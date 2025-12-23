import { useFrame, useThree } from "@react-three/fiber";
import { memo } from "react";
import * as THREE from "three";
import { CAMERA_CONFIG } from "../config/sceneConfig";
import { useSmoothAnimation } from "../hooks/useAnimationFrame";
import { useScene } from "../context/SceneContext";

const CameraAnimation = memo(function CameraAnimation() {
  const { camera } = useThree();
  const { handleAnimationComplete } = useScene();

  const getProgress = useSmoothAnimation(
    CAMERA_CONFIG.animationDuration,
    handleAnimationComplete
  );

  useFrame(() => {
    const { eased, isComplete } = getProgress();

    if (isComplete) return;

    const startPos = new THREE.Vector3(...CAMERA_CONFIG.animationStartPosition);
    const endPos = new THREE.Vector3(...CAMERA_CONFIG.initialPosition);

    camera.position.lerpVectors(startPos, endPos, eased);
    camera.lookAt(0, 0, 0);
  });

  return null;
});

export default CameraAnimation;

