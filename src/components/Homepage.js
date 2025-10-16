import React, { useEffect, useState } from 'react';
import CRTMonitor from './CRTMonitor';

const Homepage = () => {
  const [isMuted, setIsMuted] = useState(false);

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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    window.isAudioMuted = !isMuted;
  };

  // Project data matching the exact layout from your image
  const projects = [
    {
      name: 'Nami',
      image: '/projects/nami.png',
      href: 'https://drive.google.com/file/d/1UVI7kN4oDeVfGonKaQKw52GDW6Gw6OdS/view?usp=share_link'
    },
    {
      name: 'गली LABS',
      image: '/projects/gullylabs.png',
      href: 'https://www.figma.com/design/your-gully-project'
    },
    {
      name: 'BLUORNƏ',
      image: '/projects/bluorng.png',
      href: 'https://www.figma.com/design/your-bluorn-project'
    },
    {
      name: 'Cards',
      image: '/projects/cards.png',
      href: 'https://www.figma.com/design/your-cards-project'
    }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-8 relative">
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
      <div className="flex flex-col items-center gap-20 max-w-5xl pb-20">
        {/* Top row: 3 monitors */}
        <div className="flex gap-16">
          <CRTMonitor project={projects[0]} index={0} />
          <CRTMonitor project={projects[1]} index={1} />
          <CRTMonitor project={projects[2]} index={2} />
        </div>
        
        {/* Bottom row: 1 monitor aligned with first */}
        <div className="flex gap-16">
          <CRTMonitor project={projects[3]} index={3} />
          <div className="w-72"></div> {/* Spacer to match layout */}
          <div className="w-72"></div> {/* Spacer to match layout */}
        </div>
      </div>

    </div>
  );
};

export default Homepage;
