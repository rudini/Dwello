/** @type {import('tailwindcss').Config} */

// Design tokens (src/styles/tokens.css), usable as bg-surface, text-ink, border-line-strong, ...
const tokenColours = [
	'canvas',
	'surface',
	'sunken',
	'line',
	'line-strong',
	'ink',
	'ink-muted',
	'accent',
	'accent-strong',
	'accent-soft',
	'on-accent',
	'positive',
	'positive-soft',
	'caution',
	'caution-soft',
	'critical',
	'critical-soft',
	'focus',
	'scrim'
];

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				...Object.fromEntries(tokenColours.map((name) => [name, `var(--color-${name})`])),
				// Old design system, removed once every screen is migrated (docs/design/01-plan.md)
				primary: '#135bec',
				success: '#10b981',
				'text-dark': '#111318',
				'text-secondary': '#616f89',
				'border-light': '#dbdfe6'
			},
			borderRadius: { control: 'var(--radius-control)', panel: 'var(--radius-panel)' },
			boxShadow: { raised: 'var(--shadow-raised)', overlay: 'var(--shadow-overlay)' },
			transitionDuration: { fast: 'var(--duration-fast)' },
			fontFamily: {
				sans: ['Inter Variable', 'system-ui', 'sans-serif']
			}
		}
	},
	plugins: []
};
