"use client";

import React from 'react';
import { useControls } from 'leva';
import { Chromo03 } from '@/app/components/Chromo_03';

export default function LogoCross() {
	const SHAPE_HEIGHT_PX = 300; // Adjusted for Chromo_03 proportions
	const GREEN_PALETTE = ["#92C746", "#FFDA00", "#FF4E00", "#FF0068", "#D900FF", "#001FFF", "#0098FF", "#00FF85", "#20FF00"];
	const RED_PALETTE = ["#D50F67", "#FF0068", "#D900FF", "#001FFF", "#0098FF", "#00FF85", "#20FF00", "#FFDA00", "#FF4E00"];

	const { shapeCount, strokeWidth } = useControls('Cross Pattern', {
		shapeCount: { value: 8, min: 1, max: 23, step: 1 },
		strokeWidth: { value: 2, min: 0.5, max: 8, step: 0.5 }
	});



	return (
		<main className="min-h-screen w-full bg-white flex items-center justify-center">
			{/* Simple overlapping SVGs - same SVG rotated around center */}
			<div className="relative" style={{ 
				width: SHAPE_HEIGHT_PX, 
				height: SHAPE_HEIGHT_PX,
				transform: 'scale(1.5)',
				transformOrigin: 'center center'
			}}>
				
				{/* Same SVG duplicated and rotated */}
				{Array.from({ length: shapeCount }).map((_, i) => {
					const angle = (360 / shapeCount) * i; // Full circle pattern
					
					return (
						<div key={`cross-${i}`} style={{ 
							position: 'absolute', 
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							transform: `rotate(${angle}deg)`,
							transformOrigin: 'center center'
						}}>
							<Chromo03 
								height={SHAPE_HEIGHT_PX} 
								greenColor={GREEN_PALETTE[0]}
								redColor={RED_PALETTE[0]}
								strokeWidth={strokeWidth} 
							/>
						</div>
					);
				})}
			</div>
		</main>
	);
}
