import { useRef, useMemo, memo, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const STAR_COUNT = 200;

// Create a glowing shooting star trail texture
const createShootingStarTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  // Clear background
  ctx.clearRect(0, 0, 256, 64);

  // Enable glow effect first
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 20;

  // Create gradient for the trail (bright head, fading tail)
  const gradient = ctx.createLinearGradient(0, 32, 256, 32);
  gradient.addColorStop(0, "rgba(100, 150, 255, 0)");
  gradient.addColorStop(0.2, "rgba(150, 200, 255, 0.4)");
  gradient.addColorStop(0.5, "rgba(200, 220, 255, 0.7)");
  gradient.addColorStop(0.8, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 1)");

  // Draw the main trail body with thicker streak
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 32);
  ctx.lineTo(220, 24);
  ctx.lineTo(256, 32);
  ctx.lineTo(220, 40);
  ctx.closePath();
  ctx.fill();

  // Add multiple glowing layers for brightness
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(0, 32);
  ctx.lineTo(240, 20);
  ctx.lineTo(256, 32);
  ctx.lineTo(240, 44);
  ctx.closePath();
  ctx.fill();

  // Bright head with intense glow
  ctx.globalAlpha = 1;
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 30;
  const headGradient = ctx.createRadialGradient(250, 32, 0, 250, 32, 20);
  headGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  headGradient.addColorStop(0.2, "rgba(255, 255, 255, 1)");
  headGradient.addColorStop(0.5, "rgba(200, 230, 255, 0.9)");
  headGradient.addColorStop(1, "rgba(150, 200, 255, 0)");
  ctx.fillStyle = headGradient;
  ctx.beginPath();
  ctx.arc(250, 32, 20, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const Starfield = memo(function Starfield() {
  const starsRef = useRef();
  const shootingStarRef = useRef();
  const [shootingStar, setShootingStar] = useState(null);

  // Initialize shooting star texture immediately
  const trailTexture = useMemo(() => {
    return createShootingStarTexture();
  }, []);

  useEffect(() => {
    return () => {
      if (trailTexture) {
        trailTexture.dispose();
      }
    };
  }, [trailTexture]);

  // Generate star positions - CLOSER to camera
  const { positions, colors, sizes, twinklePhases, twinkleSpeeds } =
    useMemo(() => {
      const pos = new Float32Array(STAR_COUNT * 3);
      const cols = new Float32Array(STAR_COUNT * 3);
      const szs = new Float32Array(STAR_COUNT);
      const phases = new Float32Array(STAR_COUNT);
      const speeds = new Float32Array(STAR_COUNT);

      const starColors = [
        new THREE.Color("#ffffff"),
        new THREE.Color("#aaccff"),
        new THREE.Color("#ffeecc"),
      ];

      for (let i = 0; i < STAR_COUNT; i++) {
        // Spread stars in visible area - MUCH CLOSER
        pos[i * 3] = (Math.random() - 0.5) * 40; // x: -20 to 20
        pos[i * 3 + 1] = Math.random() * 15 + 3; // y: 3 to 18 (above laptop)
        pos[i * 3 + 2] = -5 - Math.random() * 8; // z: -5 to -13 (in front of fog!)

        const color = starColors[Math.floor(Math.random() * starColors.length)];
        cols[i * 3] = color.r;
        cols[i * 3 + 1] = color.g;
        cols[i * 3 + 2] = color.b;

        // Much larger sizes for better visibility
        szs[i] = 0.08 + Math.random() * 0.15;

        phases[i] = Math.random() * Math.PI * 2;
        speeds[i] = 1 + Math.random() * 2;
      }

      return {
        positions: pos,
        colors: cols,
        sizes: szs,
        twinklePhases: phases,
        twinkleSpeeds: speeds,
      };
    }, []);

  // Spawn shooting stars periodically
  useEffect(() => {
    const spawn = () => {
      setShootingStar({
        id: Date.now(),
        x: -15 + Math.random() * 10,
        y: 12 + Math.random() * 5,
        z: -6 - Math.random() * 3,
        vx: 15 + Math.random() * 10,
        vy: -5 - Math.random() * 3,
        life: 0,
      });
    };

    spawn(); // Spawn one immediately
    const interval = setInterval(spawn, 2000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate
  useFrame((state, delta) => {
    if (!starsRef.current) return;

    const time = state.clock.elapsedTime;
    const geometry = starsRef.current.geometry;
    const sizeAttr = geometry.attributes.size;

    // Twinkle stars
    for (let i = 0; i < STAR_COUNT; i++) {
      const baseSize = sizes[i];
      const phase = twinklePhases[i];
      const speed = twinkleSpeeds[i];
      const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * speed + phase));
      sizeAttr.array[i] = baseSize * twinkle;
    }
    sizeAttr.needsUpdate = true;

    // Update shooting star
    if (shootingStar) {
      setShootingStar((s) => {
        if (!s || s.life > 1) return null;
        return {
          ...s,
          x: s.x + s.vx * delta,
          y: s.y + s.vy * delta,
          life: s.life + delta * 2,
        };
      });

      // Update shooting star sprite rotation and scale
      const sprite = shootingStarRef.current;
      if (sprite && shootingStar) {
        sprite.position.set(shootingStar.x, shootingStar.y, shootingStar.z);
        // Calculate angle from velocity
        const angle = Math.atan2(shootingStar.vy, shootingStar.vx);
        sprite.material.rotation = angle;
        // Fade out as life increases
        sprite.material.opacity = 1 - shootingStar.life;
      }
    }
  });

  return (
    <group>
      {/* Twinkling stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={STAR_COUNT}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={STAR_COUNT}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={STAR_COUNT}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Shooting star with glowing trail */}
      {shootingStar && shootingStar.life < 1 && trailTexture && (
        <sprite
          ref={shootingStarRef}
          position={[shootingStar.x, shootingStar.y, shootingStar.z]}
          scale={[8, 1.5, 1]}
        >
          <spriteMaterial
            map={trailTexture}
            transparent
            opacity={1 - shootingStar.life}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            color="#ffffff"
          />
        </sprite>
      )}
    </group>
  );
});

export default Starfield;
