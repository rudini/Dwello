import type { Activity } from '../screenplay/actor';
import { Click, DownloadFrom, Enter, Navigate, Select, Wait } from '../screenplay/interactions';
import {
	draftFilter,
	generateStatementsButton,
	nextPageLink,
	openStatementLink,
	statementBuildingFilter,
	statementPdfLink,
	statementSearchButton,
	statementSearchInput
} from '../targets/statements';

export const openStatementList = Navigate.to('/statements');

// Filters navigate on the client; the list is filtered once the URL carries them
const filteredBy = (filters: Record<string, string>) =>
	Wait.forUrl((url) => Object.entries(filters).every(([key, value]) => url.searchParams.get(key) === value));

export const searchStatements = (term: string): Activity => (actor) =>
	actor.attemptsTo(
		Enter.theValue(term).into(statementSearchInput),
		Click.on(statementSearchButton),
		filteredBy({ search: term }) // the list shown is the result, not the page before
	);

export const showStatementsOfBuilding = (buildingId: string): Activity => (actor) =>
	actor.attemptsTo(
		Select.option(buildingId).from(statementBuildingFilter),
		Click.on(statementSearchButton),
		filteredBy({ building: buildingId })
	);

// The building is chosen before the page is hydrated; the search runs once it is
export const showStatementsOfBuildingWhileLoading = (buildingId: string): Activity => (actor) =>
	actor.attemptsTo(
		Navigate.toWithScriptsHeldBack('/statements'),
		Select.option(buildingId).from(statementBuildingFilter),
		Navigate.releaseScripts,
		Click.on(statementSearchButton),
		filteredBy({ building: buildingId })
	);

export const showDraftsOfBuilding = (buildingId: string): Activity => (actor) =>
	actor.attemptsTo(
		showStatementsOfBuilding(buildingId),
		Click.on(draftFilter),
		filteredBy({ building: buildingId, status: 'draft' })
	);

export const turnToNextPage = Click.on(nextPageLink);
export const startGeneratingStatements = Click.on(generateStatementsButton);
export const openStatement = (tenantName: string, year: number) => Click.on(openStatementLink(tenantName, year));
export const downloadStatementPdfFromList = (tenantName: string, year: number) =>
	DownloadFrom(statementPdfLink(tenantName, year));
