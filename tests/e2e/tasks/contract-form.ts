import type { Actor } from '../fixtures/actor';
import {
	apartmentSelect,
	baseRentInput,
	contractSubmitButton,
	startDateInput,
	tenantSelect
} from '../interactions/contract-form';

export type ContractData = { tenantId: string; apartmentId: string; startDate: string; baseRent: string };

export const registerContract = (contract: ContractData) => async (actor: Actor) => {
	await tenantSelect(actor.page).selectOption(contract.tenantId);
	await apartmentSelect(actor.page).selectOption(contract.apartmentId);
	await startDateInput(actor.page).fill(contract.startDate);
	await baseRentInput(actor.page).fill(contract.baseRent);
	await contractSubmitButton(actor.page).click();
};

export const saveContract = async (actor: Actor) => {
	await contractSubmitButton(actor.page).click();
};

export const changeBaseRent = (baseRent: string) => async (actor: Actor) => {
	await baseRentInput(actor.page).fill(baseRent);
	await contractSubmitButton(actor.page).click();
};
