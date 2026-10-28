/**
 * The Übertrag (#448) in SQL on `utility_statements`: which Saldo is carried over, which statement counts it, and when
 * none will (#506, Fachreview 506-1)
 */
import { and, eq, isNull, or, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { contractAdvancePayments, contractCategories, rentalContracts, tenants, utilityStatements } from '../db/schema';

// The number of the sent statement of another period that counts this statement's Saldo as its Übertrag (#448); a
// berichtigte Abrechnung of the same period counts it again; a draft may still change (Fachreview 448-2 V-14)
export const countedBy = sql<string | null>`(
	select counting.statement_number from utility_statements counting
	where counting.carried_from_id = utility_statements.id and counting.status <> 'draft'
		and (counting.period_start <> utility_statements.period_start or counting.period_end <> utility_statements.period_end)
	limit 1
)`; // the outer table by its name: drizzle writes a column of a single-table select without it
// A Saldo carried over: settled with a Saldo other than 0.00, or a refund below CHF 5 settled under #94, which the
// tenant is still owed (PO 2026-10-19); a Nachzahlung waived under #94 stays waived
export const carriable = or(
	and(eq(utilityStatements.status, 'settled'), sql`${utilityStatements.balance} <> 0`),
	and(eq(utilityStatements.status, 'paid'), sql`${utilityStatements.paidAmount} = 0 and ${utilityStatements.balance} < 0 and ${utilityStatements.balance} > -5`)
);

/**
 * #506: no statement will count the Übertrag: a later sent statement of the contract counts another one or none (a),
 * the contract ends in its period (b), or after it the contract pays a Nebenkostenpauschale only, without Akonto
 * above 0 and without agreed costs (c, Fachreview 506-1 V-3)
 */
const unreachable = sql`(
	exists (
		select 1 from utility_statements later
		where later.contract_id = utility_statements.contract_id and later.status not in ('draft', 'replaced')
			and later.period_start > utility_statements.period_end and later.carried_from_id is distinct from utility_statements.id
	)
	or exists (
		select 1 from ${rentalContracts} c
		where c.id = utility_statements.contract_id and (
			c.end_date <= utility_statements.period_end
			or (
				c.flat_rate_utility_charge > 0
				and not exists (
					select 1 from ${contractAdvancePayments} a
					where a.contract_id = c.id and a.amount > 0 and (a.valid_from > utility_statements.period_end or a.valid_from = (
						select max(b.valid_from) from ${contractAdvancePayments} b
						where b.contract_id = c.id and b.valid_from <= utility_statements.period_end
					))
				)
				and not exists (select 1 from ${contractCategories} k where k.contract_id = c.id and k.agreed)
			)
		)
	)
)`;

/** #506: an Übertrag no statement counts and none will, not settled by hand: the landlord settles it himself */
export const openCarry = sql<boolean>`coalesce(${and(carriable, isNull(utilityStatements.carrySettledOn), sql`${countedBy} is null`, unreachable)}, false)`;

/** The open Überträge for the Übersicht (#506), the oldest first */
export const openCarryOvers = () =>
	db
		.select({
			id: utilityStatements.id,
			statementNumber: utilityStatements.statementNumber,
			tenantName: sql<string>`${tenants.firstName} || ' ' || ${tenants.lastName}`,
			balance: utilityStatements.balance
		})
		.from(utilityStatements)
		.innerJoin(tenants, eq(utilityStatements.tenantId, tenants.id))
		.where(openCarry)
		.orderBy(utilityStatements.periodEnd);
