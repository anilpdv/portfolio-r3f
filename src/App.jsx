import { Canvas } from "@react-three/fiber";
import { Suspense, memo } from "react";
import { Loader } from "@react-three/drei";
import Experience from "./Experience.jsx";
import CameraAnimation from "./components/CameraAnimation.jsx";
import ThemeSwitcher from "./components/ThemeSwitcher.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import { SceneProvider } from "./context/SceneContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { CAMERA_CONFIG, PERFORMANCE_CONFIG } from "./config/sceneConfig.js";

const App = memo(function App() {
  return (
    <ThemeProvider>
      <SceneProvider>
        <Canvas
          camera={{
            fov: CAMERA_CONFIG.fov,
            near: CAMERA_CONFIG.near,
            far: CAMERA_CONFIG.far,
            position: CAMERA_CONFIG.initialPosition,
          }}
          dpr={PERFORMANCE_CONFIG.dpr}
          performance={{ min: 0.5 }}
          gl={{
            antialias: PERFORMANCE_CONFIG.antialias,
            alpha: false,
            powerPreference: PERFORMANCE_CONFIG.powerPreference,
            stencil: PERFORMANCE_CONFIG.stencil,
            depth: true,
          }}
          frameloop="always"
          onCreated={({ gl, camera }) => {
            gl.setClearColor("#0a0a12");
            camera.updateProjectionMatrix();
          }}
        >
          <Suspense fallback={null}>
            <CameraAnimation />
            <Experience />
          </Suspense>
        </Canvas>
        <ThemeSwitcher />
        <CustomCursor />
        <Loader
          containerStyles={{
            background: "linear-gradient(180deg, #0a0a12 0%, #12121a 100%)",
          }}
          barStyles={{
            background: "linear-gradient(90deg, #4a90e2 0%, #88ccff 100%)",
            height: "3px",
          }}
          dataStyles={{
            color: "#e8f4ff",
            fontSize: "14px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        />
      </SceneProvider>
    </ThemeProvider>
  );
});

export default App;
