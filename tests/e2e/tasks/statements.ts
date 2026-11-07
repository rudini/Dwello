import type { Activity } from '../screenplay/actor';
import { Click, DownloadFrom, Enter, Navigate, Select, Wait } from '../screenplay/interactions';
import { statementStatus } from '../targets/statement-detail';
import {
	draftFilter,
	settledFilter,
	overdueFilter,
	generateStatementsButton,
	emptyResetFiltersButton,
	nextPageLink,
	openStatementLink,
	resetFiltersButton,
	scopeContractLink,
	statementBuildingFilter,
	statementPdfLink,
	statementPdfMissingLink,
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

export const showSettledOfBuilding = (buildingId: string): Activity => (actor) =>
	actor.attemptsTo(
		showStatementsOfBuilding(buildingId),
		Click.on(settledFilter),
		filteredBy({ building: buildingId, status: 'settled' })
	);

// #1186: a status no statement of the building has
export const showOverdueOfBuilding = (buildingId: string): Activity => (actor) =>
	actor.attemptsTo(
		showStatementsOfBuilding(buildingId),
		Click.on(overdueFilter),
		filteredBy({ building: buildingId, status: 'overdue' })
	);

export const turnToNextPage = Click.on(nextPageLink);
export const startGeneratingStatements = Click.on(generateStatementsButton);
// until its page is there: a step after it (a deletion meanwhile, #1094) must not overtake the navigation
export const openStatement = (tenantName: string, year: number): Activity => (actor) =>
	actor.attemptsTo(Click.on(openStatementLink(tenantName, year)), Wait.until(statementStatus));
export const openStatementWithoutPdf = (tenantName: string, year: number) =>
	Click.on(statementPdfMissingLink(tenantName, year));
export const downloadStatementPdfFromList = (tenantName: string, year: number) =>
	DownloadFrom(statementPdfLink(tenantName, year));
/** Follows the list's PDF link in the tab, as a browser does when the answer is no PDF */
export const requestStatementPdfFromList = (tenantName: string, year: number) => Click.on(statementPdfLink(tenantName, year));
// #673: back to the contract the list is filtered by; the reset waits until the search is gone from the address
export const goToScopeContract = Click.on(scopeContractLink);
const resetFrom = (button: typeof resetFiltersButton): Activity => (actor) =>
	actor.attemptsTo(
		Click.on(button),
		Wait.forUrl((url) => url.pathname === '/statements' && !url.searchParams.has('search'))
	);
export const resetStatementFilters = resetFrom(resetFiltersButton);
export const resetStatementFiltersWithoutResults = resetFrom(emptyResetFiltersButton);

// #1162: a second tap on the chosen tile shows every status again
export const clearDraftFilter: Activity = (actor) =>
	actor.attemptsTo(Click.on(draftFilter), Wait.forUrl((url) => !url.searchParams.has('status')));
