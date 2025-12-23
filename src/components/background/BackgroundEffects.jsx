import { memo, Suspense } from "react";
import { useTheme } from "../../context/ThemeContext";
import Butterflies from "./Butterflies";
import DigitalRain from "./DigitalRain";
import Fireflies from "./Fireflies";

const BackgroundEffects = memo(function BackgroundEffects() {
  const { themeName } = useTheme();

  return (
    <group renderOrder={-1}>
      <Suspense fallback={null}>
        {themeName === "day" && <Butterflies />}
        {themeName === "neon" && <DigitalRain />}
        {themeName === "night" && <Fireflies />}
      </Suspense>
    </group>
  );
});

export default BackgroundEffects;
