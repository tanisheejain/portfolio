import React from 'react';
import Dock from './components/Dock';
import Homepage from './components/Homepage';
import BlogWindow from './components/BlogWindow';
import GalleryWindow from './components/GalleryWindow';
import MidjourneyWindow from './components/MidjourneyWindow';
import AboutWindow from './components/AboutWindow';
import { useWindowManager } from './hooks/useWindowManager';
import './App.css';

function App() {
  const { isWindowOpen, toggleWindow, closeWindow } = useWindowManager();

  const handleNotionClick = () => {
    toggleWindow('blog');
  };

  const handleGalleryClick = () => {
    toggleWindow('gallery');
  };

  const handleMidjourneyClick = () => {
    toggleWindow('midjourney');
  };

  const handleProfileClick = () => {
    toggleWindow('about');
  };

  return (
    <div className="App min-h-screen bg-black text-white font-pixel">
      {/* Homepage with CRT monitors */}
      <Homepage />
      
      {/* Dock at bottom */}
      <Dock onNotionClick={handleNotionClick} onGalleryClick={handleGalleryClick} onMidjourneyClick={handleMidjourneyClick} onProfileClick={handleProfileClick} />
      
      {/* Blog Window */}
      {isWindowOpen('blog') && (
        <BlogWindow onClose={() => closeWindow('blog')} />
      )}
      
      {/* Gallery Window */}
      {isWindowOpen('gallery') && (
        <GalleryWindow onClose={() => closeWindow('gallery')} />
      )}
      
      {/* Midjourney Window */}
      {isWindowOpen('midjourney') && (
        <MidjourneyWindow onClose={() => closeWindow('midjourney')} />
      )}
      
      {/* About Window */}
      {isWindowOpen('about') && (
        <AboutWindow onClose={() => closeWindow('about')} />
      )}
    </div>
  );
}

export default App;
