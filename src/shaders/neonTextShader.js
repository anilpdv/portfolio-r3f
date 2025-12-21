import * as THREE from "three";

export const neonTextShader = {
  uniforms: {
    time: { value: 0 },
    primaryColor: { value: new THREE.Color("#00ffff") },
    secondaryColor: { value: new THREE.Color("#ff00ff") },
    glowIntensity: { value: 2.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 primaryColor;
    uniform vec3 secondaryColor;
    uniform float glowIntensity;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = 1.0 - dot(vNormal, viewDir);
      fresnel = pow(fresnel, 1.5);
      
      float pulse = sin(time * 3.0) * 0.5 + 0.5;
      float colorMix = sin(time * 1.5 + vUv.x * 3.0) * 0.5 + 0.5;
      
      vec3 baseColor = mix(primaryColor, secondaryColor, colorMix);
      vec3 glowColor = mix(secondaryColor, primaryColor, 1.0 - colorMix);
      
      vec3 finalColor = baseColor * (1.0 + pulse * 0.3);
      finalColor += glowColor * fresnel * glowIntensity;
      
      float brightness = 0.8 + pulse * 0.2;
      finalColor *= brightness;
      
      float alpha = 1.0;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

export function createNeonTextMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: neonTextShader.uniforms,
    vertexShader: neonTextShader.vertexShader,
    fragmentShader: neonTextShader.fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}