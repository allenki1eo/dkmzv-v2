/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#E9E6DF',
        surface: '#F6F4F0',
        ink: '#1E1C19',
        'ink-muted': '#5E5950',
        line: '#CFCAC0',
        gold: '#7A5A12',
        season: '#4F6B3A',
        success: '#2F5A38',
        danger: '#8A3A2C',
      },
    },
  },
  plugins: [],
};
