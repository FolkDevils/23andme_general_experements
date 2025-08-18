"use client";

import { useMemo, useState } from "react";

// Round to fixed precision to avoid SSR/client float diffs in path strings
const fmt = (n: number, dp = 3) => Number(n.toFixed(dp));

type SpiroType = "hypotrochoid" | "epitrochoid";

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
	const [R, setR] = useState<number>(150); // fixed/outer radius
	const [r, setr] = useState<number>(60); // rolling radius
	const [p, setP] = useState<number>(75); // pen offset from rolling circle center
	const [resolution, setResolution] = useState<number>(2000); // samples along the curve
	const [strokeWidth, setStrokeWidth] = useState<number>(2);
	const [strokeColor, setStrokeColor] = useState<string>("#FFFFFF");

	// Derived: scale to fit inside canvas
	const maxRadiusGuess = useMemo(() => {
		// Rough bound for both types
		return spiroType === "hypotrochoid" ? Math.max(R, R - r + p) : Math.max(R + r + p, R + r);
	}, [R, r, p, spiroType]);
	const scale = useMemo(() => (CANVAS_PX / 2 - MARGIN) / Math.max(1, maxRadiusGuess), [CANVAS_PX, MARGIN, maxRadiusGuess]);

	const d = useMemo(() => {
		const totalAngle = computeTotalAngleRadians(R, r);
		const steps = Math.max(50, Math.floor(resolution));
		const cx = CANVAS_PX / 2;
		const cy = CANVAS_PX / 2;
		let path = "";
		for (let i = 0; i <= steps; i++) {
			const t = (totalAngle * i) / steps;
			let x: number;
			let y: number;
			if (spiroType === "hypotrochoid") {
				// Rolling inside R
				const k = R - r;
				x = k * Math.cos(t) + p * Math.cos((k / r) * t);
				y = k * Math.sin(t) - p * Math.sin((k / r) * t);
			} else {
				// Epitrochoid: rolling outside R
				const k = R + r;
				x = k * Math.cos(t) - p * Math.cos((k / r) * t);
				y = k * Math.sin(t) - p * Math.sin((k / r) * t);
			}
			const X = fmt(cx + x * scale);
			const Y = fmt(cy + y * scale);
			if (i === 0) path += `M ${X} ${Y}`; else path += ` L ${X} ${Y}`;
		}
		return path;
	}, [R, r, p, spiroType, resolution, CANVAS_PX, scale]);

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
					{/* Presets for chromosome-like (2-lobe) shapes */}
					<div className="space-y-2">
						<div className="text-sm font-medium">Presets</div>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={() => { setSpiroType("hypotrochoid"); setR(90); setr(30); setP(27); }}
								className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded"
							>
								Chromosome tall
							</button>
							<button
								onClick={() => { setSpiroType("hypotrochoid"); setR(90); setr(30); setP(24); }}
								className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded"
							>
								Skinnier waist
							</button>
							<button
								onClick={() => { setSpiroType("hypotrochoid"); setR(75); setr(25); setP(24); }}
								className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded"
							>
								Broader ends
							</button>
							<button
								onClick={() => { // Snap to 2-lobes by setting r ≈ R/3
									const newR = R; const newr = Math.max(5, Math.round(newR / 3)); setSpiroType("hypotrochoid"); setr(newr);
								}}
								className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded"
							>
								Snap 2‑lobes (r≈R/3)
							</button>
						</div>
						<div className="text-[11px] opacity-60">Tip: two lobes when (R−r)/gcd(R,r)=2. Choosing r≈R/3 often achieves this.</div>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="flex items-center gap-2">
							<label className="w-20 text-sm">Type</label>
							<select
								className="bg-black/40 border border-white/20 rounded px-2 py-1 text-sm"
								value={spiroType}
								onChange={(e) => setSpiroType(e.target.value as SpiroType)}
							>
								<option value="hypotrochoid">Hypotrochoid (inside)</option>
								<option value="epitrochoid">Epitrochoid (outside)</option>
							</select>
						</div>
						<div className="flex items-center gap-2">
							<label className="w-20 text-sm">Stroke</label>
							<input type="color" value={strokeColor} onChange={(e)=>setStrokeColor(e.target.value)} />
							<input type="range" min={1} max={10} value={strokeWidth} onChange={(e)=>setStrokeWidth(Number(e.target.value))} />
							<span className="text-xs tabular-nums">{strokeWidth}px</span>
						</div>
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
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="text-xs">Resolution</label>
							<input className="w-full" type="range" min={200} max={8000} step={100} value={resolution} onChange={(e)=>setResolution(Number(e.target.value))} />
							<div className="text-[11px] tabular-nums">{resolution}</div>
						</div>
						<div>
							<label className="text-xs">Scale auto-fit</label>
							<div className="text-[11px] opacity-60">Max radius ≈ {Math.round(maxRadiusGuess)} → scale {scale.toFixed(2)}x</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
