import { error } from '@sveltejs/kit';
import { backendMessage, type BackendError } from '$lib/backend-error';
import { localName } from '$lib/names';
import { m } from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';
import type { StatementLineItem, StatementWithDetails } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
type BackendStatement = Record<string, any>;

const toLineItem = (item: BackendStatement, profilePercent?: number): StatementLineItem => ({
	id: item.id,
	categoryId: item.categoryId,
	categoryName: item.categoryName || item.description || m.common_unknown(),
	distributionKeyId: item.distributionKeyId,
	distributionKeyName: item.distributionKeyName || '',
	totalAmount: Number(item.totalAmount),
	tenantShare: Number(item.tenantShare),
	percentage: Math.round(Number(item.sharePercentage) * 100) / 100 || 0,
	...sharesOf(item),
	byProfile: byProfile(item, profilePercent)
});

// Shared by the heating profile: its Zeitanteil is the profile's percent the statement stored (#209), not days
const byProfile = (item: BackendStatement, percent?: number) =>
	percent != null && !item.billedDays && Math.abs(Number(item.periodShare) * 100 - percent) < 0.005;

const amountOrNull = (value: unknown) => (value == null ? null : Number(value));

// Wohnungsanteil, Zeitanteil (as days where it is one) and the invoices the position billed, in the order of
// invoiceParts, which hold each one's days where they differ (#96, #104)
const sharesOf = (item: BackendStatement) => ({
	apartmentShare: amountOrNull(item.apartmentShare),
	periodShare: amountOrNull(item.periodShare),
	shareDays: item.billedDays ? { days: item.positionRentalDays ?? 0, total: item.billedDays } : null,
	invoices: (item.invoices ?? []).map((invoice: BackendStatement, index: number) => ({
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

/** Backend statement (with tenant, apartment, building, line items) as frontend StatementWithDetails */
export function toStatement(data: BackendStatement): StatementWithDetails {
	const [tenant, apartment, building] = [
		data.tenant ?? {},
		data.apartment ?? {},
		data.building ?? {}
	];
	return {
		id: data.id,
		statementNumber: data.statementNumber,
		tenantId: data.tenantId,
		apartmentId: data.apartmentId,
		buildingId: building.id || '',
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
		notes: data.notes,
		createdAt: data.createdAt,
		tenantName: data.tenant ? `${tenant.firstName} ${tenant.lastName}` : m.common_unknown(),
		tenantEmail: tenant.email || '',
		tenantCorrespondenceChannel: tenant.correspondenceChannel,
		apartmentUnit: apartment.number || '',
		apartmentFloor: apartment.floor || '',
		buildingName: building.name || '',
		buildingAddress: building.address || '',
		rentalStart: data.rentalStart,
		rentalEnd: data.rentalEnd,
		heatingProfileName: profileName(data),
		lineItems: (data.lineItems || []).map((item: BackendStatement) =>
			toLineItem(item, data.heatingShare?.byDays === false ? data.heatingShare.percent : undefined)
		)
	};
}

/** Names of categories or distribution keys in the UI language by id; the backend's lists only carry ids and the English or German name */
export async function namesById(fetch: typeof globalThis.fetch, list: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/${list}?limit=100`).catch(() => null);
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
	const statement = toStatement(await response.json());
	// Without a key the calculation shares the costs equally among the apartments
	const lineItems = statement.lineItems.map((item) => ({
		...item,
		categoryName: item.categoryId
			? (categories.get(item.categoryId) ?? item.categoryName)
			: m.invoices_not_categorised(), // the backend names it in German
		distributionKeyName: item.distributionKeyId
			? (keys.get(item.distributionKeyId) ?? '')
			: m.statements_equal_per_apartment()
	}));
	return { ...statement, lineItems };
}

const escaped = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * A statement PDF the backend refused, as a page in the UI language for the tab it opens in: the message of its
 * code (else `fallback`, never the backend's own text or JSON) and the way back to the list. Outside the app, so
 * without its styles: readable on a phone and in dark mode through the browser's own colours (the link in `CanvasText`, underlined); without scripts it is
 * ready at once (`data-hydrated`, which the app's pages set once they react to input)
 */
export function pdfRefusal(status: number, body: unknown, fallback = m.backend_pdf_failed()) {
	const sentence = backendMessage({ code: (body as BackendError | null)?.code }, fallback);
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
<a href="/statements" data-testid="pdf-refusal-back">${escaped(m.documents_to_statements())}</a>
</main>
</body>
</html>`;
	return new Response(page, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
