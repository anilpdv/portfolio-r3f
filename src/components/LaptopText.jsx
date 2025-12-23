import { Text3D, Center } from "@react-three/drei";
import { useRef, memo } from "react";
import { TEXT_CONFIG } from "../config/sceneConfig";
import { useThrottledFrame } from "../hooks/useAnimationFrame";
import { useTheme } from "../context/ThemeContext";

const LaptopText = memo(function LaptopText({
  content = TEXT_CONFIG.content,
  position = TEXT_CONFIG.position,
  rotation = TEXT_CONFIG.rotation,
  fontSize = TEXT_CONFIG.fontSize,
}) {
  const groupRef = useRef();
  const { theme, themeName } = useTheme();
  const isNeonTheme = themeName === "neon";
  const textConfig = theme?.text || {};

  // Floating animation for night/day modes
  useThrottledFrame((state) => {
    if (!isNeonTheme && groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.position.y =
        position[1] +
        Math.sin(time * TEXT_CONFIG.animation.floatSpeed) *
          TEXT_CONFIG.animation.floatAmount;
    }
  }, 2);

  // 3D text parameters
  const textParams = {
    font: "/fonts/droid_sans_bold.typeface.json",
    size: fontSize * 0.75,
    height: 0.4,
    bevelEnabled: true,
    bevelSize: 0.03,
    bevelThickness: 0.08,
    curveSegments: 16,
    bevelSegments: 6,
    lineHeight: 0.75,
    letterSpacing: 0.02,
  };

  if (isNeonTheme) {
    return (
      <group ref={groupRef} position={position} rotation-y={rotation}>
        <Center>
          <Text3D {...textParams}>
            {`ANIL\nPALLI`}
            <meshStandardMaterial
              color={textConfig.color}
              metalness={0.1}
              roughness={0.7}
            />
          </Text3D>
        </Center>
      </group>
    );
  }

  // Night/Day mode
  return (
    <group ref={groupRef} position={position} rotation-y={rotation}>
      <Center>
        <Text3D {...textParams}>
          {`ANIL\nPALLI`}
          <meshStandardMaterial
            color={textConfig.color}
            metalness={0.1}
            roughness={0.7}
          />
        </Text3D>
      </Center>
    </group>
  );
});

export default LaptopText;
