/**
 * How well the configured KI (LLM_BASE_URL, LLM_MODEL) judges whether a new category is umlagefähig (#176):
 * cost types from the leaflet of the Mieterverband «Zulässige und unzulässige Nebenkosten» (2026) and
 * Art. 5–6c VMWG, each with the expected answer. Reports the hit rate; no threshold, outside CI. Needs the
 * migrated database (DATABASE_URL): the prompt lists the predefined Kategorien (#202).
 *
 *   bun run llm:eval
 */

import { proposeAllocability } from '../src/services/llm.service';

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
	['Honorar für die Heizkostenabrechnung', false],
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
process.exit(0);
