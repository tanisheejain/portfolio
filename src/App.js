import React from 'react';
import Dock from './components/Dock';
import Homepage from './components/Homepage';
import './App.css';

function App() {
  return (
    <div className="App min-h-screen bg-black text-white font-pixel">
      {/* Homepage with CRT monitors */}
      <Homepage />
      
      {/* Dock at bottom */}
      <Dock />
    </div>
  );
}

export default App;
