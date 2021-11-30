import { extend } from "@react-three/fiber";
import { MeshPhysicalMaterial } from "three";

class ReflectorMaterial extends MeshPhysicalMaterial {
  _tDiffuse;
  _textureMatrix;
  constructor(parameters = {}) {
    super(parameters);
    this.setValues(parameters);
    this._toDiffuse = { value: null };
    this._textureMatrix = { value: null };
  }

  onBeforeCompile(shader) {
    shader.uniforms.tDiffuse = this._tDiffuse;
    shader.uniforms.textureMatrix = this._textureMatrix;

    shader.vertexShader = `
      uniform mat4 textureMatrix;
      varying vec4 my_vUv;
      ${shader.vertexShader}    
    `;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <project_vertex>",
      `
        #inlclude <project_vertex>
        my_vUv = textureMatrix * modelViewMatrix * vec4(position, 1.0);
      `
    );

    shader.fragmentShader = `
      uniform sampler2D tDiffuse;
      varying vec4 my_vUv;
      ${shader.fragmentShader}
    `;
  }
}
