import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const QuantumPulseSwarm = () => {
  const meshRef = useRef();
  const count = 20000;
  const speedMult = 1;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        )
      );
    }
    return pos;
  }, []);

  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), []);

  const PARAMS = useMemo(
    () => ({
      radius: 50,
      morph: 1.2,
      speed: 1,
      thickness: 5,
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime() * speedMult;

    for (let i = 0; i < count; i++) {
      const radius = PARAMS.radius;
      const morph = PARAMS.morph;
      const speed = PARAMS.speed;
      const thickness = PARAMS.thickness;

      const t = time * speed;
      const ratio = i / count;
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const wave = Math.sin(t + ratio * 20.0) * morph;
      const x = (radius + wave * thickness) * Math.cos(theta) * Math.sin(phi);
      const y = (radius + wave * thickness) * Math.sin(theta) * Math.sin(phi);
      const z = (radius + wave * thickness) * Math.cos(phi);

      const rotX = x * Math.cos(t * 0.2) - z * Math.sin(t * 0.2);
      const rotZ = x * Math.sin(t * 0.2) + z * Math.cos(t * 0.2);

      target.set(rotX, y, rotZ);

      const hue = (ratio + t * 0.1) % 1.0;
      const saturation = 0.6 + Math.sin(t + ratio * 10.0) * 0.4;
      pColor.setHSL(hue, saturation, 0.5);

      positions[i].lerp(target, 0.1);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
};

export default function QuantumPulseBackground() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={['#000000', 0.01]} />
        <QuantumPulseSwarm />
      </Canvas>
    </div>
  );
}
