import { memo, Suspense } from "react";
import { useTheme } from "../../context/ThemeContext";
import Starfield from "./Starfield";
import Butterflies from "./Butterflies";
import DigitalRain from "./DigitalRain";

const BackgroundEffects = memo(function BackgroundEffects() {
  const { themeName, isTransitioning } = useTheme();

  return (
    <group renderOrder={-1}>
      <Suspense fallback={null}>
        {themeName === "night" && <Starfield />}
        {themeName === "day" && <Butterflies />}
        {themeName === "neon" && <DigitalRain />}
      </Suspense>
    </group>
  );
});

export default BackgroundEffects;
