/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      "./src/**/*.{js,jsx,ts,tsx}",
   ],
   theme: {
      extend: {
         backgroundColor: {
            'half-transparent': 'rgba(0, 0, 0, 0.5)',
         },
         backgroundImage: {
            'background-slide': "url('./utils/images/background.png')",
            'background-shop': "url('./utils/images/bg-shop.jpg')"
         }
      },
   },
   plugins: [],
}

