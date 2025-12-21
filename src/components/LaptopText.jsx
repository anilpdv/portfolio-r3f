import { Text } from "@react-three/drei";
import { useRef, memo } from "react";
import { TEXT_CONFIG } from "../config/sceneConfig";
import { useThrottledFrame } from "../hooks/useAnimationFrame";
import { useTheme } from "../context/ThemeContext";
import { THEMES } from "../config/themes";
import NeonText from "./NeonText";

const LaptopText = memo(function LaptopText({
  content = TEXT_CONFIG.content,
  position = TEXT_CONFIG.position,
  rotation = TEXT_CONFIG.rotation,
  fontSize = TEXT_CONFIG.fontSize,
  font = TEXT_CONFIG.font,
}) {
  const textRef = useRef();
  const { theme } = useTheme();
  const { color, outlineWidth, outlineColor, animation } = TEXT_CONFIG;

  const currentTheme = THEMES[theme];
  const isNeonTheme = theme === "neon";
  const textConfig = currentTheme?.text || {};

  useThrottledFrame((state) => {
    if (!isNeonTheme && textRef.current) {
      const time = state.clock.elapsedTime;
      
      textRef.current.position.y =
        position[1] +
        Math.sin(time * animation.floatSpeed) * animation.floatAmount;

      const distance = state.camera.position.distanceTo(
        textRef.current.position
      );
      const opacity = Math.min(1, Math.max(0.85, 1 - distance / 20));
      textRef.current.fillOpacity = opacity;
    }
  }, 2);

  if (isNeonTheme) {
    return (
      <NeonText
        content={content}
        position={position}
        rotation={rotation}
        fontSize={fontSize}
        font={font}
      />
    );
  }

  return (
    <Text
      ref={textRef}
      fontSize={fontSize}
      position={position}
      font={font}
      rotation-y={rotation}
      maxWidth={2}
      textAlign="center"
      letterSpacing={0.05}
      outlineWidth={outlineWidth}
      outlineColor={outlineColor}
      color={textConfig.color || color}
      frustumCulled={false}
      renderOrder={999}
      anchorX="center"
      anchorY="middle"
    >
      {content}
    </Text>
  );
});

export default LaptopText;
