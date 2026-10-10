import type { ActionResult } from '@sveltejs/kit';
import { addToast } from './stores';
import type { Tenant } from './types';

/** Languages a tenant's statements can be written in */
export const languageLabels: Record<Tenant['language'], string> = {
	de: 'Deutsch',
	fr: 'Französisch',
	it: 'Italienisch',
	rm: 'Rätoromanisch',
	en: 'Englisch'
};

/** After saving the tenant form, a confirmation naming the tenant; back in the contract wizard, the wizard confirms */
export function confirmSaved(formData: FormData) {
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const name = `${field('firstName')} ${field('lastName')}`;
	const quiet = field('for') === 'contract';
	return async ({ result, update }: { result: ActionResult; update: () => Promise<void> }) => {
		if (result.type === 'redirect' && !quiet) addToast('success', `${name} gespeichert`);
		await update();
	};
}
