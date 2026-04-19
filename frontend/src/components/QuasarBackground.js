import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const QuasarParticles = () => {
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
      diskR: 55,
      jetL: 90,
      spin: 0.7,
      jetSpd: 1.5,
      thick: 3,
      corona: 0.25,
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime() * speedMult;

    for (let i = 0; i < count; i++) {
      const diskR = PARAMS.diskR;
      const jetL = PARAMS.jetL;
      const spin = PARAMS.spin;
      const jetSpd = PARAMS.jetSpd;
      const thick = PARAMS.thick;
      const corona = PARAMS.corona;

      // Partition particles into zones
      const diskCut = Math.floor(count * 0.7);
      const jetCut = Math.floor(count * 0.9);

      const norm = i / count;
      const phi = norm * 6.283185307 * 137.508;
      const seed = (i * 0.6180339887) % 1.0;

      let fx, fy, fz, fHue, fSat, fLit;

      // ZONE A — ACCRETION DISK
      if (i < diskCut) {
        const diskMask = 1.0;
        const rNorm = Math.pow(seed, 0.55);
        const radius = 1.5 + rNorm * diskR;
        const omega = spin * Math.pow(diskR / (radius + 0.001), 1.5);
        const theta = phi + omega * time;

        const armWave = Math.sin(theta * 2.0 + rNorm * 12.0 - time * 0.3) * 0.04;
        const rWarp = radius * (1.0 + armWave);

        const halfH = thick * (0.15 + rNorm * 0.85);
        const diskY = (seed * 2.0 - 1.0) * halfH * Math.sin(norm * 3.14159);
        const diskX = Math.cos(theta) * rWarp;
        const diskZ = Math.sin(theta) * rWarp;

        const diskHue = 0.58 - rNorm * 0.58;
        const diskSat = 0.9;
        const diskLit = 0.35 + (1.0 - rNorm) * 0.45;

        fx = diskX;
        fy = diskY;
        fz = diskZ;
        fHue = diskHue;
        fSat = diskSat;
        fLit = diskLit;
      }
      // ZONE B — RELATIVISTIC JETS
      else if (i >= diskCut && i < jetCut) {
        const jetIdx = i - diskCut;
        const jetSign = jetIdx % 2 === 0 ? 1.0 : -1.0;

        const tJet = jetIdx / (jetCut - diskCut + 1);
        const tPhase = (tJet + time * jetSpd * 0.15) % 1.0;
        const jetY = jetSign * tPhase * jetL;

        const colFrac = 1.0 - tPhase * 0.7;
        const jitterA = Math.sin(tPhase * 18.0 - time * jetSpd * 2.0) * 0.6 * colFrac;
        const jitterB = Math.cos(tPhase * 14.0 + time * jetSpd * 1.5) * 0.6 * colFrac;
        const jetRadius = 1.5 + colFrac * 3.5;
        const jetAngle = phi * 7.0;
        const jetX = Math.cos(jetAngle) * jetRadius + jitterA;
        const jetZ = Math.sin(jetAngle) * jetRadius + jitterB;

        const jetHue = 0.62 + tPhase * 0.12;
        const jetSat = 1.0;
        const jetLit = 0.55 + (1.0 - tPhase) * 0.25;

        fx = jetX;
        fy = jetY;
        fz = jetZ;
        fHue = jetHue;
        fSat = jetSat;
        fLit = jetLit;
      }
      // ZONE C — CORONA / HALO
      else {
        const corNorm = (i - jetCut) / (count - jetCut + 1);
        const corR = diskR * (0.6 + corNorm * 1.2) * (1.0 + corona * 0.5);
        const corTheta = phi;
        const corPhi2 = corNorm * 3.14159;

        const breath = 1.0 + 0.08 * Math.sin(time * 0.4 + corNorm * 12.0);
        const corRR = corR * breath;
        const corX = Math.sin(corPhi2) * Math.cos(corTheta) * corRR;
        const corY = Math.cos(corPhi2) * corRR;
        const corZ = Math.sin(corPhi2) * Math.sin(corTheta) * corRR;

        const corHue = 0.07 - corNorm * 0.07;
        const corSat = 0.8;
        const corLit = (0.5 - corNorm * 0.25) * (0.3 + corona * 0.7);

        fx = corX;
        fy = corY;
        fz = corZ;
        fHue = corHue;
        fSat = corSat;
        fLit = corLit;
      }

      target.set(fx, fy, fz);
      pColor.setHSL(fHue, fSat, fLit);

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

export default function QuasarBackground() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={['#000000', 0.01]} />
        <QuasarParticles />
        <OrbitControls autoRotate={true} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
