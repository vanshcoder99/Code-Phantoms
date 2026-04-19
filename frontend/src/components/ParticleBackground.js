import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Effects } from '@react-three/drei';
import { UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';

extend({ UnrealBloomPass });

const ParticleSwarm = () => {
  const meshRef = useRef();
  const count = 20000;
  const speedMult = 1;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const color = pColor;

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
      scale: 80,
      depth: 15,
      swirl: 1.5,
      speed: 1,
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime() * speedMult;

    for (let i = 0; i < count; i++) {
      const scaleCtrl = PARAMS.scale;
      const depthCtrl = PARAMS.depth;
      const swirlCtrl = PARAMS.swirl;
      const speedCtrl = PARAMS.speed;

      const t = time * speedCtrl;
      const u = i / count;

      const cols = 200.0;
      const xg = (i % cols) / cols;
      const yg = Math.floor(i / cols) / (count / cols);

      const x = (xg - 0.5) * 2.0;
      const y = (yg - 0.5) * 2.0;

      const px = x * 6.0;
      const py = y * 2.5;

      // R
      const r1 = Math.max(Math.abs(px + 5.0) - 0.2, Math.abs(py) - 1.0);
      const r2 = Math.max(Math.abs(px + 4.2) - 0.8, Math.abs(py - 0.5) - 0.3);
      const r3 = Math.max(Math.abs(px + 4.2) - 0.8, Math.abs(py + 0.5) - 0.3);
      const rMask = Math.min(r1, Math.min(r2, r3));

      // O
      const ox = px + 2.5;
      const oy = py;
      const oMask = Math.abs(Math.sqrt(ox * ox + oy * oy) - 0.8) - 0.2;

      // W
      const w1 = Math.max(Math.abs(px) - 0.2, Math.abs(py + Math.sin(px * 2.0) * 0.5) - 1.0);

      // S
      const s1 = Math.abs(Math.sin(px * 1.5) + py * 0.8) - 0.3;

      // H
      const h1 = Math.max(Math.abs(px - 2.5) - 0.2, Math.abs(py) - 1.0);
      const h2 = Math.max(Math.abs(px - 3.5) - 0.2, Math.abs(py) - 1.0);
      const h3 = Math.max(Math.abs(px - 3.0) - 0.8, Math.abs(py) - 0.2);
      const hMask = Math.min(h1, Math.min(h2, h3));

      // I
      const iMask = Math.max(Math.abs(px - 5.0) - 0.2, Math.abs(py) - 1.0);

      const d = Math.min(
        rMask,
        Math.min(oMask, Math.min(w1, Math.min(s1, Math.min(hMask, iMask))))
      );

      const shape = Math.exp(-10.0 * Math.abs(d));

      const angle = swirlCtrl * Math.atan2(y, x) + t * 0.5;
      const cs = Math.cos(angle);
      const sn = Math.sin(angle);
      const dx = x * cs - y * sn;
      const dy = x * sn + y * cs;

      const dz = depthCtrl * shape * Math.sin(t + u * 20.0);

      target.set(dx * scaleCtrl, dy * scaleCtrl, dz);

      const hue = (0.6 + 0.4 * shape + 0.2 * Math.sin(t + u * 10.0)) % 1.0;
      const light = 0.3 + 0.5 * shape;
      color.setHSL(hue, 1.0, light);

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

export default function ParticleBackground() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={['#000000', 0.01]} />
        <ParticleSwarm />
        <OrbitControls autoRotate={true} autoRotateSpeed={0.5} />
        <Effects disableGamma>
          <unrealBloomPass threshold={0} strength={1.8} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  );
}
