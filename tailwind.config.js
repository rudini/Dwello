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

/** @type {import('tailwindcss').Config} */
export default {
	// Colours, radii and shadows come only from the tokens (replaced, not extended)
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			...Object.fromEntries(tokenColours.map((/** @type {string} */ name) => [name, `var(--color-${name})`]))
		},
		borderRadius: { control: 'var(--radius-control)', panel: 'var(--radius-panel)' },
		boxShadow: { none: 'none', raised: 'var(--shadow-raised)', overlay: 'var(--shadow-overlay)' },
		extend: {
			transitionDuration: { fast: 'var(--duration-fast)' },
			maxHeight: { 'below-header': 'calc(100vh - var(--size-header))' }, // sticky sidebar
			// summary rows: label, value, action (phones: value with its action)
			gridTemplateColumns: { 'value-action': '1fr auto', 'label-value-action': '10rem 1fr auto' },
			fontFamily: {
				sans: ['Inter Variable', 'system-ui', 'sans-serif']
			}
		}
	},
	plugins: []
};
