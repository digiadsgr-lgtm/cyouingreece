'use client';
import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    // Calculate distance from current pixel to mouse
    float dist = distance(vUv, uMouse);
    
    // Create a smooth ripple effect
    float ripple = sin(dist * 20.0 - uTime * 2.0) * 0.02;
    
    // Falloff so the ripple only happens near the mouse
    float falloff = smoothstep(0.5, 0.0, dist);
    
    // Distort the UV coordinates
    vec2 distortedUv = vUv + (vUv - uMouse) * ripple * falloff;
    
    // Sample texture with distorted UVs
    vec4 color = texture2D(uTexture, distortedUv);
    
    gl_FragColor = color;
  }
`;

function DisplacementScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  
  // Using the photorealistic image we generated
  const texture = useTexture('/bg-hero.png');

  // Uniforms for the shader
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 }
    }),
    [texture]
  );

  useFrame((state) => {
    if (materialRef.current) {
      // Update time for the sine wave
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Update mouse position (normalize mapped from -1..1 to 0..1 for standard UV mapping)
      // Lerp for smooth trailing effect
      const targetX = (state.pointer.x * 0.5) + 0.5;
      const targetY = (state.pointer.y * 0.5) + 0.5;
      
      materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.05;
      materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Create a plane that covers exactly the whole viewport */}
      <planeGeometry args={[viewport.width, viewport.height, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function LiveImage3D() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }} 
        // Ensure the canvas doesn't kill SSR heavily
        dpr={[1, 2]} 
      >
        <Suspense fallback={null}>
          <DisplacementScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
