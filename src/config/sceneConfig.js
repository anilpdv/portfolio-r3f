export const CAMERA_CONFIG = {
  fov: 45,
  near: 0.1,
  far: 2000,
  initialPosition: [-2.5, 1.8, 4.5],
  animationStartPosition: [-4, 2.8, 6.5],
  animationDuration: 2.5,
};

export const LIGHTING_CONFIG = {
  ambient: {
    intensity: 0.6,
    color: "#e8f4ff",
  },
  keyLight: {
    position: [5, 6, 5],
    intensity: 100,
    angle: 0.5,
    penumbra: 0.7,
    color: "#e8f4ff",
    shadowMapSize: [1024, 1024],
  },
  fillLight: {
    position: [-4, 3, 3],
    intensity: 35,
    color: "#88ccff",
    distance: 12,
  },
  rimLight: {
    position: [0, 4, -4],
    intensity: 45,
    color: "#4a90e2",
    distance: 10,
  },
  backLight: {
    position: [-2, 2, -5],
    intensity: 45,
    angle: 0.6,
    penumbra: 0.8,
    color: "#b0c4de",
  },
};

export const PARTICLE_CONFIG = {
  count: 200,
  baseSize: 0.02,
  opacity: 0.8,
  colors: {
    primary: "#88ccff",
    secondary: "#ffffff",
    tertiary: "#4a90e2",
  },
  animation: {
    rotationSpeed: 0.05,
    pulseSpeed: 0.5,
    pulseAmount: 0.15,
  },
  distribution: {
    minRadius: 3.5,
    maxRadius: 6.5,
    avoidanceZone: {
      x: [-2, 2],
      y: [-2.5, 1.5],
      z: [-2, Infinity],
    },
  },
};

export const POST_PROCESSING_CONFIG = {
  bloom: {
    luminanceThreshold: 1.0,
    intensity: 0.15,
    levels: 8,
    mipmapBlur: true,
  },
  depthOfField: {
    focusDistance: 0,
    focalLength: 0,
    bokehScale: 0,
    height: 480,
  },
  vignette: {
    eskil: false,
    offset: 0.1,
    darkness: 0.3,
  },
};

export const LAPTOP_CONFIG = {
  scale: 13,
  positionY: -1.2,
  positionX: 0,
  modelPath: "/macbook_pro_14-inch_m5/scene.gltf",
  material: {
    metalnessMultiplier: 1.0,
    roughnessMultiplier: 0.9,
    minRoughness: 0.4,
    envMapIntensity: 0.8,
  },
};

export const SCREEN_CONFIG = {
  position: [0, 0.52, -1.38],
  rotation: -0.256,
  distanceFactor: 1.17,
  url: "https://anilpdv.github.io/portfolio/",
  dimensions: [2.5, 1.65],
  glowColor: "#4a90e2",
  glowOpacity: 0.1,
  animation: {
    floatSpeed: 0.3,
    floatAmount: 0.005,
  },
};

export const TEXT_CONFIG = {
  content: "ANIL PALLI",
  position: [2.5, 0.75, 0.75],
  rotation: -1.25,
  fontSize: 1.0,
  font: "/bangers-v20-latin-regular.woff",
  color: "#ffffff",
  outlineWidth: 0.02,
  outlineColor: "#000000",
  animation: {
    floatSpeed: 0.5,
    floatAmount: 0.02,
  },
};

export const SCENE_CONFIG = {
  background: "#0a0a12",
  fog: {
    color: "#0a0a12",
    near: 10,
    far: 25,
  },
  environment: {
    preset: "city",
    intensity: 0.8,
    backgroundBlurriness: 0.5,
  },
};

export const CONTROLS_CONFIG = {
  global: true,
  rotation: [0.25, 0.2, 0],
  polar: [-0.4, 0.2],
  azimuth: [-1, 0.75],
  config: { mass: 2, tension: 400 },
  snap: false,
};

export const PERFORMANCE_CONFIG = {
  dpr: [1, 2],
  antialias: true,
  powerPreference: "high-performance",
  stencil: false,
  targetFPS: 60,
};
