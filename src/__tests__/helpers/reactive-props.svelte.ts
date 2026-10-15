/** Props a DOM test can change after mounting, as SvelteKit changes `form` after an action */
export function reactiveProps<P extends Record<string, unknown>>(initial: P): P {
	const props = $state(initial);
	return props;
}
