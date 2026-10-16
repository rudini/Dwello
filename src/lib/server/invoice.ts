import { localName } from '$lib/names';
import { ValidationError } from './error-handler';
import type { InvoiceWithDetails } from '$lib/types';
import { toCategory } from './category';
import { toDistributionKey } from './distribution-key';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Related = Record<string, unknown> | null | undefined;
type Named = { id: string; name: string };
type MasterData = Parameters<typeof localName>[0];

/** A category as offered for invoices: named in the UI language */
const localCategory = (c: Record<string, unknown>) => ({
	...toCategory(c),
	name: localName(c as MasterData)
});

/**
 * Categories and distribution keys to choose for an invoice, named in the UI language, and the key the settings
 * preselect; a failing call offers none
 */
export async function invoiceChoices(fetch: typeof globalThis.fetch) {
	type List = { categories?: Record<string, unknown>[]; data?: Record<string, unknown>[]; value?: string };
	const get = (path: string): Promise<List> =>
		fetch(`${BACKEND_URL}/api/v1/${path}`)
			.then((response) => (response.ok ? response.json() : {}))
			.catch(() => ({}));
	const [categories, keys, defaultKey] = await Promise.all([
		get('categories?limit=100'),
		get('distribution-keys?limit=100'),
		get('config/default_distribution_key_id')
	]);
	return {
		categories: (categories.categories || categories.data || []).map(localCategory),
		distributionKeys: (keys.data || []).map((d) => ({
			...toDistributionKey(d),
			name: localName(d as MasterData)
		})),
		defaultDistributionKeyId: defaultKey.value ?? ''
	};
}

// Who chose the category: nobody yet, the KI (its suggestion kept), or the Liegenschaftsverwalter
function categorizationStatus(
	r: Record<string, unknown>
): InvoiceWithDetails['categorizationStatus'] {
	if (!r.categoryId) return 'pending';
	return r.categoryId === r.llmCategoryId && !r.wasManuallyOverridden
		? 'auto-categorized'
		: 'manual';
}

/**
 * Backend invoice as shown in the interface: its category and distribution key carry only their German name,
 * so `names` (categories and keys in the UI language) name them where it has them
 */
export function toInvoice(r: Record<string, unknown>, names: Named[] = []): InvoiceWithDetails {
	const building = r.building as Record<string, string> | null;
	const category = r.category as Related;
	const key = r.distributionKey as Related;
	const suggested = r.llmCategory as Related;
	const named = <T extends Named>(row: T) => ({
		...row,
		name: names.find((n) => n.id === row.id)?.name ?? row.name
	});
	return {
		id: r.id as string,
		buildingId: r.buildingId as string,
		invoiceDate: r.invoiceDate as string,
		invoiceNumber: (r.invoiceNumber as string | null) ?? undefined,
		servicePeriodStart: r.servicePeriodStart as string | undefined,
		servicePeriodEnd: r.servicePeriodEnd as string | undefined,
		billingEntity: (r.billingEntityName || r.billingEntity || '') as string,
		description: (r.description || '') as string,
		amount: Number(r.amount) || 0,
		categoryId: r.categoryId as string | undefined,
		distributionKeyId: r.distributionKeyId as string | undefined,
		isValidUtilityCost: (r.isValidUtilityCost ?? true) as boolean,
		llmConfidence: r.llmConfidence ? Number(r.llmConfidence) : undefined,
		manualOverrideReason: r.manualOverrideReason as string | undefined,
		createdAt: r.createdAt as string | undefined,
		updatedAt: r.updatedAt as string | undefined,
		buildingName: building?.name || '',
		buildingAddress: building?.address || '',
		category: category ? named(toCategory(category)) : undefined,
		distributionKey: key
			? named({ id: key.id as string, name: toDistributionKey(key).name })
			: undefined,
		llmCategory: suggested
			? named({ id: suggested.id as string, name: toCategory(suggested).name })
			: undefined,
		categorizationStatus: categorizationStatus(r),
		beleg: (r.beleg as { fileName: string; mimeType: string } | null) ?? null
	};
}

type StatementPeriod = { periodStart: string; periodEnd: string; createdAt: string };

const periodsOf = (statements: StatementPeriod[]) =>
	[...new Set(statements.map((s) => `${s.periodStart}/${s.periodEnd}`))].map((period) => {
		const [start, end] = period.split('/');
		return { start, end };
	});

/**
 * The periods with statements for this allocable invoice (its Leistungszeitraum, else its Rechnungsdatum, overlaps
 * them): billedIn took it (created after it was recorded), missedIn were created before and lack it
 */
export async function statementPeriods(
	fetch: typeof globalThis.fetch,
	backendUrl: string,
	invoice: Record<string, unknown>
) {
	if (invoice.isValidUtilityCost === false) return { billedIn: [], missedIn: [] };
	const response = await fetch(
		`${backendUrl}/api/v1/statements?buildingId=${invoice.buildingId}&limit=1000`
	).catch(() => null);
	const statements: StatementPeriod[] = response?.ok ? ((await response.json()).data ?? []) : [];
	const start = (invoice.servicePeriodStart ?? invoice.invoiceDate) as string;
	const end = (invoice.servicePeriodEnd ?? invoice.invoiceDate) as string;
	const overlapping = statements.filter((s) => s.periodStart <= end && s.periodEnd >= start);
	// a period can be in both: drafts created again do not replace the older ones
	const recordedAt = String(invoice.createdAt);
	return {
		billedIn: periodsOf(overlapping.filter((s) => s.createdAt >= recordedAt)),
		missedIn: periodsOf(overlapping.filter((s) => s.createdAt < recordedAt))
	};
}

/** The form a page sent with a file; one that is no form is refused as a bad request */
export const formOf = (request: Request) =>
	request.formData().catch(() => {
		throw new ValidationError('Invalid form');
	});

/** The invoice fields a form sends as JSON; anything else is refused as a bad request */
export function fieldsOf(value: FormDataEntryValue | null): Record<string, unknown> {
	try {
		return JSON.parse(String(value));
	} catch {
		throw new ValidationError('Invalid invoice fields', 'invoice');
	}
}

/** A file the property manager chose for an invoice, as the backend takes it: its name and its content in Base64 */
export async function belegOf(file: FormDataEntryValue | null) {
	if (!(file instanceof File)) throw new ValidationError('A file is required', 'file');
	return { fileName: file.name, content: Buffer.from(await file.arrayBuffer()).toString('base64') };
}
