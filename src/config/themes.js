// Theme definitions for Night, Day, and Neon modes

export const THEMES = {
  night: {
    name: "Night",
    icon: "moon",
    background: "#0a0a12",
    backgroundGradient: ["#0a0a12", "#12121a"],
    fog: {
      color: "#0a0a12",
      near: 10,
      far: 25,
    },
    particles: {
      primary: "#88ccff",
      secondary: "#ffffff",
      tertiary: "#4a90e2",
    },
    lighting: {
      ambient: { intensity: 0.6, color: "#e8f4ff" },
      keyLight: { intensity: 100, color: "#e8f4ff" },
      fillLight: { intensity: 35, color: "#88ccff" },
      rimLight: { intensity: 45, color: "#4a90e2" },
    },
    glow: {
      color: "#88ccff",
      opacity: 0.15,
    },
    postProcessing: {
      bloom: { intensity: 0.25, luminanceThreshold: 0.95 },
      vignette: { darkness: 0.4, offset: 0.15 },
    },
    text: {
      color: "#ffffff",
      outlineColor: "#000000",
    },
    ui: {
      buttonBg: "rgba(20, 20, 30, 0.8)",
      buttonText: "#ffffff",
    },
  },

  day: {
    name: "Day",
    icon: "sun",
    background: "#f0f4f8",
    backgroundGradient: ["#f0f4f8", "#e0e8f0"],
    fog: {
      color: "#f0f4f8",
      near: 12,
      far: 30,
    },
    particles: {
      primary: "#6b8cae",
      secondary: "#94b4d4",
      tertiary: "#4a6f8a",
    },
    lighting: {
      ambient: { intensity: 1.0, color: "#f8f8ff" },
      keyLight: { intensity: 120, color: "#f8f8ff" },
      fillLight: { intensity: 50, color: "#87ceeb" },
      rimLight: { intensity: 40, color: "#6b8cae" },
    },
    glow: {
      color: "#6b8cae",
      opacity: 0.15,
    },
    postProcessing: {
      bloom: { intensity: 0.15, luminanceThreshold: 0.95 },
      vignette: { darkness: 0.15, offset: 0.2 },
    },
    text: {
      color: "#2a3f54",
      outlineColor: "#ffffff",
    },
    ui: {
      buttonBg: "rgba(42, 63, 84, 0.9)",
      buttonText: "#ffffff",
    },
  },

  neon: {
    name: "Neon",
    icon: "zap",
    background: "#0d0015",
    backgroundGradient: ["#0d0015", "#150020"],
    fog: {
      color: "#0d0015",
      near: 8,
      far: 22,
    },
    particles: {
      primary: "#ff00ff",
      secondary: "#00ffff",
      tertiary: "#ff00aa",
    },
    lighting: {
      ambient: { intensity: 0.3, color: "#ff00ff" },
      keyLight: { intensity: 80, color: "#00ffff" },
      fillLight: { intensity: 50, color: "#ff00ff" },
      rimLight: { intensity: 60, color: "#00ffff" },
    },
    glow: {
      color: "#ff00ff",
      opacity: 0.25,
    },
    postProcessing: {
      bloom: { intensity: 0.8, luminanceThreshold: 0.5 },
      vignette: { darkness: 0.5, offset: 0.1 },
    },
    text: {
      color: "#00ffff",
      outlineColor: "#ff00ff",
      emissive: "#00ffff",
      emissiveIntensity: 3,
      glowLayers: [
        { scale: 1.008, color: "#00ffff", opacity: 0.9 },
        { scale: 1.02, color: "#ff00ff", opacity: 0.7 },
        { scale: 1.04, color: "#00ff88", opacity: 0.5 },
        { scale: 1.06, color: "#ff0088", opacity: 0.4 },
        { scale: 1.08, color: "#ffff00", opacity: 0.3 },
      ],
    },
    ui: {
      buttonBg: "rgba(20, 0, 40, 0.9)",
      buttonText: "#00ffff",
    },
  },
};

export const THEME_ORDER = ["night", "day", "neon"];

export const getNextTheme = (currentTheme) => {
  const currentIndex = THEME_ORDER.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
  return THEME_ORDER[nextIndex];
};
