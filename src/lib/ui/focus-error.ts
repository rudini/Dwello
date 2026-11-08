import { tick } from 'svelte';

/**
 * After a refused save, once the errors are on screen: focus the first invalid field, so its error is
 * read out, or else the form's error message. Without it the focus falls back to the page. `first`: the fields to
 * focus before any other invalid one, the first of them on the page (the empty ones a refusal names, #690)
 */
export async function focusFirstError(
	form: Element | null | undefined,
	first: string[] = []
): Promise<void> {
	await tick();
	// after SvelteKit's own focus reset, which moves the focus to the address's #fragment (e.g. «#main-content» of the
	// skip link) in a timeout of its own (persona Sven on #479, P-2)
	await new Promise((resolve) => setTimeout(resolve));
	const target =
		(first.length
			? form?.querySelector<HTMLElement>(first.map((name) => `[name="${name}"]`).join(', '))
			: null) ??
		form?.querySelector<HTMLElement>(
			':is(input, select, textarea)[aria-invalid="true"], [role="radiogroup"][aria-invalid="true"] input'
		) ??
		form?.querySelector<HTMLElement>('[role="alert"]');
	// already focused (sent with Enter in that field): focus it anew, or nothing is read out
	if (target && target === document.activeElement) target.blur();
	target?.focus();
}
