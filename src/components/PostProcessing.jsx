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
  const { theme } = useTheme();
  const { bloom, vignette } = theme.postProcessing;

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom
        luminanceThreshold={bloom.luminanceThreshold}
        intensity={bloom.intensity}
        levels={defaultBloom.levels}
        mipmapBlur={defaultBloom.mipmapBlur}
      />
      <Vignette
        eskil={false}
        offset={vignette.offset}
        darkness={vignette.darkness}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
});

export default PostProcessing;
