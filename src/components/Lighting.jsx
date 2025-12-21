import { memo } from "react";
import { LIGHTING_CONFIG } from "../config/sceneConfig";
import { useTheme } from "../context/ThemeContext";

const Lighting = memo(function Lighting() {
  const { keyLight, fillLight, rimLight } = LIGHTING_CONFIG;
  const { theme } = useTheme();
  const { lighting } = theme;

  return (
    <>
      <ambientLight
        intensity={lighting.ambient.intensity}
        color={lighting.ambient.color}
      />

      <directionalLight
        position={keyLight.position}
        intensity={lighting.keyLight.intensity * 0.005}
        color={lighting.keyLight.color}
      />

      <pointLight
        position={fillLight.position}
        intensity={lighting.fillLight.intensity}
        color={lighting.fillLight.color}
        distance={fillLight.distance}
        decay={2}
      />

      <pointLight
        position={rimLight.position}
        intensity={lighting.rimLight.intensity}
        color={lighting.rimLight.color}
        distance={rimLight.distance}
        decay={2}
      />
    </>
  );
});

export default Lighting;
