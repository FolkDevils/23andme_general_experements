"use client";

import React from 'react';

export type ControlsProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	values: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setValues: (u: (v: any) => any) => void;
};

export default function Controls({ values, setValues }: ControlsProps) {
	const input = (name: string, min = 0, max = 200, step = 1) => (
		<div className="flex items-center gap-3">
			<label className="w-40 text-sm text-white/80">{name}</label>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={values[name] ?? 0}
				onChange={(e) => setValues((v) => ({ ...v, [name]: Number(e.target.value) }))}
				className="w-56"
			/>
			<input
				type="number"
				className="w-20 rounded bg-white/10 text-white px-2 py-1"
				value={values[name] ?? 0}
				onChange={(e) => setValues((v) => ({ ...v, [name]: Number(e.target.value) }))}
			/>
		</div>
	);

	const color = (name: string) => (
		<div className="flex items-center gap-3">
			<label className="w-40 text-sm text-white/80">{name}</label>
			<input
				type="color"
				value={values[name] ?? '#ffffff'}
				onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
			/>
			<input
				type="text"
				className="w-28 rounded bg-white/10 text-white px-2 py-1"
				value={values[name] ?? '#ffffff'}
				onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
			/>
		</div>
	);

	return (
		<div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur rounded-xl p-4 space-y-3 text-white">
			<div className="text-sm font-semibold opacity-80">Chromosome</div>
			{input('armLength', 20, 200)}
			{input('armWidth', 10, 100)}
			{input('cornerRadius', 0, 40)}
			{input('waistWidth', 4, 80)}
			{input('waistHeight', 4, 80)}
			{input('waistOffset', -60, 60)}
			{input('strokeWidth', 1, 8)}
			{color('stroke')}
			{color('fill')}
			<div className="flex items-center gap-2">
				<label className="w-40 text-sm text-white/80">Outline Only</label>
				<input
					type="checkbox"
					checked={!!values.outlineOnly}
					onChange={(e) => setValues((v) => ({ ...v, outlineOnly: e.target.checked }))}
				/>
			</div>
			<div className="border-t border-white/10 my-2" />
			<div className="text-sm font-semibold opacity-80">Spiral</div>
			{input('count', 1, 200)}
			{input('radius', 10, 400)}
			{input('startAngle', -360, 360)}
			{input('angleStep', -90, 90)}
			{input('scaleStart', 0.1, 3, 0.01)}
			{input('scaleDecay', 0.5, 1, 0.005)}
			{input('perItemRotation', -180, 180)}
			<div className="flex items-center gap-2">
				<label className="w-40 text-sm text-white/80">Animate Draw</label>
				<input
					type="checkbox"
					checked={!!values.animateDraw}
					onChange={(e) => setValues((v) => ({ ...v, animateDraw: e.target.checked }))}
				/>
			</div>
		</div>
	);
} 