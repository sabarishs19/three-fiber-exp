import * as THREE from "three";
import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "post-processing";

export default function usePostProcessing(extra = []) {
  const { gl } = useThree();
  const [composer] = useMemo(() => {
    const parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      encoding: gl.outputEncoding
    };
    const renderTarget = new THREE.WebGLRenderTarget(800, 800, parameters);
    const composer = new EffectComposer(null);
    composer.autoRendererToScreen = false;
    composer.renderer = gl;
    composer.inputBuffer = renderTarget;
    composer.outputBuffer = renderTarget.clone();

    extra.forEach((pass) => {
      composer.addPass(pass);
      pass.setSize(128, 128);
    });
    return [composer];
  }, []);

  useFrame((state, delta) => {
    composer.render(delta);
    gl.setRenderTarget(null);
  });

  return null;
}
