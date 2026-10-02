import type { Actor } from '../fixtures/actor';
import { amount, category, distributionKey, legalNote, utilityCost } from '../interactions/invoice-detail';

export const amountOfInvoice = (actor: Actor) => amount(actor.page);
export const categoryOfInvoice = (actor: Actor) => category(actor.page);
export const distributionKeyOfInvoice = (actor: Actor) => distributionKey(actor.page);
export const utilityCostOfInvoice = (actor: Actor) => utilityCost(actor.page);
export const tenancyLawNote = (actor: Actor) => legalNote(actor.page);
