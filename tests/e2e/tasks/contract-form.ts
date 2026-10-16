import type { Activity } from '../screenplay/actor';
import { Check, Click, Enter, EnterDate, FailRequests, Navigate, Select, Wait } from '../screenplay/interactions';
import {
	advancePaymentInput,
	apartmentSelect,
	baseRentInput,
	contractSubmitButton,
	deleteDraftAndSaveButton,
	durationChoice,
	endDateInput,
	feeChoice,
	feeRateInput,
	newContractAfterEndLink,
	newTenantLink,
	pastEndConfirm,
	retryContractsButton,
	runningContractLink,
	startDateInput,
	tenantSelect
} from '../targets/contract-form';
import { errorToast, successToast } from '../targets/form';
import { discardDraftButton, finishedStep, nextButton, saveStatus } from '../targets/wizard';
import { createTenantByEmail } from './tenants';

export type ContractData = {
	tenantId: string;
	apartmentId: string;
	startDate: string;
	baseRent: string;
	advancePayment?: string;
	confirmPastStart?: boolean; // the wizard asks once about a start in the past
	managementFee?: string | null; // own rate in percent, 'run' for the run's rate (default), null for no choice (#89)
};

// «Verwaltungspauschale vereinbart»: the run's rate, an own rate or, with no choice, nothing
const chooseManagementFee = (fee: string | null): Activity => async (actor) => {
	if (fee === null) return;
	if (fee === 'run') return actor.attemptsTo(Click.on(feeChoice('run')));
	await actor.attemptsTo(Click.on(feeChoice('own')), Enter.theValue(fee).into(feeRateInput));
};

const NEW_CONTRACT = '/contracts/new';
export const openNewContract = Navigate.to(NEW_CONTRACT);
// as «Nachmieter erfassen» opens it, with the apartment preselected
export const openNewContractFor = (apartmentId: string) => Navigate.to(`${NEW_CONTRACT}?apartment=${apartmentId}`);
export const openContractEdit = (contractId: string) => Navigate.to(`/contracts/${contractId}/edit`);

export const goToNextStep = Click.on(nextButton);

// The contracts of the apartment, which the contract pages load in the browser, cannot be loaded
export const contractsCannotBeLoaded = (apartmentId: string) => FailRequests.to('/api/contracts', { apartmentId });
export const contractsLoadAgain = FailRequests.noLonger;
// waits for the confirmation that they are loaded (review #151 R-4)
export const retryContracts: Activity = (actor) => actor.attemptsTo(Click.on(retryContractsButton), Wait.until(successToast));
// still failing: waits for the message that says so
export const retryContractsInVain: Activity = (actor) => actor.attemptsTo(Click.on(retryContractsButton), Wait.until(errorToast));
export const enterBaseRent = (baseRent: string) => Enter.theValue(baseRent).into(baseRentInput);

// Step "Mieter"
export const chooseTenant = (tenantId: string): Activity => (actor) =>
	actor.attemptsTo(Select.option(tenantId).from(tenantSelect), goToNextStep);

// From step "Wohnung" to "Prüfen", the tenant chosen before
const fillContract = (contract: Omit<ContractData, 'tenantId'>): Activity => async (actor) => {
	await actor.attemptsTo(
		Select.option(contract.apartmentId).from(apartmentSelect),
		goToNextStep,
		EnterDate.of(contract.startDate).into(startDateInput),
		goToNextStep
	);
	if (contract.confirmPastStart) await actor.attemptsTo(goToNextStep);
	await actor.attemptsTo(Enter.theValue(contract.baseRent).into(baseRentInput));
	if (contract.advancePayment) await actor.attemptsTo(Enter.theValue(contract.advancePayment).into(advancePaymentInput));
	await actor.attemptsTo(chooseManagementFee(contract.managementFee === undefined ? 'run' : contract.managementFee), goToNextStep);
};

// The tenant chosen before, still on step "Mieter"
export const rentApartment = (contract: Omit<ContractData, 'tenantId'>): Activity => (actor) =>
	actor.attemptsTo(goToNextStep, fillContract(contract), Click.on(contractSubmitButton));

export const registerContract = (contract: ContractData): Activity => (actor) =>
	actor.attemptsTo(Select.option(contract.tenantId).from(tenantSelect), rentApartment(contract));

export const reviewContract = (contract: ContractData): Activity => (actor) =>
	actor.attemptsTo(chooseTenant(contract.tenantId), fillContract(contract));

export const chooseTenantAndApartment = (tenantId: string, apartmentId: string): Activity => (actor) =>
	actor.attemptsTo(chooseTenant(tenantId), Select.option(apartmentId).from(apartmentSelect), goToNextStep);

export const goBackToStep = (label: string) => Click.on(finishedStep(label));

// The draft is kept in the browser; the wizard says when it is saved
export const reopenNewContract: Activity = (actor) =>
	actor.attemptsTo(Wait.until(saveStatus('Entwurf gespeichert')), openNewContract);

export const discardDraft = Click.on(discardDraftButton);
export const deleteDraftAndSave = Click.on(deleteDraftAndSaveButton);

export const createTenantForContract = (fullName: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(newTenantLink), createTenantByEmail(fullName));

// The tenant is chosen before the page is hydrated
export const chooseTenantWhileLoading = (tenantId: string): Activity => (actor) =>
	actor.attemptsTo(
		Navigate.toWithScriptsHeldBack(NEW_CONTRACT),
		Select.option(tenantId).from(tenantSelect),
		Navigate.releaseScripts
	);

export const changeBaseRent = (baseRent: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(baseRent).into(baseRentInput), Click.on(contractSubmitButton));

// «Bearbeiten»: the contract ends on a fixed day; a past day is confirmed with its consequence
export const saveEndDate = (isoDate: string, { confirmPast = false } = {}): Activity => async (actor) => {
	await actor.attemptsTo(Click.on(durationChoice('Befristet')), EnterDate.of(isoDate).into(endDateInput));
	if (confirmPast) await actor.attemptsTo(Check.the(pastEndConfirm));
	await actor.attemptsTo(Click.on(contractSubmitButton));
};

// «Bearbeiten»: the contract runs on without end
export const withdrawNotice: Activity = (actor) =>
	actor.attemptsTo(Click.on(durationChoice('Kündigung aufheben')), Click.on(contractSubmitButton));

// «Bearbeiten»: another Vertragsbeginn
export const saveStartDate = (isoDate: string): Activity => (actor) =>
	actor.attemptsTo(EnterDate.of(isoDate).into(startDateInput), Click.on(contractSubmitButton));
// «Bearbeiten»: the fee is agreed at the run's rate
export const agreeManagementFee: Activity = (actor) =>
	actor.attemptsTo(Click.on(feeChoice('run')), Click.on(contractSubmitButton));

export const openRunningContract = Click.on(runningContractLink);
export const newContractAfterEnd = Click.on(newContractAfterEndLink);

// From step «Mieter» to step «Miete», the apartment preselected
export const goToRentWith = (tenantId: string, startDate: string): Activity => (actor) =>
	actor.attemptsTo(
		Select.option(tenantId).from(tenantSelect),
		goToNextStep,
		goToNextStep,
		EnterDate.of(startDate).into(startDateInput),
		goToNextStep
	);
