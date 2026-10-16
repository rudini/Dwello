import { describe, it, expect, vi } from 'vitest';
import HelpPage from '../routes/help/+page.svelte';
import { navGroups } from '$lib/navigation';
import { allByTestId, show } from './helpers/dom';

const section = (title: string) =>
	allByTestId('page-section').find((s) => s.querySelector('h2')?.textContent === title);

describe('Hilfe', () => {
	it('nennt die Bereiche mit den Namen der Hauptnavigation', () => {
		show(HelpPage, {});

		const text = document.body.textContent ?? '';
		const names = navGroups
			.flatMap((g) => g.items.map((i) => i.label))
			.filter((l) => l !== 'Hilfe');
		for (const name of names) expect(text).toContain(`«${name}»`);
		for (const old of ['«Verträge»', '«Abrechnungen»', '«Konfiguration»'])
			expect(text).not.toContain(old);
	});

	// Kosten über mehrere Jahre mit dem Jahr der Beispiele der Datumsfelder (#250, #254)
	it('erklärt Kosten über mehrere Jahre und den Boiler in der Wohnung', () => {
		vi.useFakeTimers({ toFake: ['Date'] });
		vi.setSystemTime(new Date('2027-03-01T10:00:00Z'));
		try {
			show(HelpPage, {});

			const invoices = section('Rechnungen erfassen')!.textContent;
			expect(invoices).toContain('Geben Sie dann 01.04.2027 bis 31.03.2032 ein.');
			expect(invoices).toContain('Bei einem Boiler in der Wohnung ist das umstritten');
			// das Glossar widerspricht dem Absatz nicht (Personas Dr. Weber P-1, Helga P-4)
			expect(section('Begriffe kurz erklärt')!.textContent).toContain(
				'Ohne Leistungszeitraum bestimmt das Rechnungsdatum, in welche Abrechnungsperiode eine Rechnung fällt.'
			);
		} finally {
			vi.useRealTimers();
		}
	});

	it('erklärt die Fachbegriffe in einfachen Worten', () => {
		show(HelpPage, {});

		const glossary = section('Begriffe kurz erklärt');
		expect([...(glossary?.querySelectorAll('dt') ?? [])].map((dt) => dt.textContent)).toEqual([
			'Abrechnungsperiode',
			'Akonto',
			'Nettomiete',
			'Zusatzmiete',
			'Verteilschlüssel',
			'Heizprofil',
			'Verwaltungspauschale',
			'Mietstage',
			'Umlagefähig',
			'Saldo',
			'Zahlungsfrist',
			'Mahnung',
			'Korrespondenzkanal',
			'Mietstatus'
		]);
		expect(glossary?.textContent).toContain('Ist der Saldo positiv, zahlt der Mieter nach');
		expect(glossary?.textContent).toContain('auf 5 Rappen gerundet');
		expect(glossary?.textContent).toContain('ein Prozentsatz der eigenen Nebenkosten jedes Mieters. Üblich sind bis 3 %.');
		expect(glossary?.textContent).not.toContain('Satz und Verteilschlüssel');
		for (const word of ['Nachzahlung', 'Rückerstattung', 'Wiedervermietet', 'Gesperrt'])
			expect(glossary?.textContent).toContain(word);
	});

	it('erklärt die beiden geführten Abläufe Schritt für Schritt', () => {
		show(HelpPage, {});

		const contract = section('Mieter und Mietverträge verwalten')?.textContent;
		expect(contract).toContain('«Mietvertrag erfassen»');
		expect(contract).toContain('Mieter, Wohnung, Vertragsdauer, Miete und Prüfen');
		expect(contract).toContain('Auf der Seite eines Mieters laden Sie unter «Dokument hochladen» Dateien hoch');
		const statements = section('Nebenkostenabrechnungen erstellen')?.textContent;
		expect(statements).toContain('«Abrechnungen erstellen»');
		expect(statements).toContain(
			'Abrechnungsperiode, Gebäude, Heizprofil und Verwaltungspauschale, Vorschau und Erstellen'
		);
	});

	it('nennt das Hochladen mehrerer Rechnungen (Persona Anna)', () => {
		show(HelpPage, {});
		expect(section('Rechnungen erfassen')?.textContent).toContain(
			'Mehrere Rechnungen auf einmal: Wählen Sie unter «Rechnungen» «Rechnungen hochladen». Die KI liest die Dateien aus, und Sie prüfen die Angaben, bevor Dwello die Rechnungen erstellt.'
		);
	});

	it('sagt, dass Dwello Abrechnungen nicht selbst verschickt', () => {
		show(HelpPage, {});

		const text = section('Nebenkostenabrechnungen erstellen')?.textContent;
		expect(text).toContain('Dwello verschickt die Abrechnungen nicht selbst');
		expect(text).toContain('«Als versendet markieren»');
	});
});
