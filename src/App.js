import React from 'react';
import Dock from './components/Dock';
import './App.css';

function App() {
  return (
    <div className="App min-h-screen bg-black text-white font-pixel">
      {/* Main content area - empty for now */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-4xl mb-4 tracking-wider">
              PORTFOLIO
            </h1>
            <div className="w-32 h-32 mx-auto border-4 border-white bg-black flex items-center justify-center">
              <div className="w-24 h-24 border-2 border-white bg-black flex items-center justify-center">
                <div className="w-16 h-16 border border-white bg-black"></div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400 tracking-wide">
            VINTAGE MAC STYLE
          </p>
          <p className="text-xs text-gray-500 mt-2 tracking-widest">
            CLICK DOCK ICONS TO EXPLORE
          </p>
        </div>
      </div>
      
      {/* Dock at bottom */}
      <Dock />
    </div>
  );
}

export default App;
