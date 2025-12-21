import { Text } from "@react-three/drei";
import { useRef, memo } from "react";
import { useThrottledFrame } from "../hooks/useAnimationFrame";
import * as THREE from "three";

const NeonText = memo(function NeonText({
  content,
  position,
  rotation,
  fontSize,
  font,
}) {
  const textRefs = useRef([]);
  
  const layers = [
    { scale: 1.0, color: "#00ffff", emissive: "#00ffff", opacity: 1.0, emissiveIntensity: 2 },
    { scale: 1.01, color: "#00ffff", emissive: "#00ffff", opacity: 0.6, emissiveIntensity: 3 },
    { scale: 1.02, color: "#ff00ff", emissive: "#ff00ff", opacity: 0.4, emissiveIntensity: 3 },
    { scale: 1.03, color: "#00ff88", emissive: "#00ff88", opacity: 0.3, emissiveIntensity: 2 },
    { scale: 1.05, color: "#ff0088", emissive: "#ff0088", opacity: 0.2, emissiveIntensity: 2 },
  ];

  useThrottledFrame((state) => {
    const time = state.clock.elapsedTime;
    const floatY = position[1] + Math.sin(time * 0.4) * 0.015;
    
    textRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.position.y = floatY;
        
        const pulseOffset = index * 0.1;
        const pulse = 0.7 + Math.sin(time * 3 + pulseOffset) * 0.3;
        
        if (ref.material) {
          ref.material.emissiveIntensity = (layers[index].emissiveIntensity || 2) * pulse;
          ref.fillOpacity = layers[index].opacity * pulse;
        }
      }
    });
  }, 2);

  return (
    <group frustumCulled={false}>
      {layers.map((layer, index) => (
        <Text
          key={`neon-layer-${index}`}
          ref={(el) => (textRefs.current[index] = el)}
          fontSize={fontSize * layer.scale}
          position={position}
          font={font}
          rotation-y={rotation}
          maxWidth={2}
          textAlign="center"
          letterSpacing={0.05}
          frustumCulled={false}
          renderOrder={999 - index}
          anchorX="center"
          anchorY="middle"
          fillOpacity={layer.opacity}
        >
          <meshStandardMaterial
            color={layer.color}
            emissive={layer.emissive}
            emissiveIntensity={layer.emissiveIntensity}
            transparent={true}
            opacity={layer.opacity}
            toneMapped={false}
            depthWrite={index === 0}
            blending={index > 0 ? THREE.AdditiveBlending : THREE.NormalBlending}
          />
          {content}
        </Text>
      ))}
    </group>
  );
});

export default NeonText;