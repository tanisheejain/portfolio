/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['Courier New', 'monospace'],
      },
      colors: {
        'mac-black': '#000000',
        'mac-white': '#FFFFFF',
        'mac-gray': '#808080',
      },
      animation: {
        'pixel-bounce': 'pixelBounce 0.1s ease-in-out',
      },
      keyframes: {
        pixelBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
