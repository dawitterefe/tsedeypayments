/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    },
    colors: {
      primary: "#242a2b",
      secondary: "#808080",
      accent: {
        Default: "#1cbccf",
        secondary: "#18abbc",
        tertiary: "#80c6cd",
      },
      white: "#ffffff",
      red: "#ff3333",
      blue: "#0080ff",
      grey: {
        'grey-0': "#d3d3d3",
        'grey-1': "#a9a9a9",
        'silver': "#c0c0c0"
      }
      ,
      green: "#8bc64c",
      green1: "#00b300",
      cyan: "#0cb6b6",
      yellow: "#ffd022",

      dark: {
        'eval-0': '#151823',
        'eval-1': '#222738',
        'eval-2': '#2A2F42',
        'eval-3': '#2C3142',
        'dark': '#000000',
      },

      facebook: '#1877F2',
      twitter: '#1DA1F2',
      instagram: '#E4405F',
      linkedin: '#0077B5',
      youtube: '#FF0000',
      whatsapp: '#25D366',
      pinterest: '#E60023',
      snapchat: '#FFFC00',
      tiktok: '#010101', // Black logo color
      github: '#181717',
      reddit: '#FF4500',
      discord: '#5865F2',
      medium: '#12100E',
      slack: '#4A154B',
      tumblr: '#34526F',
      spotify: '#1DB954',
      twitch: '#9146FF',
      telegram: '#0088CC',
    }
  },
  plugins: [],
}

