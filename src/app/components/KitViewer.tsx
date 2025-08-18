'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useFBX, OrbitControls, ContactShadows } from '@react-three/drei';

import { useControls } from 'leva';
import { useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';

function KitModel({ brightness, contrast, saturation, ...props }: { brightness: number; contrast: number; saturation: number; [key: string]: unknown }) {
  const fbx = useFBX('/Kit.fbx');
  const originalColors = useRef<Map<THREE.Material, THREE.Color>>(new Map());
  
  // SIMPLE: Just set your start and end positions here
  const startPosition: [number, number, number] = [0, 6, 0];  // Where kit starts (you can change this)
  const endPosition: [number, number, number] = [0, -.35, 0];   // Where kit lands (you can change this)
  
  // Natural gravity drop-in animation with hard collision
  const { position } = useSpring({
    from: { position: startPosition }, 
    to: { position: endPosition }, 
    config: { 
      mass: 1, 
      tension: 50, 
      friction: 10,  // Much higher friction for hard stop
      clamp: true,   // Prevents overshoot/bounce
      precision: 0.01
    },
    delay: 300, // Small delay before drop starts
  });
  
  useEffect(() => {
    if (!fbx) return;
    
    // Store original colors on first load
    if (originalColors.current.size === 0) {
      fbx.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material && child.material.color) {
          originalColors.current.set(child.material, child.material.color.clone());
        }
      });
    }
    
    // Apply color adjustments based on original colors
    fbx.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material && child.material.color) {
        const originalColor = originalColors.current.get(child.material);
        if (originalColor) {
          // Apply brightness (additive)
          const brightColor = originalColor.clone();
          brightColor.addScalar(brightness);
          
          // Apply contrast (multiplicative from 0.5 gray point)
          const contrastColor = brightColor.clone();
          contrastColor.addScalar(-0.5);
          contrastColor.multiplyScalar(1 + contrast);
          contrastColor.addScalar(0.5);
          
          // Apply saturation
          const gray = 0.299 * contrastColor.r + 0.587 * contrastColor.g + 0.114 * contrastColor.b;
          const satColor = contrastColor.clone();
          satColor.lerp(new THREE.Color(gray, gray, gray), -saturation);
          
          child.material.color.copy(satColor);
        }
      }
    });
  }, [fbx, brightness, contrast, saturation]);
  
  if (fbx) {
    // Scale and position the model appropriately
    fbx.scale.setScalar(0.1); // Adjust scale as needed
    
    // Ensure all materials are properly set for shadows
    fbx.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Enhanced material properties for better lighting
        if (child.material) {
          child.material.roughness = 0.2; // Less rough for more reflection
          child.material.metalness = 0.1;
          child.material.envMapIntensity = 1.0;
        }
      }
    });
  }

  return (
    <animated.group {...props} dispose={null} position={position as unknown as [number, number, number]}>
      <primitive object={fbx} />
    </animated.group>
  );
}

function Scene() {
  const { 
    shadowOpacity, 
    ambientIntensity, 
    directionalIntensity,
    brightness,
    contrast,
    saturation
  } = useControls('Kit Viewer', { 
    shadowOpacity: { value: 0.7, min: 0, max: 1, step: 0.1 },
    ambientIntensity: { value: 0.8, min: 0, max: 2, step: 0.1 },
    directionalIntensity: { value: 0.7, min: 0, max: 3, step: 0.1 },
    brightness: { value: 0.50, min: -1, max: 1, step: 0.05 },
    contrast: { value: 0.10, min: -1, max: 1, step: 0.05 },
    saturation: { value: 0.50, min: -1, max: 1, step: 0.05 }
  });
  
  // Shadow opacity is completely independent of brightness/contrast
  const shadowOpacityFinal = shadowOpacity;

  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={directionalIntensity} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight 
        position={[-10, 10, 5]} 
        intensity={directionalIntensity * 0.6} 
      />
      <directionalLight 
        position={[0, 10, -10]} 
        intensity={directionalIntensity * 0.4} 
      />
      
      {/* Kit Model - with drop animation */}
      <KitModel scale={1} brightness={brightness} contrast={contrast} saturation={saturation} />
      
      {/* Proper transparent shadows - moved down */}
      <ContactShadows 
        position={[0, -1, 0]} 
        opacity={shadowOpacityFinal} 
        scale={10} 
        blur={2} 
        far={4}
        resolution={256}
        color="#000000"
      />
      
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2}
        target={[0, -.5, 0]}
      />
      

    </>
  );
}

export default function KitViewer() {
  return (
    <div className="w-full h-screen" style={{ backgroundColor: '#F2F5F7' }}>
      <Canvas 
        shadows 
        camera={{ position: [0, -.5, 4], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
      
      {/* Controls info */}
      <div className="absolute top-4 left-4 text-black/60 text-sm">
        <p>Use mouse to orbit around the kit</p>
        <p>Scroll to zoom</p>
        <p>Use controls to adjust lighting & colors</p>
      </div>
    </div>
  );
} 