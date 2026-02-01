import type { StatementWithDetails } from '$lib/types';
import { error } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface StatementDetailData {
	statement: StatementWithDetails;
}

export const load = async ({ params, fetch }): Promise<StatementDetailData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/statements/${params.id}`);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Abrechnung nicht gefunden');
			}
			throw error(response.status, 'Fehler beim Laden der Abrechnung');
		}

		const data = await response.json();

		// Transform backend data to match frontend types
		const statement: StatementWithDetails = {
			id: data.id,
			statementNumber: data.statementNumber,
			tenantId: data.tenantId,
			apartmentId: data.apartmentId,
			buildingId: data.apartment?.buildingId || '',
			periodStart: data.periodStart,
			periodEnd: data.periodEnd,
			statementDate: data.statementDate,
			rentalDays: data.rentalDays,
			totalCosts: Number(data.totalCosts),
			totalAdvancePayments: Number(data.totalAdvancePayments),
			managementFee: Number(data.managementFee),
			balance: Number(data.balance),
			status: data.status,
			paymentDeadline: data.paymentDeadline,
			paidDate: data.paidDate,
			pdfGeneratedAt: data.pdfGeneratedAt,
			lastReminderDate: data.lastReminderDate,
			createdAt: data.createdAt,
			tenantName: data.tenant ? `${data.tenant.firstName} ${data.tenant.lastName}` : 'Unbekannt',
			tenantEmail: data.tenant?.email || '',
			apartmentUnit: data.apartment?.number || '',
			apartmentFloor: data.apartment?.floor || '',
			buildingName: data.building?.name || '',
			buildingAddress: data.building?.address || '',
			lineItems: (data.lineItems || []).map((item: Record<string, unknown>) => ({
				id: item.id,
				categoryId: item.categoryId,
				categoryName: item.categoryName || item.description || 'Unbekannt',
				distributionKeyId: item.distributionKeyId,
				distributionKeyName: item.distributionKeyName || '',
				totalAmount: Number(item.totalAmount),
				tenantShare: Number(item.tenantShare),
				percentage: Number(item.sharePercentage) || 0
			}))
		};

		return { statement };
	} catch (err) {
		console.error('Failed to fetch statement:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden der Abrechnung');
	}
};
