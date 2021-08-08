// Libraries
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import DatGui, { DatNumber } from "react-dat-gui";

// Styles
import styles from "./App.module.css";

// Components
import { GrowthLine } from "../Three/GrowthLine";
import { Controls } from "../Three/Controls";

export const App = () => {
  const [state, setState] = useState({
    data: {
      segmentCount: 4,
      radius: 3,
    },
  });

  function handleUpdate(newData) {
    setState((prevState) => ({
      data: { ...prevState.data, ...newData },
    }));
  }
  return (
    <div className={styles.canvas}>
      <DatGui data={state.data} onUpdate={handleUpdate}>
        <DatNumber path="segmentCount" label="Segment Count" />
        <DatNumber path="radius" label="Radius" />
      </DatGui>
      <Canvas>
        <GrowthLine segmentCount={state.data.segmentCount} radius={state.data.radius} />
        <Controls />
      </Canvas>
    </div>
  );
};
