import React from 'react';

export type Chromo03Props = {
	height?: number; // defaults to 188 to match SVG proportions
	greenColor?: string; // stroke color for green rectangle
	redColor?: string; // stroke color for red rectangle
	strokeWidth?: number; // stroke thickness
	className?: string;
};

export function Chromo03({ 
	height = 188, 
	greenColor = '#92C746', 
	redColor = '#D50F67', 
	strokeWidth = 2, 
	className 
}: Chromo03Props) {
	// Add padding to viewBox to avoid stroke clipping
	const pad = Math.ceil(strokeWidth / 2 + 2);
	const viewBox = `${-pad} ${-pad} ${101 + 2 * pad} ${188 + 2 * pad}`;
	
	return (
		<svg
			width="auto"
			height={height}
			viewBox={viewBox}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-label="Chromosome cross outline"
			shapeRendering="geometricPrecision"
		>
			{/* Green rectangle - rotated 26.4823 degrees */}
			<rect 
				x="73.7042" 
				y="0.700831" 
				width="29.4846" 
				height="163.782" 
				rx="14.7423" 
				transform="rotate(26.4823 73.7042 0.700831)" 
				stroke={greenColor}
				strokeWidth={strokeWidth}
				fill="none"
				strokeLinejoin="round"
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
			/>
			
			{/* Red rectangle - rotated -16.1614 degrees */}
			<rect 
				x="4.65152" 
				y="29.8263" 
				width="29.4846" 
				height="163.782" 
				rx="14.7423" 
				transform="rotate(-16.1614 4.65152 29.8263)" 
				stroke={redColor}
				strokeWidth={strokeWidth}
				fill="none"
				strokeLinejoin="round"
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}

export default Chromo03;
