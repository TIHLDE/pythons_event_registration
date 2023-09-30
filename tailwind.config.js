import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx}', './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        oswald: ['var(--font-oswald)'],
        cabin: ['var(--font-cabin)'],
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'pythons',
      themes: {
        dark: {
          colors: {
            content1: {
              50: '#f9fafa',
              100: '#f0f1f3',
              200: '#e5e8ea',
              300: '#d0d4d9',
              400: '#a5aeb7',
              500: '#74808e',
              600: '#455669',
              700: '#24384e',
              800: '#0b213a',
              900: '#031a34',
              DEFAULT: '#031a34',
              foreground: '#fafafa',
            },
            default: {
              50: '#031a34',
              100: '#0b213a',
              200: '#24384e',
              DEFAULT: '#455669',
              300: '#455669',
              400: '#74808e',
              500: '#a5aeb7',
              600: '#d0d4d9',
              700: '#e5e8ea',
              800: '#f0f1f3',
              900: '#f9fafa',
            },
            primary: {
              50: '#faf6ff',
              100: '#eadafe',
              200: '#d7b9fd',
              300: '#c08ffc',
              400: '#ae7deb',
              DEFAULT: '#BB86FC',
              500: '#9369c6',
              600: '#7c59a7',
              700: '#644786',
              800: '#543c71',
              900: '#3d2b52',
              foreground: '#121212',
            },
            secondary: {
              50: '#013b35',
              100: '#015149',
              200: '#015f56',
              300: '#02776b',
              400: '#028d7f',
              500: '#02a696',
              600: '#03baa8',
              700: '#17ddca',
              DEFAULT: '#17ddca',
              800: '#97f0e7',
              900: '#e7fbf9',
            },
            background: {
              DEFAULT: '#001328',
            },
          },
        },
      },
    }),
  ],
};

export default config;
