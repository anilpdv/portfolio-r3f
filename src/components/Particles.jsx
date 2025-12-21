import { useRef, useMemo, memo, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PARTICLE_CONFIG } from "../config/sceneConfig";
import { useThrottledFrame } from "../hooks/useAnimationFrame";
import { useTheme } from "../context/ThemeContext";

// Mouse interaction config
const MOUSE_CONFIG = {
  influenceRadius: 1.5,
  repulsionStrength: 0.3,
  returnDamping: 0.05,
  maxDisplacement: 0.3,
};

const Particles = memo(function Particles({
  count = PARTICLE_CONFIG.count,
  size = PARTICLE_CONFIG.baseSize,
  opacity = PARTICLE_CONFIG.opacity,
}) {
  const pointsRef = useRef();
  const config = PARTICLE_CONFIG;
  const { pointer, camera } = useThree();
  const { theme } = useTheme();

  // Store displacement offsets for each particle
  const displacements = useRef(new Float32Array(count * 3));

  // Raycaster for mouse position in 3D
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mousePos3D = useRef(new THREE.Vector3());
  const tempVec = useRef(new THREE.Vector3());

  // Store normalized Y values for color interpolation
  const normalizedYValues = useRef(new Float32Array(count));

  const { positions, originalPositions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const origPos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const szs = new Float32Array(count);

    const color1 = new THREE.Color(theme.particles.primary);
    const color2 = new THREE.Color(theme.particles.secondary);
    const color3 = new THREE.Color(theme.particles.tertiary);

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

      // Store original positions for return animation
      origPos[i * 3] = pos[i * 3];
      origPos[i * 3 + 1] = pos[i * 3 + 1];
      origPos[i * 3 + 2] = pos[i * 3 + 2];

      const normalizedY = (pos[i * 3 + 1] + 3) / 6;
      normalizedYValues.current[i] = normalizedY;
      const mixedColor = new THREE.Color();

      if (normalizedY < 0.5) {
        mixedColor.lerpColors(color3, color1, normalizedY * 2);
      } else {
        mixedColor.lerpColors(color1, color2, (normalizedY - 0.5) * 2);
      }

      cols[i * 3] = mixedColor.r;
      cols[i * 3 + 1] = mixedColor.g;
      cols[i * 3 + 2] = mixedColor.b;

      szs[i] = size * (0.7 + Math.random() * 0.6);
    }

    return { positions: pos, originalPositions: origPos, colors: cols, sizes: szs };
  }, [count, size, config, theme.particles]);

  // Update particle colors when theme changes
  useEffect(() => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const colorAttr = geometry.attributes.color;
    if (!colorAttr) return;

    const color1 = new THREE.Color(theme.particles.primary);
    const color2 = new THREE.Color(theme.particles.secondary);
    const color3 = new THREE.Color(theme.particles.tertiary);

    for (let i = 0; i < count; i++) {
      const normalizedY = normalizedYValues.current[i];
      const mixedColor = new THREE.Color();

      if (normalizedY < 0.5) {
        mixedColor.lerpColors(color3, color1, normalizedY * 2);
      } else {
        mixedColor.lerpColors(color1, color2, (normalizedY - 0.5) * 2);
      }

      colorAttr.array[i * 3] = mixedColor.r;
      colorAttr.array[i * 3 + 1] = mixedColor.g;
      colorAttr.array[i * 3 + 2] = mixedColor.b;
    }

    colorAttr.needsUpdate = true;
  }, [theme.particles, count]);

  useThrottledFrame((state) => {
    if (!pointsRef.current) return;

    const { rotationSpeed, pulseSpeed, pulseAmount } = config.animation;

    // Rotate the entire particle system
    pointsRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed;
    pointsRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.1) * 0.1;

    // Update opacity with pulse
    const material = pointsRef.current.material;
    material.opacity =
      opacity *
      (1 -
        pulseAmount +
        Math.sin(state.clock.elapsedTime * pulseSpeed) * pulseAmount);

    // Get mouse position in 3D space
    raycaster.setFromCamera(pointer, camera);
    const ray = raycaster.ray;

    // Project mouse onto a plane at z=0 for interaction
    const planeNormal = new THREE.Vector3(0, 0, 1);
    const planePoint = new THREE.Vector3(0, 0, 0);
    const denominator = ray.direction.dot(planeNormal);

    if (Math.abs(denominator) > 0.0001) {
      const t = planePoint.clone().sub(ray.origin).dot(planeNormal) / denominator;
      mousePos3D.current.copy(ray.origin).add(ray.direction.clone().multiplyScalar(t));
    }

    // Get the geometry and update positions
    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position;
    const disp = displacements.current;

    // Transform mouse position to local space
    const inverseMatrix = pointsRef.current.matrixWorld.clone().invert();
    const localMousePos = mousePos3D.current.clone().applyMatrix4(inverseMatrix);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Get original position in local space
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      // Calculate distance from particle to mouse (in local space)
      const dx = ox - localMousePos.x;
      const dy = oy - localMousePos.y;
      const dz = oz - localMousePos.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Apply repulsion if within influence radius
      if (distance < MOUSE_CONFIG.influenceRadius && distance > 0.01) {
        const force =
          (1 - distance / MOUSE_CONFIG.influenceRadius) *
          MOUSE_CONFIG.repulsionStrength;

        // Normalize direction and apply force (push away from mouse)
        const invDist = 1 / distance;
        disp[i3] += dx * invDist * force * 0.1;
        disp[i3 + 1] += dy * invDist * force * 0.1;
        disp[i3 + 2] += dz * invDist * force * 0.1;
      }

      // Clamp displacement magnitude
      const dispMag = Math.sqrt(
        disp[i3] * disp[i3] +
          disp[i3 + 1] * disp[i3 + 1] +
          disp[i3 + 2] * disp[i3 + 2]
      );
      if (dispMag > MOUSE_CONFIG.maxDisplacement) {
        const scale = MOUSE_CONFIG.maxDisplacement / dispMag;
        disp[i3] *= scale;
        disp[i3 + 1] *= scale;
        disp[i3 + 2] *= scale;
      }

      // Apply damping to return to original position
      disp[i3] *= 1 - MOUSE_CONFIG.returnDamping;
      disp[i3 + 1] *= 1 - MOUSE_CONFIG.returnDamping;
      disp[i3 + 2] *= 1 - MOUSE_CONFIG.returnDamping;

      // Update position
      positionAttr.array[i3] = ox + disp[i3];
      positionAttr.array[i3 + 1] = oy + disp[i3 + 1];
      positionAttr.array[i3 + 2] = oz + disp[i3 + 2];
    }

    positionAttr.needsUpdate = true;
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
