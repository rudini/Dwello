import { m } from '$lib/paraglide/messages';
import type { ActionResult } from '@sveltejs/kit';
import { addToast } from './stores';
import type { Tenant } from './types';

/** Languages a tenant's statements and reminders are written in, named in the UI language (getters: read when shown) */
export const languageLabels: Record<Tenant['language'], string> = {
	get de() {
		return m.tenants_language_de();
	},
	get fr() {
		return m.tenants_language_fr();
	},
	get it() {
		return m.tenants_language_it();
	},
	get en() {
		return m.tenants_language_en();
	}
};

/** After saving the tenant form, a confirmation naming the tenant; back in the contract wizard, the wizard confirms */
export function confirmSaved(formData: FormData) {
	const field = (key: string) => String(formData.get(key) ?? '').trim();
	const name = `${field('firstName')} ${field('lastName')}`;
	const quiet = field('for') === 'contract';
	return async ({ result, update }: { result: ActionResult; update: () => Promise<void> }) => {
		if (result.type === 'redirect' && !quiet) addToast('success', m.tenants_saved_toast({ name }));
		await update();
	};
}
