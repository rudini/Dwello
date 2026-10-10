import {
	apartmentOption,
	initialContractValues,
	validateContract,
	type ContractFormValues
} from './contract-form';
import type { AvailabilityInfo } from './utils/contract-availability';
import { formatCurrency, formatDateLong } from './utils/format';

type Field = keyof ContractFormValues;

/** The steps of "Mietvertrag erfassen" and the fields each one asks for */
export const contractSteps: { label: string; fields: Field[] }[] = [
	{ label: 'Mieter', fields: ['tenantId'] },
	{ label: 'Wohnung', fields: ['apartmentId'] },
	{ label: 'Vertragsdauer', fields: ['startDate', 'endDate'] },
	{ label: 'Miete', fields: ['baseRent', 'additionalRent', 'advancePayment'] },
	{ label: 'Prüfen', fields: [] }
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
const IMPOSSIBLE = 'Bitte prüfen Sie das Datum: Das Jahr ist nicht möglich.';
const impossible = (date: string) => !!date && !/^(19|20)\d\d-/.test(date);

function dateErrors({ startDate, endDate, isUnlimited }: ContractFormValues) {
	return {
		...(impossible(startDate) && { startDate: IMPOSSIBLE }),
		...(!isUnlimited && impossible(endDate) && { endDate: IMPOSSIBLE })
	};
}

/** Step to go back to when saving finds errors */
export function firstStepWithError(errors: Record<string, string>): number | null {
	const index = contractSteps.findIndex((step) => step.fields.some((field) => errors[field]));
	return index < 0 ? null : index + 1;
}

/** Plausibility hint: a contract without Akonto is allowed, but its consequence is easy to miss */
export function advancePaymentNotice(values: ContractFormValues): string | null {
	return parseFloat(values.advancePayment) > 0
		? null
		: 'Ohne Akonto bezahlt der Mieter alle Nebenkosten erst mit der Nebenkostenabrechnung.';
}

const amount = (value: string) => parseFloat(value) || 0;

// "1'450", "1’450" and "180,50" as written in Switzerland; parseFloat would stop at the separator
const plainAmount = (value: string) => value.replace(/['’\s]/g, '').replace(',', '.');

/** The amounts in the form the checks and the backend read */
export const normalizeAmounts = (values: ContractFormValues): ContractFormValues => ({
	...values,
	baseRent: plainAmount(values.baseRent),
	advancePayment: plainAmount(values.advancePayment),
	additionalRent: plainAmount(values.additionalRent)
});

/** Plausibility hint: a start in the past is allowed (recording an old contract) but often a mistyped date */
export function startDateNotice(startDate: string, today: string): string | null {
	return startDate && startDate < today
		? `Der Vertragsbeginn ${formatDateLong(startDate)} liegt in der Vergangenheit. Stimmt das Datum?`
		: null;
}

/** The contract in words, one line per fact, each with the step that changes it */
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
			label: 'Mieter',
			value: tenants.find((t) => t.id === values.tenantId)?.name ?? '',
			step: 1 as number | null
		},
		{
			label: 'Wohnung',
			value: apartment ? `Wohnung ${apartment.unit} - ${apartment.building}` : '',
			step: 2
		},
		{ label: 'Vertragsbeginn', value: formatDateLong(values.startDate), step: 3 },
		{
			label: 'Vertragsende',
			value: values.isUnlimited ? 'Unbefristet' : formatDateLong(values.endDate),
			step: 3
		},
		{ label: 'Nettomiete', value: formatCurrency(amount(values.baseRent)), step: 4 },
		{ label: 'Akonto', value: formatCurrency(amount(values.advancePayment)), step: 4 },
		{ label: 'Zusatzmiete', value: formatCurrency(amount(values.additionalRent)), step: 4 },
		{ label: 'Monatlich total', value: formatCurrency(gross), step: null }
	];
}

/**
 * What the wizard starts with: a draft from this browser, else empty; tenant and apartment given in the
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
	const dropped =
		(!!values.tenantId && !known.tenantIds.includes(values.tenantId)) ||
		(!!values.apartmentId && !known.apartmentIds.includes(values.apartmentId));
	if (!known.tenantIds.includes(values.tenantId)) values.tenantId = '';
	if (!known.apartmentIds.includes(values.apartmentId)) values.apartmentId = '';
	return { values, restored: !!draft, dropped };
}

/** Apartments to choose from: free ones first, rented ones shown but not selectable */
export function apartmentChoices(
	apartments: { id: string; unit: string; building: string }[],
	availability: Map<string, AvailabilityInfo>
) {
	return apartments
		.map((apartment) => ({
			value: apartment.id,
			...apartmentOption(apartment, availability.get(apartment.id), false)
		}))
		.sort((a, b) => Number(a.disabled) - Number(b.disabled));
}
