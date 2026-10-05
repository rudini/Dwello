import type { Tenant } from './types';

/** Languages a tenant's statements can be written in */
export const languageLabels: Record<Tenant['language'], string> = {
	de: 'Deutsch',
	fr: 'Französisch',
	it: 'Italienisch',
	rm: 'Rätoromanisch',
	en: 'Englisch'
};
