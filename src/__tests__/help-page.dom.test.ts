import { describe, it, expect } from 'vitest';
import HelpPage from '../routes/help/+page.svelte';
import { navGroups } from '$lib/navigation';
import { allByTestId, byTestId, show } from './helpers/dom';

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
			'Mietstatus',
			'Befristet / Unbefristet',
			'Kündigungstermin',
			'Kündigungsfrist',
			'Manuell überschrieben'
		]);
		expect(glossary?.textContent).toContain('Ist der Saldo positiv, zahlt der Mieter nach');
		expect(glossary?.textContent).toContain('auf 5 Rappen gerundet');
		expect(glossary?.textContent).toContain(
			'ein Prozentsatz der eigenen Nebenkosten jedes Mieters. Nur zulässig, wenn im Mietvertrag vereinbart; das tragen Sie beim Mietvertrag ein. Üblich sind etwa 3 %'
		);
		expect(glossary?.textContent).not.toContain('Satz und Verteilschlüssel');
		for (const word of ['Nachzahlung', 'Rückerstattung', 'Wiedervermietet', 'Gesperrt'])
			expect(glossary?.textContent).toContain(word);
	});

	// wie das Glossar «Rechnungsdatum» und «Leistungszeitraum»; gleicher Wortlaut wie PR #289 (#67)
	it('sagt, wann das Rechnungsdatum die Abrechnungsperiode bestimmt', () => {
		show(HelpPage, {});
		const glossary = section('Begriffe kurz erklärt')!.textContent;
		expect(glossary).toContain(
			'Ohne Leistungszeitraum bestimmt das Rechnungsdatum, in welche Abrechnungsperiode eine Rechnung fällt. Mit Leistungszeitraum zählen dessen Tage in der Abrechnungsperiode.'
		);
	});

	// Fachreview #69 (M-1, M-2, V-1 bis V-5): die Begriffe sagen, was Glossar und Gesetz sagen
	it('erklärt die Begriffe so, wie Glossar und Mietrecht sie verstehen', () => {
		show(HelpPage, {});
		const glossary = section('Begriffe kurz erklärt')!.textContent;
		for (const said of [
			'Bezahlen muss der Mieter diese Kosten nur, wenn der Mietvertrag sie als Nebenkosten nennt.',
			'eine einzelne Rechnung einer umlagefähigen Kategorie können Sie davon ausnehmen',
			'zu einer versendeten Abrechnung mit Nachzahlung',
			'nach einer eigenen schriftlichen Zahlungsfrist von mindestens 30 Tagen',
			'Zieht ein Mieter während der Abrechnungsperiode ein oder aus, teilt Dwello seine Heizkosten so nach Monaten',
			'bei Heizkosten mit Heizprofil den Anteil seiner Monate',
			'Bei einer Rückerstattung ist es das Datum, bis zu dem Sie ihm den Betrag überweisen («Rückerstattung bis»).',
			'Üblich sind etwa 3 %; ein höherer Satz muss Ihrem tatsächlichen Aufwand entsprechen.'
		])
			expect(glossary).toContain(said);
		for (const old of ['Wechselt der Mieter', 'Leerstand', 'lässt sich pro Rechnung anpassen'])
			expect(glossary).not.toContain(old);
	});

	// Inhaltsverzeichnis mit eigenem Einstieg in die Begriffe (#109)
	it('beginnt mit einem Inhalt, der zu jedem Abschnitt und zu den Begriffen führt', () => {
		show(HelpPage, {});
		const links = [...byTestId('help-contents')!.querySelectorAll('a')];
		const sections = allByTestId('page-section');
		expect(links.map((a) => a.textContent?.trim())).toEqual(
			sections.map((s) => s.querySelector('h2')?.textContent)
		);
		expect(links.map((a) => a.getAttribute('href'))).toEqual(sections.map((s) => `#${s.id}`));
		expect(links.at(-1)?.getAttribute('href')).toBe('#glossary');
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
