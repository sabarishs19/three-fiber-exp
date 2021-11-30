import { useCallback, useMemo, useState, useRef } from "react";
import * as THREE from "THREE";
import { SavePass, RenderPass, LambdaPass, BlurPass } from "postprocessing";

import { useThree } from "@react-three/fiber";

export default function useReflector(textureWidth = 128, textureHeight = 128) {
  const meshRef = useRef();
}
