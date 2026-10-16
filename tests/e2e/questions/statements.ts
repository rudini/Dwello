import type { TestData } from '../fixtures/backend';
import { question } from '../screenplay/actor';
import { Count, DownloadedFile, Text, ThePage, Visibility } from '../screenplay/questions';
import { statementRow, statementRowForYear, statementRows, statementsEmptyNotice, statementsScope, statusCount } from '../targets/statements';

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
export const listScope = Text.of(statementsScope);
export const countedStatements = (status: string) => Text.of(statusCount(status));

// The statement number NK-{building}-{year}-NNNN, in a row of the list or in the title of the detail page
const STATEMENT_NUMBER = /NK-[0-9A-F]{8}-\d{4}-\d{4}/;
export const listedStatementNumber = (tenantName: string) =>
	question(`the number of the statement of ${tenantName} in the list`, async (actor) =>
		(await actor.answer(listedStatement(tenantName)))?.match(STATEMENT_NUMBER)?.[0] ?? null
	);
const statementNumberOfPage = question('the number of the statement on the page', async (actor) =>
	(await actor.answer(ThePage.title)).match(STATEMENT_NUMBER)?.[0] ?? null
);
// the name of the downloaded file, the number of the statement on the page written as «<Nummer>»
export const downloadedFileNameByNumber = question('the downloaded file name by the number on the page', async (actor) => {
	const number = await actor.answer(statementNumberOfPage);
	const name = (await actor.answer(DownloadedFile)).name;
	return number ? name.replace(number, '<Nummer>') : name;
});
