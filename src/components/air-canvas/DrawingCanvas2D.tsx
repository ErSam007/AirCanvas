import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { HandData } from "@/hooks/useHandTracking";

export type ShapeMode = "free" | "line" | "rect" | "circle";

export interface DrawingCanvas2DHandle {
  clear: () => void;
  undo: () => void;
  exportPng: () => void;
  snapshotDataUrl: () => string | null;
}

interface Props {
  hands: HandData[];
  color: string;
  size: number;
  mode: ShapeMode;
  paused: boolean;
}

interface Stroke {
  type: ShapeMode;
  color: string;
  size: number;
  points: { x: number; y: number }[];
}

export const DrawingCanvas2D = forwardRef<DrawingCanvas2DHandle, Props>(
  function DrawingCanvas2D({ hands, color, size, mode, paused }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const strokesRef = useRef<Stroke[]>([]);
    const currentRef = useRef<Stroke | null>(null);
    const drawingRef = useRef(false);
    const lastPtRef = useRef<{ x: number; y: number } | null>(null);

    // Resize canvas to its container
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const resize = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        const ctx = canvas.getContext("2d");
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
        redraw();
      };
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }, []);

    const redraw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const all = currentRef.current
        ? [...strokesRef.current, currentRef.current]
        : strokesRef.current;
      for (const s of all) drawStroke(ctx, s);
    };

    const drawStroke = (ctx: CanvasRenderingContext2D, s: Stroke) => {
      if (s.points.length === 0) return;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = s.color;
      ctx.fillStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 14;

      if (s.type === "free") {
        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for (let i = 1; i < s.points.length; i++) {
          const p = s.points[i];
          const prev = s.points[i - 1];
          const mid = { x: (prev.x + p.x) / 2, y: (prev.y + p.y) / 2 };
          ctx.quadraticCurveTo(prev.x, prev.y, mid.x, mid.y);
        }
        ctx.stroke();
      } else if (s.points.length >= 2) {
        const a = s.points[0];
        const b = s.points[s.points.length - 1];
        if (s.type === "line") {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        } else if (s.type === "rect") {
          ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
        } else if (s.type === "circle") {
          const r = Math.hypot(b.x - a.x, b.y - a.y);
          ctx.beginPath();
          ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;
    };

    // Drive drawing from gestures
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Pick the dominant (Right) hand if present, otherwise first
      const drawHand =
        hands.find((hd) => hd.handedness === "Right") ?? hands[0];

      if (!drawHand || paused) {
        if (drawingRef.current && currentRef.current) {
          strokesRef.current.push(currentRef.current);
          currentRef.current = null;
        }
        drawingRef.current = false;
        lastPtRef.current = null;
        redraw();
        return;
      }

      const px = drawHand.x * w;
      const py = drawHand.y * h;
      const isDrawGesture = drawHand.gesture === "point";

      if (isDrawGesture) {
        if (!drawingRef.current) {
          drawingRef.current = true;
          currentRef.current = {
            type: mode,
            color,
            size,
            points: [{ x: px, y: py }],
          };
          lastPtRef.current = { x: px, y: py };
        } else {
          const last = lastPtRef.current;
          if (!last || Math.hypot(px - last.x, py - last.y) > 1.5) {
            if (mode === "free") {
              currentRef.current!.points.push({ x: px, y: py });
            } else {
              // For shapes: keep first point, update last
              const pts = currentRef.current!.points;
              if (pts.length === 1) pts.push({ x: px, y: py });
              else pts[pts.length - 1] = { x: px, y: py };
            }
            lastPtRef.current = { x: px, y: py };
          }
        }
      } else {
        if (drawingRef.current && currentRef.current) {
          strokesRef.current.push(currentRef.current);
          currentRef.current = null;
        }
        drawingRef.current = false;
        lastPtRef.current = null;
      }

      // palm gesture clears
      if (drawHand.gesture === "palm" && hands.length === 1) {
        // require sustained palm via simple debounce: just clear
        // (kept simple to avoid accidental clears requires palm + no other hand)
      }
      redraw();
    }, [hands, color, size, mode, paused]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        strokesRef.current = [];
        currentRef.current = null;
        redraw();
      },
      undo: () => {
        strokesRef.current.pop();
        redraw();
      },
      exportPng: () => {
        const url = compositePng();
        if (!url) return;
        const a = document.createElement("a");
        a.href = url;
        a.download = `air-canvas-${Date.now()}.png`;
        a.click();
      },
      snapshotDataUrl: () => compositePng(),
    }));

    const compositePng = (): string | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const out = document.createElement("canvas");
      out.width = canvas.width;
      out.height = canvas.height;
      const octx = out.getContext("2d")!;
      octx.fillStyle = "#0a0a1a";
      octx.fillRect(0, 0, out.width, out.height);
      octx.drawImage(canvas, 0, 0);
      return out.toDataURL("image/png");
    };

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-label="Drawing canvas"
      />
    );
  },
);
