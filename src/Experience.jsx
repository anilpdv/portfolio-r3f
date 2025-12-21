import { Environment, PresentationControls } from "@react-three/drei";
import Particles from "./components/Particles";
import Lighting from "./components/Lighting";
import LaptopScene from "./components/LaptopScene";

export default function Experience() {
  return (
    <>
      <Environment preset="city" />
      <color args={["#0f0f1a"]} attach="background" />

      <Particles count={200} color="#88ccff" size={0.02} opacity={0.8} />

      <Lighting />

      <PresentationControls
        global
        rotation={[0.25, 0.2, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={false}
      >
        <LaptopScene />
      </PresentationControls>
    </>
  );
}
