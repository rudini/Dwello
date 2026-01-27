import type { InvoiceWithDetails, Category, DistributionKey } from '$lib/types';

interface InvoiceDetailData {
	invoice: InvoiceWithDetails;
}

export const load = async ({ params }: { params: { id: string } }): Promise<InvoiceDetailData> => {
	const { id } = params;

	// Mock categories
	const mockCategories: Category[] = [
		{ id: 'cat-001', name: 'Heizung', isAllowedUtilityCost: true },
		{ id: 'cat-003', name: 'Wasser/Abwasser', isAllowedUtilityCost: true },
		{ id: 'cat-005', name: 'Hauswart', isAllowedUtilityCost: true },
		{ id: 'cat-009', name: 'Reparaturen', isAllowedUtilityCost: false }
	];

	// Mock distribution keys
	const mockDistributionKeys: DistributionKey[] = [
		{ id: 'dk-heating', name: 'Heizkosten', type: 'predefined', isActive: true },
		{ id: 'dk-units', name: 'Nach Einheiten', type: 'predefined', isActive: true }
	];

	// Mock invoice data
	const mockInvoices: Record<string, InvoiceWithDetails> = {
		'inv-001': {
			id: 'inv-001',
			buildingId: 'building-001',
			invoiceDate: '2025-01-15',
			billingEntity: 'Energie Zürich AG',
			description: 'Heizöllieferung Q4 2024',
			amount: 8500,
			categoryId: 'cat-001',
			distributionKeyId: 'dk-heating',
			isValidUtilityCost: true,
			llmConfidence: 0.95,
			llmReasoning: 'Heizölrechnung erkannt anhand Lieferant und Beschreibung',
			createdAt: '2025-01-15T10:30:00Z',
			updatedAt: '2025-01-15T10:30:00Z',
			buildingName: 'Musterhaus Zentrum',
			buildingAddress: 'Musterstraße 12, 8000 Zürich',
			category: mockCategories[0],
			distributionKey: mockDistributionKeys[0],
			categorizationStatus: 'auto-categorized'
		},
		'inv-002': {
			id: 'inv-002',
			buildingId: 'building-001',
			invoiceDate: '2025-01-10',
			billingEntity: 'Wasserwerke Zürich',
			description: 'Wasserabrechnung 2024',
			amount: 2400,
			categoryId: 'cat-003',
			distributionKeyId: 'dk-units',
			isValidUtilityCost: true,
			llmConfidence: 0.92,
			llmReasoning: 'Wasserrechnung von Versorgungsunternehmen',
			createdAt: '2025-01-10T14:20:00Z',
			updatedAt: '2025-01-10T14:20:00Z',
			buildingName: 'Musterhaus Zentrum',
			buildingAddress: 'Musterstraße 12, 8000 Zürich',
			category: mockCategories[1],
			distributionKey: mockDistributionKeys[1],
			categorizationStatus: 'auto-categorized'
		},
		'inv-005': {
			id: 'inv-005',
			buildingId: 'building-001',
			invoiceDate: '2024-12-15',
			billingEntity: 'Sanitär Müller',
			description: 'Reparatur Wasserleitung 3.OG',
			amount: 850,
			categoryId: 'cat-009',
			isValidUtilityCost: false,
			llmConfidence: 0.85,
			llmReasoning: 'Reparatur erkannt - nicht umlagefähige Nebenkosten',
			manualOverrideBy: 'admin',
			manualOverrideReason: 'Bestätigt als Reparatur, nicht auf Mieter umlegbar',
			createdAt: '2024-12-15T09:15:00Z',
			updatedAt: '2024-12-16T11:30:00Z',
			buildingName: 'Musterhaus Zentrum',
			buildingAddress: 'Musterstraße 12, 8000 Zürich',
			category: mockCategories[3],
			categorizationStatus: 'manual'
		}
	};

	const invoice = mockInvoices[id];

	if (!invoice) {
		// Return a default/404 invoice for demo
		return {
			invoice: {
				id,
				buildingId: 'building-001',
				invoiceDate: '2025-01-01',
				billingEntity: 'Unbekannt',
				description: 'Rechnung nicht gefunden',
				amount: 0,
				isValidUtilityCost: false,
				buildingName: 'Unbekannt',
				buildingAddress: 'Unbekannt',
				categorizationStatus: 'pending'
			}
		};
	}

	return { invoice };
};
