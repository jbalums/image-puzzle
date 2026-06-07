import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { R as Root } from "../_libs/radix-ui__react-label.mjs";
import { I as Image$1, T as Timer, E as EyeOff, a as Eye, S as Shuffle, R as RotateCcw, b as Trophy, U as Upload } from "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Card = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root.displayName;
const PRESETS = [
  { label: "Easy", r: 3, c: 3 },
  { label: "Medium", r: 5, c: 5 },
  { label: "Hard", r: 8, c: 8 },
  { label: "Expert", r: 10, c: 10 }
];
const MAX_FILE_MB = 10;
function fmtTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function PuzzleGame() {
  const [phase, setPhase] = reactExports.useState("upload");
  const [imgSrc, setImgSrc] = reactExports.useState(null);
  const [imgEl, setImgEl] = reactExports.useState(null);
  const [rows, setRows] = reactExports.useState(4);
  const [cols, setCols] = reactExports.useState(4);
  const [pieces, setPieces] = reactExports.useState([]);
  const [grid, setGrid] = reactExports.useState([]);
  const [elapsed, setElapsed] = reactExports.useState(0);
  const [moves, setMoves] = reactExports.useState(0);
  const [running, setRunning] = reactExports.useState(false);
  const [completed, setCompleted] = reactExports.useState(false);
  const [showOriginal, setShowOriginal] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [bestTime, setBestTime] = reactExports.useState(null);
  const [dragId, setDragId] = reactExports.useState(null);
  const [hoverIdx, setHoverIdx] = reactExports.useState(null);
  const [bgColor, setBgColor] = reactExports.useState("#18181b");
  const [confirmReset, setConfirmReset] = reactExports.useState(false);
  const boardRef = reactExports.useRef(null);
  const touchDataRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const key = `puzzle-best-${rows}x${cols}`;
    const v = localStorage.getItem(key);
    setBestTime(v ? Number(v) : null);
  }, [rows, cols]);
  reactExports.useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setElapsed((e) => e + 1), 1e3);
    return () => clearInterval(i);
  }, [running]);
  reactExports.useEffect(() => {
    const onVis = () => {
      if (document.hidden) setRunning(false);
      else if (phase === "play" && !completed) setRunning(true);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [phase, completed]);
  const handleFile = (file) => {
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
      const src = e.target?.result;
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
  const onUploadChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };
  const generatePuzzle = reactExports.useCallback(() => {
    if (!imgEl) return;
    const maxDim = 1200;
    const scale = Math.min(1, maxDim / Math.max(imgEl.width, imgEl.height));
    const W = Math.floor(imgEl.width * scale);
    const H = Math.floor(imgEl.height * scale);
    const pw = Math.floor(W / cols);
    const ph = Math.floor(H / rows);
    const canvas = document.createElement("canvas");
    canvas.width = pw;
    canvas.height = ph;
    const ctx = canvas.getContext("2d");
    const newPieces = [];
    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.clearRect(0, 0, pw, ph);
        ctx.drawImage(
          imgEl,
          c * (imgEl.width / cols),
          r * (imgEl.height / rows),
          imgEl.width / cols,
          imgEl.height / rows,
          0,
          0,
          pw,
          ph
        );
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
          dataUrl
        });
      }
    }
    const order = shuffle(newPieces.map((p) => p.id));
    if (order.every((v, i) => v === i)) {
      [order[0], order[1]] = [order[1], order[0]];
    }
    const placed = newPieces.map((p) => ({ ...p }));
    order.forEach((pid, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const piece = placed.find((p) => p.id === pid);
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
  const swap = reactExports.useCallback(
    (idxA, idxB) => {
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
          pa.currentRow = rb;
          pa.currentCol = cb;
          pb.currentRow = ra;
          pb.currentCol = ca;
        }
        return np;
      });
      setMoves((m) => m + 1);
    },
    [cols]
  );
  reactExports.useEffect(() => {
    if (phase !== "play" || pieces.length === 0) return;
    const done = pieces.every(
      (p) => p.currentRow === p.correctRow && p.currentCol === p.correctCol
    );
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
  const correctCount = pieces.filter(
    (p) => p.currentRow === p.correctRow && p.currentCol === p.correctCol
  ).length;
  const pct = pieces.length ? Math.round(correctCount / pieces.length * 100) : 0;
  const onDragStart = (e, pieceId) => {
    setDragId(pieceId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(pieceId));
  };
  const onDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (hoverIdx !== idx) setHoverIdx(idx);
  };
  const onDrop = (e, idx) => {
    e.preventDefault();
    const pid = Number(e.dataTransfer.getData("text/plain"));
    const fromIdx = grid.indexOf(pid);
    if (fromIdx >= 0) swap(fromIdx, idx);
    setDragId(null);
    setHoverIdx(null);
  };
  const onTouchStart = (e, pieceId) => {
    const target = e.currentTarget;
    touchDataRef.current = { pieceId, el: target };
  };
  const onTouchMove = (e) => {
    if (!touchDataRef.current) return;
    e.preventDefault();
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const cell = el?.closest("[data-cell-idx]");
    if (cell) {
      const idx = Number(cell.dataset.cellIdx);
      if (hoverIdx !== idx) setHoverIdx(idx);
    }
    if (dragId === null) setDragId(touchDataRef.current.pieceId);
  };
  const onTouchEnd = (e) => {
    if (!touchDataRef.current) return;
    const t = e.changedTouches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const cell = el?.closest("[data-cell-idx]");
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-background via-secondary/40 to-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border/60 bg-card/60 backdrop-blur sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary grid place-items-center text-primary-foreground font-bold shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold leading-tight", children: "Pixel Puzzle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Upload, slice, solve." })
        ] })
      ] }),
      phase === "play" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "w-3.5 h-3.5" }), children: fmtTime(elapsed) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { children: [
          moves,
          " moves"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { children: [
          pct,
          "%"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-6xl mx-auto px-4 py-8", children: [
      phase === "upload" && /* @__PURE__ */ jsxRuntimeExports.jsx(UploadView, { onFile: handleFile, error, onChange: onUploadChange }),
      phase === "configure" && imgSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(
        ConfigureView,
        {
          imgSrc,
          rows,
          cols,
          setRows,
          setCols,
          onGenerate: generatePuzzle,
          onBack: reset,
          bestTime
        }
      ),
      phase === "play" && imgSrc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_280px] gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-0 shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: boardRef,
            className: "relative w-full rounded-lg overflow-hidden",
            style: { aspectRatio: String(aspectRatio), backgroundColor: bgColor },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-0 grid touch-none select-none",
                style: {
                  gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
                  gridTemplateRows: `repeat(${rows}, minmax(0,1fr))`,
                  gap: "4px"
                },
                children: grid.map((pid, idx) => {
                  const piece = pieces.find((p) => p.id === pid);
                  if (!piece) return null;
                  const correct = piece.currentRow === piece.correctRow && piece.currentCol === piece.correctCol;
                  const isHover = hoverIdx === idx && dragId !== null;
                  const isDragging = dragId === piece.id;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "data-cell-idx": idx,
                      className: cn(
                        "relative rounded-md overflow-hidden transition-all duration-200",
                        isHover && "ring-4 ring-accent ring-offset-1 ring-offset-card scale-[1.02]",
                        correct && !isDragging && "ring-2 ring-primary/50"
                      ),
                      onDragOver: (e) => onDragOver(e, idx),
                      onDrop: (e) => onDrop(e, idx),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: piece.dataUrl,
                          alt: "",
                          draggable: true,
                          onDragStart: (e) => onDragStart(e, piece.id),
                          onDragEnd: () => {
                            setDragId(null);
                            setHoverIdx(null);
                          },
                          onTouchStart: (e) => onTouchStart(e, piece.id),
                          onTouchMove,
                          onTouchEnd,
                          className: cn(
                            "w-full h-full object-cover cursor-grab active:cursor-grabbing transition-transform",
                            isDragging && "opacity-50 scale-95"
                          ),
                          style: { touchAction: "none" }
                        }
                      )
                    },
                    idx
                  );
                })
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: "Original" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowOriginal((s) => !s), children: showOriginal ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }) })
            ] }),
            showOriginal && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: imgSrc,
                alt: "Original",
                className: "w-full rounded-md border border-border"
              }
            ),
            !showOriginal && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Click to peek at the reference image." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: "Stats" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Grid", value: `${rows} × ${cols}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Pieces", value: String(rows * cols) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Progress", value: `${pct}%` }),
            bestTime !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Best", value: fmtTime(bestTime) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: "Board Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: [
              { label: "Dark", value: "#18181b" },
              { label: "White", value: "#ffffff" },
              { label: "Blue", value: "#1e3a5f" },
              { label: "Green", value: "#14532d" },
              { label: "Red", value: "#7f1d1d" },
              { label: "Purple", value: "#3b0764" }
            ].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                title: c.label,
                onClick: () => setBgColor(c.value),
                className: "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110",
                style: {
                  backgroundColor: c.value,
                  borderColor: bgColor === c.value ? "hsl(var(--primary))" : "transparent",
                  outline: bgColor === c.value ? "2px solid hsl(var(--primary))" : "2px solid hsl(var(--border))",
                  outlineOffset: "1px"
                }
              },
              c.value
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bgColorPicker", className: "text-xs text-muted-foreground shrink-0", children: "Custom" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "bgColorPicker",
                  type: "color",
                  value: bgColor,
                  onChange: (e) => setBgColor(e.target.value),
                  className: "h-7 w-full cursor-pointer rounded border border-border bg-card"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: reshuffle, variant: "secondary", className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "w-4 h-4 mr-2" }),
              " Reshuffle"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setConfirmReset(true), variant: "outline", className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4 mr-2" }),
              " New Image"
            ] })
          ] })
        ] })
      ] })
    ] }),
    confirmReset && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "max-w-sm w-full p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold mb-2", children: "Start over?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "Your current progress will be lost." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1", onClick: () => setConfirmReset(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "destructive",
            className: "flex-1",
            onClick: () => {
              setConfirmReset(false);
              reset();
            },
            children: "New Image"
          }
        )
      ] })
    ] }) }),
    completed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "max-w-md w-full p-6 text-center animate-scale-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-accent/20 grid place-items-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-8 h-8 text-accent-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-1", children: "Puzzle Solved!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Beautifully done." }),
      imgSrc && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, className: "rounded-lg mb-4 w-full", alt: "Completed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Time", value: fmtTime(elapsed) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Moves", value: String(moves) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Grid", value: `${rows}×${cols}` })
      ] }),
      bestTime === elapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent-foreground mb-3", children: "New best time!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: reshuffle, className: "flex-1", children: "Play Again" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setConfirmReset(true), variant: "outline", className: "flex-1", children: "New Image" })
      ] })
    ] }) })
  ] });
}
function Badge({ children, icon }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-medium tabular-nums", children: [
    icon,
    children
  ] });
}
function Row({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium tabular-nums", children: value })
  ] });
}
function Stat({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold tabular-nums", children: value })
  ] });
}
function UploadView({
  onFile,
  onChange,
  error
}) {
  const [over, setOver] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl sm:text-4xl font-bold tracking-tight", children: "Turn any image into a puzzle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Upload a photo, choose your grid, and start solving." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "label",
      {
        onDragOver: (e) => {
          e.preventDefault();
          setOver(true);
        },
        onDragLeave: () => setOver(false),
        onDrop: (e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        },
        className: cn(
          "block cursor-pointer rounded-2xl border-2 border-dashed bg-card p-10 sm:p-16 text-center transition-all shadow-sm hover:shadow-lg",
          over ? "border-primary bg-primary/5 scale-[1.01]" : "border-border"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: "image/jpeg,image/png,image/webp",
              className: "hidden",
              onChange
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-7 h-7 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Click or drag an image here" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "JPG, PNG, WEBP · up to ",
            MAX_FILE_MB,
            "MB"
          ] })
        ]
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-destructive text-center", children: error })
  ] });
}
function ConfigureView({
  imgSrc,
  rows,
  cols,
  setRows,
  setCols,
  onGenerate,
  onBack,
  bestTime
}) {
  const clamp = (n) => Math.max(2, Math.min(20, n || 2));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3 shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgSrc, alt: "Preview", className: "w-full rounded-lg" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Configure puzzle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Choose difficulty or set a custom grid." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Presets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 mt-2", children: PRESETS.map((p) => {
          const active = p.r === rows && p.c === cols;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setRows(p.r);
                setCols(p.c);
              },
              className: cn(
                "rounded-lg border p-3 text-left transition-all hover:border-primary/60",
                active ? "border-primary bg-primary/5" : "border-border bg-card"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: p.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  p.r,
                  "×",
                  p.c,
                  " · ",
                  p.r * p.c,
                  " pieces"
                ] })
              ]
            },
            p.label
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rows", className: "text-xs", children: "Rows (2–20)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "rows",
              type: "number",
              min: 2,
              max: 20,
              value: rows,
              onChange: (e) => setRows(clamp(Number(e.target.value)))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cols", className: "text-xs", children: "Columns (2–20)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "cols",
              type: "number",
              min: 2,
              max: 20,
              value: cols,
              onChange: (e) => setCols(clamp(Number(e.target.value)))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-3 flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total pieces" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold tabular-nums", children: rows * cols })
      ] }),
      bestTime !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-accent/10 p-3 flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          "Best for ",
          rows,
          "×",
          cols
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold tabular-nums", children: fmtTime(bestTime) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onBack, className: "flex-1", children: "Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onGenerate, className: "flex-1", children: "Generate Puzzle" })
      ] })
    ] })
  ] });
}
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PuzzleGame, {});
}
export {
  Index as component
};
