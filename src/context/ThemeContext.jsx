import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";
import { THEMES, THEME_ORDER, getNextTheme } from "../config/themes";

const STORAGE_KEY = "portfolio-theme";
const TRANSITION_DURATION = 60;

// Helper to lerp colors
const lerpColor = (colorA, colorB, t) => {
  const a = new THREE.Color(colorA);
  const b = new THREE.Color(colorB);
  return a.lerp(b, t);
};

// Helper to lerp numbers
const lerpNumber = (a, b, t) => a + (b - a) * t;

// Deep lerp theme values
const lerpTheme = (themeA, themeB, t) => {
  return {
    name: t < 0.5 ? themeA.name : themeB.name,
    icon: t < 0.5 ? themeA.icon : themeB.icon,
    background: "#" + lerpColor(themeA.background, themeB.background, t).getHexString(),
    backgroundGradient: [
      "#" + lerpColor(themeA.backgroundGradient[0], themeB.backgroundGradient[0], t).getHexString(),
      "#" + lerpColor(themeA.backgroundGradient[1], themeB.backgroundGradient[1], t).getHexString(),
    ],
    fog: {
      color: "#" + lerpColor(themeA.fog.color, themeB.fog.color, t).getHexString(),
      near: lerpNumber(themeA.fog.near, themeB.fog.near, t),
      far: lerpNumber(themeA.fog.far, themeB.fog.far, t),
    },
    particles: {
      primary: "#" + lerpColor(themeA.particles.primary, themeB.particles.primary, t).getHexString(),
      secondary: "#" + lerpColor(themeA.particles.secondary, themeB.particles.secondary, t).getHexString(),
      tertiary: "#" + lerpColor(themeA.particles.tertiary, themeB.particles.tertiary, t).getHexString(),
    },
    lighting: {
      ambient: {
        intensity: lerpNumber(themeA.lighting.ambient.intensity, themeB.lighting.ambient.intensity, t),
        color: "#" + lerpColor(themeA.lighting.ambient.color, themeB.lighting.ambient.color, t).getHexString(),
      },
      keyLight: {
        intensity: lerpNumber(themeA.lighting.keyLight.intensity, themeB.lighting.keyLight.intensity, t),
        color: "#" + lerpColor(themeA.lighting.keyLight.color, themeB.lighting.keyLight.color, t).getHexString(),
      },
      fillLight: {
        intensity: lerpNumber(themeA.lighting.fillLight.intensity, themeB.lighting.fillLight.intensity, t),
        color: "#" + lerpColor(themeA.lighting.fillLight.color, themeB.lighting.fillLight.color, t).getHexString(),
      },
      rimLight: {
        intensity: lerpNumber(themeA.lighting.rimLight.intensity, themeB.lighting.rimLight.intensity, t),
        color: "#" + lerpColor(themeA.lighting.rimLight.color, themeB.lighting.rimLight.color, t).getHexString(),
      },
    },
    glow: {
      color: "#" + lerpColor(themeA.glow.color, themeB.glow.color, t).getHexString(),
      opacity: lerpNumber(themeA.glow.opacity, themeB.glow.opacity, t),
    },
    postProcessing: {
      bloom: {
        intensity: lerpNumber(themeA.postProcessing.bloom.intensity, themeB.postProcessing.bloom.intensity, t),
        luminanceThreshold: lerpNumber(themeA.postProcessing.bloom.luminanceThreshold, themeB.postProcessing.bloom.luminanceThreshold, t),
      },
      vignette: {
        darkness: lerpNumber(themeA.postProcessing.vignette.darkness, themeB.postProcessing.vignette.darkness, t),
        offset: lerpNumber(themeA.postProcessing.vignette.offset, themeB.postProcessing.vignette.offset, t),
      },
    },
    text: {
      color: "#" + lerpColor(themeA.text.color, themeB.text.color, t).getHexString(),
      outlineColor: "#" + lerpColor(themeA.text.outlineColor, themeB.text.outlineColor, t).getHexString(),
      // Emissive color lerping
      ...(themeA.text.emissive && themeB.text.emissive ? {
        emissive: "#" + lerpColor(themeA.text.emissive, themeB.text.emissive, t).getHexString(),
      } : themeA.text.emissive ? { emissive: themeA.text.emissive } : {}),
      // Emissive intensity lerping
      ...(themeA.text.emissiveIntensity !== undefined && themeB.text.emissiveIntensity !== undefined ? {
        emissiveIntensity: lerpNumber(themeA.text.emissiveIntensity || 0, themeB.text.emissiveIntensity || 0, t),
      } : themeA.text.emissiveIntensity !== undefined ? { emissiveIntensity: themeA.text.emissiveIntensity } : {}),
      // GlowLayers array (threshold switch, not interpolated)
      ...(t < 0.5
        ? (themeA.text.glowLayers ? { glowLayers: themeA.text.glowLayers } : {})
        : (themeB.text.glowLayers ? { glowLayers: themeB.text.glowLayers } : {})
      ),
    },
    ui: themeA.ui && themeB.ui ? {
      buttonBg: t < 0.5 ? themeA.ui.buttonBg : themeB.ui.buttonBg,
      buttonText: "#" + lerpColor(themeA.ui.buttonText, themeB.ui.buttonText, t).getHexString(),
    } : themeA.ui || themeB.ui,
  };
};

// Global store for theme state (works across React reconcilers)
const createThemeStore = () => {
  let themeName = "night";
  let currentTheme = THEMES.night;
  let isTransitioning = false;
  let listeners = new Set();
  let transitionState = { from: null, to: null, progress: 0 };
  let animationFrameId = null;

  // Cached snapshot to avoid infinite loops with useSyncExternalStore
  let cachedSnapshot = null;

  // Load from localStorage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEME_ORDER.includes(saved)) {
      themeName = saved;
      currentTheme = THEMES[saved];
    }
  }

  // Initialize cached snapshot
  cachedSnapshot = {
    themeName,
    theme: currentTheme,
    isTransitioning,
  };

  const updateSnapshot = () => {
    cachedSnapshot = {
      themeName,
      theme: currentTheme,
      isTransitioning,
    };
  };

  const notify = () => {
    updateSnapshot();
    listeners.forEach((listener) => listener());
  };

  const animate = () => {
    if (transitionState.progress >= 1) {
      currentTheme = THEMES[transitionState.to];
      isTransitioning = false;
      notify();
      return;
    }

    const eased = 1 - Math.pow(1 - transitionState.progress, 3);
    currentTheme = lerpTheme(
      THEMES[transitionState.from],
      THEMES[transitionState.to],
      eased
    );
    transitionState.progress += 1 / TRANSITION_DURATION;
    notify();
    animationFrameId = requestAnimationFrame(animate);
  };

  return {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => cachedSnapshot,
    cycleTheme: () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      const nextThemeName = getNextTheme(themeName);
      transitionState = { from: themeName, to: nextThemeName, progress: 0 };
      themeName = nextThemeName;
      isTransitioning = true;

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, nextThemeName);
      }

      notify();
      animationFrameId = requestAnimationFrame(animate);
    },
    setTheme: (newThemeName) => {
      if (!THEME_ORDER.includes(newThemeName) || newThemeName === themeName) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      transitionState = { from: themeName, to: newThemeName, progress: 0 };
      themeName = newThemeName;
      isTransitioning = true;

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, newThemeName);
      }

      notify();
      animationFrameId = requestAnimationFrame(animate);
    },
  };
};

// Singleton store
const themeStore = createThemeStore();

// Context for provider pattern (optional, for compatibility)
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const state = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getSnapshot
  );

  const value = useMemo(
    () => ({
      ...state,
      themes: THEMES,
      themeOrder: THEME_ORDER,
      cycleTheme: themeStore.cycleTheme,
      setTheme: themeStore.setTheme,
    }),
    [state]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook that works both inside and outside Canvas
export function useTheme() {
  const state = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getSnapshot
  );

  return useMemo(
    () => ({
      ...state,
      themes: THEMES,
      themeOrder: THEME_ORDER,
      cycleTheme: themeStore.cycleTheme,
      setTheme: themeStore.setTheme,
    }),
    [state]
  );
}
