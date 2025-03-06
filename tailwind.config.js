/** @type {import('tailwindcss').Config} */
export const darkMode = "class";
export const content = ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"];
export const theme = {
    extend: {
        fontFamily: {
            poppins: ["Poppins", "sans-serif"],
            inter: ["Inter", "sans-serif"],
          },
        colors: {
            primary: "var(--primary-color)",
            secondary: "var(--secondary-color)",
            tertiary: "var(--tertiary-color)",
            text: "var(--text-color)",
            light: "var(--bg-light)",
        },
    },
};
export const plugins = [
    require("daisyui"), // ✅ DaisyUI Plugin
    require("tailwindcss-animate"), // ✅ Tailwind Animate Plugin
];
export const daisyui = {
    themes: false, // Disable default themes to use custom colors
};
  