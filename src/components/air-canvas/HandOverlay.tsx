import type { HandData } from "@/hooks/useHandTracking";

interface Props {
  hands: HandData[];
}

const GESTURE_COLORS: Record<string, string> = {
  point: "#22d3ee",
  pinch: "#e879f9",
  palm: "#facc15",
  fist: "#fb7185",
  none: "#94a3b8",
};

export function HandOverlay({ hands }: Props) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {hands.map((h, i) => {
        const c = GESTURE_COLORS[h.gesture] ?? "#fff";
        return (
          <g key={i}>
            <circle
              cx={h.x * 100}
              cy={h.y * 100}
              r={1.6}
              fill={c}
              opacity={0.95}
              className={`hand-${h.gesture}`}
            />
            <circle
              cx={h.x * 100}
              cy={h.y * 100}
              r={3}
              fill="none"
              stroke={c}
              strokeWidth={0.25}
              opacity={0.6}
            />
          </g>
        );
      })}
    </svg>
  );
}
