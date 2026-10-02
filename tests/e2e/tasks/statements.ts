import type { Actor } from '../fixtures/actor';
import {
	draftFilter,
	filteredBy,
	generateStatementsButton,
	nextPageLink,
	openStatementLink,
	statementBuildingFilter,
	statementSearchButton,
	statementSearchInput
} from '../interactions/statements';

export const searchStatements = (term: string) => async (actor: Actor) => {
	await statementSearchInput(actor.page).fill(term);
	await statementSearchButton(actor.page).click();
};

export const showStatementsOfBuilding = (buildingId: string) => async (actor: Actor) => {
	await statementBuildingFilter(actor.page).selectOption(buildingId);
	await statementSearchButton(actor.page).click();
	await filteredBy(actor.page, { building: buildingId });
};

export const showDraftsOfBuilding = (buildingId: string) => async (actor: Actor) => {
	await showStatementsOfBuilding(buildingId)(actor);
	await draftFilter(actor.page).click();
	await filteredBy(actor.page, { building: buildingId, status: 'draft' });
};

export const turnToNextPage = async (actor: Actor) => {
	await nextPageLink(actor.page).click();
};

export const startGeneratingStatements = async (actor: Actor) => {
	await generateStatementsButton(actor.page).click();
};

export const openStatement = (tenantName: string, year: number) => async (actor: Actor) => {
	await openStatementLink(actor.page, tenantName, year).click();
};
