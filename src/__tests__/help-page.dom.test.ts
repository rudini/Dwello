import { describe, it, expect } from 'vitest';
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
		expect(contract).toContain('Unter «Dokumente» auf der Seite eines Mieters laden Sie Dateien hoch');
		const statements = section('Nebenkostenabrechnungen erstellen')?.textContent;
		expect(statements).toContain('«Abrechnungen erstellen»');
		expect(statements).toContain(
			'Abrechnungsperiode, Gebäude, Heizprofil und Verwaltungspauschale, Vorschau und Erstellen'
		);
	});

	it('sagt, dass Dwello Abrechnungen nicht selbst verschickt', () => {
		show(HelpPage, {});

		const text = section('Nebenkostenabrechnungen erstellen')?.textContent;
		expect(text).toContain('Dwello verschickt die Abrechnungen nicht selbst');
		expect(text).toContain('«Als versendet markieren»');
	});
});
