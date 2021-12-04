import { extend } from '@react-three/fiber'
import { MeshPhysicalMaterial } from 'three'

class ReflectorMaterial extends MeshPhysicalMaterial {
  _tDiffuse
  _textureMatrix
  constructor(parameters = {}) {
    super(parameters)
    this.setValues(parameters)
    this._tDiffuse = { value: null }
    this._textureMatrix = { value: null }
  }

  onBeforeCompile(shader) {
    shader.uniforms.tDiffuse = this._tDiffuse
    shader.uniforms.textureMatrix = this._textureMatrix

    shader.vertexShader = `
        uniform mat4 textureMatrix;
        varying vec4 my_vUv;     
      ${shader.vertexShader}
    `
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      `
        #include <project_vertex>
        my_vUv = textureMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        `
    )

    shader.fragmentShader = `
        uniform sampler2D tDiffuse;
        varying vec4 my_vUv;
        ${shader.fragmentShader}
    `
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `
        #include <map_fragment>
        vec3 coord = vec3(my_vUv.x, my_vUv.y, my_vUv.z);
        vec4 base = texture2DProj( tDiffuse, coord );
        vec4 tColor = sRGBToLinear( base );
        diffuseColor.rgb += 1.0 * tColor.rgb;
      `
    )
  }
  get tDiffuse() {
    return this._tDiffuse.value
  }
  set tDiffuse(v) {
    this._tDiffuse.value = v
  }
  get textureMatrix() {
    return this._textureMatrix.value
  }
  set textureMatrix(v) {
    this._textureMatrix.value = v
  }
}

extend({ ReflectorMaterial })
