import React, { useMemo, forwardRef } from 'react';
import { buildChromosomePath, ChromosomeParams } from '@/app/lib/shape';

export type ChromosomeProps = Partial<ChromosomeParams> & {
	className?: string;
};

const defaultParams: ChromosomeParams = {
	armLength: 60,
	armWidth: 40,
	cornerRadius: 12,
	waistWidth: 16,
	waistHeight: 20,
	waistOffset: 0,
	strokeWidth: 2,
	stroke: '#ffffff',
	fill: '#ffffff',
	outlineOnly: true,
	rotation: 90,
};

export const Chromosome = forwardRef<SVGPathElement, ChromosomeProps>(function Chromosome(
	props,
	ref
) {
	const p = { ...defaultParams, ...props } as ChromosomeParams;
	const d = useMemo(() => buildChromosomePath(p), [p]);

	return (
		<g transform={`rotate(${p.rotation})`}>
			<path
				ref={ref as React.RefObject<SVGPathElement>}
				d={d}
				stroke={p.stroke}
				strokeWidth={p.strokeWidth}
				fill={p.outlineOnly ? 'none' : p.fill}
				vectorEffect="non-scaling-stroke"
			/>
		</g>
	);
});

export default Chromosome; 