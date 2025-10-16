import { useState } from 'react';

export const useWindowManager = () => {
  const [openWindows, setOpenWindows] = useState(new Set());

  const openWindow = (windowId) => {
    setOpenWindows(prev => new Set([...prev, windowId]));
  };

  const closeWindow = (windowId) => {
    setOpenWindows(prev => {
      const newSet = new Set(prev);
      newSet.delete(windowId);
      return newSet;
    });
  };

  const toggleWindow = (windowId) => {
    if (openWindows.has(windowId)) {
      closeWindow(windowId);
    } else {
      openWindow(windowId);
    }
  };

  const isWindowOpen = (windowId) => openWindows.has(windowId);

  return {
    openWindow,
    closeWindow,
    toggleWindow,
    isWindowOpen
  };
};
