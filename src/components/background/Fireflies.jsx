import { useRef, useMemo, memo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const FIREFLY_COUNT = 50;

// Warm colors for fireflies - yellows and soft greens
const FIREFLY_COLORS = [
  "#ffee88", // warm yellow
  "#ffdd66", // golden yellow
  "#ccff88", // soft green
  "#aaffaa", // pale green
  "#ffffaa", // light yellow
];

// Create a glowing orb texture with soft falloff
const createFireflyTexture = (color) => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  // Clear with transparency
  ctx.clearRect(0, 0, 128, 128);

  // Outer soft glow
  const outerGlow = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  outerGlow.addColorStop(0, color);
  outerGlow.addColorStop(0.1, color);
  outerGlow.addColorStop(0.3, hexToRgba(color, 0.6));
  outerGlow.addColorStop(0.5, hexToRgba(color, 0.3));
  outerGlow.addColorStop(0.7, hexToRgba(color, 0.1));
  outerGlow.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = outerGlow;
  ctx.beginPath();
  ctx.arc(64, 64, 64, 0, Math.PI * 2);
  ctx.fill();

  // Bright inner core
  const innerGlow = ctx.createRadialGradient(64, 64, 0, 64, 64, 20);
  innerGlow.addColorStop(0, "#ffffff");
  innerGlow.addColorStop(0.3, color);
  innerGlow.addColorStop(1, hexToRgba(color, 0));

  ctx.fillStyle = innerGlow;
  ctx.beginPath();
  ctx.arc(64, 64, 20, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// Helper to convert hex to rgba
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const Fireflies = memo(function Fireflies() {
  const firefliesRef = useRef([]);

  // Create textures synchronously with useMemo (available on first render)
  const textures = useMemo(() => {
    return FIREFLY_COLORS.map((color) => createFireflyTexture(color));
  }, []);

  // Cleanup textures on unmount
  useEffect(() => {
    return () => {
      textures.forEach((t) => t.dispose());
    };
  }, [textures]);

  const fireflies = useMemo(() => {
    return Array.from({ length: FIREFLY_COUNT }, (_, i) => ({
      id: i,
      // Spread fireflies across the scene
      x: (Math.random() - 0.5) * 40,
      y: -2 + Math.random() * 18,
      z: -2 - Math.random() * 8,
      // Movement properties
      baseX: 0,
      baseY: 0,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      // Drift pattern
      driftPhase: Math.random() * Math.PI * 2,
      driftSpeed: 0.3 + Math.random() * 0.4,
      driftRadius: 0.5 + Math.random() * 1.5,
      // Pulse properties (for firefly blinking)
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.5 + Math.random() * 1.5,
      pulseMin: 0.1 + Math.random() * 0.2,
      pulseMax: 0.8 + Math.random() * 0.2,
      // Appearance
      scale: 0.2 + Math.random() * 0.3,
      colorIdx: Math.floor(Math.random() * FIREFLY_COLORS.length),
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    fireflies.forEach((f, i) => {
      const sprite = firefliesRef.current[i];
      if (!sprite) return;

      // Gentle drifting movement with figure-8 pattern
      const driftX =
        Math.sin(time * f.driftSpeed + f.driftPhase) * f.driftRadius;
      const driftY =
        Math.sin(time * f.driftSpeed * 0.7 + f.driftPhase) *
        Math.cos(time * f.driftSpeed * 0.5 + f.driftPhase) *
        f.driftRadius *
        0.5;

      // Slow base movement
      f.baseX += f.vx;
      f.baseY += f.vy;

      // Boundary check - wrap around
      const totalX = f.x + f.baseX + driftX;
      const totalY = f.y + f.baseY + driftY;

      if (totalX > 25) f.baseX -= 50;
      if (totalX < -25) f.baseX += 50;
      if (totalY > 18) f.baseY -= 20;
      if (totalY < -4) f.baseY += 20;

      // Random direction changes
      if (Math.random() < 0.002) {
        f.vx = (Math.random() - 0.5) * 0.02;
        f.vy = (Math.random() - 0.5) * 0.015;
      }

      // Update position
      sprite.position.set(f.x + f.baseX + driftX, f.y + f.baseY + driftY, f.z);

      // Firefly pulse/blink effect
      const pulseTime = time * f.pulseSpeed + f.pulsePhase;
      const pulseWave = Math.sin(pulseTime);

      // Create distinct on/off phases like real fireflies
      let glowIntensity;
      if (pulseWave > 0.3) {
        // Glowing phase
        glowIntensity =
          f.pulseMin + (f.pulseMax - f.pulseMin) * ((pulseWave - 0.3) / 0.7);
      } else if (pulseWave > -0.5) {
        // Dim phase
        glowIntensity = f.pulseMin * 0.5;
      } else {
        // Off phase
        glowIntensity = f.pulseMin * 0.2;
      }

      // Apply glow
      if (sprite.material) {
        sprite.material.opacity = glowIntensity;
      }

      // Scale variation with glow
      const scaleVariation = 1 + glowIntensity * 0.3;
      sprite.scale.set(f.scale * scaleVariation, f.scale * scaleVariation, 1);
    });
  });

  return (
    <group>
      {fireflies.map((f, i) => (
        <sprite
          key={f.id}
          ref={(el) => (firefliesRef.current[i] = el)}
          position={[f.x, f.y, f.z]}
          scale={[f.scale, f.scale, 1]}
        >
          <spriteMaterial
            map={textures[f.colorIdx]}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
});

export default Fireflies;
