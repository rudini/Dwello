import type { SubmitFunction } from '@sveltejs/kit';
import { goto } from '$app/navigation';

type Result = Parameters<Exclude<Awaited<ReturnType<SubmitFunction>>, void>>[0]['result'];

/**
 * Submit of a confirmation dialog's form, which lies outside the dialog: adds the values of the dialog's fields,
 * keeps the dialog busy until the page has answered, then hands over the result
 */
export function dialogSubmit(
	fields: () => Record<string, string>,
	busy: (busy: boolean) => void,
	answered: (result: Result) => unknown,
	redirected?: () => void // the action led to another page, which then shows
): SubmitFunction {
	return ({ formData }) => {
		for (const [name, value] of Object.entries(fields())) formData.set(name, value);
		busy(true);
		return async ({ result, update }) => {
			if (result.type === 'redirect') {
				redirected?.();
				// a delete: the next page takes the deleted record's place in the history, so browser back leads to the
				// page before it, not to a page that no longer exists (#1047)
				await goto(result.location, { replaceState: true, invalidateAll: true });
			} else await update();
			busy(false);
			await answered(result);
		};
	};
}
