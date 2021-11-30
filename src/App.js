import "./styles.css";
import React, { Suspense } from "react";
import { Canvas } from "@react-three";
import { Circle, OrbitCountrols, Environment } from "@react-three/drei";
import usePostprocessing from "./shaders/usePostprocessing";
import useReflector from "./shaders/useReflector";
import Sphere from "./Sphere";
import "./shaders/materials/ReflectorMaterial";

function Modal(props) {
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
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
