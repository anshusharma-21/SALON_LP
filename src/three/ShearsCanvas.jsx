import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { shears } from './shearsState.js';
import { asset } from '../lib/asset.js';

const MODEL = asset('models/shears.glb');
const MODEL_HEIGHT = 5.3; // units, measured from the Blender export (ring tang → blade tip)

const damp = THREE.MathUtils.damp;

function Shears() {
  const { nodes } = useGLTF(MODEL);
  const group = useRef();
  const inner = useRef();
  const halfA = useRef();
  const halfB = useRef();
  const cur = useRef({ x: 0.4, y: 0, size: 0.6, rx: 0, ry: 0, rz: 0, open: 0.2, o: 0 });
  const { viewport, gl, scene, camera } = useThree();

  // Compile every shader up-front (while the loader is still on screen) so the first
  // appearance of the shears never stalls the main thread mid-animation.
  useEffect(() => {
    const g = group.current;
    const was = g.visible;
    g.visible = true;
    gl.compile(scene, camera);
    g.visible = was;
  }, [gl, scene, camera]);

  // Hand-tuned physical materials (richer than the glTF defaults).
  const mats = useMemo(() => ({
    gold: new THREE.MeshPhysicalMaterial({
      color: '#d8ad72', metalness: 1, roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.15,
      envMapIntensity: 1.35,
    }),
    steel: new THREE.MeshPhysicalMaterial({
      color: '#e6cfae', metalness: 1, roughness: 0.14, envMapIntensity: 1.5,
    }),
    screw: new THREE.MeshPhysicalMaterial({
      color: '#9c7448', metalness: 1, roughness: 0.28, envMapIntensity: 1.2,
    }),
  }), []);

  const parts = useMemo(() => {
    const pick = (mat) => {
      const n = (mat?.name || '').toLowerCase();
      if (n.includes('steel')) return mats.steel;
      if (n.includes('screw')) return mats.screw;
      return mats.gold;
    };
    const prep = (obj) => {
      const c = obj.clone(true);
      c.position.set(obj.position.x, obj.position.y, obj.position.z);
      c.traverse((m) => {
        if (m.isMesh) {
          m.material = Array.isArray(m.material) ? m.material.map(pick) : pick(m.material);
          m.castShadow = false;
        }
      });
      return c;
    };
    return { a: prep(nodes.HalfA), b: prep(nodes.HalfB), p: prep(nodes.Pivot) };
  }, [nodes, mats]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const { a, b, mouse } = shears;
    const pa = a.o * a.in;
    const pb = b.o * b.in;
    const src = pb > pa ? b : a; // whichever choreography is currently present
    const c = cur.current;
    const k = 5; // damping strength — higher = snappier
    for (const key of ['x', 'y', 'size', 'rx', 'rz']) c[key] = damp(c[key], src[key], k, dt);
    c.ry = damp(c.ry, src.ry + src.spin, k, dt);
    c.o = damp(c.o, Math.max(pa, pb), k, dt);
    const snip = src.snip * (0.5 + 0.5 * Math.sin(t * 3.2)) * 0.55;
    c.open = damp(c.open, src.open + snip, 9, dt);

    const vw = viewport.width / 2;
    const vh = viewport.height / 2;
    const s = (c.size * viewport.height) / MODEL_HEIGHT;
    const g = group.current;
    g.position.set(c.x * vw, c.y * vh + Math.sin(t * 0.9) * 0.06 * c.o, 0);
    g.scale.setScalar(s * (0.85 + 0.15 * c.o));
    g.visible = c.o > 0.01;

    const i = inner.current;
    i.rotation.x = c.rx + mouse.y * 0.18 + Math.sin(t * 0.7) * 0.05;
    i.rotation.y = c.ry + mouse.x * 0.32 + Math.sin(t * 0.5) * 0.08;
    i.rotation.z = c.rz + Math.sin(t * 0.6) * 0.03;

    const ang = c.open * 0.42;
    // Blender's Z (the pivot axis) became glTF's Y on export
    halfA.current.rotation.y = -ang;
    halfB.current.rotation.y = ang;

    // Fade in/out without permanent transparency (avoids depth-sorting artefacts on the metal).
    const op = Math.min(1, c.o * 1.4);
    const fading = op < 0.995;
    for (const m of Object.values(mats)) {
      if (m.transparent !== fading) { m.transparent = fading; m.depthWrite = !fading; m.needsUpdate = true; }
      m.opacity = op;
    }
  });

  return (
    <group ref={group}>
      <group ref={inner}>
        {/* Blender is Z-up, glTF is Y-up: stand the shears upright, facing the camera */}
        <group rotation-x={Math.PI / 2}>
          <primitive ref={halfA} object={parts.a} />
          <primitive ref={halfB} object={parts.b} />
          <primitive object={parts.p} />
        </group>
      </group>
    </group>
  );
}

function Studio() {
  // Local studio lighting (no external HDR download): soft boxes reflected in the metal.
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#2a201b']} />
      <Lightformer form="rect" intensity={4} color="#fff3e2" position={[0, 5, -6]} scale={[12, 3, 1]} />
      <Lightformer form="rect" intensity={2.4} color="#ffe2bd" position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
      <Lightformer form="rect" intensity={2} color="#ffffff" position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
      <Lightformer form="ring" intensity={3} color="#ffd9a8" position={[2, 3, 6]} scale={3} />
      <Lightformer form="rect" intensity={1} color="#b8956a" position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[12, 12, 1]} />
    </Environment>
  );
}

export default function ShearsCanvas() {
  const wrap = useRef();
  // Render only while the shears are on screen (plus a short tail so fades finish) — an idle WebGL loop
  // costs a full GPU frame every tick and is the main source of scroll jank on laptops.
  const [loop, setLoop] = useState('always');
  useEffect(() => {
    let lastLive = performance.now();
    let cur = 'always';
    const check = () => {
      const { a, b } = shears;
      const now = performance.now();
      if (a.o * a.in > 0.001 || b.o * b.in > 0.001) lastLive = now;
      const want = now - lastLive < 1500 ? 'always' : 'never';
      if (want !== cur) { cur = want; setLoop(want); }
    };
    const id = setInterval(check, 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      shears.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      shears.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div className="shears-canvas" ref={wrap} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={loop}
        camera={{ position: [0, 0, 14], fov: 30, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <Studio />
          <directionalLight position={[4, 6, 8]} intensity={1.2} color="#fff1dc" />
          <Shears />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL);
