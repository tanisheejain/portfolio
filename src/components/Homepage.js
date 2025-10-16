import React from 'react';
import CRTMonitor from './CRTMonitor';

const Homepage = () => {
  // Project data - you can modify these with your actual projects
  const projects = [
    {
      name: 'Nami',
      image: '/projects/nami.svg',
      figmaLink: 'https://www.figma.com/design/your-nami-project'
    },
    {
      name: 'Gully',
      image: '/projects/gully.svg',
      figmaLink: 'https://www.figma.com/design/your-gully-project'
    },
    {
      name: 'Project 3',
      image: '/projects/project3.svg',
      figmaLink: 'https://www.figma.com/design/your-project3'
    },
    {
      name: 'Project 4',
      image: '/projects/project4.svg',
      figmaLink: 'https://www.figma.com/design/your-project4'
    },
    {
      name: 'Project 5',
      image: '/projects/project5.svg',
      figmaLink: 'https://www.figma.com/design/your-project5'
    },
    {
      name: 'Project 6',
      image: '/projects/project6.svg',
      figmaLink: 'https://www.figma.com/design/your-project6'
    },
    {
      name: 'Project 7',
      image: '/projects/project7.svg',
      figmaLink: 'https://www.figma.com/design/your-project7'
    },
    {
      name: 'Project 8',
      image: '/projects/project8.svg',
      figmaLink: 'https://www.figma.com/design/your-project8'
    },
    {
      name: 'Project 9',
      image: '/projects/project9.svg',
      figmaLink: 'https://www.figma.com/design/your-project9'
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

      {/* 3x3 Grid of Monitors */}
      <div className="grid grid-cols-3 gap-8 max-w-4xl">
        {projects.map((project, index) => (
          <CRTMonitor 
            key={project.name} 
            project={project} 
            index={index}
          />
        ))}
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
