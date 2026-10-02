import type { Actor } from '../fixtures/actor';
import {
	generationResult,
	managementFeeHint,
	previewEmpty,
	previewRows
} from '../interactions/statement-generate';

export const previewRow = (actor: Actor, tenantName: string) =>
	previewRows(actor.page).filter({ hasText: tenantName });
export const allPreviewRows = (actor: Actor) => previewRows(actor.page);
export const noContractsInPeriod = (actor: Actor) => previewEmpty(actor.page);
export const generationOutcome = (actor: Actor) => generationResult(actor.page);
export const feeAboveGuideline = (actor: Actor) => managementFeeHint(actor.page);
