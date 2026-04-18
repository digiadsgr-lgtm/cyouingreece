'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, Clouds, Cloud } from '@react-three/drei';
import * as THREE from 'three';

function VolumetricFlight() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Simulate flying forward through the clouds
      groupRef.current.position.z += delta * 15;
      
      // If we've flown far enough, reset position for infinite loop effect
      if (groupRef.current.position.z > 100) {
        groupRef.current.position.z = -100;
      }

      // Gentle camera sway (like an airplane turning)
      state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 5;
      state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.2) * 2;
      state.camera.lookAt(0, 0, -50);
    }
  });

  return (
    <>
      {/* Sunset / Golden Hour Sky reflecting the Aegean sunset */}
      <Sky 
        sunPosition={[100, 20, -100]} 
        turbidity={0.5} 
        rayleigh={0.8}
        mieCoefficient={0.005} 
        mieDirectionalG={0.8} 
      />
      
      <ambientLight intensity={1.5} color="#ffd8a8" />
      <directionalLight position={[100, 20, -100]} intensity={3} color="#ffe8cc" />

      {/* Volumetric Clouds using Drei */}
      <group ref={groupRef}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400} range={200}>
           {/* Generate a tunnel of clouds to fly through */}
           {Array.from({ length: 40 }).map((_, i) => (
             <Cloud
               key={i}
               seed={i}
               position={[
                 (Math.random() - 0.5) * 150, 
                 (Math.random() - 0.5) * 60, 
                 (Math.random() - 0.5) * 400 - 200 // Spread deeply along the Z axis
               ]} // Spread around
               opacity={0.8}
               speed={0.2} // internal cloud morphing speed
               segments={20} // detail
               bounds={[10, 10, 10]}
               color={i % 3 === 0 ? "#ffcc99" : "#ffffff"} // Golden hour tint on some clouds
             />
           ))}
        </Clouds>
      </group>
    </>
  );
}

export default function LiveImage3D() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 0], fov: 60 }} 
        dpr={[1, 2]} 
      >
        <VolumetricFlight />
      </Canvas>
    </div>
  );
}
