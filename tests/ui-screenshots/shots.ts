type Screen = { name: string; path: string; states: string[] };

// a route pattern and a screen path with its ids as {placeholders} match when both are the same with every id blanked
const pattern = (path: string) => path.split('?')[0].replace(/\[\w+\]|\{\w+\}/g, '*');

/** The dialog and wizard states of tests/a11y/screens.json on a page (#697) */
export const statesOf = (route: string, screens: Screen[]) =>
	screens
		.filter((screen) => pattern(screen.path) === pattern(route))
		.flatMap((screen) =>
			screen.states
				// an upload dialog's Beleg gets a new random name each time (tasks/accessibility.ts): its shot would always differ
				.filter(
					(state) =>
						(state.includes('dialog') && !state.startsWith('upload-')) ||
						state === 'every-wizard-step'
				)
				.map((state) => ({ screen: screen.name, state }))
		);

/** File name (without .png) and comment title of a shot of a page, in a look or state named by `parts` */
export const shot = (route: string, ...parts: string[]) => ({
	file: [
		route
			.split(/[/[\]]+/)
			.filter(Boolean)
			.join('_') || 'home',
		...parts
	].join('--'),
	title: [`\`${route}\``, ...parts].join(', ')
});
