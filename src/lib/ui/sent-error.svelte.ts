/**
 * The error of a choice belongs to the choice that was sent (#654, as `Field` does for text-like controls): changing
 * the choice takes the error away, and the next submit of the form around it, or a new error, shows it again.
 * Create it in a component's script; `attach` goes on the element around the choice (`{@attach sent.attach}`): it
 * notes the change before the new value reaches the caller, whose error may follow from the new choice.
 */
export function sentError(error: () => string | undefined) {
	let corrected = $state<string>(); // the error the choice was changed after
	$effect(() => {
		if (!error()) corrected = undefined;
	});
	return {
		get shown() {
			const current = error();
			return current === corrected ? undefined : current;
		},
		attach(node: HTMLElement) {
			const form = node.closest('form');
			const changed = () => (corrected = error());
			const check = () => (corrected = undefined);
			node.addEventListener('change', changed, true);
			form?.addEventListener('submit', check, true);
			return () => {
				node.removeEventListener('change', changed, true);
				form?.removeEventListener('submit', check, true);
			};
		}
	};
}
