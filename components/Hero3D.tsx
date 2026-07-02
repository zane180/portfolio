"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleUniverse() {
  const pointsRef = useRef<THREE.Points>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const wire2Ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const n = 1800;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      // Fibonacci sphere shell with radial jitter
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.4 + (Math.random() - 0.5) * 1.4;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;

    if (groupRef.current) {
      // Mouse parallax
      groupRef.current.rotation.y += (pointer.x * 0.35 - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x += (-pointer.y * 0.25 - groupRef.current.rotation.x) * 0.04;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.06;
      // Hue drifts continuously — a truly dynamic color scheme
      (pointsRef.current.material as THREE.PointsMaterial).color.setHSL(
        (t * 0.025) % 1, 0.85, 0.65
      );
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.05;
      wireRef.current.rotation.z = t * 0.03;
      const s = 1 + Math.sin(t * 0.6) * 0.06;
      wireRef.current.scale.setScalar(s);
      (wireRef.current.material as THREE.MeshBasicMaterial).color.setHSL(
        (t * 0.025 + 0.33) % 1, 0.9, 0.6
      );
    }
    if (wire2Ref.current) {
      wire2Ref.current.rotation.x = t * 0.04;
      wire2Ref.current.rotation.y = t * 0.07;
      (wire2Ref.current.material as THREE.MeshBasicMaterial).color.setHSL(
        (t * 0.025 + 0.66) % 1, 0.9, 0.55
      );
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.032} transparent opacity={0.85} depthWrite={false} sizeAttenuation />
      </points>

      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial wireframe transparent opacity={0.22} />
      </mesh>

      <mesh ref={wire2Ref}>
        <torusKnotGeometry args={[0.7, 0.08, 90, 8, 2, 3]} />
        <meshBasicMaterial wireframe transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ position: "absolute", inset: 0 }}
    >
      <ParticleUniverse />
    </Canvas>
  );
}
