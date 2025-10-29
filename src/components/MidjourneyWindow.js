import React, { useState, useRef } from 'react';
import { MJ_GROUPS } from '../data/midjourney';

const MidjourneyWindow = ({ onClose }) => {
  const [position, setPosition] = useState(() => {
    // Center the window on screen initially
    const windowWidth = 1000; // 800px * 1.25
    const windowHeight = 700; // increased by 100px
    return {
      x: (window.innerWidth - windowWidth) / 2,
      y: (window.innerHeight - windowHeight) / 2 - 40 // slightly more up
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const windowRef = useRef(null);

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
    // Do not initiate drag when clicking header buttons
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    // Disable dragging when maximized
    if (isMaximized) return;

    if (e.target.classList.contains('window-header') || e.target.closest('.window-header')) {
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
      const maxX = window.innerWidth - 1000; // window width (800px * 1.25)
      const maxY = window.innerHeight - 700; // updated window height
      
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

  const handleImageClick = () => {
    playClickSound();
  };

  const containerStyle = {
    left: isMaximized ? 0 : position.x,
    top: isMaximized ? 0 : position.y,
    width: isMaximized ? '100vw' : '1000px',
    height: isMaximized ? '100vh' : (isMinimized ? 'auto' : '700px')
  };

  return (
    <div
      ref={windowRef}
      className="fixed bg-black border-2 border-white z-50 select-none"
      style={containerStyle}
    >
      {/* Window Header */}
      <div
        className="window-header bg-white text-black px-2 py-1 flex justify-between items-center cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs font-mono">Midjourney</span>
        <div className="flex gap-1">
          <button
            className="w-3 h-3 bg-black border border-white text-white text-xs font-mono hover:bg-gray-800"
            title={isMinimized ? 'Restore' : 'Minimize'}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); if (isMaximized && !isMinimized) setIsMaximized(false); }}
          >
            _
          </button>
          <button
            className="w-3 h-3 bg-black border border-white text-white text-xs font-mono hover:bg-gray-800"
            title={isMaximized ? 'Restore' : 'Maximize'}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); if (isMinimized) setIsMinimized(false); }}
          >
            ☐
          </button>
          <button
            className="w-3 h-3 bg-black border border-white text-white text-xs font-mono hover:bg-gray-800"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-4 h-full overflow-y-auto bg-black text-white" style={{ display: isMinimized ? 'none' : 'block' }}>
        {/* Header Content */}
        <div className="mb-6">
          <h1 className="text-2xl font-mono mb-4 tracking-wider text-center">Midjourney</h1>
        </div>

        {/* Midjourney Groups */}
        <div className="space-y-8">
          {MJ_GROUPS.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              {/* Group Title */}
              <h2 className="text-lg font-mono mb-4">{group.title}</h2>
              
              {/* Images Grid - Max 3 columns */}
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: group.count }, (_, index) => (
                  <MidjourneyImage
                    key={index}
                    slug={group.slug}
                    index={index + 1}
                    onClick={handleImageClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MidjourneyImage = ({ slug, index, onClick }) => {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);

  const extensions = ['.mp4', '.jpg', '.png', '.jpeg', '.webp'];

  // Build candidate filenames in priority order
  const buildCandidates = React.useCallback(() => {
    // Preserve leading/trailing spaces in slug (trimmed in URL encoding but preserved in path construction)
    const trimmedSlug = slug.trim();
    const hasLeadingSpace = slug.startsWith(' ');
    const hasTrailingSpace = slug.endsWith(' ');
    
    const baseVariants = [
      `${slug} ${index}`,
      `${slug}${index}`,
      `${trimmedSlug} ${index}`,
      `${trimmedSlug}${index}`
    ];
    // Also try without index as a fallback when index is 1
    if (index === 1) {
      baseVariants.push(`${slug}`, trimmedSlug);
      if (hasLeadingSpace) {
        baseVariants.push(` ${trimmedSlug}`);
      }
    }

    const candidates = [];
    for (const base of baseVariants) {
      for (const ext of extensions) {
        const rawPath = `/midjourney/${base}${ext}`;
        candidates.push({
          url: encodeURI(rawPath),
          type: ext === '.mp4' ? 'video' : 'image'
        });
      }
    }
    return candidates;
  }, [slug, index]);

  React.useEffect(() => {
    // Reset when slug or index changes
    setMediaSrc(null);
    setMediaType(null);
    setCurrentCandidateIndex(0);
  }, [slug, index]);

  React.useEffect(() => {
    const candidates = buildCandidates();
    if (currentCandidateIndex >= candidates.length) {
      setMediaSrc(null);
      setMediaType(null);
      return;
    }

    const candidate = candidates[currentCandidateIndex];
    if (candidate.type === 'video') {
      const video = document.createElement('video');
      video.onloadeddata = () => {
        setMediaSrc(candidate.url);
        setMediaType('video');
      };
      video.onerror = () => {
        setCurrentCandidateIndex(prev => prev + 1);
      };
      video.src = candidate.url;
      video.load();
    } else {
      const img = new Image();
      img.onload = () => {
        setMediaSrc(candidate.url);
        setMediaType('image');
      };
      img.onerror = () => {
        setCurrentCandidateIndex(prev => prev + 1);
      };
      img.src = candidate.url;
    }
  }, [buildCandidates, currentCandidateIndex]);

  const handleClick = () => {
    onClick();
  };

  // Don't render anything if no media found
  if (!mediaSrc) {
    return null;
  }

  return (
    <div
      className="w-full cursor-pointer relative overflow-hidden"
      onClick={handleClick}
    >
      {/* Media - Image or Video */}
      {mediaType === 'video' ? (
        <video
          src={mediaSrc}
          className="w-full h-auto block"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src={mediaSrc}
          alt={`${slug} ${index}`}
          className="w-full h-auto block"
          style={{ imageRendering: 'pixelated' }}
        />
      )}
    </div>
  );
};

export default MidjourneyWindow;

