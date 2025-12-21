import { Html } from "@react-three/drei";

export default function LaptopScreen({
  position = [0, 0.52, -1.38],
  rotation = -0.256,
  distanceFactor = 1.17,
  url = "https://anilpdv.github.io/portfolio/",
}) {
  return (
    <Html
      transform
      wrapperClass="htmlScreen"
      distanceFactor={distanceFactor}
      position={position}
      rotation-x={rotation}
      zIndexRange={[100, 0]}
    >
      <iframe src={url} title="Portfolio" />
    </Html>
  );
}
