import type { Activity } from '../screenplay/actor';
import { Click, Enter, Navigate, Select, Wait } from '../screenplay/interactions';
import { Visibility } from '../screenplay/questions';
import {
	contractBuildingFilter,
	contractRow,
	contractRows,
	contractSearchButton,
	contractSearchInput,
	contractStatusFilter,
	newContractButton,
	viewContractButton
} from '../targets/contracts';

export const openContractList = Navigate.to('/contracts');

// The search navigates on the client: the next step acts on its result, and a navigation of its own would otherwise
// interrupt it (WebKit, #424)
export const searchContracts = (term: string): Activity => (actor) =>
	actor.attemptsTo(
		Enter.theValue(term).into(contractSearchInput),
		Click.on(contractSearchButton),
		Wait.forUrl((url) => url.searchParams.get('search') === term)
	);

export const filterContracts =
	(filter: { buildingId?: string; status?: 'active' | 'ended' }): Activity =>
	async (actor) => {
		if (filter.buildingId) await actor.attemptsTo(Select.option(filter.buildingId).from(contractBuildingFilter));
		if (filter.status) await actor.attemptsTo(Select.option(filter.status).from(contractStatusFilter));
		await actor.attemptsTo(
			Click.on(contractSearchButton),
			Wait.forUrl(
				(url) =>
					(!filter.buildingId || url.searchParams.get('building') === filter.buildingId) &&
					(!filter.status || url.searchParams.get('status') === filter.status)
			)
		);
	};

export const startNewContract = Click.on(newContractButton);
// The list pages 12 contracts, newest start first: a scenario's own contract with an early start moves to page 2 once
// parallel scenarios created later ones, so a row the open page lacks is found by the tenant's suffixed name (#1163);
// only then, so a page that shows it keeps its address and history; the list has rows once it rendered (the own
// contract exists), so the check waits for them first (Fallback review, Medium)
const findContract = (tenantName: string): Activity => async (actor) => {
	await actor.attemptsTo(Wait.until(contractRows));
	if (!(await actor.answer(Visibility.of(contractRow(tenantName))))) await actor.attemptsTo(searchContracts(tenantName));
};
export const viewContract = (tenantName: string): Activity => (actor) =>
	actor.attemptsTo(findContract(tenantName), Click.on(viewContractButton(tenantName)));
