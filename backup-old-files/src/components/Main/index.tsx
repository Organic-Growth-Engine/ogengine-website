'use client';

import { FC, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

import { DeviceOrientationButton } from '../DeviceOrientationButton';
import { Scene } from './Scene';
import styles from './styles.module.css';

// Empty fallback — the GSAP entrance animation handles the canvas fade-in
const CanvasLoader: FC = () => {
  return null;
};

export const Main: FC = () => {
  return (
    <div className={styles.scene}>
      <DeviceOrientationButton />

      <Canvas
        dpr={[0.8, 3]}
        camera={{ fov: 60 }}
        style={{ touchAction: 'pan-y' }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};
