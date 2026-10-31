import { error } from '@sveltejs/kit';
import { backendMessage, type BackendError } from '$lib/backend-error';
import { localName } from '$lib/names';
import { m } from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';
import type { StatementWithDetails as StatementResponse } from '../../../backend/src/api/statement';
import type { Json, StatementLineItem, StatementWithDetails } from '$lib/types';
import type { SplitKeyHint } from '$lib/types';
import type { SplitKey } from '../../../backend/src/services/split-keys';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
type BackendStatement = Record<string, any>;

// a position as the backend stores it (backend/src/api/statement.ts)
type LineItem = Json<StatementResponse>['lineItems'][number];

const toLineItem = (item: LineItem, profilePercent?: number): StatementLineItem => ({
	id: item.id,
	categoryId: item.categoryId,
	// the backend sends no names; loadStatement names category and key in the UI language
	categoryName: item.description || m.common_unknown(),
	distributionKeyId: item.distributionKeyId,
	distributionKeyName: '',
	totalAmount: Number(item.totalAmount),
	tenantShare: Number(item.tenantShare),
	percentage: Math.round(Number(item.sharePercentage) * 100) / 100 || 0,
	...sharesOf(item),
	byProfile: byProfile(item, profilePercent)
});

// Shared by the heating profile: its Zeitanteil is the profile's percent the statement stored (#209), not days
const byProfile = (item: LineItem, percent?: number) =>
	percent != null && !item.billedDays && Math.abs(Number(item.periodShare) * 100 - percent) < 0.005;

const amountOrNull = (value: unknown) => (value == null ? null : Number(value));

// Wohnungsanteil, Zeitanteil (as days where it is one) and the invoices the position billed, in the order of
// invoiceParts, which hold each one's days where they differ (#96, #104)
const sharesOf = (item: LineItem) => ({
	apartmentShare: amountOrNull(item.apartmentShare),
	periodShare: amountOrNull(item.periodShare),
	shareDays: item.billedDays ? { days: item.positionRentalDays ?? 0, total: item.billedDays } : null,
	invoices: (item.invoices ?? []).map((invoice, index) => ({
		...invoice,
		part: item.invoiceParts?.[index] ?? null
	}))
});

const notApplied: Record<string, () => string> = {
	wholePeriod: m.statements_profile_reason_whole_period,
	noHeatingMonths: m.statements_profile_reason_no_heating_months
};

// The heating profile as the statement stored it (#229), else as it is now; shared by days, not applied and why (#247)
const profileName = (data: BackendStatement): string => {
	const share = data.heatingShare;
	const name = share?.names ? localName(share.names) : data.heatingProfile ? localName(data.heatingProfile) : '';
	if (!name || !share?.byDays) return name;
	const reason = notApplied[share.reason];
	return reason
		? m.statements_profile_not_applied({ profile: name, reason: reason() })
		: m.statements_profile_not_applied_unknown({ profile: name });
};

// A berichtigte Abrechnung and the statement it replaces, and what was paid on the replaced ones (#120)
const correctionOf = (data: BackendStatement) => ({
	contractId: data.contractId,
	paidAmount: amountOrNull(data.paidAmount),
	replaces: data.replaces ?? null,
	replacedBy: data.replacedBy ?? null,
	priorPayments: Number(data.priorPayments ?? 0),
	priorPaidOn: data.priorPaidOn ?? [],
	offsetWith: (data.offsetWith ?? []).map((o: BackendStatement) => ({ statementNumber: o.statementNumber, amount: Number(o.amount) }))
});

// #448: a Schlussabrechnung has no Mindestbetrag; the Übertrag from the previous statement of the Mietvertrag
const carryOf = (data: BackendStatement) => ({
	final: !!data.final,
	openCarry: !!data.openCarry,
	carrySettledOn: data.carrySettledOn ?? null,
	carriedFrom: data.carriedFrom ? { ...data.carriedFrom, balance: Number(data.carriedFrom.balance) } : null
});

// The tenant, apartment and building of a statement as the pages name them; each is null when its record is gone
const tenantOf = ({ tenant }: Json<StatementResponse>) => ({
	tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : m.common_unknown(),
	tenantEmail: tenant?.email || '',
	tenantCorrespondenceChannel: tenant?.correspondenceChannel,
	tenantLanguage: tenant?.language
});
const placeOf = ({ apartment, building }: Json<StatementResponse>) => ({
	buildingId: building?.id || '',
	apartmentUnit: apartment?.number || '',
	apartmentFloor: apartment?.floor || '',
	buildingName: building?.name || '',
	buildingAddress: building?.address || ''
});

/** Backend statement (with tenant, apartment, building, line items) as frontend StatementWithDetails */
export function toStatement(data: Json<StatementResponse>): StatementWithDetails {
	return {
		id: data.id,
		statementNumber: data.statementNumber,
		tenantId: data.tenantId,
		apartmentId: data.apartmentId,
		periodStart: data.periodStart,
		periodEnd: data.periodEnd,
		statementDate: data.statementDate,
		rentalDays: data.rentalDays,
		totalCosts: Number(data.totalCosts),
		totalAdvancePayments: Number(data.totalAdvancePayments),
		managementFee: Number(data.managementFee),
		managementFeePercent: Number(data.managementFeePercent ?? 0), // rate chosen for the generation run
		balance: Number(data.balance),
		status: data.status,
		paymentDeadline: data.paymentDeadline,
		paidDate: data.paidDate,
		pdfGeneratedAt: data.pdfGeneratedAt,
		lastReminderDate: data.reminderSentDate,
		nextReminderFrom: data.nextReminderFrom,
		reminderToSend: !!data.reminderToSend,
		remindersCounted: data.remindersCounted ?? 0,
		oldAddress: !!data.oldAddress, // A-5: the moved-out tenant still has the building's address
		notes: data.notes,
		createdAt: data.createdAt,
		...tenantOf(data),
		...placeOf(data),
		rentalStart: data.rentalStart,
		rentalEnd: data.rentalEnd,
		heatingProfileName: profileName(data),
		...correctionOf(data),
		...carryOf(data),
		paymentResets: (data.paymentResets ?? []).map(({ resetOn, paidDate }: BackendStatement) => ({
			resetOn,
			paidDate
		})),
		correctionDeclined: data.correctionDeclined ? { on: data.correctionDeclined.on } : null,
		// what it allows, the backend decides it (#788)
		editable: data.editable === true,
		correctable: data.correctable === true,
		asksPayment: data.asksPayment === true,
		superseded: data.superseded === true,
		redeliverable: data.redeliverable === true, // #534
		refund: data.refund === true,
		resent: (data.resent ?? []).map((sending) => ({ ...sending, sentAt: sending.sentAt ? String(sending.sentAt) : null, createdAt: String(sending.createdAt) })),
		newPdfToSend: data.newPdfToSend ?? null,
		newPdfMadeAt: data.newPdfMadeAt ? String(data.newPdfMadeAt) : null,
		// what the Saldo asks of whom, by the Swiss day (#815)
		unpaid: data.unpaid === true,
		claimed: data.claimed === true,
		noPayment: data.noPayment === true,
		waived: data.waived === true,
		carried: data.carried === true,
		reminderWaitsUntil: data.reminderWaitsUntil ?? null,
		reminderToPost: data.reminderToPost === true,
		deadlinePassed: data.deadlinePassed === true,
		advanceChanged: data.advanceChanged === true,
		lineItems: (data.lineItems || []).map((item) =>
			toLineItem(item, data.heatingShare?.byDays === false ? data.heatingShare.percent : undefined)
		)
	};
}

/** What changed since the statement was created: how many invoices of its period were recorded, changed or deleted
 *  (#96), whether its Tankbestand changed, and whether correcting it is due and may be declined (#454); only a hint:
 *  nothing if it cannot be loaded */
export async function laterChanges(fetch: typeof globalThis.fetch, id: string) {
	const [response, categories, keys] = await Promise.all([
		fetch(`${BACKEND_URL}/api/v1/statements/${id}/changed-invoices`).catch(() => null),
		namesById(fetch, 'categories'),
		namesById(fetch, 'distribution-keys')
	]);
	const changed: {
		invoiceIds?: string[];
		fuelStockChanged?: boolean;
		correctionDue?: boolean;
		correctionDeclinable?: boolean;
		correctionLowers?: boolean;
		carryOverChanged?: boolean;
		splitKeys?: SplitKey[];
	} = response?.ok ? await response.json() : {};
	return {
		invoices: changed.invoiceIds?.length ?? 0,
		fuelStock: !!changed.fuelStockChanged,
		correctionDue: !!changed.correctionDue,
		correctionDeclinable: !!changed.correctionDeclinable,
		correctionLowers: !!changed.correctionLowers,
		carryOver: !!changed.carryOverChanged, // #506 C: the draft would count another Übertrag now
		splitKeys: localSplitKeys(changed.splitKeys, categories, keys) // #528, as «Neu berechnen» would bill them
	};
}

/** #528: the Kategorie and keys of each split in the UI language; without a key «Pro Einheit», as its line */
export function localSplitKeys(splitKeys: SplitKey[] = [], categories: Map<string, string>, keys: Map<string, string>): SplitKeyHint[] {
	const keyName = (id: string | null) => (id ? (keys.get(id) ?? '') : m.statements_key_per_unit());
	return splitKeys.map((split) => ({
		...split,
		categoryName: (split.categoryId && categories.get(split.categoryId)) || '',
		keyName: keyName(split.keyId),
		mainKeyName: keyName(split.mainKeyId)
	}));
}

/** Names of categories or distribution keys in the UI language by id; the backend's lists only carry ids and the English or German name */
export async function namesById(fetch: typeof globalThis.fetch, list: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/${list}?limit=1000`).catch(() => null); // all of them (#585)
	const body = response?.ok ? await response.json() : {};
	const records: (Parameters<typeof localName>[0] & { id: string })[] =
		body.categories ?? body.data ?? [];
	return new Map(records.map((record) => [record.id, localName(record)]));
}

export async function loadStatement(fetch: typeof globalThis.fetch, id: string) {
	const [response, categories, keys] = await Promise.all([
		fetch(`${BACKEND_URL}/api/v1/statements/${id}`),
		namesById(fetch, 'categories'),
		namesById(fetch, 'distribution-keys')
	]);
	if (response.status === 404) throw error(404, m.statements_not_found());
	if (!response.ok) throw error(response.status, m.statements_load_failed());
	const body = await response.json();
	const statement = toStatement(body);
	// Without a key the calculation shares the costs equally among the apartments, as «Pro Einheit» (the PDF names it so)
	const lineItems = statement.lineItems.map((item) => ({
		...item,
		categoryName: item.categoryId
			? (categories.get(item.categoryId) ?? item.categoryName)
			: m.invoices_not_categorised(), // the backend names it in German
		distributionKeyName: item.distributionKeyId
			? (keys.get(item.distributionKeyId) ?? '')
			: m.statements_key_per_unit()
	}));
	return { ...statement, lineItems, splitKeys: localSplitKeys(body.splitKeys, categories, keys) };
}

/** The backend names a statement PDF after its number (NK-…, #101); in the header only ASCII letters, digits, underscore, dot and dash */
export const pdfFileName = (headers: Headers) =>
	headers
		.get('content-disposition')
		?.match(/filename="(.*)"/)?.[1]
		.replace(/[^\w.-]/g, '') || 'statement.pdf';

const SETTINGS_CODES = ['CREDITOR_ADDRESS_MISSING', 'IBAN_MISSING', 'IBAN_INVALID'];

const escaped = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * A statement PDF the backend refused, as a page in the UI language for the tab it opens in: the message of its
 * code (else `fallback`, never the backend's own text or JSON) and the way back to the list. Outside the app, so
 * without its styles: readable on a phone and in dark mode through the browser's own colours (the link in `CanvasText`, underlined); without scripts it is
 * ready at once (`data-hydrated`, which the app's pages set once they react to input)
 */
export function pdfRefusal(status: number, body: unknown, fallback = m.backend_pdf_failed()) {
	const code = (body as BackendError | null)?.code;
	const sentence = backendMessage({ code }, fallback);
	// a refusal whose way out is in «Einstellungen» links there too (persona Dr. Weber P-2, #450)
	const settings = SETTINGS_CODES.includes(code ?? '')
		? `\n<a href="/config" data-testid="pdf-refusal-settings">${escaped(m.documents_to_settings())}</a>`
		: '';
	const page = `<!doctype html>
<html lang="${getLocale()}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${escaped(m.nav_statements())} - Dwello</title>
<style>
body { font-family: system-ui, sans-serif; font-size: 1rem; line-height: 1.5; margin: 1.5rem }
a { display: inline-block; padding: 0.75rem 0; color: CanvasText }
</style>
</head>
<body data-hydrated>
<main>
<p data-testid="pdf-refusal-message">${escaped(sentence)}</p>
<a href="/statements" data-testid="pdf-refusal-back">${escaped(m.documents_to_statements())}</a>${settings}
</main>
</body>
</html>`;
	return new Response(page, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
