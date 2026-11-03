import { m } from '$lib/paraglide/messages';
import { francs } from './statement';

/** #508 (Fachreview 508-1): amounts in francs as the backend gives them (backend/src/services/statement-run.service.ts) */
export interface HeatingSum {
	statementId: string;
	costs: string;
	tenants: string;
	landlord: string;
	billed: string;
	difference: string;
	result: 'more' | 'less' | 'equal';
	landlordFor: 'vacancy' | 'leases' | null;
	periodFirst?: boolean; // #1026: the run has heating invoices without Leistungszeitraum beside ones with (#339)
}

const sumCosts = {
	vacancy: m.statements_heating_sum_costs_vacancy,
	leases: m.statements_heating_sum_costs_landlord
};
const sumResult = {
	more: m.statements_heating_sum_more,
	less: m.statements_heating_sum_less,
	equal: m.statements_heating_sum_equal
};

const sumAdvice = {
	more: m.statements_heating_sum_advice_more,
	less: m.statements_heating_sum_advice_less,
	equal: () => ''
};

/**
 * #508: the apartment's heating costs, the landlord's part and what its statements bill for them, in words; #1026: then
 * the advice of the result, or with heating invoices without Leistungszeitraum in the run only to enter it first
 */
export function heatingSumText(sum: HeatingSum, tenant: string) {
	const [costs, tenants, landlord, billed, difference] = [
		sum.costs,
		sum.tenants,
		sum.landlord,
		sum.billed,
		sum.difference
	].map((amount) => francs(Number(amount)));
	const costsText = sum.landlordFor
		? sumCosts[sum.landlordFor]({ costs, tenants, landlord })
		: m.statements_heating_sum_costs({ costs });
	const advice = sum.periodFirst
		? m.statements_heating_sum_period_first()
		: sumAdvice[sum.result]({ tenant });
	return [costsText, sumResult[sum.result]({ billed, difference }), advice]
		.filter(Boolean)
		.join(' ');
}
