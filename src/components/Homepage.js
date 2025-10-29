import React, { useEffect, useState } from 'react';
import CRTMonitor from './CRTMonitor';

const Homepage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [sparks, setSparks] = useState([]);

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

  return (
    <div className="bg-black flex flex-col items-center p-8 relative" style={{ minHeight: '100vh' }}>
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
      `}</style>
    </div>
  );
};

export default Homepage;
