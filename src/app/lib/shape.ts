export type ChromosomeParams = {
	armLength: number;
	armWidth: number;
	cornerRadius: number;
	waistWidth: number;
	waistHeight: number;
	waistOffset: number;
	strokeWidth: number;
	stroke: string;
	fill: string;
	outlineOnly: boolean;
	rotation: number;
};

export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

export function polarToCartesian(radius: number, angleDeg: number): { x: number; y: number } {
	const a = (angleDeg * Math.PI) / 180;
	return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
}

export function cycle<T>(arr: T[], i: number): T {
	return arr[((i % arr.length) + arr.length) % arr.length];
}

// Fully rounded capsule: two intersecting rounded-rect "arms" reduce to a single
// convex outline with semicircular caps and straight sides. No concavity.
// We keep waist parameters for API compatibility but do not pinch the outline.
export function buildChromosomePath(p: ChromosomeParams): string {
	const armLen = Math.max(10, p.armLength);
	const fullW = Math.max(4, p.armWidth);
	const halfW = fullW / 2;
	const r = clamp(p.cornerRadius || halfW, 0, halfW);

	const yTop = -armLen;
	const yBottom = armLen;

	let d = '';
	// Start at top-right cap point
	d += `M ${halfW} ${yTop}`;
	// Top semicircle to top-left
	d += ` A ${r} ${r} 0 0 1 ${-halfW} ${yTop}`;
	// Left side down to bottom-left
	d += ` V ${yBottom}`;
	// Bottom semicircle to bottom-right
	d += ` A ${r} ${r} 0 0 1 ${halfW} ${yBottom}`;
	// Right side up to start
	d += ` V ${yTop}`;
	// Close
	d += ' Z';
	return d;
} 