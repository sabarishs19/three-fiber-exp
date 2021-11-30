import { useCallback, useMemo, useState, useRef } from "react";
import * as THREE from "THREE";
import { SavePass, RenderPass, LambdaPass, BlurPass } from "postprocessing";
import { useThree } from "@react-three/fiber";

export default function useReflector(textureWidth = 128, textureHeight = 128) {
  const meshRef = useRef();
  const [reflectorPlane] = useState(() => new THREE.Plane());
  const [normal] = useState(() => new THREE.Vector3());
  const [reflectorWorlPosition] = useState(() => new THREE.Vector3());
  const [cameraWorldPosition] = useState(() => new THREE.Vector3());
  const [rotationMatrix] = useState(() => new THREE.Vector3());
  const [lookAtPosition] = useState(() => new THREE.Vector3(0, 0, -1));
  const [clipPlane] = useState(() => new THREE.Vector4());
  const [view] = useState(() => new THREE.Vector3());
  const [target] = useState(() => new THREE.Vector3());
  const [q] = useState(() => new THREE.Vector4());
  const [textureMatrix] = useState(() => new THREE.Matrix4());
  const [virtuaCamera] = useState(() => new THREE.PerspectiveCamera());
  const { gl, scene, camera } = useThree();

  const beforeRender = useCallback(() => {
    if (!meshRef.current) return;
    meshRef.current.visible = false;
  });
}
