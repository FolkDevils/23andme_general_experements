import React from 'react';

export type Chromo02Props = {
	height?: number; // defaults to 420 to match Chromo_01
	color?: string; // stroke color
	strokeWidth?: number; // stroke thickness
	className?: string;
};

export function Chromo02({ height = 420, color = '#000', strokeWidth = 2, className }: Chromo02Props) {
	// Add padding to viewBox to avoid stroke clipping
	const pad = Math.ceil(strokeWidth / 2 + 2);
	const viewBox = `${-pad} ${-pad} ${36 + 2 * pad} ${345 + 2 * pad}`;
	return (
		<svg
			width="auto"
			height={height}
			viewBox={viewBox}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-label="Chromosome outline 02"
			shapeRendering="geometricPrecision"
		>
			<path
				d="M34.4992 17.4996C34.4992 8.19961 26.8992 0.599609 17.5992 0.599609C8.29923 0.599609 0.699219 8.19961 0.699219 17.4996V103.5L17.2992 172.2C15.0992 181.3 0.799225 240.9 0.799225 240.9C0.799225 240.9 0.799225 241 0.799225 241.1V326.9C0.799225 336.2 8.39922 343.8 17.6992 343.8C26.9992 343.8 34.5992 336.2 34.5992 326.9V240.9L17.9992 172.2C20.1992 163.1 34.4992 103.5 34.4992 103.5C34.4992 103.5 34.4992 103.4 34.4992 103.3V17.4996Z"
				fill="none"
				stroke={color}
				strokeWidth={strokeWidth}
				strokeLinejoin="round"
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}

export default Chromo02;
