"use client";

import { useEffect, useMemo, useRef } from 'react';
import { useControls, button } from 'leva';
import Image from 'next/image';
import gsap from 'gsap';

export default function LogoChromo01() {
	// Render parameters
	const WIDTH_UNITS = 6; // from provided SVG
	const VIEW_HEIGHT_PX = 670; // overall visible height
	const SCALE = 20; // 6 units -> 120px width, so ~20px per unit
	const RADIUS_UNITS = 2.95;
	
	const OVERLAP_PX = 30; // fixed requested overlap
	// Per-shape incremental offset in px (screen-space). Adjust as needed.
	const STEP_OFFSET_X_PX = 0;
	const STEP_OFFSET_Y_PX = 0;
	// Per-shape top-height step (px). Each subsequent shape adds i * TOP_HEIGHT_STEP_PX to the base topHeightPx
	const TOP_HEIGHT_STEP_PX = 0;

	// Total rect height if there were no overlap: two 18.9u rects => 18.9u*2 * SCALE
	// We will keep total visual height at VIEW_HEIGHT_PX and always overlap by OVERLAP_PX.
	const totalRectHeightPx = useMemo(() => VIEW_HEIGHT_PX + OVERLAP_PX, []);

	// Leva controls
	const { startTopHeight, finalCount, hasBackground, strokeWidth } = useControls('Chromosome Animation', {
		startTopHeight: { value: 195, min: 120, max: 400, step: 1, label: 'Start Top Height' },
		finalCount: { value: 8, min: 1, max: 16, step: 1, label: 'Final Count' },
		hasBackground: { value: false, label: 'Background' },
		strokeWidth: { value: 3.5, min: 0.5, max: 8, step: 0.5, label: 'Stroke Width' },
		'Replay Animation': button(() => runAnimation())
	});



	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Simple function to force correct colors based on background
	const applyColors = () => {
		if (!containerRef.current) return;
		
		const container = containerRef.current;
		
		for (let i = 0; i < finalCount; i++) {
			const colorMatrix = container.querySelector(`#union-outline-filter-${i} feColorMatrix`);
			
			if (colorMatrix) {
				if (hasBackground) {
					// Gradient background = WHITE chromosomes
					colorMatrix.setAttribute('values', '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0');
				} else {
					// White background = RAINBOW chromosomes
					const colors = [
						'0 0 0 0 1  0 0 0 0 0.85  0 0 0 0 0  0 0 0 1 0', // Yellow (#FFDA00)
						'0 0 0 0 1  0 0 0 0 0.31  0 0 0 0 0  0 0 0 1 0', // Orange (#FF4E00)
						'0 0 0 0 1  0 0 0 0 0  0 0 0 0 0.41  0 0 0 1 0', // Pink (#FF0068)
						'0 0 0 0 0.85  0 0 0 0 0  0 0 0 0 1  0 0 0 1 0', // Purple (#D900FF)
						'0 0 0 0 0  0 0 0 0 0.12  0 0 0 0 1  0 0 0 1 0', // Blue (#001FFF)
						'0 0 0 0 0  0 0 0 0 0.6  0 0 0 0 1  0 0 0 1 0', // Light blue (#0098FF)
						'0 0 0 0 0  0 0 0 0 1  0 0 0 0 0.52  0 0 0 1 0', // Green (#00FF85)
						'0 0 0 0 0.13  0 0 0 0 1  0 0 0 0 0  0 0 0 1 0', // Bright green (#20FF00)
						'0 0 0 0 0.81  0 0 0 0 1  0 0 0 0 0  0 0 0 1 0'  // Yellow-green (#CEFF00)
					];
					const colorIndex = i % colors.length;
					colorMatrix.setAttribute('values', colors[colorIndex]);
				}
			}
		}
	};

	// Constrain the slider so neither rectangle is shorter than the width
	// This ensures each rectangle can always form a perfect semicircle at minimum
	const widthPx = WIDTH_UNITS * SCALE; // 120px
	const minRectHeight = widthPx; // Minimum height = width for perfect pill shape
	const maxTopHeight = totalRectHeightPx - OVERLAP_PX - minRectHeight; // Leave room for bottom rect
	const minTopHeight = minRectHeight; // Top rect must be at least as tall as wide

	const runAnimation = () => {
		if (!containerRef.current) return;

		// EXPLICIT CHECK: If gradient background is on, FORCE WHITE
		if (hasBackground) {
			console.log("GRADIENT BACKGROUND IS ON - FORCING WHITE");
			// Force white immediately when gradient background is on
			const container = containerRef.current;
			for (let i = 0; i < finalCount; i++) {
				const colorMatrix = container.querySelector(`#union-outline-filter-${i} feColorMatrix`);
				if (colorMatrix) {
					colorMatrix.setAttribute('values', '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0');
				}
			}
		} else {
			console.log("WHITE BACKGROUND IS ON - FORCING COLORS");
		}

		// Kill any existing timeline
		if (timelineRef.current) {
			timelineRef.current.kill();
		}

		const container = containerRef.current;
		const shapes = container.querySelectorAll('.chromosome-shape');

		// Reset all shapes
		gsap.set(shapes, { 
			opacity: 0,
			rotation: 0,
			transformOrigin: '50% 50%'
		});

		// DON'T call applyColors() here - it would overwrite our explicit check above

		const tl = gsap.timeline();
		timelineRef.current = tl;

		// Animate all shapes with smoother sequential rotation
		for (let i = 0; i < finalCount; i++) {
			const finalAngle = (180 / finalCount) * i; // Final position in fan
			const startAngle = i === 0 ? 0 : (180 / finalCount) * (i - 1); // Start from previous position
			const delay = i * 0.15; // Stagger each new shape

			// Set initial rotation for this shape
			gsap.set(shapes[i], { rotation: startAngle });

			tl.to(shapes[i], {
				opacity: 1,
				rotation: finalAngle,
				duration: 0.6,
				ease: 'power2.out'
			}, delay);
		}

		// Calculate when the last chromosome finishes rotating
		const lastChromosomeDelay = (finalCount - 1) * 0.15;
		const totalRotationDuration = lastChromosomeDelay + 0.6; // delay + rotation duration

		// Animate top height to finish at the same time as rotation animation
		tl.to({}, {
			duration: totalRotationDuration,
			onUpdate: function() {
				const progress = this.progress();
				const currentTopHeight = startTopHeight + (295 - startTopHeight) * progress;
				const clampedTop = Math.max(minTopHeight, Math.min(maxTopHeight, currentTopHeight));
				const bottomHeight = Math.max(0, totalRectHeightPx - OVERLAP_PX - clampedTop);

				// Update all visible shapes
				for (let i = 0; i < finalCount; i++) {
					const topRect = container.querySelector(`.top-rect-${i}`);
					const bottomRect = container.querySelector(`.bottom-rect-${i}`);
					if (topRect && bottomRect) {
						(topRect as SVGRectElement).setAttribute('height', String(clampedTop - strokeWidth * 2));
						(bottomRect as SVGRectElement).setAttribute('height', String(bottomHeight - strokeWidth * 2));
						(bottomRect as SVGRectElement).setAttribute('y', String(clampedTop - OVERLAP_PX - strokeWidth * 2));
					}
				}
			}
		}, 0); // Start at the same time as the rotation animation

		// Colors are already set by explicit check above - don't override them during animation
	};

	useEffect(() => {
		// Run animation on mount and when controls change
		const timer = setTimeout(runAnimation, 100);
		return () => {
			clearTimeout(timer);
			if (timelineRef.current) {
				timelineRef.current.kill();
			}
		};
	}, [finalCount, startTopHeight, strokeWidth, runAnimation]);

	// Update colors when background mode changes
	useEffect(() => {
		// Small delay to ensure DOM is ready
		const timer = setTimeout(() => {
			applyColors();
		}, 50);
		
		return () => clearTimeout(timer);
	}, [hasBackground, finalCount, applyColors]);
	

	

	// Convert px back to SVG units for rect attributes
	const rxUnits = RADIUS_UNITS; // in units
	const rxPx = rxUnits * SCALE; // corner radius in px
	const strokePx = strokeWidth; // dynamic stroke width from controls

	return (
		<main className={`relative min-h-screen w-full ${hasBackground ? '' : 'bg-white'} flex items-center justify-center`}>
			{/* Background image (conditional) */}
			{hasBackground && (
				<Image
					src="/Hero.png"
					alt="Background"
					fill
					priority
					className="object-cover"
				/>
			)}

			{/* Container for chromosome shapes */}
			<div 
				ref={containerRef}
				style={{ 
					position: 'relative', 
					width: VIEW_HEIGHT_PX, 
					height: VIEW_HEIGHT_PX,
					transform: 'scale(0.7)',
					transformOrigin: 'center center',
					zIndex: 10
				}}
			>
				{Array.from({ length: 16 }).map((_, i) => {
					const filterId = `union-outline-filter-${i}`;
					// Use startTopHeight for initial render
					const localTop = Math.max(minTopHeight, Math.min(maxTopHeight, startTopHeight + i * TOP_HEIGHT_STEP_PX));
					const localBottom = Math.max(0, totalRectHeightPx - OVERLAP_PX - localTop);
					return (
						<div 
							key={i} 
							className="chromosome-shape"
							style={{ 
								position: 'absolute', 
								top: '50%', 
								left: '50%', 
								transform: `translate(-50%, -50%) translate(${i * STEP_OFFSET_X_PX}px, ${i * STEP_OFFSET_Y_PX}px)`,
								opacity: 0
							}}
						>
							<svg
								width={widthPx}
								height={VIEW_HEIGHT_PX}
								viewBox={`0 0 ${widthPx} 645`}
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-label="Chromosome shape"
								style={{ 
									position: 'relative',
									transformOrigin: '50% 50%',
									transformBox: 'view-box'
								}}
							>
								<defs>
									<filter id={filterId} x={-strokePx * 2} y={-strokePx * 2} width={widthPx + strokePx * 4} height={VIEW_HEIGHT_PX + strokePx * 4} filterUnits="userSpaceOnUse">
										<feGaussianBlur in="SourceAlpha" stdDeviation="0.5" result="smoothed-alpha" />
										<feMorphology in="smoothed-alpha" operator="dilate" radius={strokePx} result="dilated" />
										<feMorphology in="smoothed-alpha" operator="dilate" radius={strokePx * 0.3} result="inner-dilated" />
										<feComposite in="dilated" in2="inner-dilated" operator="out" result="border-ring" />
										<feGaussianBlur in="border-ring" stdDeviation="0.3" result="smooth-border" />
										<feColorMatrix in="smooth-border" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" result="white-border" />
										<feMerge>
											<feMergeNode in="white-border" />
										</feMerge>
									</filter>
								</defs>

								<g filter={`url(#${filterId})`} transform={`translate(${strokePx * 2}, ${strokePx * 2})`}>
									<rect 
										className={`top-rect top-rect-${i}`}
										x={0} 
										y={0} 
										width={widthPx - strokePx * 4} 
										height={localTop - strokePx * 2} 
										rx={rxPx} 
										fill="white" 
									/>
									<rect 
										className={`bottom-rect bottom-rect-${i}`}
										x={0} 
										y={localTop - OVERLAP_PX - strokePx * 2} 
										width={widthPx - strokePx * 4} 
										height={localBottom - strokePx * 2} 
										rx={rxPx} 
										fill="white" 
									/>
								</g>
							</svg>
						</div>
					);
				})}
			</div>
		</main>
	);
}
