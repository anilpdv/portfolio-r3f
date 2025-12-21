export default function Lighting() {
  return (
    <>
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
    </>
  );
}
