import { m } from '$lib/paraglide/messages';
import { plainAmount } from './invoice';
import {
	apartmentOption,
	initialContractValues,
	managementFeeText,
	validateContract,
	type ContractFormValues
} from './contract-form';
import type { AvailabilityInfo } from './utils/contract-availability';
import { formatCurrency, formatDateLong } from './utils/format';

type Field = keyof ContractFormValues;

/** The steps of "Mietvertrag erfassen" and the fields each one asks for */
export const contractSteps: { label: string; fields: Field[] }[] = [
	{
		get label() {
			return m.contracts_tenant();
		},
		fields: ['tenantId']
	},
	{
		get label() {
			return m.tenants_apartment();
		},
		fields: ['apartmentId']
	},
	{
		get label() {
			return m.contracts_period();
		},
		fields: ['startDate', 'endDate']
	},
	{
		get label() {
			return m.contracts_rent();
		},
		fields: ['baseRent', 'additionalRent', 'advancePayment', 'managementFee', 'managementFeeRate']
	},
	{
		get label() {
			return m.contracts_step_review();
		},
		fields: []
	}
];

/** Errors of one step (counted from 1), checked when the user goes on */
export function stepErrors(values: ContractFormValues, step: number): Record<string, string> {
	const fields: string[] = contractSteps[step - 1].fields;
	return Object.fromEntries(
		Object.entries({ ...validateContract(values), ...dateErrors(values) }).filter(([field]) =>
			fields.includes(field)
		)
	);
}

// A date field typed over can end up in year 12026; such a date is surely a typing mistake
export const impossibleYear = () => m.common_error_impossible_year();
export const impossible = (date: string) => !!date && !/^(19|20)\d\d-/.test(date);

function dateErrors({ startDate, endDate, isUnlimited }: ContractFormValues) {
	return {
		...(impossible(startDate) && { startDate: impossibleYear() }),
		...(!isUnlimited && impossible(endDate) && { endDate: impossibleYear() })
	};
}

/** Step to go back to when saving finds errors */
export function firstStepWithError(errors: Record<string, string>): number | null {
	const index = contractSteps.findIndex((step) => step.fields.some((field) => errors[field]));
	return index < 0 ? null : index + 1;
}

/** Plausibility hint: a contract without Akonto is allowed, but its consequence is easy to miss */
export function advancePaymentNotice(values: ContractFormValues): string | null {
	return parseFloat(values.advancePayment) > 0 ? null : m.contracts_no_advance_text();
}

const amount = (value: string) => parseFloat(value) || 0;

/** The amounts in the form the checks and the backend read */
export const normalizeAmounts = (values: ContractFormValues): ContractFormValues => ({
	...values,
	baseRent: plainAmount(values.baseRent),
	advancePayment: plainAmount(values.advancePayment),
	additionalRent: plainAmount(values.additionalRent)
});

/** Plausibility hint: a start in the past is allowed (recording an old contract) but often a mistyped date */
export function startDateNotice(startDate: string, today: string): string | null {
	return startDate && !impossible(startDate) && startDate < today
		? m.contracts_start_in_past({ date: formatDateLong(startDate) })
		: null;
}

/** The contract in words, one line per fact, each with the step and the field (id or name) that change it */
export function contractSummary(
	values: ContractFormValues,
	tenants: { id: string; name: string }[],
	apartments: { id: string; unit: string; building: string }[]
) {
	const apartment = apartments.find((a) => a.id === values.apartmentId);
	const gross =
		amount(values.baseRent) + amount(values.advancePayment) + amount(values.additionalRent);
	return [
		{
			label: m.contracts_tenant(),
			value: tenants.find((t) => t.id === values.tenantId)?.name ?? '',
			step: 1 as number | null,
			field: 'tenant'
		},
		{
			label: m.tenants_apartment(),
			value: apartment
				? `${m.buildings_apartment_number({ number: apartment.unit })} - ${apartment.building}`
				: '',
			step: 2,
			field: 'apartment'
		},
		{
			label: m.tenants_contract_start(),
			value: formatDateLong(values.startDate),
			step: 3,
			field: 'startDate'
		},
		{
			label: m.dashboard_kind_contract_end(),
			value: values.isUnlimited ? m.contracts_unlimited() : formatDateLong(values.endDate),
			step: 3,
			field: values.isUnlimited ? 'duration' : 'endDate'
		},
		{
			label: m.common_net_rent(),
			value: formatCurrency(amount(values.baseRent)),
			step: 4,
			field: 'baseRent'
		},
		{
			label: m.common_advance_payment(),
			value: formatCurrency(amount(values.advancePayment)),
			step: 4,
			field: 'advancePayment'
		},
		{
			label: m.common_additional_rent(),
			value: formatCurrency(amount(values.additionalRent)),
			step: 4,
			field: 'additionalRent'
		},
		{
			label: m.contracts_fee_label(),
			value: values.managementFee
				? managementFeeText(
						values.managementFee !== 'none',
						values.managementFee === 'own' ? values.managementFeeRate : null
					)
				: '',
			step: 4,
			field: 'managementFee'
		},
		{ label: m.common_monthly_total(), value: formatCurrency(gross), step: null, field: '' }
	];
}

/**
 * What the wizard starts with: a draft from this browser, else empty; tenant, apartment and start given in the
 * address win (e.g. back from "Neuen Mieter erfassen"). Tenants and apartments deleted meanwhile are dropped.
 */
export function startValues(
	params: URLSearchParams,
	draft: ContractFormValues | null,
	known: { tenantIds: string[]; apartmentIds: string[] }
) {
	const fromUrl = initialContractValues(undefined, params);
	const values = { ...fromUrl, ...draft };
	values.tenantId = fromUrl.tenantId || values.tenantId;
	values.apartmentId = fromUrl.apartmentId || values.apartmentId;
	values.startDate = fromUrl.startDate || values.startDate;
	const dropped =
		(!!values.tenantId && !known.tenantIds.includes(values.tenantId)) ||
		(!!values.apartmentId && !known.apartmentIds.includes(values.apartmentId));
	if (!known.tenantIds.includes(values.tenantId)) values.tenantId = '';
	if (!known.apartmentIds.includes(values.apartmentId)) values.apartmentId = '';
	return { values, restored: !!draft, dropped };
}

/** Apartments to choose from: free ones first, rented ones shown but not selectable */
export function apartmentChoices(
	apartments: { id: string; unit: string; building: string; size?: string }[],
	availability: Map<string, AvailabilityInfo | null>
) {
	return apartments
		.map((apartment) => ({
			value: apartment.id,
			...apartmentOption(apartment, availability.get(apartment.id), false)
		}))
		.sort((a, b) => Number(a.disabled) - Number(b.disabled));
}

type Rent = Pick<ContractFormValues, 'baseRent' | 'additionalRent' | 'advancePayment'>;
/** A contract as the contract list answers it, with what the wizard reads */
export type ListedContract = {
	id: string;
	tenantId?: string;
	startDate: string;
	endDate: string | null;
	terminated?: boolean;
	baseRent: string;
	additionalRent?: string | null;
	monthlyAdvancePayment?: string | null;
};
const RENT = ['baseRent', 'additionalRent', 'advancePayment'] as const;
const kept = (amount?: string | null) => (Number(amount) ? String(amount) : ''); // a zero stays empty
const rentOf = (rent: Rent): Rent => ({
	baseRent: rent.baseRent,
	additionalRent: rent.additionalRent,
	advancePayment: rent.advancePayment
});

/** Amounts of the apartment's last contract that starts before `before`, to take over (#144) */
export function lastRent(
	response: { data?: { contracts?: ListedContract[] }; error?: unknown },
	before = ''
) {
	const last = (response.error ? [] : (response.data?.contracts ?? []))
		.filter((c) => !before || c.startDate.slice(0, 10) < before)
		.sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
	if (!last) return null;
	return {
		baseRent: kept(last.baseRent),
		additionalRent: kept(last.additionalRent),
		advancePayment: kept(last.monthlyAdvancePayment),
		startDate: last.startDate,
		endDate: last.endDate,
		terminated: !!last.terminated
	};
}

/** True while the three amounts are the taken-over ones, however they are written ("950" or "950.00") */
export const rentTakenOver = (values: Rent, rent: Rent | null) =>
	!!rent &&
	RENT.every((key) => (parseFloat(plainAmount(values[key])) || 0) === (parseFloat(rent[key]) || 0));

/** The amounts to fill in: only into empty fields or ones still holding the amounts filled in before */
export function rentToPreset(values: Rent, rent: Rent | null, preset: Rent | null): Rent | null {
	if (!RENT.every((key) => !values[key]) && !rentTakenOver(values, preset)) return null;
	if (rent) return rentOf(rent);
	return preset ? { baseRent: '', additionalRent: '', advancePayment: '' } : null;
}
