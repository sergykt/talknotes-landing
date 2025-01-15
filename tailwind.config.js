/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      poppins: ["Poppins", "Inter", "sans-serif"],
    },
    extend: {
      keyframes: {
        beat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": {
            transform: "scale(1.025)",
          },
        },
      },
      animation: {
        beat: "beat 1s ease-in-out infinite",
        "pulse-beat": "pulse 1s ease-in-out infinite, beat 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
