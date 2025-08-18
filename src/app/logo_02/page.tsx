"use client";

import { useMemo, useState } from 'react';
import { Chromo01 } from '@/app/components/Chromo_01';
import { Chromo02 } from '@/app/components/Chromo_02';

export default function Logo02() {
	const SHAPE_HEIGHT_PX = 420;
	const PALETTE = ["#FFDA00", "#FF4E00", "#FF0068", "#D900FF", "#001FFF", "#0098FF", "#00FF85", "#20FF00", "#CEFF00"];

	const [shapeCount, setShapeCount] = useState<number>(5);
	const [strokeWidth, setStrokeWidth] = useState<number>(2);

	const colors = useMemo(() => Array.from({ length: shapeCount }).map((_, i) => PALETTE[i % PALETTE.length]), [shapeCount, PALETTE]);

	return (
		<main className="min-h-screen w-full bg-white flex items-center justify-center">
			{/* Controls */}
			<div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-5 text-black/80">
				<div className="flex items-center gap-3">
					<label className="text-sm">Count</label>
					<input type="range" min={1} max={23} value={shapeCount} onChange={(e)=>setShapeCount(Number(e.target.value))} className="w-[260px]" />
					<span className="text-xs tabular-nums">{shapeCount}</span>
				</div>
				<div className="flex items-center gap-3">
					<label className="text-sm">Stroke</label>
					<input type="range" min={1} max={8} step={0.1} value={strokeWidth} onChange={(e)=>setStrokeWidth(Number(e.target.value))} className="w-[200px]" />
					<span className="text-xs tabular-nums">{strokeWidth}px</span>
				</div>
			</div>

			{/* Side-by-side canvases */}
			<div className="flex items-start gap-8">
				<div className="relative" style={{ width: SHAPE_HEIGHT_PX, height: SHAPE_HEIGHT_PX }}>
					<div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-black/70">Chromo 01</div>
					{colors.map((color, i) => {
						const angle = (180 / shapeCount) * i;
						return (
							<div key={`c1-${i}`} style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${angle}deg)`, transformOrigin: '50% 50%' }}>
								<Chromo01 height={SHAPE_HEIGHT_PX} color={color} strokeWidth={strokeWidth} />
							</div>
						);
					})}
				</div>

				<div className="relative" style={{ width: SHAPE_HEIGHT_PX, height: SHAPE_HEIGHT_PX }}>
					<div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-black/70">Chromo 02</div>
					{colors.map((color, i) => {
						const angle = (180 / shapeCount) * i;
						return (
							<div key={`c2-${i}`} style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${angle}deg)`, transformOrigin: '50% 50%' }}>
								<Chromo02 height={SHAPE_HEIGHT_PX} color={color} strokeWidth={strokeWidth} />
							</div>
						);
					})}
				</div>
			</div>
		</main>
	);
}
