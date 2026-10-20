import { tick } from 'svelte';

/**
 * After a refused save, once the errors are on screen: focus the first invalid field, so its error is
 * read out, or else the form's error message. Without it the focus falls back to the page.
 */
export async function focusFirstError(form: Element | null | undefined): Promise<void> {
	await tick();
	// after SvelteKit's own focus reset, which moves the focus to the address's #fragment (e.g. «#main-content» of the
	// skip link) in a timeout of its own (persona Sven on #479, P-2)
	await new Promise((resolve) => setTimeout(resolve));
	const target =
		form?.querySelector<HTMLElement>(
			':is(input, select, textarea)[aria-invalid="true"], [role="radiogroup"][aria-invalid="true"] input'
		) ?? form?.querySelector<HTMLElement>('[role="alert"]');
	// already focused (sent with Enter in that field): focus it anew, or nothing is read out
	if (target && target === document.activeElement) target.blur();
	target?.focus();
}
