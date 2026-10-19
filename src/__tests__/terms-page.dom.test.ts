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
		// PO on Fachreview 458-1 R-2: the sections do not name the landlord (Art. 19 Abs. 2 Bst. a DSG)
		expect(section('Verantwortung für Abrechnungen')?.textContent).toContain(
			'Nennen Sie dabei Ihren Namen und wie Ihre Mieter Sie erreichen, und sagen Sie dazu, dass mit «Sie» dort der Vermieter gemeint ist (Art. 19 Abs. 2 DSG).'
		);
	});

	// Persona Helga 458 P-1: each section to pass on is one link away
	it('verlinkt die vier Abschnitte der Datenschutzerklärung, die der Vermieter weitergibt', () => {
		show(TermsPage, { data: { operator: null } } as never);

		const links = [...(section('Verantwortung für Abrechnungen')?.querySelectorAll('a') ?? [])].map((link) => [
			link.textContent,
			link.getAttribute('href')
		]);
		expect(links).toEqual([
			['Verantwortlich', '/privacy#controller'],
			['Welche Daten Dwello speichert', '/privacy#stored'],
			['Aufbewahrung', '/privacy#retention'],
			['Weitergabe an Dritte', '/privacy#third']
		]);
	});

	// Persona Helga 458 P-1, Fachreview 458-2 B: when and how the landlord passes the information on (Art. 19 DSG)
	it('sagt, wann und wie der Vermieter die Angaben weitergibt', () => {
		show(TermsPage, { data: { operator: null } } as never);

		const text = section('Verantwortung für Abrechnungen')?.textContent;
		expect(text).toContain(
			'Geben Sie diese Angaben Ihren Mietern, wenn Sie ihre Daten erhalten, meist beim Abschluss des Mietvertrags, auf Papier oder per E-Mail.'
		);
		expect(text).toContain('spätestens einen Monat danach (Art. 19 Abs. 5 DSG)');
		expect(text).toContain('Ihren heutigen Mietern schicken Sie die Angaben einmal nach.');
	});

	// Persona Dr. Weber 458 P-3, Fachreview 458-2 C: the export answers access and hand-over
	it('nennt «Daten exportieren» für Auskunft und Herausgabe', () => {
		show(TermsPage, { data: { operator: null } } as never);

		expect(section('Verantwortung für Abrechnungen')?.textContent).toContain(
			'Verlangt ein Mieter Auskunft über seine Daten oder ihre Herausgabe, laden Sie sie auf seiner Seite mit «Daten exportieren» herunter'
		);
	});

	// Persona Dr. Weber 458 P-5, Fachreview 458-2 D: an agreement on processing with a provider (Art. 9 DSG)
	it('rät zu einer Vereinbarung über die Auftragsbearbeitung mit einem Anbieter', () => {
		show(TermsPage, { data: { operator: null } } as never);

		expect(section('Zweck')?.textContent).toContain(
			'Schliessen Sie mit einem solchen Anbieter eine Vereinbarung über die Auftragsbearbeitung ab'
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
