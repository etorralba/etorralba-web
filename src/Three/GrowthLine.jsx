import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const GrowthLine = ({ segmentCount, radius }) => {
  const points = [];

  // Generating circle points
  for (let i = 0; i <= segmentCount; i++) {
    let theta = (i / segmentCount) * Math.PI * 2;
    const currentVector = new THREE.Vector3(
      Math.cos(theta) * radius,
      Math.sin(theta) * radius,
      0
    );
    points.push(currentVector);
    if (i != 0) {
      console.log(currentVector.distanceTo(points[i - 1]));
    }
  }

  useFrame(() => {});

  function insertList(array, index, element) {
    console.log(`Original ${array}`);
    array.splice(index, 0, element);
    console.log(`New ${array}`);
  }

  const newVector = new THREE.Vector3(0, 0, 0);

  insertList(points, 5, newVector);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <>
      <group position={[0, 0, 0]}>
        <lineLoop geometry={lineGeometry}>
          <lineBasicMaterial
            attach="material"
            color={"#9c88ff"}
            linewidth={10}
          />
        </lineLoop>
        <points geometry={lineGeometry}>
          <pointsMaterial size={0.1} />
        </points>
      </group>
    </>
  );
};
