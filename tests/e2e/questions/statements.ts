import type { Actor } from '../fixtures/actor';
import { statementRow, statementRowForYear, statementRows } from '../interactions/statements';

export const listedStatement = (actor: Actor, tenantName: string) => statementRow(actor.page, tenantName);
export const statementOfYear = (actor: Actor, tenantName: string, year: number) =>
	statementRowForYear(actor.page, tenantName, year);
export const allListedStatements = (actor: Actor) => statementRows(actor.page);
