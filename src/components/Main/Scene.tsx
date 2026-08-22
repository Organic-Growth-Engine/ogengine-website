import { FC, useRef } from 'react';
import { useThree } from '@react-three/fiber';

import { Environment } from '@react-three/drei';
import { Group, Vector3 } from 'three';

import { useAnimatableVec3 } from '@/hooks/useAnimatableVec3';
import { useDeviceOrientationDelta } from '@/hooks/useDeviceOrientationDelta';
import { useMouseMoveDelta } from '@/hooks/useMouseMoveDelta';
import { useScreenPositionDelta } from '@/hooks/useScreenPositionDelta';

import { GlassBox } from './GlassBox';

const rotation = Math.PI * 0.6;

export const Scene: FC = () => {
  const groupRef = useRef<Group>(null);

  const { iterateTarget: iteratePositionTarget } = useAnimatableVec3(
    ({ x, y }) => {
      const group = groupRef.current;
      if (!group) return;

      group.position.set(x, -y, 0);
    },
    0.02,
    0.1,
  );

  const { iterateTarget: iterateRotationTarget } = useAnimatableVec3(
    ({ x, y, z }) => {
      const group = groupRef.current;
      if (!group) return;

      group.rotation.set(y * rotation, x * rotation, z * rotation);
    },
    0.02,
    0.1,
  );

  const { width } = useThree((state) => state.size);
  const isMobile = width < 768;
  const responsiveScale = isMobile ? 0.95 : 1.2;

  useMouseMoveDelta(({ x, y }) => {
    if (isMobile) return;
    const vec = new Vector3(x, y, 0);

    iteratePositionTarget(vec);
    iterateRotationTarget(vec);
  });

  useScreenPositionDelta(({ x, y }) => {
    if (isMobile) return;
    const strength = 5;
    const vec = new Vector3(-x * strength, -y * strength, 0);

    iteratePositionTarget(vec);
    iterateRotationTarget(vec);
  });

  useDeviceOrientationDelta(({ gamma, beta }) => {
    if (isMobile) return;
    const rotationStrength = 0.05;
    const rotationVector = new Vector3(
      gamma * rotationStrength,
      beta * rotationStrength,
      0,
    );

    const positionStrength = 0.075;
    const positionVector = new Vector3(
      gamma * positionStrength,
      beta * positionStrength,
      0,
    );

    iterateRotationTarget(rotationVector);
    iteratePositionTarget(positionVector);
  });

  return (
    <>
      <Environment preset="night" environmentIntensity={1.6} />

      <group ref={groupRef} scale={responsiveScale}>
        <GlassBox />
      </group>
    </>
  );
};
