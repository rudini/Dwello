import type { Actor } from '../fixtures/actor';
import { rentalApartment, rentalRent, rentalStart } from '../interactions/tenant-detail';

export const rentedApartment = (actor: Actor) => rentalApartment(actor.page);
export const monthlyRent = (actor: Actor) => rentalRent(actor.page);
export const rentalStartDate = (actor: Actor) => rentalStart(actor.page);
