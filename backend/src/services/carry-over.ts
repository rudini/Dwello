/**
 * The Übertrag (#448) in SQL on `utility_statements`: which Saldo is carried over, which statement counts it, when none
 * will (#506, Fachreview 506-1) and which one a draft would count now. Each rule takes the name of the row it is about,
 * the table or an alias, so a subquery can ask it of another row (code review 506-1 C-1)
 */
import { eq, sql, type SQL } from 'drizzle-orm';
import { db } from '../db/connection';
import { tenants, utilityStatements } from '../db/schema';

const T = 'utility_statements';

// A Saldo carried over: settled with a Saldo other than 0.00, or a refund below CHF 5 settled under #94, which the
// tenant is still owed (PO 2026-10-19); a Nachzahlung waived under #94 stays waived
const carriableOf = (t: string) =>
	sql.raw(`((${t}.status = 'settled' and ${t}.balance <> 0)
		or (${t}.status = 'paid' and ${t}.paid_amount = 0 and ${t}.balance < 0 and ${t}.balance > -5))`);

// The number of the sent statement of another period that counts the Saldo as its Übertrag (#448); a berichtigte
// Abrechnung of the same period counts it again; a draft may still change (Fachreview 448-2 V-14)
const countedByOf = (t: string) =>
	sql.raw(`(
		select counting.statement_number from utility_statements counting
		where counting.carried_from_id = ${t}.id and counting.status <> 'draft'
			and (counting.period_start <> ${t}.period_start or counting.period_end <> ${t}.period_end)
		limit 1
	)`);

/**
 * #506: no statement will count the Übertrag: a later sent statement of the contract counts another one or none (a),
 * the contract ends in its period (b), or after it the contract pays a Nebenkostenpauschale only, without Akonto
 * above 0 and without agreed costs (c, Fachreview 506-1 V-3)
 */
const unreachableOf = (t: string) =>
	sql.raw(`(
		exists (
			select 1 from utility_statements later
			where later.contract_id = ${t}.contract_id and later.status not in ('draft', 'replaced')
				and later.period_start > ${t}.period_end and later.carried_from_id is distinct from ${t}.id
		)
		or exists (
			select 1 from rental_contracts c
			where c.id = ${t}.contract_id and (
				c.end_date <= ${t}.period_end
				or (
					c.flat_rate_utility_charge > 0
					and not exists (
						select 1 from contract_advance_payments a
						where a.contract_id = c.id and a.amount > 0 and (a.valid_from > ${t}.period_end + 1 or a.valid_from = (
							-- the Akonto that applies on the day after the period (PR #941 review)
							select max(b.valid_from) from contract_advance_payments b
							where b.contract_id = c.id and b.valid_from <= ${t}.period_end + 1
						))
					)
					and not exists (select 1 from contract_categories k where k.contract_id = c.id and k.agreed)
				)
			)
		)
	)`);

// #506: an Übertrag no statement counts and none will, not settled by hand: the landlord settles it himself
const openOf = (t: string) =>
	sql`coalesce(${carriableOf(t)} and ${sql.raw(`${t}.carry_settled_on is null`)} and ${countedByOf(t)} is null and ${unreachableOf(t)}, false)`;

export const carriable = carriableOf(T);
export const countedBy = sql<string | null>`${countedByOf(T)}`;
export const openCarry = sql<boolean>`${openOf(T)}`;

/**
 * The Übertrag (#448) a statement of the contract and period counts: the latest earlier statement of the contract with
 * a Saldo carried over, not open or settled by hand (#506, Fachreview 506-1 V-1), that no statement of another period
 * counts yet; one rule for the calculation and for a draft's check (code review 506-2 C-7)
 */
const carriedNow = (contract: SQL, start: SQL, end: SQL) => sql`(
	select prev.id from utility_statements prev
	where prev.contract_id = ${contract} and ${carriableOf('prev')} and prev.carry_settled_on is null
		and not ${openOf('prev')} and prev.period_end < ${start}
		and not exists (
			select 1 from utility_statements counting
			where counting.carried_from_id = prev.id and (counting.period_start <> ${start} or counting.period_end <> ${end})
		)
	order by prev.period_end desc limit 1
)`;

/** The id of the Übertrag a new statement of the contract and period counts */
export const carriedOverId = (contractId: string, periodStart: string, periodEnd: string) =>
	carriedNow(sql`${contractId}::uuid`, sql`${periodStart}::date`, sql`${periodEnd}::date`);

// #506 C: a draft that would count another Übertrag now than the one it counts (Fachreview 448-3 V-23)
const row = (column: string) => sql.raw(`${T}.${column}`);
export const carryChanged = sql<boolean>`(${row('status')} = 'draft' and ${carriedNow(row('contract_id'), row('period_start'), row('period_end'))} is distinct from ${row('carried_from_id')})`;

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
