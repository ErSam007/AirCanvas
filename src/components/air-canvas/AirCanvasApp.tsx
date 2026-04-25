import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useHandTracking } from "@/hooks/useHandTracking";
import { DrawingCanvas2D, type DrawingCanvas2DHandle, type ShapeMode } from "./DrawingCanvas2D";
import { Scene3D, type Shape3D } from "./Scene3D";
import { Toolbar } from "./Toolbar";
import { HandOverlay } from "./HandOverlay";
import { guessDrawing } from "@/utils/ai-assist.functions";

const GESTURE_COLORS: Record<string, string> = {
  point: "#22d3ee",
  pinch: "#e879f9",
  palm: "#facc15",
  fist: "#fb7185",
};

export function AirCanvasApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasHandleRef = useRef<DrawingCanvas2DHandle>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const { hands, ready, error, fps } = useHandTracking(videoRef, cameraOn);

  const [mode2D, setMode2D] = useState<ShapeMode>("free");
  const [color, setColor] = useState("#22d3ee");
  const [size, setSize] = useState(8);
  const [is3D, setIs3D] = useState(false);
  const [shape3D, setShape3D] = useState<Shape3D>("cube");
  const [paused, setPaused] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiGuess, setAiGuess] = useState<string | null>(null);

  const guessFn = useServerFn(guessDrawing);

  const handleAiGuess = async () => {
    const url = canvasHandleRef.current?.snapshotDataUrl();
    if (!url) {
      toast.error("Nothing to analyze yet");
      return;
    }
    setAiBusy(true);
    try {
      const res = await guessFn({ data: { imageDataUrl: url } });
      if (res.error) {
        toast.error(res.error);
      } else if (res.guess) {
        setAiGuess(res.guess);
        toast.success(res.guess);
      }
    } catch (e) {
      toast.error("AI request failed");
      console.error(e);
    } finally {
      setAiBusy(false);
    }
  };

  // Keyboard shortcuts: U=undo, C=clear, S=save, A=AI, P=pause, 3=toggle 3D, space=cam
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const k = e.key.toLowerCase();
      if (k === "u") canvasHandleRef.current?.undo();
      else if (k === "c") canvasHandleRef.current?.clear();
      else if (k === "s") canvasHandleRef.current?.exportPng();
      else if (k === "a") handleAiGuess();
      else if (k === "p") setPaused((v) => !v);
      else if (k === "3") setIs3D((v) => !v);
      else if (k === " ") {
        e.preventDefault();
        setCameraOn((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Left-hand gesture controls: fist=clear (held), palm=undo (single trigger)
  const lastActionRef = useRef<{ g: string; t: number }>({ g: "", t: 0 });
  useEffect(() => {
    const left = hands.find((h) => h.handedness === "Left");
    if (!left) return;
    const now = performance.now();
    const since = now - lastActionRef.current.t;
    if (left.gesture === lastActionRef.current.g && since < 1200) return;
    if (left.gesture === "palm") {
      canvasHandleRef.current?.undo();
      toast("↶ Undo", { duration: 800 });
      lastActionRef.current = { g: "palm", t: now };
    } else if (left.gesture === "fist") {
      canvasHandleRef.current?.clear();
      toast("✊ Cleared", { duration: 800 });
      lastActionRef.current = { g: "fist", t: now };
    } else {
      lastActionRef.current = { g: left.gesture, t: now };
    }
  }, [hands]);

  const dominantGesture =
    hands.find((h) => h.handedness === "Right")?.gesture ?? hands[0]?.gesture ?? "none";

  return (
    <div className="relative h-screen w-screen overflow-hidden grid-bg">
      {/* Hidden webcam feed (used by MediaPipe) */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute top-4 right-4 w-[200px] aspect-video rounded-xl border border-primary/30 object-cover -scale-x-100 z-10 opacity-80 shadow-[0_0_24px_oklch(0.82_0.18_200/0.35)] ${
          cameraOn ? "" : "hidden"
        }`}
      />
      {!cameraOn && (
        <div className="absolute top-4 right-4 w-[200px] aspect-video rounded-xl border border-destructive/40 bg-black/40 z-10 flex items-center justify-center text-[11px] uppercase tracking-widest text-destructive">
          Camera Off
        </div>
      )}

      {/* Drawing surface */}
      <div className="absolute inset-0">
        {is3D ? (
          <Scene3D hands={hands} shape={shape3D} color={color} />
        ) : (
          <DrawingCanvas2D
            ref={canvasHandleRef}
            hands={hands}
            color={color}
            size={size}
            mode={mode2D}
            paused={paused}
          />
        )}
      </div>

      {/* Hand cursor overlay */}
      <HandOverlay hands={hands} />

      {/* Header */}
      <header className="absolute top-4 left-4 z-20 pointer-events-none">
        <h1 className="text-2xl font-bold tracking-tight text-holo">AirCanvas</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Gesture-controlled drawing studio</p>
        <p className="text-xs text-muted-foreground mt-0.5">Making of Team NextGen</p>
        <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-widest">
          <span
            className={`size-2 rounded-full ${
              ready ? "bg-[var(--neon-lime)]" : error ? "bg-destructive" : "bg-yellow-400"
            } pulse-glow`}
          />
          <span className="text-muted-foreground">
            {error ? "camera error" : ready ? `${fps} fps · ${hands.length} hand(s)` : "loading…"}
          </span>
          <span className="text-primary ml-2">{dominantGesture.toUpperCase()}</span>
        </div>
      </header>

      {/* Toolbar */}
      <div className="absolute bottom-4 left-4 z-20 float-y animate-fade-in">
        <Toolbar
          mode2D={mode2D}
          setMode2D={setMode2D}
          color={color}
          setColor={setColor}
          size={size}
          setSize={setSize}
          is3D={is3D}
          setIs3D={setIs3D}
          shape3D={shape3D}
          setShape3D={setShape3D}
          paused={paused}
          setPaused={setPaused}
          cameraOn={cameraOn}
          setCameraOn={setCameraOn}
          onUndo={() => canvasHandleRef.current?.undo()}
          onClear={() => canvasHandleRef.current?.clear()}
          onSave={() => canvasHandleRef.current?.exportPng()}
          onAiGuess={handleAiGuess}
          aiBusy={aiBusy}
        />
      </div>

      {/* AI guess bubble */}
      {aiGuess && (
        <div className="absolute top-24 right-4 z-20 glass-panel rounded-2xl px-4 py-3 max-w-[260px] text-xs animate-scale-in">
          <div className="text-[10px] uppercase tracking-widest text-holo font-semibold mb-1">
            ✨ AI Guess
          </div>
          <div className="text-foreground">{aiGuess}</div>
          <button
            onClick={() => setAiGuess(null)}
            className="absolute top-1 right-2 text-muted-foreground hover:text-foreground text-xs"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Gesture legend + shortcuts */}
      <div className="absolute bottom-4 right-4 z-20 glass-panel rounded-2xl p-3 text-xs space-y-1.5 w-[240px] animate-fade-in">
        <div className="text-[10px] uppercase tracking-widest text-holo font-semibold mb-1">
          Right Hand · Draw
        </div>
        <Legend gesture="point" label="Point — draw / rotate" />
        <Legend gesture="pinch" label="Pinch — scale (3D)" />
        <div className="text-[10px] uppercase tracking-widest text-holo font-semibold mt-2 mb-1">
          Left Hand · Control
        </div>
        <Legend gesture="palm" label="Open palm — undo" />
        <Legend gesture="fist" label="Fist — clear" />
        <div className="text-[10px] uppercase tracking-widest text-holo font-semibold mt-2 mb-1">
          Shortcuts
        </div>
        <div className="text-muted-foreground text-[10px] leading-relaxed">
          <kbd className="kbd">U</kbd> undo · <kbd className="kbd">C</kbd> clear ·{" "}
          <kbd className="kbd">S</kbd> save · <kbd className="kbd">A</kbd> AI ·{" "}
          <kbd className="kbd">P</kbd> pause · <kbd className="kbd">3</kbd> 3D ·{" "}
          <kbd className="kbd">␣</kbd> cam
        </div>
      </div>

      {/* Error toast */}
      {error && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-center pointer-events-none">
          <div className="glass-panel rounded-xl px-6 py-4 max-w-md text-center">
            <div className="text-destructive font-semibold mb-1">Camera unavailable</div>
            <div className="text-xs text-muted-foreground">{error}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Allow camera access and reload. Use Chrome/Edge over HTTPS.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Legend({ gesture, label }: { gesture: string; label: string }) {
  const color = GESTURE_COLORS[gesture] || "#fff";
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className={`size-2 rounded-full legend-${gesture}`} />
      <span>{label}</span>
    </div>
  );
}
