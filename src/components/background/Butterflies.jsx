import { useRef, useMemo, memo, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

const BUTTERFLY_COUNT = 25;

const BUTTERFLY_COLORS = [
  { wing: "#89CFF0", accent: "#5BA3D9" }, // blue
  { wing: "#DDA0DD", accent: "#BA55D3" }, // purple
  { wing: "#FFB6C1", accent: "#FF69B4" }, // pink
  { wing: "#98FB98", accent: "#3CB371" }, // green
  { wing: "#FFDAB9", accent: "#FF8C00" }, // orange
];

const MOVEMENT_TYPES = {
  HORIZONTAL_LEFT: "horizontal_left",
  HORIZONTAL_RIGHT: "horizontal_right",
  VERTICAL_UP: "vertical_up",
  VERTICAL_DOWN: "vertical_down",
  DIAGONAL_UP_LEFT: "diagonal_up_left",
  DIAGONAL_UP_RIGHT: "diagonal_up_right",
  DIAGONAL_DOWN_LEFT: "diagonal_down_left",
  DIAGONAL_DOWN_RIGHT: "diagonal_down_right",
  FLOATER: "floater",
};

const FLIGHT_STATES = {
  GLIDING: "gliding",
  FLUTTERING: "fluttering",
  HOVERING: "hovering",
  TURNING: "turning",
};

// Create a realistic butterfly texture with canvas
const createButterflyTexture = (wingColor, accentColor) => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Clear background
  ctx.clearRect(0, 0, 256, 256);

  // Draw butterfly wings (symmetric) - scaled up 2x
  const drawWing = (flipX = false) => {
    ctx.save();
    if (flipX) {
      ctx.translate(256, 0);
      ctx.scale(-1, 1);
    }

    // Upper wing
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.bezierCurveTo(90, 80, 40, 50, 20, 70);
    ctx.bezierCurveTo(10, 100, 30, 140, 80, 120);
    ctx.bezierCurveTo(100, 110, 120, 120, 128, 128);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(80, 90, 10, 80, 100, 80);
    gradient.addColorStop(0, wingColor);
    gradient.addColorStop(0.7, wingColor);
    gradient.addColorStop(1, accentColor);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Wing pattern dots
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.arc(70, 90, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(50, 100, 8, 0, Math.PI * 2);
    ctx.fill();

    // Lower wing
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.bezierCurveTo(110, 150, 80, 190, 50, 200);
    ctx.bezierCurveTo(30, 190, 40, 160, 70, 150);
    ctx.bezierCurveTo(100, 140, 116, 136, 128, 128);
    ctx.closePath();

    const gradient2 = ctx.createRadialGradient(80, 170, 10, 80, 170, 60);
    gradient2.addColorStop(0, accentColor);
    gradient2.addColorStop(1, wingColor);
    ctx.fillStyle = gradient2;
    ctx.fill();

    ctx.restore();
  };

  // Draw both wings
  drawWing(false); // Right wing
  drawWing(true); // Left wing (mirrored)

  // Draw body
  ctx.fillStyle = "#2a1810";
  ctx.beginPath();
  ctx.ellipse(128, 128, 8, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw head
  ctx.beginPath();
  ctx.arc(128, 84, 10, 0, Math.PI * 2);
  ctx.fill();

  // Antennae
  ctx.strokeStyle = "#2a1810";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(124, 80);
  ctx.quadraticCurveTo(110, 50, 100, 40);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(132, 80);
  ctx.quadraticCurveTo(146, 50, 156, 40);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const Butterflies = memo(function Butterflies() {
  const butterfliesRef = useRef([]);

  const textures = useMemo(() => {
    return BUTTERFLY_COLORS.map((c) =>
      createButterflyTexture(c.wing, c.accent)
    );
  }, []);

  useEffect(() => {
    return () => {
      textures.forEach((t) => t.dispose());
    };
  }, [textures]);

  const butterflies = useMemo(() => {
    const movementTypes = Object.values(MOVEMENT_TYPES);

    return Array.from({ length: BUTTERFLY_COUNT }, (_, i) => {
      const movementType =
        movementTypes[Math.floor(Math.random() * movementTypes.length)];

      let x, y, speedX, speedY;

      switch (movementType) {
        case MOVEMENT_TYPES.HORIZONTAL_LEFT:
          x = 25;
          y = -5 + Math.random() * 25;
          speedX = -(0.2 + Math.random() * 0.2);
          speedY = (Math.random() - 0.5) * 0.1;
          break;
        case MOVEMENT_TYPES.HORIZONTAL_RIGHT:
          x = -25;
          y = -5 + Math.random() * 25;
          speedX = 0.2 + Math.random() * 0.2;
          speedY = (Math.random() - 0.5) * 0.1;
          break;
        case MOVEMENT_TYPES.VERTICAL_UP:
          x = -20 + Math.random() * 40;
          y = -5;
          speedX = (Math.random() - 0.5) * 0.1;
          speedY = 0.2 + Math.random() * 0.2;
          break;
        case MOVEMENT_TYPES.VERTICAL_DOWN:
          x = -20 + Math.random() * 40;
          y = 20;
          speedX = (Math.random() - 0.5) * 0.1;
          speedY = -(0.2 + Math.random() * 0.2);
          break;
        case MOVEMENT_TYPES.DIAGONAL_UP_LEFT:
          x = 25;
          y = -5;
          speedX = -(0.2 + Math.random() * 0.15);
          speedY = 0.2 + Math.random() * 0.15;
          break;
        case MOVEMENT_TYPES.DIAGONAL_UP_RIGHT:
          x = -25;
          y = -5;
          speedX = 0.2 + Math.random() * 0.15;
          speedY = 0.2 + Math.random() * 0.15;
          break;
        case MOVEMENT_TYPES.DIAGONAL_DOWN_LEFT:
          x = 25;
          y = 20;
          speedX = -(0.2 + Math.random() * 0.15);
          speedY = -(0.2 + Math.random() * 0.15);
          break;
        case MOVEMENT_TYPES.DIAGONAL_DOWN_RIGHT:
          x = -25;
          y = 20;
          speedX = 0.2 + Math.random() * 0.15;
          speedY = -(0.2 + Math.random() * 0.15);
          break;
        case MOVEMENT_TYPES.FLOATER:
        default:
          x = (Math.random() - 0.5) * 30;
          y = Math.random() * 15;
          speedX = (Math.random() - 0.5) * 0.15;
          speedY = (Math.random() - 0.5) * 0.15;
          break;
      }

      return {
        id: i,
        x,
        y,
        z: -1 - Math.random() * 3,
        speedX,
        speedY,
        vx: speedX,
        vy: speedY,
        movementType,
        flightState: FLIGHT_STATES.GLIDING,
        stateTimer: 0,
        targetAngle: 0,
        currentAngle: 0,
        flapPhase: Math.random() * Math.PI * 2,
        flapSpeed: 6 + Math.random() * 4,
        scale: 0.8 + Math.random() * 0.6,
        colorIdx: Math.floor(Math.random() * BUTTERFLY_COLORS.length),
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 0.5,
      };
    });
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    butterflies.forEach((b, i) => {
      const sprite = butterfliesRef.current[i];
      if (!sprite) return;

      b.stateTimer += delta;

      const updateFlightState = () => {
        const transitionChance = Math.random();

        if (b.stateTimer > 2 + Math.random() * 2) {
          if (b.flightState === FLIGHT_STATES.HOVERING) {
            b.flightState =
              transitionChance > 0.5
                ? FLIGHT_STATES.GLIDING
                : FLIGHT_STATES.TURNING;
            b.stateTimer = 0;
          } else if (b.flightState === FLIGHT_STATES.GLIDING) {
            if (transitionChance > 0.8) {
              b.flightState = FLIGHT_STATES.HOVERING;
            } else if (transitionChance > 0.4) {
              b.flightState = FLIGHT_STATES.TURNING;
              b.targetAngle = (Math.random() - 0.5) * Math.PI;
            } else {
              b.flightState = FLIGHT_STATES.FLUTTERING;
            }
            b.stateTimer = 0;
          } else {
            b.flightState = FLIGHT_STATES.GLIDING;
            b.stateTimer = 0;
          }
        }
      };

      updateFlightState();

      let targetVx = b.speedX;
      let targetVy = b.speedY;
      let speedMultiplier = 0.04;
      let wobbleX = 0;
      let wobbleY = 0;

      switch (b.flightState) {
        case FLIGHT_STATES.HOVERING:
          targetVx = 0;
          targetVy = Math.sin(time * 2) * 0.05;
          speedMultiplier = 0.02;
          break;

        case FLIGHT_STATES.FLUTTERING:
          wobbleX = Math.sin(time * b.wobbleSpeed * 3 + b.wobblePhase) * 0.3;
          wobbleY = Math.cos(time * b.wobbleSpeed * 3 + b.wobblePhase) * 0.3;
          speedMultiplier = 0.03;
          break;

        case FLIGHT_STATES.TURNING:
          const turnProgress = Math.min(b.stateTimer / 1.5, 1);
          const currentAngle = Math.atan2(b.speedY, b.speedX);
          const newAngle = currentAngle + b.targetAngle * turnProgress;
          const speed = Math.sqrt(b.speedX * b.speedX + b.speedY * b.speedY);
          targetVx = Math.cos(newAngle) * speed;
          targetVy = Math.sin(newAngle) * speed;
          wobbleX = Math.sin(time * b.wobbleSpeed * 2 + b.wobblePhase) * 0.1;
          wobbleY = Math.cos(time * b.wobbleSpeed * 2 + b.wobblePhase) * 0.1;
          speedMultiplier = 0.035;
          break;

        case FLIGHT_STATES.GLIDING:
        default:
          wobbleX = Math.sin(time * b.wobbleSpeed * 0.5 + b.wobblePhase) * 0.05;
          wobbleY = Math.cos(time * b.wobbleSpeed * 0.5 + b.wobblePhase) * 0.05;
          speedMultiplier = 0.045;
          break;
      }

      const smoothing = 0.1;
      b.vx = b.vx * (1 - smoothing) + (targetVx + wobbleX) * smoothing;
      b.vy = b.vy * (1 - smoothing) + (targetVy + wobbleY) * smoothing;

      b.x += b.vx * speedMultiplier;
      b.y += b.vy * speedMultiplier;

      const edgeBuffer = 5;
      if (b.x > 25 + edgeBuffer) {
        b.x = -25 - edgeBuffer;
      }
      if (b.x < -25 - edgeBuffer) {
        b.x = 25 + edgeBuffer;
      }
      if (b.y > 20 + edgeBuffer) {
        b.y = -5 - edgeBuffer;
      }
      if (b.y < -5 - edgeBuffer) {
        b.y = 20 + edgeBuffer;
      }

      if (b.flightState === FLIGHT_STATES.TURNING && b.stateTimer > 1.5) {
        b.speedX = targetVx;
        b.speedY = targetVy;
      }

      sprite.position.set(b.x, b.y, b.z);

      const velocityMagnitude = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (velocityMagnitude > 0.01) {
        const movementAngle = Math.atan2(b.vy, b.vx);
        b.currentAngle = b.currentAngle * 0.8 + movementAngle * 0.2;
        sprite.material.rotation = b.currentAngle;
      }

      let flapIntensity = 0.15;
      if (b.flightState === FLIGHT_STATES.FLUTTERING) {
        flapIntensity = 0.25;
      } else if (b.flightState === FLIGHT_STATES.HOVERING) {
        flapIntensity = 0.3;
      }
      const flapScale =
        1 + Math.sin(time * b.flapSpeed + b.flapPhase) * flapIntensity;
      sprite.scale.set(b.scale * flapScale, b.scale, 1);
    });
  });

  return (
    <group>
      {butterflies.map((b, i) => (
        <sprite
          key={b.id}
          ref={(el) => (butterfliesRef.current[i] = el)}
          position={[b.x, b.y, b.z]}
          scale={[b.scale, b.scale, 1]}
        >
          <spriteMaterial
            map={textures[b.colorIdx]}
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.NormalBlending}
            color={new THREE.Color(1.2, 1.2, 1.2)}
          />
        </sprite>
      ))}
    </group>
  );
});

export default Butterflies;
