import { question } from '../screenplay/actor';
import { Count, Text, Visibility } from '../screenplay/questions';
import {
	previewReconciliation,
	draftsNoteLinks,
	reconciliationCells,
	reconciliationHelp,
	reconciliationNotes,
	reconciliationRowCells,
	reconciliationSentence,
	reportPeriod,
	reportReconciliation
} from '../targets/cost-reconciliation';

// #1126: what a Kostenabstimmung shows: in the preview, of a building, or without one the one on «Berichte»
export type Place = { name: string; id: string } | null;
const scopeOf = (building: Place) => (building ? previewReconciliation(building.name, building.id) : reportReconciliation);
export const cellsOf = (building: Place) => Text.ofAll(reconciliationCells(scopeOf(building)));
export const rowOf = (building: Place, label: string) => Text.ofAll(reconciliationRowCells(scopeOf(building), label));
export const textOf = (building: Place) => Text.of(scopeOf(building));
export const shown = (building: Place) => Visibility.of(scopeOf(building));
export const helpOf = (building: Place) => Text.of(reconciliationHelp(scopeOf(building)));
export const sentenceOf = (building: Place, topic: 'fuel-stock' | 'vacancy') =>
	question(`the sentences of ${scopeOf(building)} on ${topic}`, async (actor) =>
		joined(await actor.answer(Text.ofAll(reconciliationSentence(scopeOf(building), topic))))
	);
const joined = (texts: string[]) => texts.join(' ');
export const notesOf = (building: Place) =>
	question(`the notes of ${scopeOf(building)}`, async (actor) => joined(await actor.answer(Text.ofAll(reconciliationNotes(scopeOf(building))))));
export const noteCount = (building: Place) => Count.of(reconciliationNotes(scopeOf(building)));
export const reportPeriodName = (buildingId: string, periodStart: string) => Text.of(reportPeriod(buildingId, periodStart));
export const draftsNamed = Text.ofAll(draftsNoteLinks(reportReconciliation));
