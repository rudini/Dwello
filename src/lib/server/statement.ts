import { error } from '@sveltejs/kit';
import { localName } from '$lib/names';
import { m } from '$lib/paraglide/messages';
import type { StatementLineItem, StatementWithDetails } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
type BackendStatement = Record<string, any>;

const toLineItem = (item: BackendStatement): StatementLineItem => ({
	id: item.id,
	categoryId: item.categoryId,
	categoryName: item.categoryName || item.description || m.common_unknown(),
	distributionKeyId: item.distributionKeyId,
	distributionKeyName: item.distributionKeyName || '',
	totalAmount: Number(item.totalAmount),
	tenantShare: Number(item.tenantShare),
	percentage: Math.round(Number(item.sharePercentage) * 100) / 100 || 0
});

/** Backend statement (with tenant, apartment, building, line items) as frontend StatementWithDetails */
export function toStatement(data: BackendStatement): StatementWithDetails {
	const { tenant = {}, apartment = {}, building = {} } = data;
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
		notes: data.notes,
		createdAt: data.createdAt,
		tenantName: data.tenant
			? `${tenant.firstName} ${tenant.lastName}`
			: m.common_unknown(),
		tenantEmail: tenant.email || '',
		tenantCorrespondenceChannel: tenant.correspondenceChannel,
		apartmentUnit: apartment.number || '',
		apartmentFloor: apartment.floor || '',
		buildingName: building.name || '',
		buildingAddress: building.address || '',
		lineItems: (data.lineItems || []).map(toLineItem)
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
