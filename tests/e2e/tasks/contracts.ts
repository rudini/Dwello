import type { Actor } from '../fixtures/actor';
import {
	contractBuildingFilter,
	contractSearchButton,
	contractSearchInput,
	contractStatusFilter,
	editContractButton,
	newContractButton,
	viewContractButton
} from '../interactions/contracts';

export const searchContracts = (term: string) => async (actor: Actor) => {
	await contractSearchInput(actor.page).fill(term);
	await contractSearchButton(actor.page).click();
};

export const filterContracts =
	(filter: { buildingId?: string; status?: 'active' | 'ended' }) => async (actor: Actor) => {
		if (filter.buildingId) await contractBuildingFilter(actor.page).selectOption(filter.buildingId);
		if (filter.status) await contractStatusFilter(actor.page).selectOption(filter.status);
		await contractSearchButton(actor.page).click();
	};

export const startNewContract = async (actor: Actor) => {
	await newContractButton(actor.page).click();
};

export const viewContract = (tenantName: string) => async (actor: Actor) => {
	await viewContractButton(actor.page, tenantName).click();
};

export const editContract = (tenantName: string) => async (actor: Actor) => {
	await editContractButton(actor.page, tenantName).click();
};
