import { useFrame } from "@react-three/fiber";
import { useRef, useCallback } from "react";
import { useScene } from "../context/SceneContext";

export function usePerformanceMonitor(sampleRate = 60) {
  const { updatePerformance } = useScene();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsBuffer = useRef([]);

  useFrame(() => {
    frameCount.current++;

    if (frameCount.current % sampleRate === 0) {
      const now = performance.now();
      const delta = now - lastTime.current;
      const fps = Math.round((sampleRate / delta) * 1000);

      fpsBuffer.current.push(fps);
      if (fpsBuffer.current.length > 10) {
        fpsBuffer.current.shift();
      }

      const avgFps =
        fpsBuffer.current.reduce((a, b) => a + b, 0) / fpsBuffer.current.length;

      const quality = avgFps >= 55 ? "high" : avgFps >= 40 ? "medium" : "low";

      updatePerformance({ fps: Math.round(avgFps), quality });
      lastTime.current = now;
    }
  });
}
