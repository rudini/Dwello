import type { Activity } from '../screenplay/actor';
import { Click, Enter, Navigate, Select, Wait } from '../screenplay/interactions';
import {
	contractBuildingFilter,
	contractSearchButton,
	contractSearchInput,
	contractStatusFilter,
	editContractButton,
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
export const viewContract = (tenantName: string) => Click.on(viewContractButton(tenantName));
export const editContract = (tenantName: string) => Click.on(editContractButton(tenantName));
