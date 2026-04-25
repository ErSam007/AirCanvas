import { useEffect, useRef, useState } from "react";
import {
  HandLandmarker,
  FilesetResolver,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";

export type Gesture = "point" | "pinch" | "palm" | "fist" | "none";

export interface HandData {
  /** Index fingertip in normalized coords (0-1, origin top-left, x already mirrored) */
  x: number;
  y: number;
  gesture: Gesture;
  /** distance between thumb tip and index tip, normalized */
  pinchDist: number;
  handedness: "Left" | "Right";
}

export interface HandTrackingState {
  hands: HandData[];
  ready: boolean;
  error: string | null;
  fps: number;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

function classifyGesture(landmarks: { x: number; y: number; z: number }[]): {
  gesture: Gesture;
  pinchDist: number;
} {
  // Landmarks: 0 wrist, 4 thumb tip, 8 index tip, 12 middle tip, 16 ring tip, 20 pinky tip
  // PIP joints (one before tip): 6, 10, 14, 18 — finger extended if tip.y < pip.y (image space)
  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const indexExt = indexTip.y < landmarks[6].y;
  const middleExt = middleTip.y < landmarks[10].y;
  const ringExt = ringTip.y < landmarks[14].y;
  const pinkyExt = pinkyTip.y < landmarks[18].y;
  const extendedCount = [indexExt, middleExt, ringExt, pinkyExt].filter(Boolean).length;

  const pinchDist = dist(thumbTip, indexTip);
  const handSize = dist(wrist, landmarks[9]) || 0.001;
  const normPinch = pinchDist / handSize;

  let gesture: Gesture = "none";
  if (extendedCount === 0) gesture = "fist";
  else if (extendedCount === 4) gesture = "palm";
  else if (normPinch < 0.45 && indexExt) gesture = "pinch";
  else if (indexExt && !middleExt && !ringExt && !pinkyExt) gesture = "point";

  return { gesture, pinchDist: normPinch };
}

export function useHandTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean = true,
) {
  const [state, setState] = useState<HandTrackingState>({
    hands: [],
    ready: false,
    error: null,
    fps: 0,
  });
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const fpsAccumRef = useRef<{ frames: number; t: number }>({ frames: 0, t: 0 });
  const lastHandsRef = useRef<HandData[]>([]);
  const gestureHistoryRef = useRef<Record<number, Gesture[]>>({});

  useEffect(() => {
    if (!enabled) {
      // Tear down if disabled
      setState({ hands: [], ready: false, error: null, fps: 0 });
      return;
    }
    let cancelled = false;
    const videoElement = videoRef.current;

    const setup = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });
        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        const video = videoElement;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        setState((s) => ({ ...s, ready: true }));
        loop();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Camera/model failed";
        setState((s) => ({ ...s, error: msg }));
      }
    };

    const loop = () => {
      const video = videoRef.current;
      const lm = landmarkerRef.current;
      if (!video || !lm || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const now = performance.now();
      let result: HandLandmarkerResult | null = null;
      if (now - lastTsRef.current > 60) {
        try {
          result = lm.detectForVideo(video, now);
          lastTsRef.current = now;
        } catch {
          /* ignore transient */
        }
      }

      if (result) {

        const hands: HandData[] = [];
        result.landmarks.forEach((lms, i) => {
          const handed = result!.handedness[i]?.[0]?.categoryName as "Left" | "Right" | undefined;
          const tip = lms[8];
          // Mirror x for selfie view
          const { gesture, pinchDist } = classifyGesture(lms);
          const newHand: HandData = {
            x: 1 - tip.x,
            y: tip.y,
            gesture,
            pinchDist,
            handedness: handed ?? "Right",
          };

          // Smooth position
          const lastHand = lastHandsRef.current[i];
          if (lastHand) {
            const alpha = 0.7; // smoothing factor
            newHand.x = alpha * lastHand.x + (1 - alpha) * newHand.x;
            newHand.y = alpha * lastHand.y + (1 - alpha) * newHand.y;
          }

          // Stabilize gesture
          const history = gestureHistoryRef.current[i] || [];
          history.push(gesture);
          if (history.length > 5) history.shift(); // keep last 5
          const stableGesture =
            history.filter((g) => g === gesture).length >= 3 ? gesture : history[0] || gesture;
          newHand.gesture = stableGesture;
          gestureHistoryRef.current[i] = history;

          hands.push(newHand);
        });

        lastHandsRef.current = hands;

        // FPS
        const acc = fpsAccumRef.current;
        acc.frames += 1;
        if (now - acc.t > 500) {
          const fps = (acc.frames * 1000) / (now - acc.t);
          acc.frames = 0;
          acc.t = now;
          setState((s) => ({ ...s, hands, fps: Math.round(fps) }));
        } else {
          setState((s) => ({ ...s, hands }));
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    setup();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const stream = videoElement?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, [videoRef, enabled]);

  return state;
}
