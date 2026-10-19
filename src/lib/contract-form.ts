import { m } from '$lib/paraglide/messages';
import { localToday } from './contract-status';
import type { RentalContract } from './types';
import { formatDate, isFeeRate, parsePercent } from './utils/format';
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
	terminated?: boolean; // the end is a Kündigungstermin of an open-ended contract (A-1), only when editing
	billedUntil?: string; // «Abgerechnet bis» (#133), only when editing; '' for none
	baseRent: string;
	additionalRent: string;
	advancePayment: string;
	advancePaymentFrom?: string; // «Gültig ab» of the Akonto (#464), only when editing
	savedAdvance?: string; // the Akonto as loaded: unchanged, it is not sent again (fach review 464-2 V-2)
	flatRateUtilityCharge?: string; // «Nebenkostenpauschale» (#429); absent in a draft saved before it
	// «Verwaltungspauschale vereinbart» (#89): at the run's rate, an own rate, none; '' until chosen (no default)
	managementFee: '' | 'run' | 'own' | 'none';
	managementFeeRate: string; // the own rate as typed, comma or point
	agreedCategoryIds?: string[]; // #91: the agreed Nebenkosten; absent on a new contract: every umlagefähige category
}

/** «Verwaltungspauschale» of a contract in words: not agreed, at the run's rate or its own rate (#89) */
export const managementFeeText = (
	agreed: boolean | undefined,
	ownRate: string | null | undefined
) =>
	!agreed
		? m.contracts_fee_shown_none()
		: ownRate != null
			? m.contracts_fee_shown_own({ percent: String(parsePercent(ownRate)) })
			: m.contracts_fee_shown_run();

const feeChoice = (contract: RentalContract): ContractFormValues['managementFee'] =>
	!contract.managementFeeAgreed ? 'none' : contract.managementFeePercent != null ? 'own' : 'run';

const dateForInput = (date: string | null | undefined) =>
	date ? new Date(date).toISOString().split('T')[0] : '';

// A date field typed over can end up in year 12026; such a date is surely a typing mistake
export const impossibleYear = () => m.common_error_impossible_year();
export const impossible = (date: string) => !!date && !/^(19|20)\d\d-/.test(date);

/**
 * «Gültig ab» of a new Akonto (#464, fach review 464-2 V-2): in a running contract the next first of a month, as an
 * increase applies from a Kündigungstermin at the earliest; a future contract corrects it from its Vertragsbeginn, an
 * ended one its last amount
 */
function proposedAdvanceFrom(contract: RentalContract) {
	const today = localToday();
	if (contract.startDate > today) return dateForInput(contract.startDate);
	const [year, month] = today.split('-').map(Number);
	const next = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
	if (!contract.endDate || next <= dateForInput(contract.endDate)) return next;
	return contract.advancePayments?.at(-1)?.validFrom;
}

// a changed Akonto goes with its «Gültig ab»; on a new contract it always goes
const advanceChanged = (values: ContractFormValues) =>
	values.savedAdvance === undefined || Number(values.advancePayment || 0) !== Number(values.savedAdvance || 0);

/** Values of the contract being edited, or of a new contract for the tenant and apartment given in the URL */
export function initialContractValues(
	contract: RentalContract | undefined,
	params: URLSearchParams
): ContractFormValues {
	if (!contract) {
		const start = params.get('start') || '';
		return {
			tenantId: params.get('tenant') || '',
			apartmentId: params.get('apartment') || '',
			startDate: impossible(start) ? '' : start, // the day after the contract it follows (#156), never one the date check refuses (#296)
			endDate: '',
			isUnlimited: true,
			baseRent: '',
			additionalRent: '',
			advancePayment: '',
			flatRateUtilityCharge: '',
			managementFee: '',
			managementFeeRate: ''
		};
	}
	return {
		tenantId: contract.tenantId,
		apartmentId: contract.apartmentId,
		startDate: dateForInput(contract.startDate),
		endDate: dateForInput(contract.endDate),
		isUnlimited: !contract.endDate,
		terminated: !!contract.terminated,
		billedUntil: dateForInput(contract.billedUntil),
		baseRent: String(contract.baseRent),
		additionalRent: String(contract.additionalRent || ''),
		advancePayment: String(contract.monthlyAdvancePayment || ''),
		advancePaymentFrom: contract.advancePayments && proposedAdvanceFrom(contract),
		savedAdvance: String(contract.monthlyAdvancePayment || ''),
		flatRateUtilityCharge: String(contract.flatRateUtilityCharge || ''),
		managementFee: feeChoice(contract),
		managementFeeRate: contract.managementFeePercent ?? '',
		agreedCategoryIds: contract.agreedCategoryIds
	};
}

function endDateError({ isUnlimited, startDate, endDate }: ContractFormValues) {
	if (isUnlimited) return undefined;
	if (!endDate) return m.contracts_error_end_required();
	if (startDate && new Date(endDate) <= new Date(startDate))
		return m.contracts_error_end_before_start();
}

// Francs and up to two decimals of Rappen; anything else ("1.450", "1,450.00") would be read as a wrong amount
export const FRANCS = /^\d+(\.\d{1,2})?$/;
const amountHint = () => m.contracts_error_amount();

function baseRentError(baseRent: string) {
	if (!baseRent) return m.contracts_error_base_rent_required();
	if (!FRANCS.test(String(baseRent))) return amountHint();
	if (parseFloat(baseRent) <= 0) return m.contracts_error_rent_invalid();
}

// Optional amounts may be left empty, but not negative
const amountError = (amount: string) =>
	amount && !FRANCS.test(String(amount)) ? amountHint() : undefined;

/** Error message per field; empty when the contract can be saved */
export function validateContract(values: ContractFormValues): Record<string, string> {
	const errors = {
		tenantId: values.tenantId ? undefined : m.contracts_error_tenant_required(),
		apartmentId: values.apartmentId ? undefined : m.contracts_error_apartment_required(),
		startDate: values.startDate ? undefined : m.contracts_error_start_required(),
		endDate: endDateError(values),
		baseRent: baseRentError(values.baseRent),
		additionalRent: amountError(values.additionalRent),
		advancePayment: amountError(values.advancePayment),
		advancePaymentFrom:
			values.advancePaymentFrom === '' && advanceChanged(values)
				? m.contracts_error_advance_from_required()
				: undefined,
		flatRateUtilityCharge: amountError(values.flatRateUtilityCharge ?? ''),
		managementFee: values.managementFee ? undefined : m.contracts_error_fee_choice(),
		managementFeeRate:
			values.managementFee === 'own' && !isFeeRate(parsePercent(values.managementFeeRate))
				? m.statements_error_fee()
				: undefined
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
	terminated: !values.isUnlimited && !!values.terminated,
	baseRent: String(values.baseRent),
	additionalRent: String(values.additionalRent || 0),
	...(advanceChanged(values) && {
		monthlyAdvancePayment: String(values.advancePayment || 0),
		...(values.advancePaymentFrom && { advancePaymentFrom: values.advancePaymentFrom })
	}),
	flatRateUtilityCharge: String(values.flatRateUtilityCharge || 0),
	managementFeeAgreed: values.managementFee !== 'none',
	managementFeePercent:
		values.managementFee === 'own' ? String(parsePercent(values.managementFeeRate)) : null,
	...(values.billedUntil !== undefined && { billedUntil: values.billedUntil || null }),
	...(values.agreedCategoryIds && { agreedCategoryIds: values.agreedCategoryIds })
});

/** The names of the agreed Nebenkosten among the categories shown; without a choice every one (#91) */
export const agreedNames = (agreed: string[] | undefined, categories: { id: string; name: string }[]) =>
	categories.filter((category) => agreed?.includes(category.id) ?? true).map((category) => category.name);

/**
 * An apartment's contracts as the contract list answers them, in the shape the availability check reads; null when
 * they could not be loaded, also for an answer without a list: the apartment is then not free (#143)
 */
export function forAvailability(response: {
	data?: {
		contracts?: { id: string; startDate: string; endDate: string | null; tenantId?: string }[];
	};
	error?: unknown;
}): ContractForAvailability[] | null {
	const list = response.data?.contracts;
	if (response.error || !Array.isArray(list)) return null;
	return list.map((c) => ({
		id: c.id,
		start_date: c.startDate,
		end_date: c.endDate,
		tenant_id: c.tenantId
	}));
}

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

/**
 * Choice of an apartment: rented apartments cannot be chosen, except the one of the contract being edited; null for
 * an apartment whose contracts could not be loaded: it is not shown as free (#151, W-01)
 */
export function apartmentOption(
	apartment: { unit: string; building: string; size?: string },
	availability: AvailabilityInfo | null | undefined,
	isCurrent: boolean
): { label: string; disabled: boolean } {
	const name = `${m.buildings_apartment_number({ number: apartment.unit })} - ${apartment.building}${apartment.size ? `, ${apartment.size}` : ''}`;
	if (isCurrent) return { label: m.contracts_option_current({ name }), disabled: false };
	if (availability === null)
		return { label: m.contracts_option_unchecked({ name }), disabled: false };
	if (availability?.hasOngoingContract)
		return { label: m.contracts_option_unavailable({ name }), disabled: true };
	if (availability?.availableFrom)
		return {
			label: m.contracts_option_available_from({
				name,
				date: formatDate(availability.availableFrom)
			}),
			disabled: false
		};
	return { label: name, disabled: false };
}

/** Earliest start and its notice for an apartment that becomes free later */
export function availableFrom(availability: AvailabilityInfo | null | undefined) {
	if (!availability) return { min: undefined, notice: null };
	return {
		min: availability.availableFrom || undefined,
		notice: availability.statusType === 'available-from' ? availability.message : null
	};
}

/** Start date a new contract gets once its apartment is chosen: the day the apartment becomes free, never one the date check refuses (#296) */
export function suggestedStartDate(
	startDate: string,
	availability: AvailabilityInfo | null | undefined
) {
	const free = availability?.availableFrom;
	return startDate || !free || impossible(free) ? null : free;
}
