import React, { useState, useRef } from 'react';

const AboutWindow = ({ onClose }) => {
  const [position, setPosition] = useState(() => {
    // Center the window on screen initially (same as Midjourney window)
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

  const handleMouseDown = (e) => {
    // Do not initiate drag when clicking header buttons
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
      
      // Keep window within viewport bounds
      const maxX = window.innerWidth - 1000; // updated window width
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

  const containerStyle = {
    left: isMaximized ? 0 : position.x,
    top: isMaximized ? 0 : position.y,
    width: isMaximized ? '100vw' : '1000px',
    height: isMaximized ? '100vh' : (isMinimized ? 'auto' : '700px')
  };

  return (
    <div
      ref={windowRef}
      className="window-container fixed bg-black border-2 border-white z-50 select-none"
      style={containerStyle}
    >
      {/* Window Header */}
      <div
        className="window-header bg-white text-black px-2 py-1 flex justify-between items-center cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs font-mono">About Me</span>
        <div className="window-controls">
          <button type="button"
            className="window-btn"
            title={isMinimized ? 'Restore' : 'Minimize'}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); if (isMaximized && !isMinimized) setIsMaximized(false); }}
          >
            _
          </button>
          <button type="button"
            className="window-btn"
            title={isMaximized ? 'Restore' : 'Maximize'}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); if (isMinimized) setIsMinimized(false); }}
          >
            ☐
          </button>
          <button type="button"
            className="window-btn"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="window-content p-6 h-full overflow-y-auto bg-black text-white border-b-2 border-white" style={{ display: isMinimized ? 'none' : 'block' }}>
        <div className="max-w-2xl mx-auto space-y-6 font-mono text-sm leading-relaxed">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-mono tracking-wider mb-4 border-b-2 border-white pb-3">About Me</h1>
          </div>

          {/* Introduction */}
          <p className="leading-loose">
            My name is <span className="font-bold">Tanishae Jain</span>, and I'm currently pursuing a <span className="font-bold">B.Des in Humanising Technology</span> at <span className="font-bold">NMIMS School of Design</span>.
          </p>

          <p className="leading-loose">
            Before this, I came from a commerce background at <span className="font-bold">Gundecha Education Academy</span> (plot twist, I know). Somewhere between economics textbooks and debate competitions, I realised I enjoy understanding how people think and how markets move — which now quietly shapes the way I approach design.
          </p>

          <div className="text-center py-4 border-t border-white border-b border-white my-6">
            <p className="font-bold text-base">So yes, design + business + culture = my playground.</p>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <p className="leading-loose">
              I've interned at <span className="font-bold">Light of Life Trust</span>, where I designed marathon collaterals, campaign visuals, and brand communication for social impact initiatives.
            </p>

            <p className="leading-loose">
              I also worked as a <span className="font-bold">Senior Intern at I.I.M.U.N</span>, coordinating outreach, events and communication — which basically taught me how to talk to a lot of different people without losing my mind.
            </p>
          </div>

          <div className="text-center py-4 border-t border-white border-b border-white my-6">
            <p className="font-bold text-base">So yes, I'm comfortable in both chaos and Canva.</p>
          </div>

          {/* Outside Work Section */}
          <div className="mt-8">
            <h2 className="text-xl font-mono tracking-wide mb-4 border-b border-white pb-2">Outside work:</h2>
            
            <ul className="space-y-3 ml-4 leading-relaxed">
              <li>
                I read a lot (mostly fiction, sometimes psychology, occasionally a questionable rabbit-hole from the internet).
              </li>
              <li>
                I dance whenever I get the chance — the kind where you stop caring about steps and just move.
              </li>
              <li>
                I play the ukulele with confidence that far exceeds my actual skill level (impresses absolutely nobody, but I have a great time).
              </li>
              <li>
                I'm a black belt in Shotokan Karate, which sounds intense but mostly means I can open tight jars (on a good day).
              </li>
            </ul>
          </div>

          {/* Blog Section */}
          <div className="mt-8 space-y-3 leading-loose">
            <p>
              I also have a blog, where I write about whatever is currently living rent-free in my brain — life, identity, books, movies, conversations, and the occasional unsolicited philosophical take.
            </p>
            <p className="italic text-white/80">
              It's basically a public-facing brain dump, but with paragraph breaks.
            </p>
          </div>

          {/* YouTube Section */}
          <div className="mt-6 space-y-3 leading-loose">
            <p>
              And because YouTube is my natural habitat, I plan to start a channel soon — not for virality, just because I genuinely enjoy long-form storytelling and speaking to a camera like it's my roommate.
            </p>
          </div>

          {/* Closing Section */}
          <div className="mt-10 pt-6 border-t-2 border-white">
            <p className="leading-loose mb-4">
              If you've made it this far: <span className="font-bold">congratulations</span> — your attention span is still alive.
            </p>
            <p className="leading-loose mb-4">
              You survived a full paragraph on the internet in 2025. Which means:
            </p>
            <div className="space-y-2 ml-4 mt-4">
              <p className="font-bold">You're my people.</p>
              <p className="font-bold">I have successfully earned the most valuable currency online: your attention.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutWindow;

