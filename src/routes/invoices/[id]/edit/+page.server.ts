import type { InvoiceWithDetails, Category, DistributionKey } from '$lib/types';

interface InvoiceEditData {
	invoice: InvoiceWithDetails;
	buildings: { id: string; name: string; address: string }[];
	categories: Category[];
	distributionKeys: DistributionKey[];
}

export const load = async ({ params }: { params: { id: string } }): Promise<InvoiceEditData> => {
	const { id } = params;

	// Mock categories
	const mockCategories: Category[] = [
		{ id: 'cat-001', name: 'Heizung', isAllowedUtilityCost: true },
		{ id: 'cat-002', name: 'Warmwasser', isAllowedUtilityCost: true },
		{ id: 'cat-003', name: 'Wasser/Abwasser', isAllowedUtilityCost: true },
		{ id: 'cat-004', name: 'Allgemeinstrom', isAllowedUtilityCost: true },
		{ id: 'cat-005', name: 'Hauswart', isAllowedUtilityCost: true },
		{ id: 'cat-006', name: 'Aufzug', isAllowedUtilityCost: true },
		{ id: 'cat-007', name: 'Gartenpflege', isAllowedUtilityCost: true },
		{ id: 'cat-008', name: 'Kehricht', isAllowedUtilityCost: true },
		{ id: 'cat-009', name: 'Reparaturen', isAllowedUtilityCost: false },
		{ id: 'cat-010', name: 'Versicherung', isAllowedUtilityCost: false }
	];

	// Mock distribution keys
	const mockDistributionKeys: DistributionKey[] = [
		{ id: 'dk-units', name: 'Nach Einheiten', type: 'predefined', isActive: true },
		{ id: 'dk-area', name: 'Nach Fläche', type: 'predefined', isActive: true },
		{ id: 'dk-heating', name: 'Heizkosten', type: 'predefined', isActive: true },
		{ id: 'dk-rooms', name: 'Nach Zimmern', type: 'predefined', isActive: true }
	];

	// Mock buildings
	const mockBuildings = [
		{ id: 'building-001', name: 'Musterhaus Zentrum', address: 'Musterstraße 12, 8000 Zürich' },
		{ id: 'building-002', name: 'Seepark Residenz', address: 'Seestrasse 45, 6004 Luzern' },
		{ id: 'building-003', name: 'Alpenblick', address: 'Bergweg 7, 3012 Bern' },
		{ id: 'building-004', name: 'Sonnenhof', address: 'Bahnhofstrasse 88, 4051 Basel' }
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
			buildingName: 'Musterhaus Zentrum',
			buildingAddress: 'Musterstraße 12, 8000 Zürich',
			category: mockCategories[0],
			distributionKey: mockDistributionKeys[2],
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
			buildingName: 'Musterhaus Zentrum',
			buildingAddress: 'Musterstraße 12, 8000 Zürich',
			category: mockCategories[2],
			distributionKey: mockDistributionKeys[0],
			categorizationStatus: 'auto-categorized'
		}
	};

	const invoice = mockInvoices[id] || {
		id,
		buildingId: 'building-001',
		invoiceDate: '2025-01-01',
		billingEntity: 'Unbekannt',
		description: '',
		amount: 0,
		isValidUtilityCost: true,
		buildingName: '',
		buildingAddress: '',
		categorizationStatus: 'pending'
	};

	return {
		invoice,
		buildings: mockBuildings,
		categories: mockCategories,
		distributionKeys: mockDistributionKeys
	};
};
