import type { Actor } from '../fixtures/actor';
import { numberTakenWarning, rentedStatus, statusSelect } from '../interactions/apartment-form';

export const numberTaken = (actor: Actor) => numberTakenWarning(actor.page);

export const statusFromContracts = (actor: Actor) => rentedStatus(actor.page);
export const manualStatusChoice = (actor: Actor) => statusSelect(actor.page);
