import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Circle,
  Eraser,
  Hand,
  Minus,
  Pen,
  RotateCcw,
  Save,
  Square,
  Box,
  Cone,
  Cylinder,
  Globe,
  Camera,
  CameraOff,
  Sparkles,
} from "lucide-react";
import type { ShapeMode } from "./DrawingCanvas2D";
import type { Shape3D } from "./Scene3D";

interface Props {
  mode2D: ShapeMode;
  setMode2D: (m: ShapeMode) => void;
  color: string;
  setColor: (c: string) => void;
  size: number;
  setSize: (n: number) => void;
  is3D: boolean;
  setIs3D: (v: boolean) => void;
  shape3D: Shape3D;
  setShape3D: (s: Shape3D) => void;
  paused: boolean;
  setPaused: (v: boolean) => void;
  cameraOn: boolean;
  setCameraOn: (v: boolean) => void;
  onUndo: () => void;
  onClear: () => void;
  onSave: () => void;
  onAiGuess: () => void;
  aiBusy: boolean;
}

const COLORS = [
  "#22d3ee",
  "#e879f9",
  "#a78bfa",
  "#f472b6",
  "#facc15",
  "#34d399",
  "#fb7185",
  "#ffffff",
];

export function Toolbar(props: Props) {
  const {
    mode2D,
    setMode2D,
    color,
    setColor,
    size,
    setSize,
    is3D,
    setIs3D,
    shape3D,
    setShape3D,
    paused,
    setPaused,
    cameraOn,
    setCameraOn,
    onUndo,
    onClear,
    onSave,
    onAiGuess,
    aiBusy,
  } = props;

  return (
    <div className="pointer-events-auto glass-panel rounded-2xl p-3 flex flex-col gap-3 w-[260px]">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-holo font-semibold">
          {is3D ? "3D Mode" : "2D Mode"}
        </div>
        <button
          onClick={() => setIs3D(!is3D)}
          className={cn(
            "text-[10px] px-2 py-1 rounded-full border border-primary/40 hover:border-primary transition-colors",
            is3D ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary",
          )}
        >
          {is3D ? "Switch to 2D" : "Switch to 3D"}
        </button>
      </div>

      {!is3D ? (
        <>
          <div className="grid grid-cols-4 gap-2">
            <ToolBtn active={mode2D === "free"} onClick={() => setMode2D("free")} label="Pen">
              <Pen className="size-4" />
            </ToolBtn>
            <ToolBtn active={mode2D === "line"} onClick={() => setMode2D("line")} label="Line">
              <Minus className="size-4" />
            </ToolBtn>
            <ToolBtn active={mode2D === "rect"} onClick={() => setMode2D("rect")} label="Rect">
              <Square className="size-4" />
            </ToolBtn>
            <ToolBtn
              active={mode2D === "circle"}
              onClick={() => setMode2D("circle")}
              label="Circle"
            >
              <Circle className="size-4" />
            </ToolBtn>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          <ToolBtn active={shape3D === "cube"} onClick={() => setShape3D("cube")} label="Cube">
            <Box className="size-4" />
          </ToolBtn>
          <ToolBtn
            active={shape3D === "sphere"}
            onClick={() => setShape3D("sphere")}
            label="Sphere"
          >
            <Globe className="size-4" />
          </ToolBtn>
          <ToolBtn active={shape3D === "cone"} onClick={() => setShape3D("cone")} label="Cone">
            <Cone className="size-4" />
          </ToolBtn>
          <ToolBtn
            active={shape3D === "cylinder"}
            onClick={() => setShape3D("cylinder")}
            label="Cyl"
          >
            <Cylinder className="size-4" />
          </ToolBtn>
        </div>
      )}

      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
          Color
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "size-6 rounded-full border-2 transition-transform hover:scale-110",
                color === c ? "border-white shadow-[0_0_12px_currentColor]" : "border-white/20",
              )}
              style={{ backgroundColor: c, color: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </div>

      {!is3D && (
        <div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
            <span>Brush</span>
            <span className="text-primary">{size}px</span>
          </div>
          <input
            type="range"
            min={2}
            max={40}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-[var(--neon-cyan)]"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPaused(!paused)}
          className="bg-transparent border-primary/40 hover:bg-primary/10"
        >
          <Hand className="size-4 mr-1" />
          {paused ? "Resume" : "Pause"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          className="bg-transparent border-primary/40 hover:bg-primary/10"
        >
          <RotateCcw className="size-4 mr-1" /> Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="bg-transparent border-destructive/40 hover:bg-destructive/10 text-destructive"
        >
          <Eraser className="size-4 mr-1" /> Clear
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-background font-semibold hover:opacity-90"
        >
          <Save className="size-4 mr-1" /> Save
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCameraOn(!cameraOn)}
          className={cn(
            "bg-transparent",
            cameraOn
              ? "border-primary/40 hover:bg-primary/10"
              : "border-destructive/40 text-destructive hover:bg-destructive/10",
          )}
        >
          {cameraOn ? (
            <>
              <Camera className="size-4 mr-1" /> Cam On
            </>
          ) : (
            <>
              <CameraOff className="size-4 mr-1" /> Cam Off
            </>
          )}
        </Button>
        <Button
          size="sm"
          onClick={onAiGuess}
          disabled={aiBusy}
          className="bg-gradient-to-r from-[var(--neon-magenta)] to-[var(--neon-violet,#a78bfa)] text-background font-semibold hover:opacity-90"
        >
          <Sparkles className={cn("size-4 mr-1", aiBusy && "animate-spin")} />
          {aiBusy ? "Thinking…" : "AI Guess"}
        </Button>
      </div>
    </div>
  );
}

function ToolBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "h-10 rounded-lg flex flex-col items-center justify-center gap-0.5 border transition-all",
        active
          ? "bg-primary/20 border-primary text-primary shadow-[0_0_14px_oklch(0.82_0.18_200/0.5)]"
          : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
      <span className="text-[9px] uppercase tracking-wider">{label}</span>
    </button>
  );
}
