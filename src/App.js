import React from 'react';
import Dock from './components/Dock';
import Homepage from './components/Homepage';
import BlogWindow from './components/BlogWindow';
import GalleryWindow from './components/GalleryWindow';
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

  return (
    <div className="App min-h-screen bg-black text-white font-pixel">
      {/* Homepage with CRT monitors */}
      <Homepage />
      
      {/* Dock at bottom */}
      <Dock onNotionClick={handleNotionClick} onGalleryClick={handleGalleryClick} />
      
      {/* Blog Window */}
      {isWindowOpen('blog') && (
        <BlogWindow onClose={() => closeWindow('blog')} />
      )}
      
      {/* Gallery Window */}
      {isWindowOpen('gallery') && (
        <GalleryWindow onClose={() => closeWindow('gallery')} />
      )}
    </div>
  );
}

export default App;
