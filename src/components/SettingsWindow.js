import React, { useState, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const SettingsWindow = ({ onClose }) => {
  const { settings, updateSetting } = useSettings();
  const [position, setPosition] = useState({ x: 200, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    if (isMaximized) return;
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      const maxX = window.innerWidth - 700;
      const maxY = window.innerHeight - 500;
      
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragOffset]);

  const containerStyle = {
    left: isMaximized ? 0 : position.x,
    top: isMaximized ? 0 : position.y,
    width: isMaximized ? '100vw' : '700px',
    height: isMaximized ? '100vh' : (isMinimized ? 'auto' : '500px')
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
        <span className="text-xs font-mono">Settings</span>
        <div className="window-controls">
          <button
            type="button"
            className="window-btn"
            title={isMinimized ? 'Restore' : 'Minimize'}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
              if (isMaximized && !isMinimized) setIsMaximized(false);
            }}
          >
            _
          </button>
          <button
            type="button"
            className="window-btn"
            title={isMaximized ? 'Restore' : 'Maximize'}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
              if (isMinimized) setIsMinimized(false);
            }}
          >
            ☐
          </button>
          <button
            type="button"
            className="window-btn"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div
        className="p-6 h-full overflow-y-auto bg-black text-white border-b-2 border-white"
        style={{ display: isMinimized ? 'none' : 'block' }}
      >
        <div className="mb-6">
          <h1 className="text-lg font-mono mb-2 tracking-wider">DISPLAY</h1>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <label className="block text-xs font-mono mb-2">Theme</label>
          <div className="flex gap-2">
            {['pixel', 'iridescent', 'cyber'].map((theme) => (
              <button
                key={theme}
                className={`px-3 py-2 border-2 font-mono text-xs transition-all ${
                  settings.theme === theme
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => updateSetting('theme', theme)}
              >
                {theme === 'pixel' ? 'Pixel Mono' : theme === 'iridescent' ? 'Iridescent' : 'Cyber-glitch'}
              </button>
            ))}
          </div>
        </div>

        {/* Side Pixels */}
        <div className="mb-6">
          <label className="block text-xs font-mono mb-2">Side pixels</label>
          <div className="flex gap-2">
            {['On', 'Off'].map((option) => (
              <button
                key={option}
                className={`px-3 py-2 border-2 font-mono text-xs transition-all ${
                  (option === 'On') === settings.sidePixels
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => updateSetting('sidePixels', option === 'On')}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Reduced Motion */}
        <div className="mb-6">
          <label className="block text-xs font-mono mb-2">Reduced motion</label>
          <div className="flex gap-2">
            {['On', 'Off'].map((option) => (
              <button
                key={option}
                className={`px-3 py-2 border-2 font-mono text-xs transition-all ${
                  (option === 'On') === settings.reducedMotion
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => updateSetting('reducedMotion', option === 'On')}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="mb-6">
          <label className="block text-xs font-mono mb-2">Font size</label>
          <div className="flex gap-2">
            {['S', 'M', 'L'].map((size) => (
              <button
                key={size}
                className={`px-3 py-2 border-2 font-mono text-xs transition-all ${
                  settings.fontScale === size
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => updateSetting('fontScale', size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Dock Size */}
        <div className="mb-6">
          <label className="block text-xs font-mono mb-2">Dock size</label>
          <div className="flex gap-2">
            {['S', 'M', 'L'].map((size) => (
              <button
                key={size}
                className={`px-3 py-2 border-2 font-mono text-xs transition-all ${
                  settings.dockSize === size
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => updateSetting('dockSize', size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Window Shadow */}
        <div className="mb-6">
          <label className="block text-xs font-mono mb-2">Window shadow</label>
          <div className="flex gap-2">
            {['subtle', 'none'].map((shadow) => (
              <button
                key={shadow}
                className={`px-3 py-2 border-2 font-mono text-xs transition-all ${
                  settings.windowShadow === shadow
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => updateSetting('windowShadow', shadow)}
              >
                {shadow === 'subtle' ? 'Subtle' : 'None'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsWindow;

