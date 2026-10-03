import type { Actor } from '../fixtures/actor';
import { categoryWarning, utilityCostCheckbox } from '../interactions/invoice-form';

export const utilityCostChoice = (actor: Actor) => utilityCostCheckbox(actor.page);
export const nonAllocableCategoryWarning = (actor: Actor) => categoryWarning(actor.page);
