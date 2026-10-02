import type { Actor } from '../fixtures/actor';
import { occupancyBuilding, overdueStatementsTile, quickAction, vacantTile } from '../interactions/dashboard';

const tiles = { Leer: vacantTile };

export const openBuildingFromOccupancy = (building: string) => async (actor: Actor) => {
	await occupancyBuilding(actor.page, building).click();
};

export const openTile = (label: keyof typeof tiles) => async (actor: Actor) => {
	await tiles[label](actor.page).click();
};

export const openOverdueStatements = async (actor: Actor) => {
	await overdueStatementsTile(actor.page).click();
};

export const chooseQuickAction = (label: string) => async (actor: Actor) => {
	await quickAction(actor.page, label).click();
};
