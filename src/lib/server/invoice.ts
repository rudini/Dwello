import { localName } from '$lib/names';
import { ValidationError } from './error-handler';
import type { BilledStatement, InvoiceWithDetails, Json } from '$lib/types';
import type { InvoiceWithDetails as InvoiceResponse } from '../../../backend/src/api/invoice';
import { toCategory, type CategoryRow } from './category';
import { toDistributionKey, type DistributionKeyRow } from './distribution-key';
import type { LatestKey } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Named = { id: string; name: string };

/** A category as offered for invoices: named in the UI language */
const localCategory = (c: CategoryRow) => ({
	...toCategory(c),
	name: localName(c)
});

/**
 * Per building the category of its tank (its latest Tankbestand reading): a delivery there counts in the period of its
 * delivery day, which the invoice form explains (#451, M-1; persona Helga P-4); a failing call names none
 */
export async function tankCategories(fetch: typeof globalThis.fetch, buildingIds: string[]) {
	const latest = async (id: string) => {
		const response = await fetch(`${BACKEND_URL}/api/v1/buildings/${encodeURIComponent(id)}/fuel-stocks`).catch(() => null);
		const body: unknown = response?.ok ? await response.json() : [];
		const readings = (Array.isArray(body) ? body : []) as { categoryId: string }[];
		return [id, readings.at(-1)?.categoryId ?? ''] as const;
	};
	return Object.fromEntries((await Promise.all(buildingIds.map(latest))).filter(([, category]) => category));
}

/**
 * Categories and distribution keys to choose for an invoice, named in the UI language, and the key the settings
 * preselect; a failing call offers none
 */
export async function invoiceChoices(fetch: typeof globalThis.fetch) {
	type List = { categories?: CategoryRow[]; data?: DistributionKeyRow[]; value?: string };
	const get = (path: string): Promise<List> =>
		fetch(`${BACKEND_URL}/api/v1/${path}`)
			.then((response) => (response.ok ? response.json() : {}))
			.catch(() => ({}));
	const [categories, keys, defaultKey, latestKeys] = await Promise.all([
		get('categories?limit=1000'), // all of them: the limit counts the non-umlagefähige ones too (#583)
		get('distribution-keys?limit=1000'), // all of them (#588)
		get('config/default_distribution_key_id'),
		// the key each category last had in each building, which the form proposes (#379)
		fetch(`${BACKEND_URL}/api/v1/invoices/latest-keys`)
			.then((response) => (response.ok ? response.json() : []))
			.catch(() => []) as Promise<LatestKey[]>
	]);
	return {
		categories: (categories.categories || categories.data || []).map(localCategory),
		distributionKeys: (keys.data || []).map((d) => ({
			...toDistributionKey(d),
			name: localName(d)
		})),
		defaultDistributionKeyId: defaultKey.value ?? '',
		latestKeys
	};
}

/** An invoice as `GET /invoices` and `GET /invoices/:id` send it */
export type InvoiceRow = Json<InvoiceResponse>;

// Who chose the category: nobody yet, the KI (its suggestion kept), or the Liegenschaftsverwalter
function categorizationStatus(
	r: Pick<InvoiceRow, 'categoryId' | 'llmCategoryId' | 'wasManuallyOverridden'>
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
export function toInvoice(r: InvoiceRow, names: Named[] = []): InvoiceWithDetails {
	const named = <T extends Named>(row: T) => ({
		...row,
		name: names.find((n) => n.id === row.id)?.name ?? row.name
	});
	return {
		id: r.id,
		buildingId: r.buildingId,
		invoiceDate: r.invoiceDate,
		invoiceNumber: r.invoiceNumber,
		servicePeriodStart: r.servicePeriodStart,
		servicePeriodEnd: r.servicePeriodEnd,
		billingEntity: r.billingEntityName,
		description: r.description,
		amount: Number(r.amount),
		categoryId: r.categoryId,
		distributionKeyId: r.distributionKeyId,
		isValidUtilityCost: r.isValidUtilityCost,
		llmConfidence: r.llmConfidence ? Number(r.llmConfidence) : null,
		manualOverrideReason: r.manualOverrideReason,
		createdAt: r.createdAt,
		updatedAt: r.updatedAt,
		buildingName: r.building?.name ?? '',
		buildingAddress: r.building?.address ?? '',
		category: r.category ? named(toCategory(r.category)) : undefined,
		distributionKey: r.distributionKey
			? named({ id: r.distributionKey.id, name: toDistributionKey(r.distributionKey).name })
			: undefined,
		llmCategory: r.llmCategory
			? named({ id: r.llmCategory.id, name: toCategory(r.llmCategory).name })
			: undefined,
		categorizationStatus: categorizationStatus(r),
		beleg: r.beleg,
		inPeriodAmount: r.inPeriod?.amount
	};
}

type Period = { start: string; end: string };

/**
 * The periods with statements that bill this invoice (billedIn) and that lack it as it is now (missedIn: recorded or
 * changed after them), from the invoices the statements keep (#96), and each statement it is in; none if they cannot
 * be loaded
 */
export async function statementPeriods(fetch: typeof globalThis.fetch, backendUrl: string, invoiceId: string) {
	const response = await fetch(`${backendUrl}/api/v1/invoices/${invoiceId}/statements`).catch(() => null);
	const periods: { billedIn?: Period[]; missedIn?: Period[]; statements?: BilledStatement[] } = response?.ok
		? await response.json()
		: {};
	return { billedIn: periods.billedIn ?? [], missedIn: periods.missedIn ?? [], statements: periods.statements ?? [] };
}

/** The form a page sent with a file; one that is no form is refused as a bad request */
export const formOf = (request: Request) =>
	request.formData().catch(() => {
		throw new ValidationError('Invalid form');
	});

/** The invoice fields a form sends as JSON; anything else is refused as a bad request */
export function fieldsOf(value: FormDataEntryValue | null): Record<string, unknown> {
	let fields: unknown;
	try {
		fields = JSON.parse(String(value));
	} catch {
		fields = null;
	}
	if (typeof fields !== 'object' || fields === null || Array.isArray(fields)) throw new ValidationError('Invalid invoice fields', 'invoice');
	return fields as Record<string, unknown>;
}

/** A file the property manager chose for an invoice, as the backend takes it: its name and its content in Base64 */
export async function belegOf(file: FormDataEntryValue | null) {
	if (!(file instanceof File)) throw new ValidationError('A file is required', 'file');
	return { fileName: file.name, content: Buffer.from(await file.arrayBuffer()).toString('base64') };
}
