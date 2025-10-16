import React, { useState, useRef } from 'react';
import { blogEntries } from '../data/blogs';

const BlogWindow = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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

  const handleBlogClick = (href) => {
    if (href) {
      window.open(href, '_blank');
    }
  };

  return (
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
        <span className="text-xs font-mono">Notion / Blog</span>
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
          <h1 className="text-2xl font-mono mb-4 tracking-wider">Why do I write?</h1>
          <p className="text-sm font-mono leading-relaxed">
            I am exploring myself which includes taking a look at my own thoughts, feelings, behaviors and motivations and asking why? All of which I'll set down here. I will write things and put them here maybe once a week. This blog is like a receptacle to me, a thinking place, a journal and what not. Dan Gilbert said "There's nothing better than people talking to each other, sharing best practices, and opening up communications." Having a blog allows people to find me and get a snipped of what goes on in my head.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {blogEntries.map((blog, index) => (
            <BlogCard
              key={blog.slug}
              blog={blog}
              onClick={() => handleBlogClick(blog.href)}
              onHover={playTickSound}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const BlogCard = ({ blog, onClick, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="w-full h-48 cursor-pointer border-2 border-white bg-black overflow-hidden transition-all duration-200"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        filter: isHovered ? 'invert(1)' : 'none'
      }}
    >
      {/* Cover Image */}
      <div className="w-full h-32 relative overflow-hidden">
        <img
          src={`/photos/blogs/${blog.slug}.jpg`}
          alt={blog.title}
          className="w-full h-full object-cover"
          style={{ imageRendering: 'pixelated' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        
        {/* Static Overlay on Hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
        )}
      </div>

      {/* Title */}
      <div className="h-16 flex items-center justify-center p-2">
        <h3 className="text-xs font-mono text-center leading-tight">
          {blog.title}
        </h3>
      </div>
    </div>
  );
};

export default BlogWindow;
