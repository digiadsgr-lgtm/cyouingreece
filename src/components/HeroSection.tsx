'use client';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { Environment, MeshDistortMaterial, Sphere, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ─── The Mediterranean Sea ─────────────────────────────────────────────────────
function Sea() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Simulate extremely slow, deep breathing of the Aegean
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2 - 1.5;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[100, 100, 128, 128]} />
      <MeshDistortMaterial 
        color="#041220"
        emissive="#020810"
        roughness={0.1}
        metalness={0.8}
        distort={0.2}
        speed={0.5}
      />
    </mesh>
  );
}

// ─── The Cubic Island Houses (Cycladic architecture) ──────────────────────────
function CycladicVillage() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Very slow drift to simulate boat movement
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 0.5;
    }
  });

  const houses = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * 8;
      const y = Math.random() * 2 + 0.5;
      const z = (Math.random() - 0.5) * 5 - 15;
      const scale = Math.random() * 0.6 + 0.4;
      temp.push({ position: [x, y, z] as [number, number, number], scale });
    }
    return temp;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Island base */}
      <mesh position={[0, 0, -15]}>
        <sphereGeometry args={[8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1410" roughness={0.9} />
      </mesh>
      
      {/* Houses */}
      {houses.map((house, i) => (
        <mesh key={i} position={house.position} scale={house.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.2} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Camera Rig for Parallax & Bobbing ───────────────────────────────────────
function CameraRig() {
  const { camera, pointer } = useThree();
  const vec = new THREE.Vector3();
  
  useFrame((state) => {
    // Smooth damp towards cursor for parallax, plus a slight boat bobbing effect
    const bobbing = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    vec.set(pointer.x * 2, pointer.y * 1 + bobbing, camera.position.z);
    camera.position.lerp(vec, 0.02);
    // Always look slightly downward at the sea
    camera.lookAt(0, 0, -15);
  });
  return null;
}

// ─── Gyroscope Fallback for Mobile ──────────────────────────────────────────
function DeviceOrientationRig() {
  const { camera } = useThree();
  const [orientation, setOrientation] = useState({ gamma: 0, beta: 0 });

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setOrientation({
        gamma: e.gamma ? e.gamma / 45 : 0, // left/right
        beta: e.beta ? (e.beta - 45) / 45 : 0 // forward/back tilt
      });
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  useFrame(() => {
    // Only apply if we detect gyroscope usage
    if (Math.abs(orientation.gamma) > 0.1) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, orientation.gamma * 2, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -orientation.beta * 1, 0.05);
    }
  });
  
  return null;
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0a0705]">
      {/* Fallback & WebGL Canvas */}
      <div className="absolute inset-0 z-0 opacity-80" style={{ backgroundImage: 'radial-gradient(circle at 50% 60%, rgba(193, 68, 14, 0.2), transparent 60%)' }}>
        {mounted && (
          <Canvas
            camera={{ position: [0, 2, 5], fov: 45 }}
            gl={{ powerPreference: "high-performance", antialias: false }}
            dpr={[1, 1.5]} // cap DPR for performance
          >
            <color attach="background" args={['#0a0705']} />
            <fog attach="fog" args={['#0a0705', 5, 30]} />
            
            <ambientLight intensity={0.1} />
            {/* The Golden Hour Sun */}
            <directionalLight 
              position={[5, 1, -20]} 
              intensity={4} 
              color="#D4A027" 
              castShadow 
            />
            {/* Soft fill light from the sea */}
            <hemisphereLight args={["#0A1628", "#000000", 0.5]} />

            <Sea />
            <CycladicVillage />
            <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={0.5} />
            
            <CameraRig />
            <DeviceOrientationRig />

            <EffectComposer disableNormalPass>
              <DepthOfField target={[0, 0, -15]} focalLength={0.02} bokehScale={2} height={480} />
              <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.5} mipmapBlur />
            </EffectComposer>
          </Canvas>
        )}
      </div>

      {/* Heavy Editorial Typography Layer */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-24 px-6 md:px-16 pointer-events-none">
        <div className="max-w-[1200px] mx-auto w-full">
          <p className="font-sans text-brand-golden tracking-[0.3em] uppercase text-xs md:text-sm mb-6 drop-shadow-md">
            Not TripAdvisor. Not Lonely Planet.
          </p>
          <h1 className="text-6xl md:text-[8rem] font-serif font-light text-brand-white leading-[0.9] drop-shadow-2xl mix-blend-screen">
            C You In<br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4A027] to-[#C1440E]">Greece.</span>
          </h1>
          <p className="mt-8 text-xl md:text-3xl text-[#FAF9F6] font-light max-w-2xl font-serif italic drop-shadow-lg leading-relaxed">
            "Turn left at the blue door, past the bakery that opens at 5am. There is a table with a view that will change you."
          </p>
          
          <div className="mt-12 flex space-x-8 pointer-events-auto">
            <button className="text-xs tracking-[0.2em] font-sans uppercase font-semibold text-brand-white border-b-2 border-brand-golden pb-2 hover:text-brand-golden hover:tracking-[0.25em] transition-all duration-500">
              Enter The Journal
            </button>
            <button className="text-xs tracking-[0.2em] font-sans uppercase text-gray-400 hover:text-brand-white transition-colors pb-2">
              Speak to Nikos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
