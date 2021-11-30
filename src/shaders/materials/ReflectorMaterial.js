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
  }
}
