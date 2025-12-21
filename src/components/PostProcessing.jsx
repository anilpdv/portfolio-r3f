import { memo } from "react";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { POST_PROCESSING_CONFIG } from "../config/sceneConfig";
import { useTheme } from "../context/ThemeContext";

const PostProcessing = memo(function PostProcessing() {
  const { bloom: defaultBloom } = POST_PROCESSING_CONFIG;
  const { theme, themeName } = useTheme();
  const { bloom, vignette } = theme.postProcessing;
  
  const isNeonTheme = themeName === "neon";

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom
        luminanceThreshold={bloom.luminanceThreshold}
        intensity={bloom.intensity}
        levels={isNeonTheme ? 8 : defaultBloom.levels}
        mipmapBlur={defaultBloom.mipmapBlur}
        radius={isNeonTheme ? 0.9 : 0.85}
      />
      <Vignette
        eskil={false}
        offset={vignette.offset}
        darkness={vignette.darkness}
      />
      <ToneMapping mode={isNeonTheme ? ToneMappingMode.LINEAR : ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
});

export default PostProcessing;
