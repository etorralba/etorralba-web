import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

// Growth Component
export const GrowthLine = ({ segmentCount, radius }) => {
  const path = useRef();
  const MAX_POINTS = segmentCount;

  // Generate a Float32Array to store the information of a limit of points
  const positions = new Float32Array(MAX_POINTS * 3);
  // Set a geometry that takes the array an map
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  
  let drawCount = 2
  geometry.setDrawRange(0, drawCount);
  // // Generating circle points
  // for (let i = 0; i <= segmentCount; i++) {
  //   let theta = (i / segmentCount) * Math.PI * 2;
  //   const currentVector = new THREE.Vector3(
  //     Math.cos(theta) * radius,

  //     Math.sin(theta) * radius,
  //     0
  //   );
  //   points.push(currentVector);
  // }
  // points.splice(-1);
  // const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  useFrame(() => {
    let prevCount = Math.floor( drawCount ); 
    drawCount = (drawCount + 0.01) % MAX_POINTS;
    
    path.current.geometry.setDrawRange(0, drawCount);
    const p = path.current.geometry.attributes.position.array;
    
    if (drawCount !== 0) {
      // periodically, generate new data
      
      let x, y, z, index;
      x = y = z = index = 0;
      
      for (let i = 0, l = MAX_POINTS; i < l; i++) {
        p[index++] = x;
        p[index++] = y;
        p[index++] = z;
        
        x += (Math.random() - 0.5) * 1.5;
        y += (Math.random() - 0.5) * 1.5;
        z += (Math.random() - 0.5) * 1.5;
        
      }
      // path.current.geometry.attributes.position.needsUpdate = true; // required after the first render
      
    }
    console.log()
    if (Math.floor( drawCount )-prevCount === 1){

      path.current.material.color.setHSL(Math.random(), 1, 0.5);
    }
  });

  // Methods
  function getPointInBetweenByLen(pointA, pointB, length) {
    var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);
  }

  return (
    <>
      <group position={[0, 0, 0]}>
        <line geometry={geometry} >
          <lineBasicMaterial
            attach="material"
            color={"white"}
            linewidth={10}
          />
        </line>
        <points geometry={geometry} ref={path}>
          <pointsMaterial size={0.2} />
        </points>
      </group>
    </>
  );
};
