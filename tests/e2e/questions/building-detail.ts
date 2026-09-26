import type { Actor } from '../fixtures/actor';
import { apartmentRow, yearBuiltValue } from '../interactions/building-detail';

export const listedApartment = (actor: Actor, number: string) => apartmentRow(actor.page, number);
export const yearBuilt = (actor: Actor) => yearBuiltValue(actor.page);
