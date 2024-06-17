/** @type {import('tailwindcss').Config} */
module.exports = {
content: [ './index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        accentColor: '#00FFCA',
        backgroundColor: '#0A4D68',
        sendColor: '#088395',
        receivedColor: '#05BFDB',
        boxColor: '#EAFDFC'
      },
      keyframes: {
        rotateUp: {
          from: { transform: 'rotate(0deg)'},
          to: { transform: 'rotate(180deg)'},
        },
        rotateDown: {
          from: { transform: 'rotate(180deg)'},
          to: { transform: 'rotate(0deg)'},
        },
        
        grow: {
          from: { maxHeight: '0px', opacity: '0'},
          to: { maxHeight: '40vh', opacity: '1'},
        },
        shrink: {
          from: { maxHeight: '40vh', opacity: '1'},
          to: { maxHeight: '0px', opacity: '0'},
        }
      },
      animation: {
        rotateUp: 'rotateUp 1s ease-in-out',
        rotateDown: 'rotateDown 1s ease-in-out',
        
        grow: 'grow 1s ease-in-out',
        shrink: 'shrink 1s ease-in-out'
      }
    },
  },
  plugins: [],
}

