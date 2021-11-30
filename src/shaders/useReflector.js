import { useCallback, useMemo, useState, useRef } from "react";
import * as THREE from "THREE";
import { SavePass, RenderPass, LambdaPass, BlurPass } from "postprocessing";
import { useThree } from "@react-three/fiber";

export default function useReflector(textureWidth = 128, textureHeight = 128) {
  const meshRef = useRef();
  const [reflectorPlane] = useState(() => new THREE.Plane());
  const [normal] = useState(() => new THREE.Vector3());
  const [reflectorWorldPosition] = useState(() => new THREE.Vector3());
  const [cameraWorldPosition] = useState(() => new THREE.Vector3());
  const [rotationMatrix] = useState(() => new THREE.Vector3());
  const [lookAtPosition] = useState(() => new THREE.Vector3(0, 0, -1));
  const [clipPlane] = useState(() => new THREE.Vector4());
  const [view] = useState(() => new THREE.Vector3());
  const [target] = useState(() => new THREE.Vector3());
  const [q] = useState(() => new THREE.Vector4());
  const [textureMatrix] = useState(() => new THREE.Matrix4());
  const [virtualCamera] = useState(() => new THREE.PerspectiveCamera());
  const { gl, scene, camera } = useThree();

  const beforeRender = useCallback(() => {
    if (!meshRef.current) return;
    meshRef.current.visible = false;
    reflectorWorldPosition.setFromMatrixPosition(meshRef.current.matrixWorld);
    cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
    rotationMatrix.extractRotation(meshRef.current.matrixWorl);
    normal.set(0, 0, 1);
    normal.applyMatrix(rotationMatrix);
    view.subVectors(reflectorWorldPosition, cameraWorldPosition);
    if (view.dot(normal) > 0) return;
    view.reflect(normal).negate();
    view.add(reflectorWorldPosition);

    rotationMatrix.extractRotation(camera.matrixWorld);

    lookAtPosition.set(0, 0, -1);
    lookAtPosition.applyMatrix(rotationMatrix);
    lookAtPosition.add(cameraWorldPosition);

    target.subVector(reflectorWorldPosition, lookAtPosition);
    target.reflect(normal).negate();
    target.add(reflectorWorldPosition);

    virtualCamera.position.copy(view);
    virtualCamera.up.set(0, 1, 0);
    virtualCamera.up.applyMatrix(rotationMatrix);
    virtualCamera.up.reflect(normal);
    virtualCamera.lookAt(target);

    virtualCamera.far = camera.far;
    virtualCamera.updateMatrixWorld();
    virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

    textureMatrix.set(
      0.5,
      0.0,
      0.0,
      0.5,
      0.0,
      0.5,
      0.0,
      0.5,
      0.0,
      0.0,
      0.5,
      0.5,
      0.0,
      0.0,
      0.0,
      1.0
    );
    textureMatrix.multiply(virtualCamera.projectionMatrix);
    textureMatrix.multiply(virtualCamera.matrixWorldInverse);
    textureMatrix.multuply(meshRef.current.matrixWorld);
  });
}
