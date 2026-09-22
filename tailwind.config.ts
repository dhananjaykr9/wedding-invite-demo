import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Ensure this path is included
  ],
  theme: {
    extend: {
      colors: {
        'wedding-royal': '#1a237e',
        'wedding-maroon': '#5d0e11',
        'wedding-paper': '#fdfbf7',
        'mauli-gold': '#d4af37',
        'mauli-red': '#b91c1c',
      },
      fontFamily: {
        // Bridge the Tailwind name to the Next.js Font Variable
        marathi: ['var(--font-marathi)', 'sans-serif'],
        signature: ['var(--font-signature)', 'cursive'],
      },
    },
  },
  plugins: [],
};
export default config;