'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Simulate wave pushing OUT of the screen (Z-axis distortion)
    // We use the Y coordinate (bottom of the image is the sea) to intensify the wave
    float waveIntensity = smoothstep(0.4, 0.0, uv.y); // Lower part of the image has higher intensity
    
    // Complex sine wave for organic water movement
    float elevation = sin(modelPosition.x * 3.0 - uTime * 2.0) * 0.15;
    elevation += sin(modelPosition.y * 5.0 - uTime * 1.5) * 0.15;
    
    // Interactive mouse push effect
    float distance = distance(uv, uMouse);
    float interactivePush = smoothstep(0.4, 0.0, distance) * 0.3;
    
    // Apply elevation out of the screen (Z axis)
    modelPosition.z += (elevation + interactivePush) * waveIntensity * 3.0;
    
    vElevation = modelPosition.z;
    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Sample the idyllic beach texture
    vec4 texColor = texture2D(uTexture, vUv);
    
    // Add specular highlights to the peaks of the waves to make it feel 3D
    float highlight = smoothstep(0.0, 0.5, vElevation) * 0.15;
    texColor.rgb += highlight;
    
    gl_FragColor = texColor;
  }
`;

function WaveScene() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // High quality idyllic greek beach - Downloaded locally to avoid CORS errors
  const texture = useTexture('/bg-hero.png');

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }
    }),
    [texture]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Interpolate mouse for smooth tracking
      const targetX = (state.pointer.x * 0.5) + 0.5;
      const targetY = (state.pointer.y * 0.5) + 0.5;
      
      materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.05;
      materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.05;
    }
  });

  return (
    <mesh rotation={[-0.1, 0, 0]}>
      {/* High-segment plane to allow vertex distortion */}
      <planeGeometry args={[16, 9, 256, 256]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function LiveImage3D() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden">
      <Canvas 
        camera={{ position: [0, 0, 5.5], fov: 65 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <WaveScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
