'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Suspense } from 'react';
import { useControls } from 'leva';
import Link from 'next/link';
import DNAHelix from './DNAHelix';

function Text3DComponent() {
  return (
    <Html 
      center 
      position={[0, 0, -2]}
      transform
      occlude
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div 
        className="text-center leading-none"
        style={{
          transform: 'scale(0.4)', // Twice as big again - much larger text
          color: 'white',
          textShadow: '0 0 15px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.7)',
          filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.9))'
        }}
      >
        <div 
          className="italic tracking-wider block"
          style={{ 
            fontFamily: 'Million, serif', 
            fontWeight: 300,
            fontSize: '150px',
            lineHeight: '120px'
          }}
        >
          THE
        </div>
        <div 
          className="tracking-widest block -mt-4"
          style={{ 
            fontFamily: 'Million, serif', 
            fontWeight: 300, 
            fontStyle: 'normal',
            fontSize: '300px',
            lineHeight: '240px'
          }}
        >
          STRAND
        </div>
      </div>
    </Html>
  );
}

export default function DNAStrand() {
  // Gradient color controls
  const { topColor, middleColor, bottomColor, direction } = useControls('Background Gradient', {
    topColor: { value: '#6c00a7', label: 'Top Color' }, // Your preferred purple
    middleColor: { value: '#2000a1', label: 'Middle Color' }, // Your preferred blue  
    bottomColor: { value: '#120848', label: 'Bottom Color' }, // Your preferred dark blue
    direction: {
      value: 'to bottom',
      options: {
        'Top to Bottom': 'to bottom',
        'Left to Right': 'to right',
        'Top-Left to Bottom-Right': 'to bottom right',
        'Radial': 'radial-gradient(circle,'
      },
      label: 'Direction'
    }
  });

  // Create the gradient style
  const gradientStyle = direction === 'radial-gradient(circle,' 
    ? { background: `radial-gradient(circle, ${topColor}, ${middleColor}, ${bottomColor})` }
    : { background: `linear-gradient(${direction}, ${topColor}, ${middleColor}, ${bottomColor})` };

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 85 }}
        style={gradientStyle}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={
          <Html center>
            <div className="text-white text-xl">Loading DNA Strand...</div>
          </Html>
        }>
          <DNAHelix />
          <Text3DComponent />
        </Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* Navigation */}
      <div className="absolute top-4 left-4 text-white z-10">
        <Link 
          href="/" 
          className="inline-block mb-4 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
        >
          ← Back to Home
        </Link>
        <p className="text-xs opacity-60 mt-1">Drag to rotate • Scroll to zoom</p>
      </div>


    </div>
  );
} 