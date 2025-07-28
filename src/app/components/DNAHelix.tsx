'use client';

import { useRef, useMemo } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useImageLoader } from './ImageLoader';

interface ImagePlaneProps {
  imageUrl: string;
  index: number;
  strand: number;
  animationOffset: number;
  radius: number;
  spacing: number;
  angleStep: number;
  speed: number;
  totalLength: number;
}

function ImagePlane({
  imageUrl,
  index,
  strand,
  animationOffset,
  radius,
  spacing,
  angleStep,
  speed,
  totalLength,
}: ImagePlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const texture = useLoader(TextureLoader, imageUrl, undefined, (error) => {
    console.warn(`Failed to load texture ${index}:`, error);
  });

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed;
      const animatedPosition = animationOffset + time;
      
      const angle = animatedPosition * angleStep + (strand * Math.PI);
      // Calculate position based on a continuous, wrapping space
      const x = (animatedPosition * spacing) % totalLength - totalLength / 2;
      const y = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      
      meshRef.current.position.set(x, y, z);
    }
  });

  const scale = strand === 0 ? 0.4 : 0.35;

  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        opacity={strand === 0 ? 1.0 : 0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const { images, loading } = useImageLoader();

  // --- Centralized Helix Parameters ---
  const radius = 4; // Wider helix for more vertical screen space
  const spacing = 0.4; // Spacing between images
  const angleStep = 0.18; // Stretched-out turns
  const speed = 0.3; // Slower speed for a grander feel
  const maxImages = Math.min(images.length, 400); // More images for full coverage
  const imagesPerStrand = Math.floor(maxImages / 2);
  // totalLength is now calculated perfectly from image count and spacing to ensure no gaps
  const totalLength = imagesPerStrand * spacing;

  const helixPositions = useMemo(() => {
    if (images.length === 0) return [];

    const positions: Array<{
      imageUrl: string;
      index: number;
      strand: number;
      animationOffset: number;
    }> = [];
    
     for (let strand = 0; strand < 2; strand++) {
       for (let i = 0; i < imagesPerStrand; i++) {
         const imageIndex = strand * imagesPerStrand + i;
         if (imageIndex >= images.length) break;

         positions.push({
           imageUrl: images[imageIndex]?.urls.small || images[imageIndex]?.urls.thumb || '',
           index: imageIndex,
           strand: strand,
           animationOffset: i,
         });
       }
     }

    return positions;
  }, [images, imagesPerStrand]);

  if (loading) return null;

  return (
    <group ref={groupRef}>
      {helixPositions.map((item, index) => (
        <ImagePlane
          key={`${item.index}-${index}`}
          imageUrl={item.imageUrl}
          index={item.index}
          strand={item.strand}
          animationOffset={item.animationOffset}
          radius={radius}
          spacing={spacing}
          angleStep={angleStep}
          speed={speed}
          totalLength={totalLength}
        />
      ))}
    </group>
  );
} 