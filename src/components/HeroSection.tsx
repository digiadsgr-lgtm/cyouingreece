'use client';
import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Float, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ─── Vertex-Displaced Ocean ─────────────────────────────────────────────────
// Real sine-wave ocean — every vertex moves, creating genuine 3D water
function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 60, 128, 128);
    return geo;
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta * 0.35;
    if (!meshRef.current) return;

    const geo = meshRef.current.geometry as THREE.BufferGeometry;
    const pos = geo.attributes.position;
    const count = pos.count;

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Layer multiple sine waves at different frequencies for realism
      const y =
        Math.sin(x * 0.4 + timeRef.current) * 0.35 +
        Math.sin(x * 0.15 - timeRef.current * 0.7) * 0.6 +
        Math.sin(z * 0.25 + timeRef.current * 1.2) * 0.25 +
        Math.cos(x * 0.08 + z * 0.12 + timeRef.current * 0.5) * 0.8;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.8, 0]}
      receiveShadow
    >
      <meshPhysicalMaterial
        color="#0d2a3d"
        emissive="#041525"
        roughness={0.05}
        metalness={0.9}
        transmission={0.3}
        thickness={0.5}
        envMapIntensity={2}
      />
    </mesh>
  );
}

// ─── Cycladic Island ─────────────────────────────────────────────────────────
function Island() {
  return (
    <Float speed={0.4} floatIntensity={0.3} rotationIntensity={0} position={[3, 1.2, -22]}>
      <group>
        {/* Rocky base */}
        <mesh position={[0, -1.2, 0]}>
          <sphereGeometry args={[5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#2a1f15" roughness={1} />
        </mesh>
        {/* Hillside */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[3.8, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#3d2e1e" roughness={1} />
        </mesh>
        {/* White cubic houses — Cycladic architecture */}
        {[
          [-0.5, 0.8, 0], [0.8, 1.1, -0.3], [-1.2, 1.4, -0.6],
          [0.2, 1.6, -0.8], [-0.3, 2.0, -1.2], [1.1, 0.6, 0.4],
          [-1.5, 1.0, 0.2], [0.5, 2.3, -1.6],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} scale={Math.random() * 0.2 + 0.25}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#F8F6F1" roughness={0.2} />
          </mesh>
        ))}
        {/* Small church dome */}
        <mesh position={[-0.6, 2.6, -1.4]}>
          <sphereGeometry args={[0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color="#1a4a8a" roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Distant Silhouette Islands ──────────────────────────────────────────────
function DistantIslands() {
  return (
    <>
      {[[-12, 0.3, -35], [18, 0.2, -45], [-22, 0.15, -50]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[3 + i, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <meshStandardMaterial color="#0d1820" roughness={1} fog />
        </mesh>
      ))}
    </>
  );
}

// ─── Camera: Boat Drift + Mouse Parallax ────────────────────────────────────
function CameraRig() {
  const { camera, pointer } = useThree();
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    // Boat bobbing: gentle sine on Y
    const targetY = Math.sin(t.current * 0.3) * 0.15 + 1.8;
    // Mouse parallax on X, subtle on Y
    const targetX = pointer.x * 1.8;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.015);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02);
    camera.lookAt(0, 0.5, -10);
  });
  return null;
}

// ─── Scene: everything together ──────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Atmosphere */}
      <color attach="background" args={['#030b15']} />
      <fog attach="fog" args={['#030b15', 20, 65]} />

      {/* Lighting: Golden Hour */}
      <ambientLight intensity={0.08} />
      {/* Low sun from the right-west */}
      <directionalLight
        position={[18, 2, -15]}
        intensity={5}
        color="#e8903a"
        castShadow
      />
      {/* Soft sky fill */}
      <hemisphereLight args={['#0a1e35', '#030b15', 0.4]} />
      {/* Warm horizon glow */}
      <pointLight position={[0, 1, -8]} intensity={2} color="#c95a15" distance={30} />

      <Ocean />
      <Island />
      <DistantIslands />
      <Stars radius={80} depth={60} count={600} factor={3} fade speed={0.3} />

      <CameraRig />

      <EffectComposer>
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={2.5} mipmapBlur />
      </EffectComposer>
    </>
  );
}

// ─── Hero Content Layer ──────────────────────────────────────────────────────
function HeroContent() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none select-none"
      style={{ background: 'linear-gradient(to top, rgba(3,11,21,0.95) 0%, rgba(3,11,21,0.5) 40%, transparent 75%)' }}>
      <div className="max-w-[1320px] mx-auto w-full px-6 md:px-16 pb-20 md:pb-28">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-7">
          <span className="h-px w-10 bg-[#D4A027]" />
          <span className="text-[#D4A027] text-[11px] tracking-[0.45em] uppercase font-semibold">
            Aegean · 2026
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-[clamp(3.2rem,9vw,8.5rem)] font-serif font-light text-white leading-[0.9] mb-8"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>
          C You In<br />
          <em className="not-italic"
            style={{ background: 'linear-gradient(90deg, #D4A027, #C1440E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Greece.
          </em>
        </h1>

        {/* Nikos Quote */}
        <p className="font-serif italic text-[clamp(0.95rem,2vw,1.35rem)] text-white/70 max-w-2xl leading-relaxed mb-10"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
          "Turn left at the blue door, past the bakery that opens at 5am.
          There is a table with a view that will change you."
          <span className="not-italic text-[#D4A027] text-xs ml-3 tracking-widest">— Nikos</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-6 pointer-events-auto">
          <a href="#destinations"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A027] text-[#030b15] text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-all duration-300">
            Discover Greece
          </a>
          <button
            className="text-xs tracking-[0.2em] uppercase text-white/70 border-b border-white/30 pb-1 hover:text-[#D4A027] hover:border-[#D4A027] transition-all duration-300"
            onClick={() => {
              const btn = document.querySelector<HTMLButtonElement>('[aria-label="Plan my trip with Nikos"]');
              btn?.click();
            }}>
            Speak to Nikos →
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-10 hidden md:flex flex-col items-center gap-3">
        <span className="text-[9px] uppercase tracking-[0.35em] text-white/30 -rotate-90 mb-6">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-[#D4A027]/60 to-transparent" />
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#030b15]">
      {/* Fallback: full-bleed photo shown instantly (LCP) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: '50% 60%',
          filter: 'brightness(0.35) saturate(0.8)',
        }}
      />

      {/* WebGL Canvas — layered on top of fallback */}
      {mounted && (
        <div className="absolute inset-0 z-[1]">
          <Canvas
            camera={{ position: [0, 1.8, 8], fov: 55 }}
            gl={{ powerPreference: 'high-performance', antialias: false, alpha: true }}
            dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)]}
            shadows
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Editorial content overlay */}
      <HeroContent />
    </section>
  );
}
