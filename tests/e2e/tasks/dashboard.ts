import type { Actor } from '../fixtures/actor';
import {
	headerAction,
	occupancyBuilding,
	quickAction,
	statementsTile,
	statTile
} from '../interactions/dashboard';

// Labels contain each other ("Vermietet" / "Wiedervermietet"), so tiles are found by their test id
const tiles: Record<string, string> = {
	Gebäude: 'stat-buildings',
	Wohnungen: 'stat-apartments',
	Vermietet: 'stat-occupied',
	Wiedervermietet: 'stat-relet',
	Leer: 'stat-vacant',
	Gesperrt: 'stat-reserved',
	'Davon überfällig': 'stat-overdue-amount'
};
const statementStatuses: Record<string, string> = {
	Entwürfe: 'draft',
	Versendet: 'sent',
	Bezahlt: 'paid',
	Überfällig: 'overdue'
};

export const openBuildingFromOccupancy = (building: string) => async (actor: Actor) => {
	await occupancyBuilding(actor.page, building).click();
};

export const openTile = (label: string) => async (actor: Actor) => {
	await statTile(actor.page, tiles[label]).click();
};

export const openStatementsWithStatus = (label: string) => async (actor: Actor) => {
	await statementsTile(actor.page, statementStatuses[label]).click();
};

export const chooseQuickAction = (label: string) => async (actor: Actor) => {
	await quickAction(actor.page, label).click();
};

export const chooseHeaderAction = (label: string) => async (actor: Actor) => {
	await headerAction(actor.page, label).click();
};
