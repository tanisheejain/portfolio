import React, { useState } from 'react';

const CRTMonitor = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showText, setShowText] = useState(false);

  // Different monitor frame styles for variety
  const frameStyles = [
    'border-4 border-white', // Classic thick border
    'border-2 border-white bg-black', // Thin border with black background
    'border-4 border-white bg-black', // Thick border with black background
  ];

  const playStaticSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.log('Audio not available:', e);
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setShowText(true);
    
    // Typewriter effect delay
    setTimeout(() => {
      window.open(project.figmaLink, '_blank');
    }, 2000);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playStaticSound();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowText(false);
    setIsClicked(false);
  };

  return (
    <div className="relative group">
      {/* Monitor Frame */}
      <div 
        className={`
          w-32 h-32 cursor-pointer transition-all duration-300
          ${frameStyles[index % frameStyles.length]}
          ${isHovered ? 'animate-crt-flicker' : ''}
          ${isClicked ? 'animate-crt-brightness' : ''}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Screen Content */}
        <div className="w-full h-full relative overflow-hidden bg-black">
          {/* Project Image */}
          <div 
            className={`
              absolute inset-0 transition-opacity duration-300
              ${isHovered ? 'opacity-0' : 'opacity-100'}
            `}
          >
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-cover filter invert"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Static Noise Overlay */}
          <div 
            className={`
              absolute inset-0 transition-opacity duration-300
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <img
              src="/static.svg"
              alt="static"
              className="w-full h-full object-cover opacity-50"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Typewriter Text */}
          {showText && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
              <div className="text-white text-xs font-mono text-center p-2">
                <div className="animate-typewriter">
                  Opening "{project.name}"...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Monitor Stand */}
        <div className="w-16 h-2 bg-white mx-auto mt-1"></div>
        <div className="w-20 h-1 bg-white mx-auto"></div>
      </div>

      {/* Project Label */}
      <div className="text-center mt-2">
        <p className="text-white text-xs font-mono tracking-wider">
          {project.name}
        </p>
      </div>
    </div>
  );
};

export default CRTMonitor;
