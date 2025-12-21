import { memo } from "react";
import { LIGHTING_CONFIG } from "../config/sceneConfig";

const Lighting = memo(function Lighting() {
  const { ambient, keyLight, fillLight, rimLight } = LIGHTING_CONFIG;

  return (
    <>
      <ambientLight intensity={0.3} color="#ffffff" />

      <directionalLight
        position={keyLight.position}
        intensity={0.5}
        color="#ffffff"
      />

      <pointLight
        position={fillLight.position}
        intensity={20}
        color="#e8f4ff"
        distance={fillLight.distance}
        decay={2}
      />

      <pointLight
        position={rimLight.position}
        intensity={20}
        color="#88ccff"
        distance={rimLight.distance}
        decay={2}
      />
    </>
  );
});

export default Lighting;
