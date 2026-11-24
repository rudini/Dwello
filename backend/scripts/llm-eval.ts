/**
 * How well the configured KI (LLM_BASE_URL, LLM_MODEL) judges whether a new category is umlagefähig (#176):
 * cost types from the leaflet of the Mieterverband «Zulässige und unzulässige Nebenkosten» (2026) and
 * Art. 5–6c VMWG, each with the expected answer. Reports the hit rate; no threshold, outside CI. Needs the
 * migrated database (DATABASE_URL): the prompt lists the predefined Kategorien (#202).
 * Then how it reads the Leistungszeitraum of the invoices in llm-eval/ (#1474).
 *
 *   bun run llm:eval
 */

import { extractInvoice, proposeAllocability } from '../src/services/llm.service';

// [cost type as a landlord would name the category, umlagefähig]
const cases: [string, boolean][] = [
	['Heizöl', true],
	['Brennerservice', true],
	['Kaminfeger', true],
	['Tankrevision', true],
	['Fernwärme', true],
	['Strom aus dem Zusammenschluss zum Eigenverbrauch (ZEV)', true],
	['Ablesung der Wärmezähler', true],
	['Entkalkung des Boilers', true],
	['Wasserverbrauch', true],
	['Abwassergebühr nach Verbrauch', true],
	['Kehrichtgebühr nach Verbrauch', true],
	['Allgemeinstrom Treppenhaus', true],
	['Strom für den Lift', true],
	['Lift-Notruftelefon', true],
	['Hauswart Reinigung', true],
	['Treppenhausreinigung', true],
	['Rasenmähen und Laubentfernung', true],
	['Benzin für den Rasenmäher', true],
	['Schneeräumung', true],
	['Kabelfernsehen Grundnutzungsgebühr', true],
	['Versicherung der Heizungsanlage', true],
	['Verwaltung des Heizbetriebs', true],
	['Liftreparatur', false],
	['Ersatzteile Lift', false],
	['Heizungsreparatur', false],
	['Amortisation der Heizungsanlage', false],
	['Dachsanierung', false],
	['Fassadenrenovation', false],
	['Serviceabo Flachdach', false],
	['Gebäudeversicherung', false],
	['Liegenschaftssteuer', false],
	['Hypothekarzinsen', false],
	['Meteorabwasser', false],
	['Ersatz der Waschmaschine', false],
	['Neubepflanzung im Garten', false],
	['Anschaffung Rasenmäher', false],
	['Schädlingsbekämpfung', false],
	['Wartung der Feuerlöscher', false],
	['Entsorgung von Grümpel', false],
	['Räumung des Estrichs', false],
	['Baumfällung', false],
	['Installation des Kabelanschlusses', false],
	['Rasensanierung', false],
	['Kehrichtgrundgebühr nach Gebäudeversicherungswert', false],
	['Honorar der Verwaltung für die Heizkostenabrechnung', false],
	// Art. 5 Abs. 2 Bst. f VMWG: a third party's service for the consumption-based heating statement (Fachreview 452-3 V-1)
	['Abrechnungsservice für die verbrauchsabhängige Heizkostenabrechnung', true],
	['Gebühren für die Verwaltungsapp', false],
	['Honorar für die Nebenkostenabrechnung', false]
];

let hits = 0;
for (const [name, expected] of cases) {
	const proposal = await proposeAllocability({ name }).catch(() => null);
	const answer = proposal ? String(proposal.isAllowedUtilityCost) : 'kein Vorschlag';
	if (proposal?.isAllowedUtilityCost === expected) hits++;
	console.log(`${proposal?.isAllowedUtilityCost === expected ? 'ok    ' : 'FALSCH'} ${name}: erwartet ${expected}, KI ${answer}`);
}
console.log(`Trefferquote: ${hits} von ${cases.length} (${Math.round((hits / cases.length) * 100)} %)`);

// [invoice image in llm-eval/, Leistungszeitraum the KI should read: start, end]; the one delivery date of goods is
// both, the day of a service none (#1474)
const invoices: [string, string | null, string | null][] = [
	['heizoel-lieferdatum.png', '2026-06-28', '2026-06-28'], // Lieferdatum 28.06., Rechnungsdatum 05.07.
	['heizoel-bestelldatum.png', '2026-01-08', '2026-01-08'], // bestellt 15.12.2025, geliefert 08.01., Rechnung 12.01.
	['pellets-zwei-lieferungen.png', null, null], // two delivery days: no Leistungszeitraum
	['kaminfeger-ausgefuehrt-am.png', null, null],
	['werke-leistungszeitraum.png', '2026-01-01', '2026-03-31'],
	['hauswart-ohne-datum.png', null, null]
];
let read = 0;
for (const [file, start, end] of invoices) {
	const image = Buffer.from(await Bun.file(`${import.meta.dir}/llm-eval/${file}`).arrayBuffer()).toString('base64');
	const extraction = await extractInvoice(file, [`data:image/png;base64,${image}`]).catch(() => null);
	const fields = extraction && extraction !== 'unreadable' ? extraction.fields : null;
	const ok = !!fields && fields.servicePeriodStart === start && fields.servicePeriodEnd === end;
	if (ok) read++;
	const answer = fields ? `${fields.servicePeriodStart} bis ${fields.servicePeriodEnd}` : 'kein Vorschlag';
	console.log(`${ok ? 'ok    ' : 'FALSCH'} ${file}: erwartet ${start} bis ${end}, KI ${answer}`);
}
console.log(`Leistungszeitraum: ${read} von ${invoices.length}`);
process.exit(0);
