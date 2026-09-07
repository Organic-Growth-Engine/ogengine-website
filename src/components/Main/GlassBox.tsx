"use client";

import { FC, useEffect, useMemo, useRef } from "react";
import { useTexture, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, MeshPhysicalMaterial } from "three";

export const GlassBox: FC = () => {
  const groupRef = useRef<any>(null);
  const baseRotation = useMemo(() => ({ x: 0, y: 0 }), []);

  const logoTexture = useTexture("/og.png");

  // Drag rotation state
  const isDragging = useRef(false);
  const previousPointerPosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  // References for sub-meshes to apply organic breathing warp
  const logoFrontRef = useRef<any>(null);
  const logoBackRef = useRef<any>(null);
  const boxRef = useRef<any>(null);

  useEffect(() => {
    if (logoTexture) {
      logoTexture.anisotropy = 16;
      logoTexture.needsUpdate = true;
    }
  }, [logoTexture]);

  const boxMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        transmission: 0.85,
        thickness: 3.5, // Thicker glass for deeper refraction sways
        roughness: 0.02, // Ultra glossy for sharp reflections
        metalness: 0.65, // Highly metallic obsidian dark glass
        ior: 2.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.01,
        color: "#0a0a0a", // Deep dark body
        transparent: true,
        depthWrite: true,
      }),
    [],
  );

  const lockScroll = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.touchAction = "none";
    document.body.style.touchAction = "none";
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.documentElement.style.touchAction = "";
    document.body.style.touchAction = "";
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();

    // Instantly freeze viewport scroll when touching the active interactive mesh to prevent browser drag hijacking
    lockScroll();

    isDragging.current = true;
    previousPointerPosition.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousPointerPosition.current.x;
      const deltaY = e.clientY - previousPointerPosition.current.y;

      // Rotate 3D elements based on drag (increased sensitivity factor to 0.065 for faster response)
      targetRotation.current.y += deltaX * 0.065;
      targetRotation.current.x += deltaY * 0.065;
      targetRotation.current.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, targetRotation.current.x),
      );

      previousPointerPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      if (isDragging.current) {
      }
      isDragging.current = false;

      // Always restore default browser scrolling behavior on finger lift
      unlockScroll();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      unlockScroll();
    };
  }, []);

  // Block native mobile page scrolling ONLY when actively dragging the 3D model
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDragging.current) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };
    window.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  useEffect(() => {
    return () => {
      boxMaterial.dispose();
    };
  }, [boxMaterial]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.getElapsedTime();

    // 1. Wave/liquid floating effect
    group.position.y = Math.sin(t * 1.0) * 0.08;

    // 2. Smoothly lerp towards drag rotation targets (No constant auto rotation)
    currentRotation.current.x +=
      (targetRotation.current.x - currentRotation.current.x) * 0.1;
    currentRotation.current.y +=
      (targetRotation.current.y - currentRotation.current.y) * 0.1;

    group.rotation.x = currentRotation.current.x;
    group.rotation.y = currentRotation.current.y;

    // 3. Ultra-subtle continuous liquify breathing (only 2% warp for solid luxury feel)
    const speed = 1.0;
    const amp = 0.02;

    const boxScaleX = 1 + Math.sin(t * speed) * amp;
    const boxScaleY = 1 + Math.cos(t * speed * 1.25) * amp;
    const boxScaleZ = 1.0; // Keep Z scale fixed to prevent swallowing/clipping front planes

    const logoScaleX = 1 + Math.sin(t * speed + 0.8) * (amp * 0.5);
    const logoScaleY = 1 + Math.cos(t * speed * 1.1 + 0.4) * (amp * 0.5);

    const lerpFactor = 0.08;

    if (boxRef.current) {
      boxRef.current.scale.x +=
        (boxScaleX - boxRef.current.scale.x) * lerpFactor;
      boxRef.current.scale.y +=
        (boxScaleY - boxRef.current.scale.y) * lerpFactor;
      boxRef.current.scale.z +=
        (boxScaleZ - boxRef.current.scale.z) * lerpFactor;
    }

    if (logoFrontRef.current) {
      logoFrontRef.current.scale.x +=
        (logoScaleX - logoFrontRef.current.scale.x) * lerpFactor;
      logoFrontRef.current.scale.y +=
        (logoScaleY - logoFrontRef.current.scale.y) * lerpFactor;
    }

    if (logoBackRef.current) {
      logoBackRef.current.scale.x +=
        (logoScaleX - logoBackRef.current.scale.x) * lerpFactor;
      logoBackRef.current.scale.y +=
        (logoScaleY - logoBackRef.current.scale.y) * lerpFactor;
    }
  });

  return (
    <group ref={groupRef} onPointerDown={handlePointerDown}>
      {/* Front Side (Placed at z = 0.305 for a safe rendering margin) */}
      <mesh ref={logoFrontRef} position={[0, 0, 0.305]}>
        <planeGeometry args={[1.4, 1.4]} />
        <meshBasicMaterial
          map={logoTexture}
          blending={AdditiveBlending}
          transparent={true}
          depthWrite={false}
          color={[1.5, 1.5, 1.5]}
          toneMapped={false}
        />
      </mesh>

      {/* Back Side (Placed at z = -0.305 for a safe rendering margin) */}
      <mesh
        ref={logoBackRef}
        position={[0, 0, -0.305]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[1.4, 1.4]} />
        <meshBasicMaterial
          map={logoTexture}
          blending={AdditiveBlending}
          transparent={true}
          depthWrite={false}
          color={[1.5, 1.5, 1.5]}
          toneMapped={false}
        />
      </mesh>

      {/* 3D Black Liquid Glass Box */}
      <RoundedBox
        ref={boxRef}
        args={[1.6, 1.6, 0.6]}
        radius={0.2}
        smoothness={1}
        position={[0, 0, 0]}
      >
        <primitive object={boxMaterial} attach="material" />
      </RoundedBox>
    </group>
  );
};
