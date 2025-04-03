// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ensure this is correct based on your file structure
  ],
  theme: {
    extend: {
      keyframes: {
        fizz: {
          '0%, 100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
          '50%': { opacity: 0.5, transform: 'translateY(-5px) scale(1.05)' },
        },
      },
      animation: {
        fizz: 'fizz 0.5s infinite alternate ease-in-out',
      },
    },
  },
  plugins: [],
};
