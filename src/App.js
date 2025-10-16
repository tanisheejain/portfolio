import React from 'react';
import Dock from './components/Dock';
import Homepage from './components/Homepage';
import BlogWindow from './components/BlogWindow';
import { useWindowManager } from './hooks/useWindowManager';
import './App.css';

function App() {
  const { isWindowOpen, toggleWindow, closeWindow } = useWindowManager();

  const handleNotionClick = () => {
    toggleWindow('blog');
  };

  return (
    <div className="App min-h-screen bg-black text-white font-pixel">
      {/* Homepage with CRT monitors */}
      <Homepage />
      
      {/* Dock at bottom */}
      <Dock onNotionClick={handleNotionClick} />
      
      {/* Blog Window */}
      {isWindowOpen('blog') && (
        <BlogWindow onClose={() => closeWindow('blog')} />
      )}
    </div>
  );
}

export default App;
