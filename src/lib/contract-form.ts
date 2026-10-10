import type { RentalContract } from './types';
import { formatDate } from './utils/format';
import {
	checkDateRangeOverlap,
	type AvailabilityInfo,
	type ContractForAvailability
} from './utils/contract-availability';

/** Input of the contract form; amounts stay as typed, the backend takes decimals as strings */
export interface ContractFormValues {
	tenantId: string;
	apartmentId: string;
	startDate: string;
	endDate: string;
	isUnlimited: boolean;
	baseRent: string;
	additionalRent: string;
	advancePayment: string;
}

const dateForInput = (date: string | null | undefined) =>
	date ? new Date(date).toISOString().split('T')[0] : '';

/** Values of the contract being edited, or of a new contract for the tenant and apartment given in the URL */
export function initialContractValues(
	contract: RentalContract | undefined,
	params: URLSearchParams
): ContractFormValues {
	if (!contract) {
		return {
			tenantId: params.get('tenant') || '',
			apartmentId: params.get('apartment') || '',
			startDate: '',
			endDate: '',
			isUnlimited: true,
			baseRent: '',
			additionalRent: '',
			advancePayment: ''
		};
	}
	return {
		tenantId: contract.tenantId,
		apartmentId: contract.apartmentId,
		startDate: dateForInput(contract.startDate),
		endDate: dateForInput(contract.endDate),
		isUnlimited: !contract.endDate,
		baseRent: String(contract.baseRent),
		additionalRent: String(contract.additionalRent || ''),
		advancePayment: String(contract.monthlyAdvancePayment || '')
	};
}

function endDateError({ isUnlimited, startDate, endDate }: ContractFormValues) {
	if (isUnlimited) return undefined;
	if (!endDate) return 'Vertragsende ist erforderlich bei befristetem Vertrag';
	if (startDate && new Date(endDate) <= new Date(startDate))
		return 'Vertragsende muss nach Vertragsbeginn liegen';
}

// Francs and up to two decimals of Rappen; anything else ("1.450", "1,450.00") would be read as a wrong amount
const FRANCS = /^\d+(\.\d{1,2})?$/;
const AMOUNT_HINT = "Bitte geben Sie einen gültigen Betrag ein, zum Beispiel 1450.00 oder 1'450.";

function baseRentError(baseRent: string) {
	if (!baseRent) return 'Nettomiete ist erforderlich';
	if (!FRANCS.test(String(baseRent))) return AMOUNT_HINT;
	if (parseFloat(baseRent) <= 0) return 'Bitte geben Sie eine gültige Miete ein';
}

// Optional amounts may be left empty, but not negative
const amountError = (amount: string) =>
	amount && !FRANCS.test(String(amount)) ? AMOUNT_HINT : undefined;

/** Error message per field; empty when the contract can be saved */
export function validateContract(values: ContractFormValues): Record<string, string> {
	const errors = {
		tenantId: values.tenantId ? undefined : 'Bitte wählen Sie einen Mieter aus',
		apartmentId: values.apartmentId ? undefined : 'Bitte wählen Sie eine Wohnung aus',
		startDate: values.startDate ? undefined : 'Vertragsbeginn ist erforderlich',
		endDate: endDateError(values),
		baseRent: baseRentError(values.baseRent),
		additionalRent: amountError(values.additionalRent),
		advancePayment: amountError(values.advancePayment)
	};
	return Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as Record<
		string,
		string
	>;
}

/** Request body of the contract API */
export const contractBody = (values: ContractFormValues) => ({
	tenantId: values.tenantId,
	apartmentId: values.apartmentId,
	startDate: values.startDate,
	endDate: values.isUnlimited ? null : values.endDate,
	baseRent: String(values.baseRent),
	additionalRent: String(values.additionalRent || 0),
	monthlyAdvancePayment: String(values.advancePayment || 0)
});

/** Contracts as the contract list returns them, in the shape the availability check reads */
export const forAvailability = (
	contracts: { id: string; startDate: string; endDate: string | null }[]
): ContractForAvailability[] =>
	contracts.map((c) => ({ id: c.id, start_date: c.startDate, end_date: c.endDate }));

/** Warning when the contract overlaps another contract of the apartment */
export function overlapWarning(
	values: ContractFormValues,
	contracts: ContractForAvailability[],
	excludeContractId?: string
): string | null {
	if (!values.startDate || contracts.length === 0) return null;
	const endDate = values.isUnlimited ? null : values.endDate || null;
	const result = checkDateRangeOverlap(values.startDate, endDate, contracts, excludeContractId);
	return result.hasOverlap ? result.message : null;
}

/** Choice of an apartment: rented apartments cannot be chosen, except the one of the contract being edited */
export function apartmentOption(
	apartment: { unit: string; building: string },
	availability: AvailabilityInfo | undefined,
	isCurrent: boolean
): { label: string; disabled: boolean } {
	const name = `Wohnung ${apartment.unit} - ${apartment.building}`;
	if (isCurrent) return { label: `${name} (aktuell)`, disabled: false };
	if (availability?.hasOngoingContract)
		return { label: `${name} (nicht verfügbar)`, disabled: true };
	if (availability?.availableFrom)
		return {
			label: `${name} (verfügbar ab ${formatDate(availability.availableFrom)})`,
			disabled: false
		};
	return { label: name, disabled: false };
}

/** Earliest start and its notice for an apartment that becomes free later; not for the edited contract's own apartment */
export function availableFrom(
	availability: AvailabilityInfo | null | undefined,
	apartmentChanged: boolean
) {
	if (!availability || !apartmentChanged) return { min: undefined, notice: null };
	return {
		min: availability.availableFrom || undefined,
		notice: availability.statusType === 'available-from' ? availability.message : null
	};
}

/** Start date a new contract gets once its apartment is chosen: the day the apartment becomes free */
export function suggestedStartDate(
	startDate: string,
	availability: AvailabilityInfo | null | undefined
) {
	if (startDate) return null;
	return availability?.availableFrom || null;
}
