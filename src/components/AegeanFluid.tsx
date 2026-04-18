'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GRID_SIZE = 80;
const SEPARATION = 1.2;

function ParticleWave() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate uniform particle grid positions centered at origin
  const positions = useMemo(() => {
    const numParticles = GRID_SIZE * GRID_SIZE;
    const positions = new Float32Array(numParticles * 3);

    let i = 0;
    for (let ix = 0; ix < GRID_SIZE; ix++) {
      for (let iz = 0; iz < GRID_SIZE; iz++) {
        // Center the grid
        positions[i] = ix * SEPARATION - (GRID_SIZE * SEPARATION) / 2; // x
        positions[i + 1] = 0; // y 
        positions[i + 2] = iz * SEPARATION - (GRID_SIZE * SEPARATION) / 2; // z
        i += 3;
      }
    }
    return positions;
  }, []);

  // Frame animate fluid motion using combined sine waves
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 0.8;
    const positionAttr = pointsRef.current?.geometry.attributes.position;
    
    if (positionAttr) {
      let vertexIndex = 0;
      for (let ix = 0; ix < GRID_SIZE; ix++) {
        for (let iz = 0; iz < GRID_SIZE; iz++) {
          const y = Math.sin((ix + time) * 0.3) * 1.5 + Math.sin((iz + time) * 0.5) * 1.5;
          positionAttr.setY(vertexIndex, y);
          vertexIndex += 1;
        }
      }
      positionAttr.needsUpdate = true;
    }
    
    // Slow drifting rotation
    if (pointsRef.current) {
        pointsRef.current.rotation.y = time * 0.05;
        pointsRef.current.rotation.z = Math.sin(time * 0.1) * 0.1;
    }
  });

  return (
    <points ref={pointsRef} position={[0, -5, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      {/* Golden/Blue aesthetic material mapping */}
      <pointsMaterial
        size={0.15}
        color="#00AEEF"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function AegeanFluid() {
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#001122] to-[#002244]">
      <Canvas
        camera={{ position: [0, 8, 25], fov: 65 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
      >
        <fog attach="fog" args={['#001122', 15, 45]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 15, 10]} color="#D4AF37" intensity={2} />
        <pointLight position={[-10, 5, -10]} color="#005A9C" intensity={1} />
        
        <ParticleWave />
      </Canvas>
    </div>
  );
}
