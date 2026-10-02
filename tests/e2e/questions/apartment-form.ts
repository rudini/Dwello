import type { Actor } from '../fixtures/actor';
import { numberTakenWarning } from '../interactions/apartment-form';

export const numberTaken = (actor: Actor) => numberTakenWarning(actor.page);
