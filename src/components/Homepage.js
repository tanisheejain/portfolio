import React from 'react';
import CRTMonitor from './CRTMonitor';

const Homepage = () => {
  // Project data matching the exact layout from your image
  const projects = [
    {
      name: 'Nami',
      image: '/projects/nami.png',
      figmaLink: 'https://www.figma.com/design/your-nami-project'
    },
    {
      name: 'गली LABS',
      image: '/projects/gullylabs.png',
      figmaLink: 'https://www.figma.com/design/your-gully-project'
    },
    {
      name: 'BLUORNƏ',
      image: '/projects/bluorng.png',
      figmaLink: 'https://www.figma.com/design/your-bluorn-project'
    },
    {
      name: 'Cards',
      image: '/projects/cards.png',
      figmaLink: 'https://www.figma.com/design/your-cards-project'
    }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl mb-4 tracking-wider text-white font-mono">
          PROJECTS
        </h1>
        <p className="text-sm text-white tracking-wide font-mono">
          RETRO CRT MONITOR GALLERY
        </p>
        <p className="text-xs text-white mt-2 tracking-widest font-mono">
          HOVER FOR STATIC • CLICK TO OPEN
        </p>
      </div>

      {/* Custom Layout matching the second image exactly */}
      <div className="flex flex-col items-center gap-12 max-w-4xl">
        {/* Top row: 3 monitors */}
        <div className="flex gap-12">
          <CRTMonitor project={projects[0]} index={0} />
          <CRTMonitor project={projects[1]} index={1} />
          <CRTMonitor project={projects[2]} index={2} />
        </div>
        
        {/* Bottom row: 1 monitor aligned with first */}
        <div className="flex gap-12">
          <CRTMonitor project={projects[3]} index={3} />
          <div className="w-32"></div> {/* Spacer to match layout */}
          <div className="w-32"></div> {/* Spacer to match layout */}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-xs text-white tracking-widest font-mono">
          VINTAGE MAC AESTHETIC • BLACK & WHITE ONLY
        </p>
      </div>
    </div>
  );
};

export default Homepage;
