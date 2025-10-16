import React, { useState } from 'react';

const CRTMonitor = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);


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

  const playClickSound = () => {
    try {
      const audio = new Audio('/sounds/click.wav');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Click sound not available:', e));
    } catch (e) {
      console.log('Click sound not available:', e);
    }
  };

  const playStartupHum = () => {
    try {
      const audio = new Audio('/sounds/startup_hum.wav');
      audio.volume = 0.2;
      audio.play().catch(e => console.log('Startup hum not available:', e));
    } catch (e) {
      console.log('Startup hum not available:', e);
    }
  };

  const handleClick = () => {
    // 1. Immediately open a blank new tab (to avoid pop-up blockers)
    const newTab = window.open('', '_blank');
    
    // 2. Set states for animation
    setIsClicked(true);
    setShowText(true);
    
    // 3. Play click sound immediately
    playClickSound();
    
    // 4. After typewriter text finishes (~2s), show white overlay and play startup hum
    setTimeout(() => {
      setShowOverlay(true);
      playStartupHum();
      
      // 5. After overlay animation completes (~0.4s), navigate to project href
      setTimeout(() => {
        if (newTab) {
          newTab.location.href = project.href;
        }
        
        // Reset states after navigation
        setTimeout(() => {
          setShowOverlay(false);
          setShowText(false);
          setIsClicked(false);
        }, 100);
      }, 400); // 0.4s for overlay animation
    }, 2000); // 2s for typewriter text
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playStaticSound();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowText(false);
    setIsClicked(false);
    setShowOverlay(false);
  };

  return (
    <div className="relative group">
      {/* Just the image without any monitor frame */}
      <div 
        className="w-56 h-56 cursor-pointer transition-all duration-300 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Project Image */}
        <div 
          className={`
            w-full h-full transition-opacity duration-300
            ${isHovered ? 'opacity-0' : 'opacity-100'}
          `}
        >
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
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
            src="/projects/static.png"
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

        {/* White Overlay for Screen Brightening */}
        {showOverlay && (
          <div className="absolute inset-0 bg-white bg-opacity-20 animate-white-overlay"></div>
        )}
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
