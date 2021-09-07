import React, { useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import * as dat from "dat.gui";

// Growth Component
export const GrowthLine = () => {
  const [sDots, setsDots] = useState();
  const [sLines, setsLines] = useState();

  //Geometry
  const particle = useRef();
  const lineMesh = useRef();

  const particlesData = [];
  const maxParticleCount = 1000;
  let particleCount = 50;
  const r = 200;
  const rHalf = r / 2;
  let particles;
  let positions, colors;
  let particlePositions;
  let frameCap = 2;

  const effectController = {
    showDots: true,
    showLines: true,
    minDistance: 60,
    limitConnections: false,
    maxConnections: 20,
    particleCount: 50,
  };



  function initGUI() {
    const gui = new dat.GUI();

    gui.add(effectController, "showDots").onChange(function (value) {
      setsDots(value);
    });
    gui.add(effectController, "showLines").onChange(function (value) {
      setsLines(value);
    });
    gui.add(effectController, "minDistance", 1, 300);
    gui.add(effectController, "limitConnections");
    gui.add(effectController, "maxConnections", 0, 30, 1);
    gui
      .add(effectController, "particleCount", 0, maxParticleCount, 1)
      .onChange(function (value) {
        particleCount = parseInt(value);
        particles.setDrawRange(0, particleCount);
      });
  }

  useEffect(() => {
    initGUI();
  }, []);

  useThree;

  // Max posible conection
  const segments = maxParticleCount * maxParticleCount;
  // Creates a Float32Array of max posible conexions size
  positions = new Float32Array(segments * 3);
  colors = new Float32Array(segments * 3);

  // Creates a Float32Array of maxParticleCount * 3
  particles = new THREE.BufferGeometry();
  particlePositions = new Float32Array(maxParticleCount * 3);

  // Sets particle random position and velicity
  for (let i = 0; i < maxParticleCount; i++) {
    const x = Math.random() * r - r / 2;
    const y = Math.random() * r - r / 2;
    const z = Math.random() * r - r / 2;

    // Gets Float32Arrtay x y z position base on iterator
    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    // Sets an object with aditional information
    particlesData.push({
      velocity: new THREE.Vector3(
        -1 + Math.random() * 2,
        -1 + Math.random() * 2,
        -1 + Math.random() * 2
      ),
      numConnections: 0,
    });
  }

  // Set initial Draw Range
  particles.setDrawRange(0, particleCount);
  particles.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3).setUsage(
      THREE.DynamicDrawUsage
    )
  );

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
  );

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage)
  );
  geometry.computeBoundingSphere();
  geometry.setDrawRange(0, 0);

  useFrame(() => {
    let prevFrameCap = Math.floor(frameCap);
    frameCap = frameCap + 0.5;

    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    if (Math.floor(frameCap) - prevFrameCap === 1) {
      // All conections resets to 0
      for (let i = 0; i < particleCount; i++) {
        particlesData[i].numConnections = 0;
      }

      for (let i = 0; i < particleCount; i++) {
        const particleData = particlesData[i];
        particlePositions[i * 3] += particleData.velocity.x;
        particlePositions[i * 3 + 1] += particleData.velocity.y;
        particlePositions[i * 3 + 2] += particleData.velocity.z;

        if (
          particlePositions[i * 3 + 1] < -rHalf ||
          particlePositions[i * 3 + 1] > rHalf
        )
          particleData.velocity.y = -particleData.velocity.y;

        if (
          particlePositions[i * 3] < -rHalf ||
          particlePositions[i * 3] > rHalf
        )
          particleData.velocity.x = -particleData.velocity.x;

        if (
          particlePositions[i * 3 + 2] < -rHalf ||
          particlePositions[i * 3 + 2] > rHalf
        )
          particleData.velocity.z = -particleData.velocity.z;

        if (
          effectController.limitConnections &&
          particleData.numConnections >= effectController.maxConnections
        )
          continue;

        // Check collision
        for (let j = i + 1; j < particleCount; j++) {
          const particleDataB = particlesData[j];
          if (
            effectController.limitConnections &&
            particleDataB.numConnections >= effectController.maxConnections
          )
            continue;

          const dx = particlePositions[i * 3] - particlePositions[j * 3];
          const dy =
            particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
          const dz =
            particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < effectController.minDistance) {
            particleData.numConnections++;
            particleDataB.numConnections++;

            const alpha = 1.0 - dist / effectController.minDistance;

            positions[vertexpos++] = particlePositions[i * 3];
            positions[vertexpos++] = particlePositions[i * 3 + 1];
            positions[vertexpos++] = particlePositions[i * 3 + 2];

            positions[vertexpos++] = particlePositions[j * 3];
            positions[vertexpos++] = particlePositions[j * 3 + 1];
            positions[vertexpos++] = particlePositions[j * 3 + 2];

            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;

            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;

            numConnected++;
          }
        }

        lineMesh.current.geometry.setDrawRange(0, numConnected * 2);
      }
      lineMesh.current.geometry.attributes.position.needsUpdate = true;
      lineMesh.current.geometry.attributes.color.needsUpdate = true;
      particle.current.geometry.attributes.position.needsUpdate = true;
      particle.current.visible = sDots;
      lineMesh.current.visible = sLines;
    }
  });
  return (
    <>
      <group position={[0, 0, 0]}>
        <points geometry={particles} ref={particle}>
          <pointsMaterial color={0xeeeeee} size={3} sizeAttenuation />
        </points>
        <lineSegments geometry={geometry} ref={lineMesh}>
          <lineBasicMaterial
            attach="material"
            color={0x32e0c4}
            vertexColors
            transparent
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      </group>
    </>
  );
};
