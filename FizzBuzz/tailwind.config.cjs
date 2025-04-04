// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/**/*.{js,jsx,ts,tsx}', // Ensure this is correct based on your file structure
  ],
  theme: {
    extend: {
      keyframes: {
        fizz: {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(0deg)', 
            opacity: 1 
          },
          '25%': { 
            transform: 'translateY(-5px) rotate(2deg)', 
            opacity: 0.8 
          },
          '50%': { 
            transform: 'translateY(0) rotate(0deg)', 
            opacity: 1 
          },
          '75%': { 
            transform: 'translateY(3px) rotate(-2deg)', 
            opacity: 0.9 
          },
        },
        buzz: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
        },
      },
      animation: {
        fizz: 'fizz 0.5s infinite alternate',
        buzz: 'buzz 2.0s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
