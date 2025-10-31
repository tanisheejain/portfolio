import React, { useEffect, useState } from 'react';
import CRTMonitor from './CRTMonitor';

const Homepage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [sparks, setSparks] = useState([]);
  const leftColRef = React.useRef(null);
  const leftColRef2 = React.useRef(null);
  const rightColRef = React.useRef(null);
  const rightColRef2 = React.useRef(null);
  const lastScanRef = React.useRef(0);

  // Initialize audio context immediately
  useEffect(() => {
    const initAudio = () => {
      try {
        // Create a global audio context
        if (!window.globalAudioContext) {
          window.globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Set global mute state
        window.isAudioMuted = isMuted;
      } catch (e) {
        console.log('Audio context initialization failed:', e);
      }
    };

    initAudio();
  }, [isMuted]);

  // Cursor spark effect
  useEffect(() => {
    const sparkChars = ['*', '+', '.', 'x'];
    let sparkIdCounter = 0;

    const handleMouseMove = (e) => {
      const randomChar = sparkChars[Math.floor(Math.random() * sparkChars.length)];
      const size = Math.random() * 3 + 14; // 14-17px (increased by 6px)
      
      const newSpark = {
        id: sparkIdCounter++,
        x: e.clientX,
        y: e.clientY,
        char: randomChar,
        size: size
      };

      setSparks(prev => [...prev, newSpark]);

      // Remove spark after 200ms
      setTimeout(() => {
        setSparks(prev => prev.filter(spark => spark.id !== newSpark.id));
      }, 200);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Dispatch a CustomEvent on each pixel column loop reset
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-loop]');
    const emit = () => {
      window.dispatchEvent(new CustomEvent('pixelLoopReset'));
    };
    nodes.forEach((n) => n.addEventListener('animationiteration', emit));
    return () => nodes.forEach((n) => n.removeEventListener('animationiteration', emit));
  }, []);

  // Listen for loop resets and show a transient CRT scanline
  useEffect(() => {
    const handler = () => {
      const now = Date.now();
      if (now - lastScanRef.current < 150) return; // debounce
      lastScanRef.current = now;

      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return; // skip sweep for reduced motion

      const line = document.createElement('div');
      line.className = 'scanline';
      document.body.appendChild(line);
      // remove after animation completes (~400ms)
      setTimeout(() => {
        if (line && line.parentNode) line.parentNode.removeChild(line);
      }, 420);
    };
    window.addEventListener('pixelLoopReset', handler);
    return () => window.removeEventListener('pixelLoopReset', handler);
  }, []);

  // Minimal pixel columns with idle animation and proximity burst
  useEffect(() => {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // disable bursts completely

    let lastBurstLeft = 0;
    let lastBurstLeft2 = 0;
    let lastBurstRight = 0;
    let lastBurstRight2 = 0;
    const BURST_THROTTLE_MS = 200;
    const NEAR_PX = 120;

    const handleMouseMove = (e) => {
      const now = Date.now();
      const triggerBurst = (colRef, lastBurstTime, setLast) => {
        if (!colRef.current) return;
        const colRect = colRef.current.getBoundingClientRect();
        const colX = colRect.left + colRect.width / 2;
        if (Math.abs(e.clientX - colX) > NEAR_PX) return;
        if (now - lastBurstTime < BURST_THROTTLE_MS) return;
        setLast(now);

        const children = Array.from(colRef.current.querySelectorAll('[data-pixel]'));
        children.forEach((el) => {
          const r = el.getBoundingClientRect();
          const dy = Math.abs(e.clientY - (r.top + r.height / 2));
          if (dy <= NEAR_PX) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 10 + Math.random() * 30; // 10–40px
            const tx = Math.cos(angle) * radius;
            const ty = Math.sin(angle) * radius;
            el.style.transition = 'transform 160ms ease-out';
            el.style.transform = `translate(${tx}px, ${ty}px)`;
            setTimeout(() => {
              el.style.transition = 'transform 240ms ease-out';
              el.style.transform = 'translate(0, 0)';
            }, 160);
          }
        });
      };

      triggerBurst(leftColRef, lastBurstLeft, (t) => (lastBurstLeft = t));
      triggerBurst(leftColRef2, lastBurstLeft2, (t) => (lastBurstLeft2 = t));
      triggerBurst(rightColRef, lastBurstRight, (t) => (lastBurstRight = t));
      triggerBurst(rightColRef2, lastBurstRight2, (t) => (lastBurstRight2 = t));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    window.isAudioMuted = !isMuted;
  };

  // Project data matching the exact layout from your image
  const projects = [
    {
      name: 'Nami',
      image: '/projects/nami.png',
      href: 'https://drive.google.com/file/d/1OfFdkyL598RZnXJd7d7WdBBuhqaQH8uW/view?usp=share_link'
    },
    {
      name: 'गली LABS',
      image: '/projects/gullylabs.png',
      href: 'https://drive.google.com/file/d/1UU7onNkfFHz3WFS3BqGKKf9VKAcUU0Ym/view?usp=share_link'
    },
    {
      name: 'BLUORNƏ',
      image: '/projects/bluorng.png',
      href: 'https://drive.google.com/file/d/1rSkYDEcMEOAsUMcI1iElDaSH7UEVFZVx/view?usp=share_link'
    },
    {
      name: 'Cards',
      image: '/projects/cards.png',
      href: 'https://drive.google.com/file/d/1LoyeYvTR-FTLZtcsdov0gsF5pOuWwAhF/view?usp=share_link'
    },
    {
      name: 'Camii',
      image: '/photos/camii.png',
      href: 'https://drive.google.com/file/d/1vuebbAjrn70wz0O33bk_pNFg00xLMoBK/view?usp=share_link'
    }
  ];

  const renderPixelColumn = (ref, direction, offsetPx = 0, startAtEdge = 'auto') => {
    const COUNT = 16; // 12–20
    const SIZE = 6;
    const GAP = 8;
    const loopDistance = (SIZE + GAP) * COUNT;
    const stack = (keyPrefix) => (
      <div key={keyPrefix} style={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
        {Array.from({ length: COUNT }).map((_, i) => (
          <div key={`${keyPrefix}-${i}`} data-pixel style={{ width: `${SIZE}px`, height: `${SIZE}px`, background: '#fff' }} />
        ))}
      </div>
    );

    // Wrapper positioning (fixed, edge-aligned)
    const baseStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: direction === 'left' ? 12 + offsetPx : 'auto',
      right: direction === 'right' ? 12 + offsetPx : 'auto',
      display: 'flex',
      alignItems: 'flex-start',
      pointerEvents: 'none',
      zIndex: 40
    };

    // For LEFT: marquee loop by duplicating stacks inside an animated wrapper
    if (direction === 'left') {
      return (
        <div ref={ref} style={baseStyle}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${GAP}px`,
              animation: `colDown 12s linear infinite`,
              '--loop-distance': `${loopDistance}px`
            }}
          >
            {stack('L1')}
            {stack('L2')}
          </div>
        </div>
      );
    }

    // RIGHT: marquee loop upward using duplicated stacks; start hugging bottom
    return (
      <div ref={ref} style={{ ...baseStyle, alignItems: 'flex-end' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${GAP}px`,
            animation: `colUp 12s linear infinite`,
            '--loop-distance': `${loopDistance}px`
          }}
        >
          {stack('R1')}
          {stack('R2')}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black flex flex-col items-center p-8 relative" style={{ minHeight: '100vh' }}>
      {/* Minimal animated pixel columns (homepage only) */}
      {renderPixelColumn(leftColRef, 'left', 0, 'top')}
      {renderPixelColumn(leftColRef2, 'left', 16, 'top')}
      {renderPixelColumn(rightColRef, 'right', 0, 'bottom')}
      {renderPixelColumn(rightColRef2, 'right', 16, 'bottom')}

      {/* Mute Toggle Button */}
      <button
        onClick={toggleMute}
        className="absolute top-8 right-8 text-white font-mono text-xs cursor-pointer hover:text-gray-400 transition-colors"
      >
        {isMuted ? '🔇 UNMUTE' : '🔊 MUTE'}
      </button>

      {/* Header */}
      <div className="text-center mb-16 mt-8">
        <h1 className="text-4xl mb-4 tracking-wider text-white font-mono">
          PROJECTS
        </h1>
      </div>

      {/* Custom Layout matching the second image exactly */}
      <div className="flex flex-col items-center gap-12 max-w-5xl pb-40 mb-20">
        {/* Top row: 3 monitors */}
        <div className="flex gap-16">
          <CRTMonitor project={projects[0]} index={0} />
          <CRTMonitor project={projects[1]} index={1} />
          <CRTMonitor project={projects[2]} index={2} />
        </div>
        
        {/* Bottom row: 2 monitors aligned with first */}
        <div className="flex gap-16">
          <CRTMonitor project={projects[3]} index={3} />
          <CRTMonitor project={projects[4]} index={4} />
          <div className="w-72"></div> {/* Spacer to match layout */}
        </div>
      </div>

      {/* Cursor spark effect */}
      {sparks.map(spark => (
        <div
          key={spark.id}
          style={{
            position: 'fixed',
            left: spark.x,
            top: spark.y,
            fontSize: `${spark.size}px`,
            color: '#ffffff99',
            pointerEvents: 'none',
            fontFamily: 'monospace',
            userSelect: 'none',
            transform: 'translate(-50%, -50%)',
            opacity: 1,
            animation: 'sparkFade 200ms ease-out forwards',
            zIndex: 9999
          }}
        >
          {spark.char}
        </div>
      ))}

      <style>{`
        @keyframes sparkFade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes colDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(var(--loop-distance)); }
        }
        @keyframes colUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(var(--loop-distance) * -1)); }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*='animation: colDown'], [style*='animation: colUp'] {
            animation-duration: 24s !important;
          }
        }

        .scanline {
          position: fixed;
          left: 0;
          width: 100%;
          height: 2px;
          background: #ffffff1f;
          pointer-events: none;
          z-index: 39; /* below window layer, above background */
          animation: crtSweep 360ms ease-out forwards;
        }
        @keyframes crtSweep {
          0% { top: -2px; opacity: 0; }
          10% { opacity: .15; }
          100% { top: 100vh; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Homepage;
