import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useGLTF,
  Environment,
  Float,
  PresentationControls,
  ContactShadows,
  Html,
  Text,
} from "@react-three/drei";

function FloatingParticles({ count = 200 }) {
  const points = useRef();

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 0.5;
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#88ccff"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Experience() {
  const computer = useGLTF("./laptop.gltf");
  return (
    <>
      <Environment preset="city" />
      <color args={["#0f0f1a"]} attach="background" />
      <fog attach="fog" args={["#0f0f1a", 5, 15]} />

      {/* Floating particles */}
      <FloatingParticles count={200} />

      {/* Enhanced 3-point lighting */}
      <ambientLight intensity={0.4} color="#ffffff" />

      <spotLight
        position={[5, 5, 5]}
        intensity={70}
        angle={0.3}
        penumbra={0.5}
        color="#4a90e2"
        castShadow={false}
      />

      <pointLight
        position={[-3, 2, 2]}
        intensity={30}
        color="#ff9d5c"
        distance={10}
        decay={2}
      />

      <pointLight
        position={[0, 2, -3]}
        intensity={40}
        color="#b084cc"
        distance={8}
        decay={2}
      />

      <PresentationControls
        global
        rotation={[0.25, 0.2, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <Float rotationIntensity={0.4}>
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            color={"#ff6900"}
            rotation={[-0.1, Math.PI, 0]}
            position={[0, 0.55, -1.15]}
          />
          {/* Direct light on screen for iframe visibility */}
          <spotLight
            position={[0, 3, 0]}
            intensity={100}
            angle={0.5}
            penumbra={0.5}
            color="#ffffff"
          />
          <primitive object={computer.scene} position-y={-1.2}>
            <Html
              transform
              wrapperClass="htmlScreen"
              distanceFactor={1.19}
              position={[0, 1.56, -1.4]}
              rotation-x={-0.256}
              zIndexRange={[100, 0]}
            >
              <iframe src="https://anilpdv.github.io/portfolio/"></iframe>
            </Html>
          </primitive>
          <Text
            fontSize={1.0}
            position={[2.2, 0.75, 0.75]}
            font={"./bangers-v20-latin-regular.woff"}
            rotation-y={-1.25}
            maxWidth={2}
            textAlign="center"
            letterSpacing={0.05}
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            ANIL PALLI
          </Text>
        </Float>
      </PresentationControls>
      {/* Temporarily disabled - causing flickering */}
      {/* <ContactShadows position-y={-1.4} opacity={0.4} scale={5} blur={2.4} /> */}
    </>
  );
}
