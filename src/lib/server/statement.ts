import { error } from '@sveltejs/kit';
import { germanName } from '$lib/names';
import type { StatementLineItem, StatementWithDetails } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON
type BackendStatement = Record<string, any>;

const toLineItem = (item: BackendStatement): StatementLineItem => ({
	id: item.id,
	categoryId: item.categoryId,
	categoryName: item.categoryName || item.description || 'Unbekannt',
	distributionKeyId: item.distributionKeyId,
	distributionKeyName: item.distributionKeyName || '',
	totalAmount: Number(item.totalAmount),
	tenantShare: Number(item.tenantShare),
	percentage: Math.round(Number(item.sharePercentage) * 100) / 100 || 0
});

// Before the rate was stored, the fee was a percentage of the tenant's costs before the fee
function feePercent(totalCosts: number, fee: number) {
	const subtotal = totalCosts - fee;
	return subtotal > 0 ? Math.round((fee / subtotal) * 10000) / 100 : 0;
}

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
		// Rate chosen for the generation run; statements from before it was stored derive it from fee / costs
		managementFeePercent:
			data.managementFeePercent != null
				? Number(data.managementFeePercent)
				: feePercent(Number(data.totalCosts), Number(data.managementFee)),
		balance: Number(data.balance),
		status: data.status,
		paymentDeadline: data.paymentDeadline,
		paidDate: data.paidDate,
		pdfGeneratedAt: data.pdfGeneratedAt,
		lastReminderDate: data.reminderSentDate,
		notes: data.notes,
		createdAt: data.createdAt,
		tenantName: data.tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unbekannt',
		tenantEmail: tenant.email || '',
		tenantCorrespondenceChannel: tenant.correspondenceChannel,
		apartmentUnit: apartment.number || '',
		apartmentFloor: apartment.floor || '',
		buildingName: building.name || '',
		buildingAddress: building.address || '',
		lineItems: (data.lineItems || []).map(toLineItem)
	};
}

// German names of categories or distribution keys by id; the line items only carry ids and the English name
async function namesById(fetch: typeof globalThis.fetch, list: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/${list}?limit=100`).catch(() => null);
	const body = response?.ok ? await response.json() : {};
	const records: { id: string; name: string; nameDE?: string | null }[] =
		body.categories ?? body.data ?? [];
	return new Map(records.map((record) => [record.id, germanName(record)]));
}

export async function loadStatement(fetch: typeof globalThis.fetch, id: string) {
	const [response, categories, keys] = await Promise.all([
		fetch(`${BACKEND_URL}/api/v1/statements/${id}`),
		namesById(fetch, 'categories'),
		namesById(fetch, 'distribution-keys')
	]);
	if (response.status === 404) throw error(404, 'Abrechnung nicht gefunden');
	if (!response.ok) throw error(response.status, 'Fehler beim Laden der Abrechnung');
	const statement = toStatement(await response.json());
	// Without a key the calculation shares the costs equally among the apartments
	const lineItems = statement.lineItems.map((item) => ({
		...item,
		categoryName: categories.get(item.categoryId) ?? item.categoryName,
		distributionKeyName: item.distributionKeyId
			? (keys.get(item.distributionKeyId) ?? '')
			: 'Gleichmässig pro Wohnung'
	}));
	return { ...statement, lineItems };
}
