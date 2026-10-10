import type { Actor } from '../fixtures/actor';
import { categoryWarning, invoiceDateInput, periodWarning, utilityCostCheckbox } from '../interactions/invoice-form';

export const utilityCostChoice = (actor: Actor) => utilityCostCheckbox(actor.page);
export const nonAllocableCategoryWarning = (actor: Actor) => categoryWarning(actor.page);
export const invoiceDate = (actor: Actor) => invoiceDateInput(actor.page);
export const dateOutsidePeriodWarning = (actor: Actor) => periodWarning(actor.page);
