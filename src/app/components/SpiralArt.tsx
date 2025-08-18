"use client";

import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import Chromosome, { ChromosomeProps } from './Chromosome';
import { polarToCartesian, cycle } from '@/app/lib/shape';

export type SpiralProps = {
	count?: number;
	radius?: number;
	startAngle?: number;
	angleStep?: number;
	scaleStart?: number;
	scaleDecay?: number; // multiply per step
	perItemRotation?: number;
	colors?: string[];
	animateDraw?: boolean;
	chromosome?: ChromosomeProps;
};

const defaultSpiral: Required<Omit<SpiralProps, 'chromosome'>> = {
	count: 24,
	radius: 120,
	startAngle: -90,
	angleStep: 12,
	scaleStart: 1,
	scaleDecay: 0.96,
	perItemRotation: 15,
	colors: ['#ffffff'],
	animateDraw: false,
};

export default function SpiralArt(props: SpiralProps) {
	const cfg = { ...defaultSpiral, ...props };
	const gRef = useRef<SVGGElement>(null);

	const items = useMemo(() => {
		return new Array(cfg.count).fill(0).map((_, i) => {
			const angle = cfg.startAngle + i * cfg.angleStep;
			const { x, y } = polarToCartesian(cfg.radius, angle);
			const s = cfg.scaleStart * Math.pow(cfg.scaleDecay, i);
			const color = cycle(cfg.colors, i);
			return { i, x, y, s, angle, color };
		});
	}, [cfg.count, cfg.radius, cfg.startAngle, cfg.angleStep, cfg.scaleStart, cfg.scaleDecay, cfg.colors]);

	useEffect(() => {
		if (!cfg.animateDraw || !gRef.current) return;
		const paths = gRef.current.querySelectorAll('path');
		paths.forEach((p) => {
			const len = (p as SVGPathElement).getTotalLength();
			(p as SVGPathElement).style.strokeDasharray = String(len);
			(p as SVGPathElement).style.strokeDashoffset = String(len);
		});
		const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
		tl.to(paths, { strokeDashoffset: 0, duration: 1.1, stagger: 0.05 });
		return () => { tl.kill(); };
	}, [cfg.animateDraw, items.length]);

	return (
		<g ref={gRef}>
			{items.map(({ i, x, y, s, angle, color }) => (
				<g key={i} transform={`translate(${x}, ${y}) rotate(${angle}) scale(${s})`}>
					<Chromosome
						{...cfg.chromosome}
						stroke={cfg.chromosome?.outlineOnly !== false ? color : cfg.chromosome?.stroke ?? color}
						fill={cfg.chromosome?.outlineOnly === false ? color : 'none'}
						rotation={cfg.perItemRotation}
					/>
				</g>
			))}
		</g>
	);
} 