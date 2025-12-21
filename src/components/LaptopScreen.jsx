import { Html } from "@react-three/drei";
import { useRef, memo } from "react";
import { SCREEN_CONFIG } from "../config/sceneConfig";
import { useThrottledFrame } from "../hooks/useAnimationFrame";

const LaptopScreen = memo(function LaptopScreen({
  position = SCREEN_CONFIG.position,
  rotation = SCREEN_CONFIG.rotation,
  distanceFactor = SCREEN_CONFIG.distanceFactor,
  url = SCREEN_CONFIG.url,
}) {
  const groupRef = useRef();
  const { dimensions, glowColor, glowOpacity, animation } = SCREEN_CONFIG;

  useThrottledFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] +
        Math.sin(state.clock.elapsedTime * animation.floatSpeed) *
          animation.floatAmount;
    }
  }, 3);

  return (
    <group ref={groupRef} position={position} frustumCulled={false}>
      <mesh position={[0, 0, 0.01]} rotation-x={rotation} frustumCulled={false}>
        <planeGeometry args={dimensions} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      <Html
        transform
        wrapperClass="htmlScreen"
        distanceFactor={distanceFactor}
        position={[0, 0, 0]}
        rotation-x={rotation}
        zIndexRange={[100, 0]}
        occlude={false}
      >
        <iframe src={url} title="Portfolio" />
      </Html>
    </group>
  );
});

export default LaptopScreen;
