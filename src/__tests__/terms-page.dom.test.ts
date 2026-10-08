import { describe, it, expect } from 'vitest';
import TermsPage from '../routes/terms/+page.svelte';
import { byTestId, show } from './helpers/dom';

describe('Nutzungsbedingungen zur Verfügbarkeit', () => {
	it('nennt Betreiber, Adresse und Kontakt der Installation', () => {
		show(TermsPage, {
			data: {
				operator: { name: 'Muster Hosting AG', address: 'Bahnhofstrasse 1, 8001 Zürich', contact: 'betrieb@muster-hosting.ch' }
			}
		} as never);

		expect(byTestId('terms-operator')?.textContent).toBe(
			'Betreiber dieser Dwello-Installation ist Muster Hosting AG, Bahnhofstrasse 1, 8001 Zürich. Kontakt: betrieb@muster-hosting.ch.'
		);
	});

	it('lässt Adresse und Kontakt weg, die nicht konfiguriert sind', () => {
		show(TermsPage, { data: { operator: { name: 'Muster Hosting AG', address: '', contact: '' } } } as never);

		expect(byTestId('terms-operator')?.textContent).toBe('Betreiber dieser Dwello-Installation ist Muster Hosting AG.');
	});

	it('nennt keinen Betreiber, solange keiner konfiguriert ist', () => {
		show(TermsPage, { data: { operator: null } } as never);

		expect(byTestId('page-title')).not.toBeNull();
		expect(byTestId('terms-operator')).toBeNull();
	});
});
