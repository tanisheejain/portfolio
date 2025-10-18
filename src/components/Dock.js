import React, { useState } from 'react';
import PixelIcon from './PixelIcon';

const Dock = ({ onNotionClick, onGalleryClick }) => {
  const [clickedIcon, setClickedIcon] = useState(null);
  const [showFlash, setShowFlash] = useState(false);

  const playSound = (soundType) => {
    // Create audio context for retro sounds
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    let frequency, duration, type;
    
    switch (soundType) {
      case 'hover':
        frequency = 800;
        duration = 0.1;
        type = 'sine';
        break;
      case 'click':
        frequency = 1000;
        duration = 0.15;
        type = 'square';
        break;
      case 'boot':
        frequency = 600;
        duration = 0.3;
        type = 'triangle';
        break;
      default:
        return;
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const playClickSound = async () => {
    if (window.isAudioMuted) return;
    try {
      let audioContext = window.globalAudioContext;
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        window.globalAudioContext = audioContext;
      }
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Load and play click.wav
      const audio = new Audio('/sounds/click.wav');
      audio.volume = 0.5;
      await audio.play();
    } catch (e) {
      console.log('Audio not available:', e);
    }
  };

  const handleIconClick = (iconType) => {
    setClickedIcon(iconType);
    playSound('click');
    
    // Handle specific icon actions
    if (iconType === 'notion' && onNotionClick) {
      onNotionClick();
    } else if (iconType === 'gallery' && onGalleryClick) {
      onGalleryClick();
    } else if (iconType === 'twitter') {
      // Play click sound and show flash animation for Twitter
      playClickSound();
      setShowFlash(true);
      
      // Hide flash after animation and open Twitter link
      setTimeout(() => {
        setShowFlash(false);
        window.open('https://x.com/TanisheeJain', '_blank', 'noopener,noreferrer');
      }, 300);
    } else if (iconType === 'linkedin') {
      // Play click sound and show flash animation for LinkedIn
      playClickSound();
      setShowFlash(true);
      
      // Hide flash after animation and open LinkedIn link
      setTimeout(() => {
        setShowFlash(false);
        window.open('https://www.linkedin.com/in/tanishee-jain-50b79a220/', '_blank', 'noopener,noreferrer');
      }, 300);
    }
    
    // Reset animation after completion
    setTimeout(() => {
      setClickedIcon(null);
    }, 100);
    
    // Play boot sound after click (except for Twitter and LinkedIn)
    if (iconType !== 'twitter' && iconType !== 'linkedin') {
      setTimeout(() => {
        playSound('boot');
      }, 50);
    }
  };

  const handleIconHover = () => {
    playSound('hover');
  };

  const icons = [
    { type: 'home', label: 'Home' },
    { type: 'profile', label: 'Profile' },
    { type: 'notion', label: 'Blogs' },
    { type: 'midjourney', label: 'Midjourney' },
    { type: 'gallery', label: 'Gallery' },
    { type: 'settings', label: 'Settings' },
    { type: 'twitter', label: 'Twitter' },
    { type: 'linkedin', label: 'LinkedIn' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black">
      {/* Flash overlay */}
      {showFlash && (
        <div className="fixed inset-0 bg-white animate-white-overlay pointer-events-none z-50"></div>
      )}
      
      <div className="flex justify-center items-center py-4 px-4">
        <div className="flex space-x-2 bg-black p-3 rounded-lg border-2 border-white">
          {icons.map((icon) => (
            <div key={icon.type} className="relative group">
              <PixelIcon
                type={icon.type}
                onClick={() => handleIconClick(icon.type)}
                onMouseEnter={handleIconHover}
                className={`transition-all duration-100 ${
                  clickedIcon === icon.type ? 'animate-pixel-bounce' : ''
                }`}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {icon.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dock;
