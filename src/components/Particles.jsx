import { useRef, useMemo, memo } from "react";
import * as THREE from "three";
import { PARTICLE_CONFIG } from "../config/sceneConfig";
import { useThrottledFrame } from "../hooks/useAnimationFrame";

const Particles = memo(function Particles({
  count = PARTICLE_CONFIG.count,
  size = PARTICLE_CONFIG.baseSize,
  opacity = PARTICLE_CONFIG.opacity,
}) {
  const pointsRef = useRef();
  const config = PARTICLE_CONFIG;

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const szs = new Float32Array(count);

    const color1 = new THREE.Color(config.colors.primary);
    const color2 = new THREE.Color(config.colors.secondary);
    const color3 = new THREE.Color(config.colors.tertiary);

    const { minRadius, maxRadius, avoidanceZone } = config.distribution;

    for (let i = 0; i < count; i++) {
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) - 0.5;
      const z = radius * Math.cos(phi);

      const inAvoidanceZone =
        y > avoidanceZone.y[0] &&
        y < avoidanceZone.y[1] &&
        x > avoidanceZone.x[0] &&
        x < avoidanceZone.x[1] &&
        z > avoidanceZone.z[0];

      if (inAvoidanceZone) {
        pos[i * 3] = x * 1.3;
        pos[i * 3 + 1] = y + (Math.random() - 0.5) * 2;
        pos[i * 3 + 2] = z - 2;
      } else {
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
      }

      const normalizedY = (pos[i * 3 + 1] + 3) / 6;
      const mixedColor = new THREE.Color();

      if (normalizedY < 0.5) {
        mixedColor.lerpColors(color3, color1, normalizedY * 2);
      } else {
        mixedColor.lerpColors(color1, color2, (normalizedY - 0.5) * 2);
      }

      cols[i * 3] = mixedColor.r;
      cols[i * 3 + 1] = mixedColor.g;
      cols[i * 3 + 2] = mixedColor.b;

      szs[i] = size * (0.5 + Math.random() * 1.5);
    }

    return { positions: pos, colors: cols, sizes: szs };
  }, [count, size, config]);

  useThrottledFrame((state) => {
    if (!pointsRef.current) return;

    const { rotationSpeed, pulseSpeed, pulseAmount } = config.animation;

    pointsRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed;
    pointsRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.1) * 0.1;

    const material = pointsRef.current.material;
    material.opacity =
      opacity *
      (1 -
        pulseAmount +
        Math.sin(state.clock.elapsedTime * pulseSpeed) * pulseAmount);
  }, 2);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
});

export default Particles;
