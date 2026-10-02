import { error } from '@sveltejs/kit';
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
	percentage: Number(item.sharePercentage) || 0
});

// The statement stores the fee in francs; the rate follows from fee / costs before the fee
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
		buildingId: apartment.buildingId || '',
		periodStart: data.periodStart,
		periodEnd: data.periodEnd,
		statementDate: data.statementDate,
		rentalDays: data.rentalDays,
		totalCosts: Number(data.totalCosts),
		totalAdvancePayments: Number(data.totalAdvancePayments),
		managementFee: Number(data.managementFee),
		managementFeePercent: feePercent(Number(data.totalCosts), Number(data.managementFee)),
		balance: Number(data.balance),
		status: data.status,
		paymentDeadline: data.paymentDeadline,
		paidDate: data.paidDate,
		pdfGeneratedAt: data.pdfGeneratedAt,
		lastReminderDate: data.lastReminderDate,
		notes: data.notes,
		createdAt: data.createdAt,
		tenantName: data.tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unbekannt',
		tenantEmail: tenant.email || '',
		apartmentUnit: apartment.number || '',
		apartmentFloor: apartment.floor || '',
		buildingName: building.name || '',
		buildingAddress: building.address || '',
		lineItems: (data.lineItems || []).map(toLineItem)
	};
}

export async function loadStatement(fetch: typeof globalThis.fetch, id: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}`);
	if (response.status === 404) throw error(404, 'Abrechnung nicht gefunden');
	if (!response.ok) throw error(response.status, 'Fehler beim Laden der Abrechnung');
	return toStatement(await response.json());
}
