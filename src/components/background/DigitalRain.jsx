import { useRef, useMemo, memo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const COLUMN_COUNT = 30;
const CHARS_PER_COLUMN = 15;
const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Create a high-resolution texture with Matrix-style character
const createCharacterTexture = (char, isLeading = false, isPulse = false) => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Background glow for leading character
  if (isLeading || isPulse) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    if (isPulse) {
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(0.3, "rgba(0, 255, 255, 0.5)");
      gradient.addColorStop(0.6, "rgba(0, 255, 255, 0.2)");
      gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
    } else {
      gradient.addColorStop(0, "rgba(0, 255, 255, 0.6)");
      gradient.addColorStop(0.4, "rgba(0, 255, 255, 0.3)");
      gradient.addColorStop(0.7, "rgba(0, 255, 255, 0.1)");
      gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }

  // Draw character with multiple shadow layers for sharper glow
  ctx.font = "bold 72px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Multiple shadow layers for enhanced glow
  if (isLeading || isPulse) {
    ctx.shadowColor = isPulse ? "#ffffff" : "#00ffff";
    ctx.shadowBlur = 30;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(char, 64, 64);

    ctx.shadowBlur = 20;
    ctx.fillText(char, 64, 64);

    ctx.shadowBlur = 10;
  } else {
    ctx.shadowColor = "#00ff41";
    ctx.shadowBlur = 15;
  }

  ctx.fillStyle = isLeading ? "#ffffff" : isPulse ? "#ffffff" : "#00ff41";
  ctx.fillText(char, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// Pre-generate character textures
const generateCharTextures = () => {
  const textures = {};
  for (let i = 0; i < MATRIX_CHARS.length; i++) {
    textures[MATRIX_CHARS[i]] = createCharacterTexture(
      MATRIX_CHARS[i],
      false,
      false
    );
    textures[MATRIX_CHARS[i] + "_lead"] = createCharacterTexture(
      MATRIX_CHARS[i],
      true,
      false
    );
    textures[MATRIX_CHARS[i] + "_pulse"] = createCharacterTexture(
      MATRIX_CHARS[i],
      false,
      true
    );
  }
  return textures;
};

const DigitalRain = memo(function DigitalRain() {
  const groupRef = useRef();
  const meshesRef = useRef([]);
  const charTextures = useRef(null);

  // Initialize textures
  useEffect(() => {
    charTextures.current = generateCharTextures();
    return () => {
      // Cleanup textures
      if (charTextures.current) {
        Object.values(charTextures.current).forEach((t) => t.dispose());
      }
    };
  }, []);

  const columns = useMemo(() => {
    return Array.from({ length: COLUMN_COUNT }, (_, i) => ({
      id: i,
      x: (i - COLUMN_COUNT / 2) * 1.2,
      z: -2 - Math.random() * 6,
      speed: 1.5 + Math.random() * 3,
      offset: Math.random() * 30,
      pulseChance: Math.random() * 0.05,
      lastPulse: 0,
      chars: Array.from({ length: CHARS_PER_COLUMN }, () => ({
        char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
        lastChange: 0,
        changeInterval: 0.08 + Math.random() * 0.2,
        isPulse: false,
        pulseTime: 0,
      })),
    }));
  }, []);

  useFrame((state) => {
    if (!charTextures.current) return;

    const time = state.clock.elapsedTime;

    columns.forEach((col, colIdx) => {
      const fallOffset = (time * col.speed + col.offset) % 25;

      // Occasional pulse column
      if (time - col.lastPulse > 5 && Math.random() < col.pulseChance) {
        col.lastPulse = time;
        const pulseChar = Math.floor(Math.random() * CHARS_PER_COLUMN);
        col.chars[pulseChar].isPulse = true;
        col.chars[pulseChar].pulseTime = time;
      }

      col.chars.forEach((charData, charIdx) => {
        const meshIdx = colIdx * CHARS_PER_COLUMN + charIdx;
        const mesh = meshesRef.current[meshIdx];
        if (!mesh) return;

        // Position with slight wave
        const waveOffset = Math.sin(time * 0.5 + colIdx * 0.2) * 0.1;
        const y = 12 - charIdx * 0.8 - fallOffset;
        mesh.position.y = y;
        mesh.position.x = col.x + waveOffset;
        mesh.visible = y > -5 && y < 15;

        // Handle pulse fade
        if (charData.isPulse && time - charData.pulseTime > 0.5) {
          charData.isPulse = false;
        }

        // Change character periodically with flicker effect
        if (time - charData.lastChange > charData.changeInterval) {
          charData.char =
            MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          charData.lastChange = time;

          // Update texture
          const isLeading = charIdx === 0;
          let texKey;
          if (charData.isPulse) {
            texKey = charData.char + "_pulse";
          } else if (isLeading) {
            texKey = charData.char + "_lead";
          } else {
            texKey = charData.char;
          }

          if (mesh.material && charTextures.current[texKey]) {
            mesh.material.map = charTextures.current[texKey];
            mesh.material.needsUpdate = true;
          }
        }

        // Enhanced opacity with depth fade
        const depthFade = 1 - (Math.abs(col.z) / 8) * 0.3;
        const trailFade = 1 - (charIdx / CHARS_PER_COLUMN) * 0.85;
        const flickerIntensity =
          0.95 + Math.sin(time * 20 + colIdx + charIdx) * 0.05;

        if (mesh.material) {
          if (charData.isPulse) {
            mesh.material.opacity = 1;
          } else if (charIdx === 0) {
            mesh.material.opacity = flickerIntensity * depthFade;
          } else {
            mesh.material.opacity =
              trailFade * 0.7 * flickerIntensity * depthFade;
          }
        }
      });
    });
  });

  return (
    <group ref={groupRef}>
      {columns.map((col) =>
        col.chars.map((charData, charIdx) => {
          const meshIdx = col.id * CHARS_PER_COLUMN + charIdx;
          return (
            <sprite
              key={`${col.id}-${charIdx}`}
              ref={(el) => (meshesRef.current[meshIdx] = el)}
              position={[col.x, 10 - charIdx * 1.0, col.z]}
              scale={[0.6, 0.6, 1]}
            >
              <spriteMaterial
                transparent
                opacity={charIdx === 0 ? 1 : 0.7}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          );
        })
      )}
    </group>
  );
});

export default DigitalRain;
