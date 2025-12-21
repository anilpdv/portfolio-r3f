import { memo } from "react";
import { PresentationControls } from "@react-three/drei";
import Lighting from "./components/Lighting";
import LaptopScene from "./components/LaptopScene";
import PostProcessing from "./components/PostProcessing";
import BackgroundEffects from "./components/background/BackgroundEffects";
import { CONTROLS_CONFIG } from "./config/sceneConfig";
import { usePerformanceMonitor } from "./hooks/usePerformanceMonitor";
import { useTheme } from "./context/ThemeContext";

const Experience = memo(function Experience() {
  usePerformanceMonitor();
  const { theme } = useTheme();

  return (
    <>
      <color args={[theme.background]} attach="background" />
      <fog
        attach="fog"
        args={[theme.fog.color, theme.fog.near, theme.fog.far]}
      />

      {/* Theme-specific background effects */}
      <BackgroundEffects />

      <Lighting />

      <PresentationControls
        global={CONTROLS_CONFIG.global}
        rotation={CONTROLS_CONFIG.rotation}
        polar={CONTROLS_CONFIG.polar}
        azimuth={CONTROLS_CONFIG.azimuth}
        config={CONTROLS_CONFIG.config}
        snap={CONTROLS_CONFIG.snap}
        makeDefault
      >
        <group frustumCulled={false}>
          <LaptopScene />
        </group>
      </PresentationControls>

      <PostProcessing />
    </>
  );
});

export default Experience;
