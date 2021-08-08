import React, {useRef}from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const GrowthLine = ({ segmentCount, radius }) => {

  const path = useRef();

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
  }

  for (let i = 1; i < points.length; i++) {
    let currentDistance = points[i-1].distanceTo(points[i]);
    if (currentDistance >= 2) {
      let newPoint = getPointInBetweenByLen(points[i],points[i-1],currentDistance/2)
      points.splice(i,0,newPoint)
    }
  }



  // Methods
  function getPointInBetweenByLen(pointA, pointB, length) {

    var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);

}
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <>
      <group position={[0, 0, 0]}>
        <line geometry={lineGeometry} ref={path}>
          <lineBasicMaterial
            attach="material"
            color={"#9c88ff"}
            linewidth={10}
          />
        </line>
        <points geometry={lineGeometry}>
          <pointsMaterial size={0.2} />
        </points>
      </group>
    </>
  );
};
