import { eq, not } from 'drizzle-orm';
import { utilityStatements } from '../db/schema';

/**
 * A replaced statement stays as it was sent, but no longer counts: its period, its rent days and its Akonto belong to
 * its berichtigte Abrechnung (#120, glossary «Ersetzt»). The one place this rule is written (#788)
 */
export const isReplaced = (statement: { status: string }) => statement.status === 'replaced';
export const counting = <S extends { status: string }>(statements: S[]) => statements.filter((s) => !isReplaced(s));

/** The same rule in a query of `utility_statements` */
export const replacedInSql = eq(utilityStatements.status, 'replaced');
export const countingInSql = not(replacedInSql);
