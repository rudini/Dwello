import { describe, it, expect } from 'vitest';
import TermsPage from '../routes/terms/+page.svelte';
import { byTestId, show } from './helpers/dom';

describe('Nutzungsbedingungen zur Verfügbarkeit', () => {
	it('nennt Betreiber, Adresse und Kontakt der Installation', () => {
		show(TermsPage, {
			data: {
				operator: {
					name: 'Muster Hosting AG',
					address: 'Bahnhofstrasse 1, 8001 Zürich',
					contact: 'betrieb@muster-hosting.ch'
				}
			}
		} as never);

		expect(byTestId('terms-operator')?.textContent).toBe(
			'Betreiber dieser Dwello-Installation ist Muster Hosting AG, Bahnhofstrasse 1, 8001 Zürich. Kontakt: betrieb@muster-hosting.ch.'
		);
	});

	it('lässt Adresse und Kontakt weg, die nicht konfiguriert sind', () => {
		show(TermsPage, {
			data: { operator: { name: 'Muster Hosting AG', address: '', contact: '' } }
		} as never);

		expect(byTestId('terms-operator')?.textContent).toBe(
			'Betreiber dieser Dwello-Installation ist Muster Hosting AG.'
		);
	});

	it('nennt keinen Betreiber, solange keiner konfiguriert ist', () => {
		show(TermsPage, { data: { operator: null } } as never);

		expect(document.querySelector('h1')?.textContent).toBe('Nutzungsbedingungen');
		expect(byTestId('terms-operator')).toBeNull();
	});
});

describe('Nutzungsbedingungen (#82)', () => {
	const demoSection = () =>
		[...document.querySelectorAll('[data-testid="page-section"]')].find(
			(section) => section.querySelector('h2')?.textContent === 'Öffentliche Demo'
		);

	it('sagt in der Demo, dass alle dieselben Daten sehen, jede Nacht alles gelöscht wird und keine echten Daten hingehören', () => {
		show(TermsPage, { data: { operator: null, demo: true } } as never);

		expect(demoSection()?.textContent).toContain(
			'Alle, die sich anmelden, sehen und ändern dieselben Daten, und jede Nacht werden alle Änderungen gelöscht. Geben Sie deshalb keine echten Daten ein'
		);
	});

	it('hat in einer eigenen Installation keinen Abschnitt zur Demo', () => {
		show(TermsPage, { data: { operator: null, demo: false } } as never);

		expect(document.querySelectorAll('[data-testid="page-section"]').length).toBeGreaterThan(0);
		expect(demoSection()).toBeUndefined();
	});

	it('spricht vom Liegenschaftsverwalter, nicht von der Verwaltung', () => {
		show(TermsPage, { data: { operator: null } } as never);

		expect(document.body.textContent).toContain('Der Liegenschaftsverwalter ist dafür verantwortlich, die Mieter');
		expect(document.body.textContent).not.toContain('Verwaltung ist');
	});
});
