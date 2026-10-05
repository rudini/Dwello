import type { Actor } from '../fixtures/actor';
import {
	apartmentSelect,
	baseRentInput,
	contractSubmitButton,
	startDateInput,
	tenantSelect
} from '../interactions/contract-form';
import { visitWhileLoading } from '../interactions/navigation';

export type ContractData = {
	tenantId: string;
	apartmentId: string;
	startDate: string;
	baseRent: string;
};

export const registerContract = (contract: ContractData) => async (actor: Actor) => {
	await tenantSelect(actor.page).selectOption(contract.tenantId);
	await rentApartment(contract)(actor);
};

// The tenant chosen before
export const rentApartment = (contract: Omit<ContractData, 'tenantId'>) => async (actor: Actor) => {
	await apartmentSelect(actor.page).selectOption(contract.apartmentId);
	await startDateInput(actor.page).fill(contract.startDate);
	await baseRentInput(actor.page).fill(contract.baseRent);
	await contractSubmitButton(actor.page).click();
};

// The tenant is chosen before the page is hydrated
export const chooseTenantWhileLoading = (tenantId: string) => async (actor: Actor) => {
	const loaded = await visitWhileLoading(actor.page, '/contracts/new');
	await tenantSelect(actor.page).selectOption(tenantId);
	await loaded();
};

export const saveContract = async (actor: Actor) => {
	await contractSubmitButton(actor.page).click();
};

export const changeBaseRent = (baseRent: string) => async (actor: Actor) => {
	await baseRentInput(actor.page).fill(baseRent);
	await contractSubmitButton(actor.page).click();
};
