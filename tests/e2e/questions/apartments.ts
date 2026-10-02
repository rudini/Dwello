import type { Actor } from '../fixtures/actor';
import { apartmentCards, apartmentStatus } from '../interactions/apartments';

export const occupancyOf = (actor: Actor, number: string) => apartmentStatus(actor.page, number);
export const allListedApartments = (actor: Actor) => apartmentCards(actor.page);
