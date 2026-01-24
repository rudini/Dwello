/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#135bec',
				success: '#10b981',
				'text-dark': '#111318',
				'text-secondary': '#616f89',
				'border-light': '#dbdfe6'
			},
			fontFamily: {
				sans: ['Manrope', 'system-ui', 'sans-serif']
			}
		}
	},
	plugins: []
};
