import { createFileRoute } from "@tanstack/react-router";
import { AirCanvasApp } from "@/components/air-canvas/AirCanvasApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NextGen" },
      {
        name: "description",
        content:
          "Draw in the air with your hands. A futuristic webcam-powered 2D & 3D drawing studio with gesture controls.",
      },
      { property: "og:title", content: "NextGen" },
      {
        property: "og:description",
        content:
          "Webcam hand-tracking drawing app with neon holographic UI, 2D strokes & 3D shapes.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <AirCanvasApp />;
}
