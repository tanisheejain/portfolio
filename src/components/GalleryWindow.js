import React, { useState, useRef } from 'react';
import { galleryItems } from '../data/gallery';

const GalleryWindow = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 200, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showFlash, setShowFlash] = useState(false);
  const windowRef = useRef(null);

  const playTickSound = async () => {
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
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
      // Audio not available
    }
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

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('window-header')) {
      setIsDragging(true);
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep window within viewport bounds
      const maxX = window.innerWidth - 800; // window width
      const maxY = window.innerHeight - 600; // window height
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleGalleryItemClick = async (item) => {
    // Play click sound and show flash animation
    await playClickSound();
    setShowFlash(true);
    
    // Hide flash after animation and open image
    setTimeout(() => {
      setShowFlash(false);
      if (item.href) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        // Open the image directly
        window.open(item.image, '_blank', 'noopener,noreferrer');
      }
    }, 300);
  };

  return (
    <>
      {/* Flash overlay */}
      {showFlash && (
        <div className="fixed inset-0 bg-white animate-white-overlay pointer-events-none z-50"></div>
      )}
      
      <div
        ref={windowRef}
        className="fixed bg-black border-2 border-white z-50 select-none"
        style={{
          left: position.x,
          top: position.y,
          width: '800px',
          height: '600px'
        }}
      >
        {/* Window Header */}
        <div
          className="window-header bg-white text-black px-2 py-1 flex justify-between items-center cursor-move"
          onMouseDown={handleMouseDown}
        >
          <span className="text-xs font-mono">Gallery</span>
          <div className="flex gap-1">
            <button
              className="w-3 h-3 bg-black border border-white text-white text-xs font-mono hover:bg-gray-800"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="p-4 h-full overflow-y-auto bg-black text-white">
          {/* Header Content */}
          <div className="mb-6">
            <h1 className="text-2xl font-mono mb-4 tracking-wider">Gallery</h1>
            <p className="text-sm font-mono leading-relaxed">
              This is a placeholder text block that will be replaced later. 
              It contains multiple lines of text to demonstrate the layout 
              and spacing of the gallery window content area.
            </p>
          </div>

          {/* Gallery Items List */}
          <div className="space-y-0">
            {galleryItems.map((item, index) => (
              <GalleryItem
                key={item.slug}
                item={item}
                onClick={() => handleGalleryItemClick(item)}
                onHover={playTickSound}
                isLast={index === galleryItems.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const GalleryItem = ({ item, onClick, onHover, isLast }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="w-full">
      {/* Gallery Item Row */}
      <div
        className="h-24 px-4 flex items-center justify-between cursor-pointer transition-all duration-200"
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          filter: isHovered ? 'invert(1)' : 'none'
        }}
      >
        {/* Title Area */}
        <div className="flex-1 pr-4">
          <h3 className="text-sm font-mono text-white overflow-hidden text-ellipsis whitespace-nowrap">
            {item.title}
          </h3>
        </div>

        {/* Thumbnail Area */}
        <div className="w-40 h-20 border border-white overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              // Try different file extensions
              const basePath = item.image.replace(/\.[^/.]+$/, '');
              const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
              
              let currentIndex = 0;
              const tryNextExtension = () => {
                if (currentIndex < extensions.length) {
                  e.target.src = basePath + extensions[currentIndex];
                  currentIndex++;
                } else {
                  // If all attempts fail, hide the image
                  e.target.style.display = 'none';
                }
              };
              
              // Start trying alternative extensions
              tryNextExtension();
            }}
          />
          
          {/* Static Overlay on Hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Divider Line */}
      {!isLast && (
        <div className="w-full h-px bg-white"></div>
      )}
    </div>
  );
};

export default GalleryWindow;
