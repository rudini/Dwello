import type { Actor } from '../fixtures/actor';
import { apartmentOption } from '../interactions/contract-form';

export const apartmentChoice = (actor: Actor, apartmentId: string) =>
	apartmentOption(actor.page, apartmentId);
