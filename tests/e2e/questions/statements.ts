import type { TestData } from '../fixtures/backend';
import { question } from '../screenplay/actor';
import { Count, Text, ThePage, Visibility } from '../screenplay/questions';
import { statementRow, statementRowForYear, statementRows, statementsEmptyNotice } from '../targets/statements';

export const listedStatement = (tenantName: string) => Text.of(statementRow(tenantName));
export const statementOfYearListed = (tenantName: string, year: number) =>
	Visibility.of(statementRowForYear(tenantName, year));
export const listedStatementsOfYear = (tenantName: string, year: number) =>
	Count.of(statementRowForYear(tenantName, year));
export const listedStatementCount = Count.of(statementRows);
export const statementListEmpty = Visibility.of(statementsEmptyNotice);

export const statementPath = (seed: TestData, tenantName: string, year: number) =>
	`/statements/${seed.idOf(`Abrechnung ${tenantName} ${year}`)}`;
// The address without the origin, to compare with a path such as `statementPath`
export const pageAddressInApp = question('the address of the page in the app', async (actor) => {
	const { pathname, search, hash } = new URL(await actor.answer(ThePage.url));
	return `${pathname}${search}${hash}`;
});
