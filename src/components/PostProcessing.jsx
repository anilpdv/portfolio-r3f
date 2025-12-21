import { memo } from "react";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { POST_PROCESSING_CONFIG } from "../config/sceneConfig";

const PostProcessing = memo(function PostProcessing() {
  const { bloom, vignette } = POST_PROCESSING_CONFIG;

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom
        luminanceThreshold={bloom.luminanceThreshold}
        intensity={bloom.intensity}
        levels={bloom.levels}
        mipmapBlur={bloom.mipmapBlur}
      />
      <Vignette
        eskil={vignette.eskil}
        offset={vignette.offset}
        darkness={vignette.darkness}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
});

export default PostProcessing;
