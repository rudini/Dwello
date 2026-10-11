import type { SubmitFunction } from '@sveltejs/kit';

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
			if (result.type === 'redirect') redirected?.();
			await update();
			busy(false);
			await answered(result);
		};
	};
}
