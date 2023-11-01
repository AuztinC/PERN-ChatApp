/** @type {import('tailwindcss').Config} */
module.exports = {
content: [ './index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accentColor: '#00FFCA',
        backgroundColor: '#0A4D68',
        sendColor: '#088395',
        receivedColor: '#05BFDB',
        boxColor: '#EAFDFC'
      }
    },
  },
  plugins: [],
}

