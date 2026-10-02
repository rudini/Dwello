import type { Actor } from '../fixtures/actor';
import {
	currentTenantName,
	historyRows,
	infoCard,
	monthlyTotal,
	vacancyNote
} from '../interactions/apartment-detail';
import { breadcrumbLink } from '../interactions/navigation';

export const apartmentInfo = (actor: Actor, info: 'status' | 'rooms' | 'floor' | 'area') =>
	infoCard(actor.page, info);
export const currentTenant = (actor: Actor) => currentTenantName(actor.page);
export const grossMonthlyRent = (actor: Actor) => monthlyTotal(actor.page);
export const vacancy = (actor: Actor) => vacancyNote(actor.page);
export const contractHistory = (actor: Actor) => historyRows(actor.page);
export const buildingOfApartment = (actor: Actor, buildingName: string) => breadcrumbLink(actor.page, buildingName);
