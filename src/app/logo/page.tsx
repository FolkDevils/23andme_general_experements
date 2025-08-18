'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useControls, button } from 'leva';

export default function LogoPage() {
  const groupRef = useRef<SVGGElement>(null);
  const redRef = useRef<SVGPathElement>(null);      // #FF4E00
  const greenRef = useRef<SVGPathElement>(null);    // #00FF85
  const otherRefs = useRef<SVGPathElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Leva controls
  	const { hasBackground, strokeWidth } = useControls('Original Logo', {
    hasBackground: { value: false, label: 'Background' },
    strokeWidth: { value: 2, min: 0.5, max: 8, step: 0.5, label: 'Stroke Width' },
    'Replay Animation': button(() => runAnimation())
  });
  
  // Logo color is tied to background: background = white logo, no background = multicolor logo
  const isWhiteMode = hasBackground;

  const runAnimation = () => {
    if (!groupRef.current || !redRef.current || !greenRef.current) return;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const red = redRef.current;
    const green = greenRef.current;
    const others = otherRefs.current.filter(Boolean);

    // Prepare stroke-draw animation
    const prepStroke = (el: SVGPathElement) => {
      const len = el.getTotalLength();
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      el.style.opacity = '1';
    };

    prepStroke(red);
    prepStroke(green);
    others.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
      p.style.opacity = '0';
    });

    // Initial state: only red + green visible. Start at final orientation (no rotation)
    gsap.set(groupRef.current, {
      rotate: 10,
      transformOrigin: '50% 50%'
    });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    timelineRef.current = tl;

    // 1) Draw the red + green mark first (no spin here)
    tl.to([red, green], { strokeDashoffset: 0, duration: 2, stagger: 0.06 });

    // Optional tiny pause to taste
    const postMarkDelay = 0.15;
    tl.to({}, { duration: postMarkDelay });

    // 2) Reveal remaining paths while the group rotates (concurrently)
    tl.add('reveal');
    tl.to(groupRef.current, { rotate: 180, duration: 2.6, ease: 'power2.out' }, 'reveal');
    tl.to(
      others,
      { opacity: 1, strokeDashoffset: 0, duration: 2.6, stagger: 0.06, ease: 'power2.out' },
      'reveal'
    );
  };

  useEffect(() => {
    runAnimation();
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Update colors when mode changes
  useEffect(() => {
    if (!redRef.current || !greenRef.current) return;

    // Update red and green refs to their specific colors
    redRef.current.setAttribute('stroke', isWhiteMode ? '#ffffff' : '#FF4E00');
    greenRef.current.setAttribute('stroke', isWhiteMode ? '#ffffff' : '#00FF85');

    // Update others with their specific colors
    const originalColors = ["#FFDA00", "#FF0068", "#D900FF", "#001FFF", "#0098FF", "#20FF00", "#CEFF00"];
    otherRefs.current.forEach((path, index) => {
      if (path && index < originalColors.length) {
        path.setAttribute('stroke', isWhiteMode ? '#ffffff' : originalColors[index]);
      }
    });
  }, [isWhiteMode]);

  return (
    <main className={`relative min-h-screen w-full ${hasBackground ? '' : 'bg-white'} flex items-center justify-center p-6`}>
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



      {/* Logo */}
      <div className="w-full max-w-[520px] overflow-visible relative z-10">
        <svg
          width="100%"
          height="100%"
          viewBox="-20 -20 282 284" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          <g ref={groupRef} style={{ transformBox: 'view-box', transformOrigin: '50% 50%' }}>
            <path d="M159.8 29.5012C161.92 17.4812 153.916 6.02272 141.923 3.90805C129.93 1.79339 118.49 9.82329 116.37 21.8434L82.4569 214.176C80.3374 226.196 88.3415 237.655 100.334 239.77C112.327 241.884 123.767 233.854 125.887 221.834L159.8 29.5012Z" stroke="#FFDA00" strokeWidth={strokeWidth} strokeMiterlimit="10" ref={(el) => { if (el) otherRefs.current.push(el); }} />
            <path ref={redRef} d="M189.017 48.2331C195.12 37.6629 191.518 24.1579 180.971 18.069C170.425 11.98 156.928 15.6128 150.825 26.1831L53.1755 195.318C47.0727 205.888 50.675 219.393 61.2214 225.482C71.7677 231.571 85.2645 227.938 91.3672 217.368L189.017 48.2331Z" stroke="#FF4E00" strokeWidth={strokeWidth} strokeMiterlimit="10" />
            <path d="M210.12 75.911C219.47 68.0655 220.704 54.143 212.877 44.8142C205.049 35.4854 191.123 34.2829 181.774 42.1285L32.1651 167.665C22.8151 175.51 21.5812 189.433 29.409 198.762C37.2367 208.091 51.1621 209.293 60.512 201.447L210.12 75.911Z" stroke="#FF0068" strokeWidth={strokeWidth} strokeMiterlimit="10" ref={(el) => { if (el) otherRefs.current.push(el); }} />
            <path d="M220.373 109.081C231.842 104.907 237.763 92.2458 233.598 80.8023C229.433 69.3588 216.759 63.4662 205.289 67.6407L21.7675 134.437C10.2981 138.612 4.37671 151.273 8.54179 162.716C12.7069 174.16 25.3812 180.052 36.8506 175.878L220.373 109.081Z" stroke="#D900FF" strokeWidth={strokeWidth} strokeMiterlimit="10" ref={(el) => { if (el) otherRefs.current.push(el); }} />
            <path d="M218.811 143.881C231.016 143.881 240.911 134.009 240.911 121.831C240.911 109.653 231.016 99.7812 218.811 99.7812L23.5107 99.7813C11.3052 99.7813 1.41061 109.653 1.41061 121.831C1.41061 134.009 11.3052 143.881 23.5107 143.881H218.811Z" stroke="#001FFF" strokeWidth={strokeWidth} strokeMiterlimit="10" ref={(el) => { if (el) otherRefs.current.push(el); }} />
            <path d="M205.331 175.885C216.8 180.059 229.475 174.167 233.64 162.723C237.805 151.28 231.883 138.619 220.414 134.444L36.892 67.6478C25.4226 63.4732 12.7483 69.3659 8.58318 80.8094C4.4181 92.2528 10.3395 104.914 21.8089 109.088L205.331 175.885Z" stroke="#0098FF" strokeWidth={strokeWidth} strokeMiterlimit="10" ref={(el) => { if (el) otherRefs.current.push(el); }} />
            <path ref={greenRef} d="M181.783 201.461C191.133 209.306 205.058 208.104 212.886 198.775C220.714 189.446 219.48 175.524 210.13 167.678L60.5215 42.1418C51.1716 34.2962 37.2462 35.4987 29.4184 44.8274C21.5906 54.1562 22.8246 68.0788 32.1746 75.9243L181.783 201.461Z" stroke="#00FF85" strokeWidth={strokeWidth} strokeMiterlimit="10" />
            <path d="M150.904 217.329C157.007 227.899 170.504 231.532 181.05 225.443C191.596 219.354 195.199 205.849 189.096 195.279L91.446 26.1441C85.3433 15.5738 71.8464 11.9409 61.3001 18.0299C50.7537 24.1188 47.1515 37.6238 53.2542 48.1941L150.904 217.329Z" stroke="#20FF00" strokeWidth={strokeWidth} strokeMiterlimit="10" ref={(el) => { if (el) otherRefs.current.push(el); }} />
            <path d="M116.421 221.755C118.54 233.775 129.981 241.805 141.973 239.69C153.966 237.576 161.97 226.117 159.851 214.097L125.937 21.7641C123.818 9.74407 112.378 1.71413 100.385 3.8288C88.3918 5.94346 80.3878 17.402 82.5073 29.422L116.421 221.755Z" stroke="#CEFF00" strokeWidth={strokeWidth} strokeMiterlimit="10" ref={(el) => { if (el) otherRefs.current.push(el); }} />
          </g>
        </svg>
      </div>
    </main>
  );
}
