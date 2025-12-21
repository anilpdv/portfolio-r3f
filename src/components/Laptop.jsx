import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function Laptop({ scale = 12, positionY = -1.2 }) {
  const { scene } = useGLTF("/macbook_pro_14-inch_m5/scene.gltf");

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.frustumCulled = false;
        }
      });
    }
  }, [scene]);

  return (
    <primitive
      object={scene}
      position={[0, positionY, 0]}
      scale={scale}
      frustumCulled={false}
    />
  );
}
