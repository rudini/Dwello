import type { Actor } from '../fixtures/actor';
import { typeDate } from '../interactions/form';
import {
	advancePaymentInput,
	apartmentSelect,
	baseRentInput,
	contractSubmitButton,
	discardDraftButton,
	endDateInput,
	limitedDuration,
	pastEndConfirm,
	finishedStep,
	newTenantLink,
	nextButton,
	saveStatus,
	startDateInput,
	tenantSelect
} from '../interactions/contract-form';
import { visit, visitWhileLoading } from '../interactions/navigation';
import { createTenantByEmail } from './tenants';

export type ContractData = {
	tenantId: string;
	apartmentId: string;
	startDate: string;
	baseRent: string;
	advancePayment?: string;
	confirmPastStart?: boolean; // the wizard asks once about a start in the past
};

// Step "Mieter"
export const chooseTenant = (tenantId: string) => async (actor: Actor) => {
	await tenantSelect(actor.page).selectOption(tenantId);
	await nextButton(actor.page).click();
};

// From step "Wohnung" to "Prüfen", the tenant chosen before
export const fillContract = (contract: Omit<ContractData, 'tenantId'>) => async (actor: Actor) => {
	await apartmentSelect(actor.page).selectOption(contract.apartmentId);
	await nextButton(actor.page).click();
	await typeDate(startDateInput(actor.page), contract.startDate);
	await nextButton(actor.page).click();
	if (contract.confirmPastStart) await nextButton(actor.page).click();
	await baseRentInput(actor.page).fill(contract.baseRent);
	if (contract.advancePayment) await advancePaymentInput(actor.page).fill(contract.advancePayment);
	await nextButton(actor.page).click();
};

// The tenant chosen before, still on step "Mieter"
export const rentApartment = (contract: Omit<ContractData, 'tenantId'>) => async (actor: Actor) => {
	await nextButton(actor.page).click();
	await fillContract(contract)(actor);
	await contractSubmitButton(actor.page).click();
};

export const registerContract = (contract: ContractData) => async (actor: Actor) => {
	await tenantSelect(actor.page).selectOption(contract.tenantId);
	await rentApartment(contract)(actor);
};

export const reviewContract = (contract: ContractData) => async (actor: Actor) => {
	await chooseTenant(contract.tenantId)(actor);
	await fillContract(contract)(actor);
};

export const chooseTenantAndApartment = (tenantId: string, apartmentId: string) => async (actor: Actor) => {
	await chooseTenant(tenantId)(actor);
	await apartmentSelect(actor.page).selectOption(apartmentId);
	await nextButton(actor.page).click();
};

export const goBackToStep = (label: string) => async (actor: Actor) => {
	await finishedStep(actor.page, label).click();
};

// The draft is kept in the browser; the wizard says when it is saved
export const reopenNewContract = async (actor: Actor) => {
	await saveStatus(actor.page).getByText('Entwurf gespeichert').waitFor();
	await visit(actor.page, '/contracts/new');
};

export const discardDraft = async (actor: Actor) => {
	await discardDraftButton(actor.page).click();
};

export const createTenantForContract = (fullName: string) => async (actor: Actor) => {
	await newTenantLink(actor.page).click();
	await createTenantByEmail(fullName)(actor);
};

export const goToNextStep = async (actor: Actor) => {
	await nextButton(actor.page).click();
};

// The tenant is chosen before the page is hydrated
export const chooseTenantWhileLoading = (tenantId: string) => async (actor: Actor) => {
	const loaded = await visitWhileLoading(actor.page, '/contracts/new');
	await tenantSelect(actor.page).selectOption(tenantId);
	await loaded();
};

export const changeBaseRent = (baseRent: string) => async (actor: Actor) => {
	await baseRentInput(actor.page).fill(baseRent);
	await contractSubmitButton(actor.page).click();
};

// «Bearbeiten»: the contract ends on a fixed day; a past day is confirmed with its consequence
export const saveEndDate = (isoDate: string, { confirmPast = false } = {}) => async (actor: Actor) => {
	await limitedDuration(actor.page).click();
	await typeDate(endDateInput(actor.page), isoDate);
	if (confirmPast) await pastEndConfirm(actor.page).check();
	await contractSubmitButton(actor.page).click();
};
