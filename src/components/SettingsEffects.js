import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const SettingsEffects = () => {
  const { settings, loaded } = useSettings();

  useEffect(() => {
    if (!loaded) return;

    const html = document.documentElement;
    const body = document.body;
    const dock = document.querySelector('.dock-wrapper');

    // Theme: set data-theme on html
    html.dataset.theme = settings.theme;

    // Side pixels: toggle side-pixels-on class on body
    if (settings.sidePixels) {
      body.classList.add('side-pixels-on');
    } else {
      body.classList.remove('side-pixels-on');
    }

    // Reduced motion: toggle reduced-motion class on html
    if (settings.reducedMotion) {
      html.classList.add('reduced-motion');
    } else {
      html.classList.remove('reduced-motion');
    }

    // Font scale: set font class on html
    html.classList.remove('font-s', 'font-m', 'font-l');
    html.classList.add(`font-${settings.fontScale.toLowerCase()}`);

    // Dock size: set dock class on dock element
    if (dock) {
      dock.classList.remove('dock-s', 'dock-m', 'dock-l');
      dock.classList.add(`dock-${settings.dockSize.toLowerCase()}`);
    }

    // Window shadow: set data attribute on html for window components to read
    html.dataset.windowShadow = settings.windowShadow;
  }, [settings, loaded]);

  return null;
};

