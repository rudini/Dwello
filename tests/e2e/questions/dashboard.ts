import type { Actor } from '../fixtures/actor';
import { listFilter, occupancyCount, occupancyRate } from '../interactions/dashboard';

// The status a list page was opened with, in the words of the dashboard
const statuses: Record<string, string> = {
	Vermietet: 'occupied',
	Wiedervermietet: 'relet',
	Leer: 'vacant',
	Gesperrt: 'reserved',
	Entwürfe: 'draft',
	Versendet: 'sent',
	Bezahlt: 'paid',
	Überfällig: 'overdue'
};

export const occupancyOf = (actor: Actor, building: string) => occupancyRate(actor.page, building);
export const rentedApartmentsOf = (actor: Actor, building: string) => occupancyCount(actor.page, building);
export const statusFilter = (actor: Actor) => listFilter(actor.page, 'status');
export const statusFilterFor = (label: string) => statuses[label];
