/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}',
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily :{
        'lato' : 'Lato,sans-serif',
        'inter': 'Inter,sans-serif',
        'roboto' : 'Roboto, sans-serif',
        'poppins' : 'Poppins, sans-serif'
      },
      colors :{
        'main' : '#6166B3',
        'second' : '#332941',
        'third'  :'#FF6969',
        'fourth' : '#FFF5E0',
        'homeMain' :'#070F2B',
        'homeSec' : '#1B1A55',
        'homeThird' :'#D7E4C0',
        'homeFourth' : '#3DC2EC'
      },
      backgroundColor :{
        'main' : '#413C69',
        'second' : '#A6D0DD',
        'third'  :'#FF6969',
        'fourth' : '#FFF5E0',
      },
    },
  },
  plugins: [
    /* eslint-disable no-undef */
    require('flowbite/plugin')
/* eslint-enable no-undef */

  ],
}