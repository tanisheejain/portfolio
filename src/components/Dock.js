import React, { useState } from 'react';
import PixelIcon from './PixelIcon';

const Dock = () => {
  const [clickedIcon, setClickedIcon] = useState(null);

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

  const handleIconClick = (iconType) => {
    setClickedIcon(iconType);
    playSound('click');
    
    // Reset animation after completion
    setTimeout(() => {
      setClickedIcon(null);
    }, 100);
    
    // Play boot sound after click
    setTimeout(() => {
      playSound('boot');
    }, 50);
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
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t-2 border-white">
      <div className="flex justify-center items-center py-4 px-4">
        <div className="flex space-x-2 bg-gray-900 p-3 rounded-lg border-2 border-white">
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
