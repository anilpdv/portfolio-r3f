import { useFrame } from "@react-three/fiber";
import { useRef, useCallback } from "react";

export function useAnimationFrame(callback, deps = []) {
  const savedCallback = useRef(callback);
  const frameCount = useRef(0);

  savedCallback.current = callback;

  useFrame((state, delta) => {
    frameCount.current++;
    savedCallback.current(state, delta, frameCount.current);
  });
}

export function useThrottledFrame(callback, throttle = 2) {
  const frameCount = useRef(0);

  useFrame((state, delta) => {
    frameCount.current++;
    if (frameCount.current % throttle === 0) {
      callback(state, delta);
    }
  });
}

export function useSmoothAnimation(duration, onComplete) {
  const startTime = useRef(Date.now());
  const hasCompleted = useRef(false);

  const getProgress = useCallback(() => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    if (progress >= 1 && !hasCompleted.current) {
      hasCompleted.current = true;
      onComplete?.();
    }

    return { progress, eased, isComplete: progress >= 1 };
  }, [duration, onComplete]);

  return getProgress;
}

