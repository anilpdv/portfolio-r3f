import { Text } from "@react-three/drei";
import { useRef, memo } from "react";
import { TEXT_CONFIG } from "../config/sceneConfig";
import { useThrottledFrame } from "../hooks/useAnimationFrame";
import { useTheme } from "../context/ThemeContext";
import { THEMES } from "../config/themes";

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
    // Simple neon effect with bright colors
    return (
      <group>
        {/* Background glow */}
        <Text
          fontSize={fontSize * 1.1}
          position={position}
          font={font}
          rotation-y={rotation}
          maxWidth={2}
          textAlign="center"
          letterSpacing={0.05}
          color={"rgb(255, 0, 255)"} // Bright magenta
          fillOpacity={0.3}
          frustumCulled={false}
          renderOrder={997}
          anchorX="center"
          anchorY="middle"
        >
          {content}
        </Text>

        {/* Main bright cyan text */}
        <Text
          ref={textRef}
          fontSize={fontSize}
          position={position}
          font={font}
          rotation-y={rotation}
          maxWidth={2}
          textAlign="center"
          letterSpacing={0.05}
          color={"rgb(0, 255, 255)"} // Bright cyan
          outlineWidth={0.02}
          outlineColor={"rgb(255, 0, 255)"} // Magenta outline
          fillOpacity={1.0}
          frustumCulled={false}
          renderOrder={999}
          anchorX="center"
          anchorY="middle"
        >
          {content}
        </Text>
      </group>
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
