/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: {
    colors: { ink: "#080913", muted: "#7e87a2", canvas: "#fbfcfe", link: "#2865ff" },
    fontFamily: { regular: ["Inter_400Regular"], semibold: ["Inter_600SemiBold"], bold: ["Inter_700Bold"] },
  } },
  plugins: [],
};
