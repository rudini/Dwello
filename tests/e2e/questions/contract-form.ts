import type { Actor } from '../fixtures/actor';
import { apartmentOption, draftRestored, reviewItem, successToast, tenantSelect } from '../interactions/contract-form';

export const apartmentChoice = (actor: Actor, apartmentId: string) => apartmentOption(actor.page, apartmentId);
export const chosenTenant = (actor: Actor) => tenantSelect(actor.page);
export const chosenTenantName = (actor: Actor) =>
	tenantSelect(actor.page).evaluate((select: HTMLSelectElement) => select.selectedOptions[0]?.text.trim() ?? '');
export const reviewed = (actor: Actor, label: string) => reviewItem(actor.page, label);
export const restoredDraft = (actor: Actor) => draftRestored(actor.page);
export const confirmation = (actor: Actor) => successToast(actor.page);
