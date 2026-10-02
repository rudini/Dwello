import type { Actor } from '../fixtures/actor';
import { listFilter, occupancyCount, occupancyRate } from '../interactions/dashboard';

export const occupancyOf = (actor: Actor, building: string) => occupancyRate(actor.page, building);
export const rentedApartmentsOf = (actor: Actor, building: string) => occupancyCount(actor.page, building);
export const statusFilter = (actor: Actor) => listFilter(actor.page, 'status');
