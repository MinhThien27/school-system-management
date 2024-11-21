const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			width: {
				1200: '1200px',
			},
		},
		colors: {
			underBg: '#eee',
			upperBg: '#fff',
			text: '#424242',
			textWhite: '#fff',
			main: '#3f51b5',
			lightMain: '#2196f3',
			shadow: '#607d8b',
			lightShadow: '#b0bec5',
			success: '#4caf50',
			error: '#e53935',
			warning: '#ffa000',
		},
		screens: {
			tablet: '960px',
			// => @media (min-width: 640px) { ... }

			laptop: '1024px',
			// => @media (min-width: 1024px) { ... }

			desktop: '1200px',
			// => @media (min-width: 1280px) { ... }
		},
		fontFamily: {
			sans: ['Montserrat', 'Poppins', 'sans-serif'],
		},
		boxShadow: {
			top: '0px 0px 6px 2px rgba(0, 0, 0, 0.1)',
			around: '0px 0px 10px 2px rgba(0, 0, 0, 0.2)',
		},
		backgroundImage: {
			publicBg: "url('../public/img/public-bg.jpg')",
		},
	},
	plugins: [require('tailwindcss'), require('autoprefixer')],
});
