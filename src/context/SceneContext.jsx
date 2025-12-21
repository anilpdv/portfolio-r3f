import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const SceneContext = createContext(null);

export function SceneProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [performance, setPerformance] = useState({
    fps: 60,
    quality: "high",
  });

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const updateLoadingProgress = useCallback((progress) => {
    setLoadingProgress(progress);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
  }, []);

  const updatePerformance = useCallback((perfData) => {
    setPerformance((prev) => ({ ...prev, ...perfData }));
  }, []);

  const value = useMemo(
    () => ({
      isLoaded,
      loadingProgress,
      animationComplete,
      performance,
      handleLoadComplete,
      updateLoadingProgress,
      handleAnimationComplete,
      updatePerformance,
    }),
    [
      isLoaded,
      loadingProgress,
      animationComplete,
      performance,
      handleLoadComplete,
      updateLoadingProgress,
      handleAnimationComplete,
      updatePerformance,
    ]
  );

  return (
    <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error("useScene must be used within SceneProvider");
  }
  return context;
}
