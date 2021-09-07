// Libraries
import React from "react";
import { Canvas } from "@react-three/fiber";

// Styles
import styles from "./App.module.css";

// Components
import { GrowthLine } from "../Three/GrowthLine";
import { Controls } from "../Three/Controls";

export const App = () => {
  return (
    <div className={styles.canvas}>
      <Canvas>
        <GrowthLine />
        <Controls />
      </Canvas>
    </div>
  );
};
