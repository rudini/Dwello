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

// #458 (#347): notes, not a contract; a help on informing tenants; the date of the texts
describe('Nutzungsbedingungen ohne Vertrag', () => {
	const section = (title: string) =>
		[...document.querySelectorAll('[data-testid="page-section"]')].find(
			(one) => one.querySelector('h2')?.textContent === title
		);

	it('sagt unter «Zweck», dass die Hinweise keinen Vertrag ersetzen', () => {
		show(TermsPage, { data: { operator: null } } as never);

		expect(section('Zweck')?.textContent).toContain(
			'Diese Hinweise ersetzen keinen Vertrag. Betreibt ein Anbieter Dwello für Sie, gelten die Vereinbarungen mit ihm.'
		);
	});

	it('nennt die Abschnitte der Datenschutzerklärung, die der Vermieter seinen Mietern weitergeben kann', () => {
		show(TermsPage, { data: { operator: null } } as never);

		expect(section('Verantwortung für Abrechnungen')?.textContent).toContain(
			'Sie können Ihren Mietern dazu die Abschnitte «Verantwortlich», «Welche Daten Dwello speichert», «Aufbewahrung» und «Weitergabe an Dritte» der Datenschutzerklärung weitergeben.'
		);
	});

	// Fachreview 458-1 R-6: notes that are no contract cannot exclude a claim; the agreement with a provider decides
	it('überlässt die zugesagte Verfügbarkeit der Vereinbarung mit dem Betreiber', () => {
		show(TermsPage, { data: { operator: null } } as never);

		const text = section('Verfügbarkeit')?.textContent;
		expect(text).toContain('Ob er eine bestimmte Verfügbarkeit zusagt, regelt die Vereinbarung mit ihm.');
		expect(text).not.toContain('Anspruch');
	});

	it('nennt den Stand', () => {
		show(TermsPage, { data: { operator: null } } as never);

		expect(byTestId('legal-as-of')?.textContent).toBe('Stand: 19. Oktober 2026');
	});
});
