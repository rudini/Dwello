import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

// #678, #1183: Enter in a field saves, as in every other form; the browser would send the form's first button,
// e.g. «Von der KI prüfen lassen» or «Verbindung prüfen», which runs only by its own button
export const saveOnEnter =
	(saving: () => boolean): Attachment<HTMLFormElement> =>
	(form) =>
		on(form, 'keydown', (event) => {
			const field = event.target;
			// an Enter that ends an IME input saves nothing, as natively
			if (event.key !== 'Enter' || event.isComposing || !(field instanceof HTMLInputElement))
				return;
			event.preventDefault();
			// requestSubmit() clicks no button, so the busy save button does not stop a second save (#677)
			if (!saving()) form.requestSubmit();
		});
