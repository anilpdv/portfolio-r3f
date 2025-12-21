import { useGLTF } from "@react-three/drei";
import { useEffect, memo } from "react";
import { LAPTOP_CONFIG } from "../config/sceneConfig";

const Laptop = memo(function Laptop({
  scale = LAPTOP_CONFIG.scale,
  positionX = LAPTOP_CONFIG.positionX,
  positionY = LAPTOP_CONFIG.positionY,
}) {
  const { scene } = useGLTF(LAPTOP_CONFIG.modelPath);

  useEffect(() => {
    if (!scene) return;

    scene.frustumCulled = false;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = false;
        child.castShadow = false;
        child.receiveShadow = false;

        if (child.material) {
          child.material.side = 2;
          child.material.metalness = 0;
          child.material.roughness = 1;
          child.material.envMapIntensity = 0;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return (
    <group frustumCulled={false}>
      <primitive
        object={scene}
        position={[positionX, positionY, 0]}
        scale={scale}
        frustumCulled={false}
      />
    </group>
  );
});

useGLTF.preload(LAPTOP_CONFIG.modelPath);

export default Laptop;
