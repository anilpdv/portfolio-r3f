import Laptop from "./Laptop";
import LaptopScreen from "./LaptopScreen";
import LaptopText from "./LaptopText";

export default function LaptopScene() {
  return (
    <group frustumCulled={false}>
      <rectAreaLight
        width={2.5}
        height={1.65}
        intensity={65}
        color="#ff6900"
        rotation={[-0.1, Math.PI, 0]}
        position={[0, 0.55, -1.15]}
      />

      <spotLight
        position={[0, 3, 0]}
        intensity={100}
        angle={0.5}
        penumbra={0.5}
        color="#ffffff"
      />

      <Laptop scale={13} positionY={-1.2} />
      <LaptopScreen
        position={[0, 0.09, -2]}
        rotation={-0.256}
        distanceFactor={1.55}
        url="https://anilpdv.github.io/portfolio/"
      />

      <LaptopText
        content="ANIL PALLI"
        position={[2.2, 0.75, 0.75]}
        rotation={-1.25}
        fontSize={1.0}
        font="/bangers-v20-latin-regular.woff"
      />
    </group>
  );
}
