import "./styles.css";
import React, { Suspense } from "react";
import { Canvas } from "@react-three";
import { Circle, OrbitControls, Environment } from "@react-three/drei";
import usePostprocessing from "./shaders/usePostprocessing";
import useReflector from "./shaders/useReflector";
import Sphere from "./Sphere";
import "./shaders/materials/ReflectorMaterial";

function Model(props) {
  const [meshRef, reflectorProps, passes] = useReflector();
  usePostprocessing(passes);
  return (
    <group {...props}>
      <Sphere />
      <Circle
        receiveShadow
        ref={meshRef}
        args={[12.75, 36, 36]}
        rotation-x={-Math.PI / 2}
        position={[1, 0, 0]}
      >
        <reflectorMaterial
          transparent
          opacity={0.7}
          color="black"
          metalness={1}
          roughness={1}
          {...reflectorProps}
        />
      </Circle>
    </group>
  );
}

export default function App() {
  return (
    <Canvas
      gl={{ alpha: false }}
      shadwows
      camera={{ position: [0, 0, 20], fov: 15, near: 1, far: 50 }}
    >
      <color attach="background" args={["#151515"]} />
      <fog attach="fog" args={["#151515", 20, 30]} />
      <ambientLight intensity={0.4} />
      <spotLight
        intensity={10}
        penumbra={1}
        angle={0.2}
        position={[10, 10, 10]}
        castShadow
      />
      <Suspense fallback={null}>
        <Model position={[0, -1, 0]} rotation={[-0.4, 0, 0]} />
        <Environment files="adams_place_bridge_1k.hdr" />
      </Suspense>
      <OrbitControls
        autoRotate
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}
