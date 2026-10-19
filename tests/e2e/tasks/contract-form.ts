import type { Activity } from '../screenplay/actor';
import { Count } from '../screenplay/questions';
import { Check, Click, Enter, EnterDate, FailRequests, Navigate, Select, Uncheck, Wait } from '../screenplay/interactions';
import {
	agreedCategory,
	agreedCategoryBoxAt,
	agreedCategoryBoxes,
	advancePaymentFromInput,
	advancePaymentInput,
	flatRateInput,
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
	billedUntilInput,
	startDateInput,
	tenantSelect
} from '../targets/contract-form';
import { errorToast, successToast } from '../targets/form';
import { discardDraftButton, discardDraftConfirm, finishedStep, nextButton, saveStatus } from '../targets/wizard';
import { createTenantByEmail } from './tenants';

export type ContractData = {
	tenantId: string;
	apartmentId: string;
	startDate: string;
	baseRent: string;
	advancePayment?: string;
	flatRateUtilityCharge?: string; // «Nebenkostenpauschale» (#429)
	confirmPastStart?: boolean; // the wizard asks once about a start in the past
	managementFee?: string | null; // own rate in percent, 'run' for the run's rate (default), null for no choice (#89)
	notAgreed?: string[]; // categories the lease does not agree, unticked (#91)
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
	if (contract.flatRateUtilityCharge)
		await actor.attemptsTo(Enter.theValue(contract.flatRateUtilityCharge).into(flatRateInput));
	await actor.attemptsTo(chooseManagementFee(contract.managementFee === undefined ? 'run' : contract.managementFee));
	for (const categoryId of contract.notAgreed ?? []) await actor.attemptsTo(Uncheck.the(agreedCategory(categoryId)));
	await actor.attemptsTo(goToNextStep);
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

// The input is kept in the browser; the wizard says when
export const reopenNewContract: Activity = (actor) =>
	actor.attemptsTo(Wait.until(saveStatus('Noch nicht gespeichert')), openNewContract);

export const discardDraft: Activity = (actor) => actor.attemptsTo(Click.on(discardDraftButton), Click.on(discardDraftConfirm));
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

export const enterAdvancePayment = (amount: string) => Enter.theValue(amount).into(advancePaymentInput);
export const enterFlatRateUtilityCharge = (amount: string) => Enter.theValue(amount).into(flatRateInput);

// #464: a new Akonto from a day on; the amount before stays for the time before
export const changeAdvancePaymentFrom = (isoDate: string, amount: string): Activity => (actor) =>
	actor.attemptsTo(
		Enter.theValue(amount).into(advancePaymentInput),
		EnterDate.of(isoDate).into(advancePaymentFromInput),
		Click.on(contractSubmitButton)
	);

// #464 (V-12): the Vertragsbeginn and the first Akonto corrected in one save
export const saveStartWithAdvance = (isoDate: string, amount: string, from: string): Activity => (actor) =>
	actor.attemptsTo(
		EnterDate.of(isoDate).into(startDateInput),
		Enter.theValue(amount).into(advancePaymentInput),
		EnterDate.of(from).into(advancePaymentFromInput),
		Click.on(contractSubmitButton)
	);

export const changeFlatRateUtilityCharge = (amount: string): Activity => (actor) =>
	actor.attemptsTo(enterFlatRateUtilityCharge(amount), Click.on(contractSubmitButton));

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
// «Bearbeiten»: the fee is agreed at the run's rate, or at an own rate in percent
export const agreeManagementFee = (fee = 'run'): Activity => (actor) =>
	actor.attemptsTo(chooseManagementFee(fee), Click.on(contractSubmitButton));

// «Bearbeiten»: the Nebenkosten are billed outside Dwello up to the day given (#133)
export const enterBilledUntil = (isoDate: string): Activity => (actor) =>
	actor.attemptsTo(EnterDate.of(isoDate).into(billedUntilInput), Click.on(contractSubmitButton));

// «Bearbeiten»: the lease does not agree this category (#91)
export const leaveOutCategory = (categoryId: string): Activity => (actor) =>
	actor.attemptsTo(Uncheck.the(agreedCategory(categoryId)), Click.on(contractSubmitButton));

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

// «Vereinbarte Nebenkosten»: every box unticked, not saved (persona Marco W10c P-1)
export const untickOneCategory = Uncheck.the(agreedCategoryBoxAt(0));
export const tickAllCategories: Activity = async (actor) => {
	const boxes = await actor.answer(Count.of(agreedCategoryBoxes));
	for (let box = 0; box < boxes; box++) await actor.attemptsTo(Check.the(agreedCategoryBoxAt(box)));
};
export const untickAllCategories: Activity = async (actor) => {
	const boxes = await actor.answer(Count.of(agreedCategoryBoxes));
	for (let box = 0; box < boxes; box++) await actor.attemptsTo(Uncheck.the(agreedCategoryBoxAt(box)));
};
