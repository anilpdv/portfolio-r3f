import { memo } from "react";
import Laptop from "./Laptop";
import LaptopScreen from "./LaptopScreen";
import LaptopText from "./LaptopText";
import {
  LAPTOP_CONFIG,
  SCREEN_CONFIG,
  TEXT_CONFIG,
} from "../config/sceneConfig";

const LaptopScene = memo(function LaptopScene() {
  return (
    <group frustumCulled={false}>
      <rectAreaLight
        width={SCREEN_CONFIG.dimensions[0]}
        height={SCREEN_CONFIG.dimensions[1]}
        intensity={8}
        color="#88ccff"
        rotation={[-0.1, Math.PI, 0]}
        position={[0, 0.55, -1.15]}
      />

      <pointLight
        position={[0, 2, 3]}
        intensity={20}
        color="#ffffff"
        distance={8}
        decay={2}
      />

      <pointLight
        position={[1, 1, 1]}
        intensity={10}
        color="#ffffff"
        distance={5}
        decay={2}
      />

      <Laptop
        scale={LAPTOP_CONFIG.scale}
        positionX={LAPTOP_CONFIG.positionX}
        positionY={LAPTOP_CONFIG.positionY}
      />
      <LaptopScreen
        position={[0.01, 0.1, -2]}
        rotation={SCREEN_CONFIG.rotation}
        distanceFactor={1.56}
        url={SCREEN_CONFIG.url}
      />

      <LaptopText
        content={TEXT_CONFIG.content}
        position={TEXT_CONFIG.position}
        rotation={TEXT_CONFIG.rotation}
        fontSize={TEXT_CONFIG.fontSize}
        font={TEXT_CONFIG.font}
      />
    </group>
  );
});

export default LaptopScene;
