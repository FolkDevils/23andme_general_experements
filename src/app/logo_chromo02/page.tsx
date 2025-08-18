"use client";

import { useMemo, useState } from "react";

// Fix hydration by rounding floats so SSR/client strings match
const fmt = (n: number, dp = 3) => Number(n.toFixed(dp));

type SpiroType = "hypotrochoid" | "epitrochoid" | "hypocycloid" | "epicycloid";

function gcd(a: number, b: number): number {
	let x = Math.abs(Math.round(a));
	let y = Math.abs(Math.round(b));
	while (y !== 0) {
		const t = y;
		y = x % y;
		x = t;
	}
	return x || 1;
}

function computeTotalAngleRadians(R: number, r: number): number {
	// Number of cycles until curve closes
	// For both hypo/epi, period is 2π * r / gcd(R, r)
	const g = gcd(R, r);
	return (2 * Math.PI * r) / g;
}

export default function LogoChromo02() {
	// Canvas dimensions
	const CANVAS_PX = 760;
	const MARGIN = 20; // keep a little breathing room

	// Spirograph parameters
	const [spiroType, setSpiroType] = useState<SpiroType>("hypotrochoid");
	const [R, setR] = useState<number>(23); // fixed/outer radius
	const [r, setr] = useState<number>(8); // rolling radius
	const [p, setP] = useState<number>(11.5); // pen offset from rolling circle center
	const RESOLUTION = 2000; // fixed samples along the curve
	const [strokeWidth, setStrokeWidth] = useState<number>(1);
	const [strokeColor, setStrokeColor] = useState<string>("#FFFFFF");

	// Derived: scale to fit inside canvas
	const maxRadiusGuess = useMemo(() => {
		// Effective pen distance: cycloids fix p to r
		const pEff = spiroType === "hypocycloid" || spiroType === "epicycloid" ? r : p;
		return spiroType === "hypotrochoid" || spiroType === "hypocycloid"
			? Math.max(R, R - r + pEff)
			: Math.max(R + r + pEff, R + r);
	}, [R, r, p, spiroType]);
	const scale = useMemo(() => (CANVAS_PX / 2 - MARGIN) / Math.max(1, maxRadiusGuess), [CANVAS_PX, MARGIN, maxRadiusGuess]);

	const d = useMemo(() => {
		const totalAngle = computeTotalAngleRadians(R, r);
		const steps = Math.max(50, Math.floor(RESOLUTION));
		const cx = CANVAS_PX / 2;
		const cy = CANVAS_PX / 2;
		const pEff = spiroType === "hypocycloid" || spiroType === "epicycloid" ? r : p;
		let path = "";
		for (let i = 0; i <= steps; i++) {
			const t = (totalAngle * i) / steps;
			let x: number;
			let y: number;
			if (spiroType === "hypotrochoid" || spiroType === "hypocycloid") {
				// Rolling inside R
				const k = R - r;
				x = k * Math.cos(t) + pEff * Math.cos((k / r) * t);
				y = k * Math.sin(t) - pEff * Math.sin((k / r) * t);
			} else {
				// Epitrochoid / Epicycloid: rolling outside R
				const k = R + r;
				x = k * Math.cos(t) - pEff * Math.cos((k / r) * t);
				y = k * Math.sin(t) - pEff * Math.sin((k / r) * t);
			}
			const X = fmt(cx + x * scale);
			const Y = fmt(cy + y * scale);
			if (i === 0) path += `M ${X} ${Y}`; else path += ` L ${X} ${Y}`;
		}
		return path;
	}, [R, r, p, spiroType, RESOLUTION, CANVAS_PX, scale]);

	return (
		<main className="min-h-screen w-full bg-black text-white flex items-center justify-center p-6">
			<div className="flex items-start gap-6 w-full max-w-[1400px]">
				{/* Left: Spirograph */}
				<svg
					width={CANVAS_PX}
					height={CANVAS_PX}
					viewBox={`0 0 ${CANVAS_PX} ${CANVAS_PX}`}
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="block flex-shrink-0"
					aria-label="Spirograph"
				>
					<path d={d} stroke={strokeColor} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
				</svg>

				{/* Right: Controls */}
				<div className="z-10 bg-white/5 rounded-lg p-3 space-y-3 w-[360px] max-h-[90vh] overflow-auto">
					<div className="flex items-center gap-2">
						<label className="w-20 text-sm">Type</label>
						<select
							className="bg-black/40 border border-white/20 rounded px-2 py-1 text-sm"
							value={spiroType}
							onChange={(e) => setSpiroType(e.target.value as SpiroType)}
						>
							<option value="hypotrochoid">Hypotrochoid (inside)</option>
							<option value="epitrochoid">Epitrochoid (outside)</option>
							<option value="hypocycloid">Hypocycloid (p=r, inside)</option>
							<option value="epicycloid">Epicycloid (p=r, outside)</option>
						</select>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<div>
							<label className="text-xs">R (fixed)</label>
							<input className="w-full" type="range" min={10} max={300} value={R} onChange={(e)=>setR(Number(e.target.value))} />
							<div className="text-[11px] tabular-nums">{R}</div>
						</div>
						<div>
							<label className="text-xs">r (rolling)</label>
							<input className="w-full" type="range" min={5} max={200} value={r} onChange={(e)=>setr(Number(e.target.value))} />
							<div className="text-[11px] tabular-nums">{r}</div>
						</div>
						<div>
							<label className="text-xs">p (pen offset)</label>
							<input className="w-full" type="range" min={0} max={300} value={p} onChange={(e)=>setP(Number(e.target.value))} />
							<div className="text-[11px] tabular-nums">{p}</div>
						</div>
					</div>
					<div className="space-y-2">
						<label className="text-xs">Scale auto-fit</label>
						<div className="text-[11px] opacity-60">Max radius ≈ {Math.round(maxRadiusGuess)} → scale {scale.toFixed(2)}x • samples {RESOLUTION}</div>
					</div>
					{/* Stroke moved to bottom to avoid overlap with the dropdown */}
					<div className="flex items-center gap-2 pt-2 border-t border-white/10">
						<label className="w-20 text-sm">Stroke</label>
						<input type="color" value={strokeColor} onChange={(e)=>setStrokeColor(e.target.value)} />
						<input type="range" min={1} max={10} value={strokeWidth} onChange={(e)=>setStrokeWidth(Number(e.target.value))} />
						<span className="text-xs tabular-nums">{strokeWidth}px</span>
					</div>
				</div>
			</div>
		</main>
	);
}
