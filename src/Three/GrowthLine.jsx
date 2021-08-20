import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

// Growth Component
export const GrowthLine = ({ segmentCount, radius }) => {
  const path = useRef();
  const pointGroup = useRef();

  let points = [];
  let drawCount = 2;

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
  points.splice(-1);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  //Point Selection Visualization
  const positions = new Float32Array(3 * 3);
  const selectedPoints = new THREE.BufferGeometry();
  selectedPoints.setAttribute("position", new THREE.BufferAttribute(positions,3));

  //useFrame
  useFrame(() => {
    let prevCount = Math.floor(drawCount);
    drawCount = drawCount + 0.005;
    let pointList = path.current.geometry.attributes.position.array;

    if (Math.floor(drawCount) - prevCount === 1) {
      for (let i = 0; i < pointList.length; i + 3) {
        let x = pointList[i++];
        let y = pointList[i++];
        let z = pointList[i++];

        if (i != 0) {
          let currentPoint = new THREE.Vector3(x, y, z);
          let prevPoint = getPrevPoint(i, pointList);
          let nextPoint = getNextPoint(i, pointList);

          // console.log(pointList);
          console.log(i);
          console.log(currentPoint);
          pointGroup.current.geometry.attributes.position.array[0] = currentPoint.x;
          pointGroup.current.geometry.attributes.position.array[1] = currentPoint.x;
          pointGroup.current.geometry.attributes.position.array[2] = currentPoint.x;

          // pointGroup.current.geometry.attributes.position.array[3] = prevPoint.x;
          // pointGroup.current.geometry.attributes.position.array[4] = prevPoint.y;
          // pointGroup.current.geometry.attributes.position.array[5] = prevPoint.z;

          // pointGroup.current.geometry.attributes.position.array[6] = nextPoint.x;
          // pointGroup.current.geometry.attributes.position.array[7] = nextPoint.y;
          // pointGroup.current.geometry.attributes.position.array[8] = nextPoint.z;
        }
      }
      console.log("actualizado");
    }
  });

  // Methods
  function getPointInBetweenByLen(pointA, pointB, length) {
    let dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);
  }

  function getDirection(v1, v2) {
    let dir = new THREE.Vector3();
    return dir.subVectors(v2, v1).normalize();
  }

  function getPrevPoint(index, pointList) {
    let x = pointList[index - 3];
    let y = pointList[index - 2];
    let z = pointList[index - 1];

    let prevPoint = new THREE.Vector3(x, y, z);
    return prevPoint;
  }

  function getNextPoint(index, pointList) {
    let x = pointList[index + 1];
    let y = pointList[index + 2];
    let z = pointList[index + 3];

    let nextPoint = new THREE.Vector3(x, y, z);
    return nextPoint;
  }

  return (
    <>
      <group position={[0, 0, 0]}>
        <line geometry={lineGeometry}>
          <lineBasicMaterial attach="material" color={"white"} linewidth={10} />
        </line>
        <points geometry={lineGeometry} ref={path}>
          <pointsMaterial size={0.1} />
        </points>
        <points geometry={selectedPoints} ref={pointGroup}>
          <pointsMaterial size={1} color={"blue"} />
        </points>
      </group>
    </>
  );
};

// const MAX_POINTS = segmentCount;

// // Generate a Float32Array to store the information of a limit of points
// const positions = new Float32Array(MAX_POINTS * 3);
// // Set a geometry that takes the array an map
// const geometry = new THREE.BufferGeometry();
// geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// let drawCount = 2;
// geometry.setDrawRange(0, drawCount);

// useFrame(() => {
//   let prevCount = Math.floor(drawCount);
//   drawCount = (drawCount + 0.01) % MAX_POINTS;

//   path.current.geometry.setDrawRange(0, drawCount);
//   const p = path.current.geometry.attributes.position.array;

//     // updatePoints(p);
//     // getMoveVector(p);

//   if (Math.floor(drawCount) - prevCount === 1) {
//     path.current.material.color.setHSL(Math.random(), 1, 0.5);
//   }
// });

// function updatePoints(p) {
//   let x, y, z, index;
//   x = y = z = index = 0;

//   for (let i = 0, l = MAX_POINTS; i < l; i++) {
//     p[index++] = x;
//     p[index++] = y;
//     p[index++] = z;

//     x += (Math.random() - 0.5) * 1.5;
//     y += (Math.random() - 0.5) * 1.5;
//     z += (Math.random() - 0.5) * 1.5;

//   }
// }

// function getMoveVector(positions){
//   var dir = new THREE.Vector3(); // create once an reuse it
//   let x, y, z, index;
//   x = y = z = index = 0;
//   for (let i = 0, l = MAX_POINTS; i < l; i++) {
//     positions[index++] = x;
//     positions[index++] = y;
//     positions[index++] = z;

//     console.log(index)
//   }
// }
