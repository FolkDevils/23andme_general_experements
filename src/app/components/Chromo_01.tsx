import React from 'react';

export type Chromo01Props = {
	height?: number; // defaults to 420
	color?: string; // stroke color
	strokeWidth?: number; // stroke thickness
	className?: string;
};

export function Chromo01({ height = 420, color = '#000', strokeWidth = 2, className }: Chromo01Props) {
	// Path coordinates are on .5 boundaries. For even stroke widths, shift by -0.5 to land on whole pixels.
	const snapShift = (strokeWidth % 2 === 0) ? -0.5 : 0;
	// Add padding to viewBox to avoid stroke clipping (round caps/joins)
	const pad = Math.ceil(strokeWidth / 2 + 2); // safety margin
	const viewBox = `${-pad} ${-pad} ${69 + 2 * pad} ${420 + 2 * pad}`;
	return (
		<svg
			width="auto"
			height={height}
			viewBox={viewBox}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			aria-label="Chromosome outline"
			shapeRendering="geometricPrecision"
		>
			<g transform={`translate(${snapShift} ${snapShift})`}>
				<path
					d="M34.5 0.5C53.2777 0.5 68.5 15.7223 68.5 34.5V185.5C68.5 194.942 64.6511 203.483 58.4365 209.645L58.0781 210L58.4365 210.355C64.6511 216.517 68.5 225.058 68.5 234.5V385.5C68.5 404.278 53.2777 419.5 34.5 419.5C15.7223 419.5 0.5 404.278 0.5 385.5V234.5C0.5 225.058 4.3482 216.517 10.5625 210.355L10.9209 210L10.5625 209.645C4.3482 203.483 0.5 194.942 0.5 185.5V34.5C0.5 15.7223 15.7223 0.5 34.5 0.5Z"
					fill="none"
					stroke={color}
					strokeWidth={strokeWidth}
					strokeLinejoin="round"
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
				/>
			</g>
		</svg>
	);
}

export default Chromo01;
