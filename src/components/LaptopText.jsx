import { Text } from "@react-three/drei";

export default function LaptopText({
  content = "ANIL PALLI",
  position = [2.2, 0.75, 0.75],
  rotation = -1.25,
  fontSize = 1.0,
  font = "/bangers-v20-latin-regular.woff",
}) {
  return (
    <Text
      fontSize={fontSize}
      position={position}
      font={font}
      rotation-y={rotation}
      maxWidth={2}
      textAlign="center"
      letterSpacing={0.05}
      outlineWidth={0.01}
      outlineColor="#000000"
      frustumCulled={false}
      renderOrder={999}
    >
      {content}
    </Text>
  );
}
