import { createFileRoute } from "@tanstack/react-router";
import PuzzleGame from "@/components/PuzzleGame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pixel Puzzle — Turn any image into a jigsaw" },
      { name: "description", content: "Upload an image, pick your grid, and solve a responsive drag-and-drop jigsaw puzzle." },
      { property: "og:title", content: "Pixel Puzzle" },
      { property: "og:description", content: "Upload an image, pick your grid, and solve a responsive drag-and-drop jigsaw puzzle." },
    ],
  }),
  component: Index,
});

function Index() {
  return <PuzzleGame />;
}
