import React from 'react';

const PixelIcon = ({ type, onClick, onMouseEnter, onMouseLeave }) => {
  const getIconSrc = () => {
    const iconMap = {
      home: '/icons/home.png',
      profile: '/icons/profile.png',
      notion: '/icons/notion.png',
      midjourney: '/icons/midjourney.png',
      gallery: '/icons/gallery.png',
      settings: '/icons/settings.png',
      twitter: '/icons/X (twitter).png',
      linkedin: '/icons/linkedin.png'
    };
    return iconMap[type] || iconMap.home;
  };

  return (
    <div
      className="w-16 h-16 cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors duration-100 flex items-center justify-center group"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img
        src={getIconSrc()}
        alt={type}
        className="w-12 h-12 filter invert"
        style={{
          imageRendering: 'pixelated'
        }}
      />
    </div>
  );
};

export default PixelIcon;
