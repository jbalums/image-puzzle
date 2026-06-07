import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, Timer, Shuffle, RotateCcw, Eye, EyeOff, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Piece = {
  id: number;
  correctRow: number;
  correctCol: number;
  currentRow: number;
  currentCol: number;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dataUrl: string;
};

type Phase = "upload" | "configure" | "play";

const PRESETS = [
  { label: "Easy", r: 3, c: 3 },
  { label: "Medium", r: 5, c: 5 },
  { label: "Hard", r: 8, c: 8 },
  { label: "Expert", r: 10, c: 10 },
];

const MAX_FILE_MB = 10;

function fmtTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PuzzleGame() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [grid, setGrid] = useState<(number | null)[]>([]); // index = row*cols+col, value = piece id
  const [elapsed, setElapsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const touchDataRef = useRef<{ pieceId: number; el: HTMLElement } | null>(null);

  // Load best time
  useEffect(() => {
    const key = `puzzle-best-${rows}x${cols}`;
    const v = localStorage.getItem(key);
    setBestTime(v ? Number(v) : null);
  }, [rows, cols]);

  // Timer
  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(i);
  }, [running]);

  // Pause on tab hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setRunning(false);
      else if (phase === "play" && !completed) setRunning(true);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [phase, completed]);

  const handleFile = (file: File) => {
    setError(null);
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Image is too large. Max ${MAX_FILE_MB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImgSrc(src);
        setImgEl(img);
        setPhase("configure");
      };
      img.onerror = () => setError("Could not load that image.");
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const onUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const generatePuzzle = useCallback(() => {
    if (!imgEl) return;
    // Render image to a square-ish canvas matching aspect, then slice
    const maxDim = 1200;
    const scale = Math.min(1, maxDim / Math.max(imgEl.width, imgEl.height));
    const W = Math.floor(imgEl.width * scale);
    const H = Math.floor(imgEl.height * scale);
    const pw = Math.floor(W / cols);
    const ph = Math.floor(H / rows);
    const canvas = document.createElement("canvas");
    canvas.width = pw;
    canvas.height = ph;
    const ctx = canvas.getContext("2d")!;
    const newPieces: Piece[] = [];
    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.clearRect(0, 0, pw, ph);
        ctx.drawImage(imgEl, c * (imgEl.width / cols), r * (imgEl.height / rows), imgEl.width / cols, imgEl.height / rows, 0, 0, pw, ph);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        newPieces.push({
          id: id++,
          correctRow: r,
          correctCol: c,
          currentRow: r,
          currentCol: c,
          sx: c * pw,
          sy: r * ph,
          sw: pw,
          sh: ph,
          dataUrl,
        });
      }
    }
    // Shuffle layout (guarantee not solved)
    let order = shuffle(newPieces.map((p) => p.id));
    if (order.every((v, i) => v === i)) {
      [order[0], order[1]] = [order[1], order[0]];
    }
    const placed = newPieces.map((p) => ({ ...p }));
    order.forEach((pid, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const piece = placed.find((p) => p.id === pid)!;
      piece.currentRow = r;
      piece.currentCol = c;
    });
    setPieces(placed);
    setGrid(order);
    setMoves(0);
    setElapsed(0);
    setCompleted(false);
    setRunning(true);
    setPhase("play");
  }, [imgEl, rows, cols]);

  const aspectRatio = imgEl ? imgEl.width / imgEl.height : 1;

  const swap = useCallback(
    (idxA: number, idxB: number) => {
      if (idxA === idxB) return;
      setGrid((g) => {
        const ng = [...g];
        [ng[idxA], ng[idxB]] = [ng[idxB], ng[idxA]];
        return ng;
      });
      setPieces((ps) => {
        const np = ps.map((p) => ({ ...p }));
        const ra = Math.floor(idxA / cols), ca = idxA % cols;
        const rb = Math.floor(idxB / cols), cb = idxB % cols;
        const pa = np.find((p) => p.currentRow === ra && p.currentCol === ca);
        const pb = np.find((p) => p.currentRow === rb && p.currentCol === cb);
        if (pa && pb) {
          pa.currentRow = rb; pa.currentCol = cb;
          pb.currentRow = ra; pb.currentCol = ca;
        }
        return np;
      });
      setMoves((m) => m + 1);
    },
    [cols],
  );

  // Check completion
  useEffect(() => {
    if (phase !== "play" || pieces.length === 0) return;
    const done = pieces.every((p) => p.currentRow === p.correctRow && p.currentCol === p.correctCol);
    if (done && !completed) {
      setCompleted(true);
      setRunning(false);
      const key = `puzzle-best-${rows}x${cols}`;
      const prev = localStorage.getItem(key);
      if (!prev || elapsed < Number(prev)) {
        localStorage.setItem(key, String(elapsed));
        setBestTime(elapsed);
      }
    }
  }, [pieces, phase, completed, elapsed, rows, cols]);

  const correctCount = pieces.filter((p) => p.currentRow === p.correctRow && p.currentCol === p.correctCol).length;
  const pct = pieces.length ? Math.round((correctCount / pieces.length) * 100) : 0;

  // Drag handlers
  const onDragStart = (e: React.DragEvent, pieceId: number) => {
    setDragId(pieceId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(pieceId));
  };
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (hoverIdx !== idx) setHoverIdx(idx);
  };
  const onDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    const pid = Number(e.dataTransfer.getData("text/plain"));
    const fromIdx = grid.indexOf(pid);
    if (fromIdx >= 0) swap(fromIdx, idx);
    setDragId(null);
    setHoverIdx(null);
  };

  // Touch (long-press) drag
  const onTouchStart = (e: React.TouchEvent, pieceId: number) => {
    const target = e.currentTarget as HTMLElement;
    touchDataRef.current = { pieceId, el: target };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchDataRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null;
    const cell = el?.closest("[data-cell-idx]") as HTMLElement | null;
    if (cell) {
      const idx = Number(cell.dataset.cellIdx);
      if (hoverIdx !== idx) setHoverIdx(idx);
    }
    if (dragId === null) setDragId(touchDataRef.current.pieceId);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchDataRef.current) return;
    const t = e.changedTouches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null;
    const cell = el?.closest("[data-cell-idx]") as HTMLElement | null;
    if (cell) {
      const idx = Number(cell.dataset.cellIdx);
      const fromIdx = grid.indexOf(touchDataRef.current.pieceId);
      if (fromIdx >= 0) swap(fromIdx, idx);
    }
    touchDataRef.current = null;
    setDragId(null);
    setHoverIdx(null);
  };

  const reset = () => {
    setPhase("upload");
    setImgSrc(null);
    setImgEl(null);
    setPieces([]);
    setGrid([]);
    setCompleted(false);
    setRunning(false);
    setElapsed(0);
    setMoves(0);
    setError(null);
  };

  const reshuffle = () => {
    if (!imgEl) return;
    generatePuzzle();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/40 to-background">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary grid place-items-center text-primary-foreground font-bold shadow-md">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Pixel Puzzle</h1>
              <p className="text-xs text-muted-foreground">Upload, slice, solve.</p>
            </div>
          </div>
          {phase === "play" && (
            <div className="flex items-center gap-2 text-sm">
              <Badge icon={<Timer className="w-3.5 h-3.5" />}>{fmtTime(elapsed)}</Badge>
              <Badge>{moves} moves</Badge>
              <Badge>{pct}%</Badge>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {phase === "upload" && (
          <UploadView onFile={handleFile} error={error} onChange={onUploadChange} />
        )}

        {phase === "configure" && imgSrc && (
          <ConfigureView
            imgSrc={imgSrc}
            rows={rows}
            cols={cols}
            setRows={setRows}
            setCols={setCols}
            onGenerate={generatePuzzle}
            onBack={reset}
            bestTime={bestTime}
          />
        )}

        {phase === "play" && imgSrc && (
          <div className="grid lg:grid-cols-[1fr_280px] gap-6">
            <Card className="p-3 sm:p-4 shadow-xl">
              <div
                ref={boardRef}
                className="relative w-full rounded-lg overflow-hidden bg-muted/40"
                style={{ aspectRatio: String(aspectRatio) }}
              >
                <div
                  className="absolute inset-0 grid touch-none select-none"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
                    gridTemplateRows: `repeat(${rows}, minmax(0,1fr))`,
                    gap: "2px",
                  }}
                >
                  {grid.map((pid, idx) => {
                    const piece = pieces.find((p) => p.id === pid);
                    if (!piece) return null;
                    const correct = piece.currentRow === piece.correctRow && piece.currentCol === piece.correctCol;
                    const isHover = hoverIdx === idx && dragId !== null;
                    const isDragging = dragId === piece.id;
                    return (
                      <div
                        key={idx}
                        data-cell-idx={idx}
                        className={cn(
                          "relative rounded-md overflow-hidden transition-all duration-200",
                          isHover && "ring-4 ring-accent ring-offset-1 ring-offset-card scale-[1.02]",
                          correct && !isDragging && "ring-2 ring-primary/50",
                        )}
                        onDragOver={(e) => onDragOver(e, idx)}
                        onDrop={(e) => onDrop(e, idx)}
                      >
                        <img
                          src={piece.dataUrl}
                          alt=""
                          draggable
                          onDragStart={(e) => onDragStart(e, piece.id)}
                          onDragEnd={() => { setDragId(null); setHoverIdx(null); }}
                          onTouchStart={(e) => onTouchStart(e, piece.id)}
                          onTouchMove={onTouchMove}
                          onTouchEnd={onTouchEnd}
                          className={cn(
                            "w-full h-full object-cover cursor-grab active:cursor-grabbing transition-transform",
                            isDragging && "opacity-50 scale-95",
                          )}
                          style={{ touchAction: "none" }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Original</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowOriginal((s) => !s)}>
                    {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {showOriginal && (
                  <img src={imgSrc} alt="Original" className="w-full rounded-md border border-border" />
                )}
                {!showOriginal && (
                  <p className="text-xs text-muted-foreground">Click to peek at the reference image.</p>
                )}
              </Card>

              <Card className="p-4 space-y-2">
                <h3 className="font-semibold text-sm">Stats</h3>
                <Row label="Grid" value={`${rows} × ${cols}`} />
                <Row label="Pieces" value={String(rows * cols)} />
                <Row label="Progress" value={`${pct}%`} />
                {bestTime !== null && <Row label="Best" value={fmtTime(bestTime)} />}
              </Card>

              <Card className="p-4 space-y-2">
                <Button onClick={reshuffle} variant="secondary" className="w-full">
                  <Shuffle className="w-4 h-4 mr-2" /> Reshuffle
                </Button>
                <Button onClick={reset} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" /> New Image
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>

      {completed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 animate-fade-in">
          <Card className="max-w-md w-full p-6 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-accent/20 grid place-items-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-accent-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Puzzle Solved!</h2>
            <p className="text-muted-foreground text-sm mb-4">Beautifully done.</p>
            {imgSrc && <img src={imgSrc} className="rounded-lg mb-4 w-full" alt="Completed" />}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Stat label="Time" value={fmtTime(elapsed)} />
              <Stat label="Moves" value={String(moves)} />
              <Stat label="Grid" value={`${rows}×${cols}`} />
            </div>
            {bestTime === elapsed && <p className="text-xs text-accent-foreground mb-3">New best time!</p>}
            <div className="flex gap-2">
              <Button onClick={reshuffle} className="flex-1">Play Again</Button>
              <Button onClick={reset} variant="outline" className="flex-1">New Image</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Badge({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-medium tabular-nums">
      {icon}
      {children}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function UploadView({
  onFile,
  onChange,
  error,
}: {
  onFile: (f: File) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
}) {
  const [over, setOver] = useState(false);
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Turn any image into a puzzle</h2>
        <p className="text-muted-foreground mt-2">Upload a photo, choose your grid, and start solving.</p>
      </div>
      <label
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        className={cn(
          "block cursor-pointer rounded-2xl border-2 border-dashed bg-card p-10 sm:p-16 text-center transition-all shadow-sm hover:shadow-lg",
          over ? "border-primary bg-primary/5 scale-[1.01]" : "border-border",
        )}
      >
        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onChange} />
        <div className="w-16 h-16 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4">
          <Upload className="w-7 h-7 text-primary" />
        </div>
        <p className="font-medium">Click or drag an image here</p>
        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP · up to {MAX_FILE_MB}MB</p>
      </label>
      {error && (
        <p className="mt-3 text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}

function ConfigureView({
  imgSrc, rows, cols, setRows, setCols, onGenerate, onBack, bestTime,
}: {
  imgSrc: string;
  rows: number; cols: number;
  setRows: (n: number) => void; setCols: (n: number) => void;
  onGenerate: () => void;
  onBack: () => void;
  bestTime: number | null;
}) {
  const clamp = (n: number) => Math.max(2, Math.min(20, n || 2));
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      <Card className="p-3 shadow-xl">
        <img src={imgSrc} alt="Preview" className="w-full rounded-lg" />
      </Card>
      <Card className="p-6 space-y-5">
        <div>
          <h2 className="text-2xl font-bold">Configure puzzle</h2>
          <p className="text-sm text-muted-foreground">Choose difficulty or set a custom grid.</p>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Presets</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {PRESETS.map((p) => {
              const active = p.r === rows && p.c === cols;
              return (
                <button
                  key={p.label}
                  onClick={() => { setRows(p.r); setCols(p.c); }}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-all hover:border-primary/60",
                    active ? "border-primary bg-primary/5" : "border-border bg-card",
                  )}
                >
                  <div className="font-semibold text-sm">{p.label}</div>
                  <div className="text-xs text-muted-foreground">{p.r}×{p.c} · {p.r * p.c} pieces</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rows" className="text-xs">Rows (2–20)</Label>
            <Input id="rows" type="number" min={2} max={20} value={rows}
              onChange={(e) => setRows(clamp(Number(e.target.value)))} />
          </div>
          <div>
            <Label htmlFor="cols" className="text-xs">Columns (2–20)</Label>
            <Input id="cols" type="number" min={2} max={20} value={cols}
              onChange={(e) => setCols(clamp(Number(e.target.value)))} />
          </div>
        </div>

        <div className="rounded-lg bg-muted p-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total pieces</span>
          <span className="font-semibold tabular-nums">{rows * cols}</span>
        </div>
        {bestTime !== null && (
          <div className="rounded-lg bg-accent/10 p-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Best for {rows}×{cols}</span>
            <span className="font-semibold tabular-nums">{fmtTime(bestTime)}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
          <Button onClick={onGenerate} className="flex-1">Generate Puzzle</Button>
        </div>
      </Card>
    </div>
  );
}