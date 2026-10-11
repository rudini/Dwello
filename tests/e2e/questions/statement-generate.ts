import type { Actor } from '../fixtures/actor';
import {
	buildingCheckbox,
	buildingInvoices,
	categoryFindings,
	draftsOnlyNote,
	generationResult,
	missingInvoices,
	managementFeeHint,
	periodStartInput,
	previewEmpty,
	previewRows
} from '../interactions/statement-generate';

export const previewRow = (actor: Actor, tenantName: string) =>
	previewRows(actor.page).filter({ hasText: tenantName });
export const allPreviewRows = (actor: Actor) => previewRows(actor.page);
export const noContractsInPeriod = (actor: Actor) => previewEmpty(actor.page);
export const generationOutcome = (actor: Actor) => generationResult(actor.page);
export const feeAboveGuideline = (actor: Actor) => managementFeeHint(actor.page);
export const periodChoice = (actor: Actor) => periodStartInput(actor.page);
export const missingInvoicesWarning = (actor: Actor) => missingInvoices(actor.page);
export const invoicesOfBuilding = (actor: Actor, buildingName: string) => buildingInvoices(actor.page, buildingName);
export const draftsOnly = (actor: Actor) => draftsOnlyNote(actor.page);
export const chosenBuilding = (actor: Actor, buildingId: string) => buildingCheckbox(actor.page, buildingId);
export const categoryFinding = (actor: Actor, category: string) => categoryFindings(actor.page).filter({ hasText: category });
