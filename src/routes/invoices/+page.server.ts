import type { InvoicesListData, InvoiceWithDetails, Category } from '$lib/types';

export const load = async ({ url }: { url: URL }): Promise<InvoicesListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10);
	const search = url.searchParams.get('search') || '';
	const buildingId = url.searchParams.get('buildingId') || '';
	const categoryId = url.searchParams.get('categoryId') || '';
	const validity = url.searchParams.get('validity') || ''; // 'valid', 'invalid', ''

	// Mock categories for development
	const mockCategories: Category[] = [
		{
			id: 'cat-001',
			name: 'Heizung',
			isAllowedUtilityCost: true,
			description: 'Heizkosten und Brennstoffe'
		},
		{
			id: 'cat-002',
			name: 'Warmwasser',
			isAllowedUtilityCost: true,
			description: 'Warmwasseraufbereitung'
		},
		{
			id: 'cat-003',
			name: 'Wasser/Abwasser',
			isAllowedUtilityCost: true,
			description: 'Frischwasser und Abwasserentsorgung'
		},
		{
			id: 'cat-004',
			name: 'Allgemeinstrom',
			isAllowedUtilityCost: true,
			description: 'Strom für Gemeinschaftsräume'
		},
		{
			id: 'cat-005',
			name: 'Hauswart',
			isAllowedUtilityCost: true,
			description: 'Hauswartkosten und Gebäudepflege'
		},
		{
			id: 'cat-006',
			name: 'Aufzug',
			isAllowedUtilityCost: true,
			description: 'Liftbetrieb und Wartung'
		},
		{
			id: 'cat-007',
			name: 'Gartenpflege',
			isAllowedUtilityCost: true,
			description: 'Garten- und Umgebungspflege'
		},
		{
			id: 'cat-008',
			name: 'Kehricht',
			isAllowedUtilityCost: true,
			description: 'Abfallentsorgung'
		},
		{
			id: 'cat-009',
			name: 'Reparaturen',
			isAllowedUtilityCost: false,
			description: 'Reparatur- und Instandhaltungskosten (nicht umlagefähig)'
		},
		{
			id: 'cat-010',
			name: 'Versicherung',
			isAllowedUtilityCost: false,
			description: 'Gebäudeversicherungen (nicht umlagefähig)'
		}
	];

	// Mock invoices for development
	const mockInvoices: InvoiceWithDetails[] = [
		{
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
			distributionKey: { id: 'dk-heating', name: 'Heizkosten', type: 'predefined', isActive: true },
			categorizationStatus: 'auto-categorized'
		},
		{
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
			buildingName: 'Musterhaus Zentrum',
			buildingAddress: 'Musterstraße 12, 8000 Zürich',
			category: mockCategories[2],
			distributionKey: { id: 'dk-units', name: 'Nach Einheiten', type: 'predefined', isActive: true },
			categorizationStatus: 'auto-categorized'
		},
		{
			id: 'inv-003',
			buildingId: 'building-001',
			invoiceDate: '2025-01-05',
			billingEntity: 'Hauswart Meier GmbH',
			description: 'Hauswartservice Januar 2025',
			amount: 650,
			categoryId: 'cat-005',
			distributionKeyId: 'dk-units',
			isValidUtilityCost: true,
			llmConfidence: 0.88,
			llmReasoning: 'Hauswartrechnung basierend auf Firmennamen',
			buildingName: 'Musterhaus Zentrum',
			buildingAddress: 'Musterstraße 12, 8000 Zürich',
			category: mockCategories[4],
			distributionKey: { id: 'dk-units', name: 'Nach Einheiten', type: 'predefined', isActive: true },
			categorizationStatus: 'auto-categorized'
		},
		{
			id: 'inv-004',
			buildingId: 'building-002',
			invoiceDate: '2024-12-20',
			billingEntity: 'Schindler Aufzüge AG',
			description: 'Liftservice und Wartung Q4 2024',
			amount: 1200,
			categoryId: 'cat-006',
			distributionKeyId: 'dk-units',
			isValidUtilityCost: true,
			llmConfidence: 0.90,
			llmReasoning: 'Aufzugswartung von bekanntem Lifthersteller',
			buildingName: 'Seepark Residenz',
			buildingAddress: 'Seestrasse 45, 6004 Luzern',
			category: mockCategories[5],
			distributionKey: { id: 'dk-units', name: 'Nach Einheiten', type: 'predefined', isActive: true },
			categorizationStatus: 'auto-categorized'
		},
		{
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
			buildingName: 'Musterhaus Zentrum',
			buildingAddress: 'Musterstraße 12, 8000 Zürich',
			category: mockCategories[8],
			categorizationStatus: 'manual'
		},
		{
			id: 'inv-006',
			buildingId: 'building-003',
			invoiceDate: '2024-12-01',
			billingEntity: 'Gartenbau Keller',
			description: 'Herbstschnitt und Laubentfernung',
			amount: 450,
			categoryId: 'cat-007',
			distributionKeyId: 'dk-area',
			isValidUtilityCost: true,
			llmConfidence: 0.91,
			llmReasoning: 'Gartenarbeiten basierend auf Beschreibung',
			buildingName: 'Alpenblick',
			buildingAddress: 'Bergweg 7, 3012 Bern',
			category: mockCategories[6],
			distributionKey: { id: 'dk-area', name: 'Nach Fläche', type: 'predefined', isActive: true },
			categorizationStatus: 'auto-categorized'
		},
		{
			id: 'inv-007',
			buildingId: 'building-001',
			invoiceDate: '2024-11-28',
			billingEntity: 'EKZ AG',
			description: 'Allgemeinstrom November 2024',
			amount: 320,
			categoryId: 'cat-004',
			distributionKeyId: 'dk-units',
			isValidUtilityCost: true,
			buildingName: 'Musterhaus Zentrum',
			buildingAddress: 'Musterstraße 12, 8000 Zürich',
			category: mockCategories[3],
			distributionKey: { id: 'dk-units', name: 'Nach Einheiten', type: 'predefined', isActive: true },
			categorizationStatus: 'pending'
		}
	];

	// Mock buildings for filters
	const mockBuildings = [
		{ id: 'building-001', name: 'Musterhaus Zentrum', address: 'Musterstraße 12, 8000 Zürich' },
		{ id: 'building-002', name: 'Seepark Residenz', address: 'Seestrasse 45, 6004 Luzern' },
		{ id: 'building-003', name: 'Alpenblick', address: 'Bergweg 7, 3012 Bern' },
		{ id: 'building-004', name: 'Sonnenhof', address: 'Bahnhofstrasse 88, 4051 Basel' }
	];

	// Apply filters
	let filteredInvoices = mockInvoices;

	if (search) {
		const searchLower = search.toLowerCase();
		filteredInvoices = filteredInvoices.filter(
			(inv) =>
				inv.billingEntity.toLowerCase().includes(searchLower) ||
				inv.description.toLowerCase().includes(searchLower) ||
				inv.buildingName?.toLowerCase().includes(searchLower)
		);
	}

	if (buildingId) {
		filteredInvoices = filteredInvoices.filter((inv) => inv.buildingId === buildingId);
	}

	if (categoryId) {
		filteredInvoices = filteredInvoices.filter((inv) => inv.categoryId === categoryId);
	}

	if (validity === 'valid') {
		filteredInvoices = filteredInvoices.filter((inv) => inv.isValidUtilityCost);
	} else if (validity === 'invalid') {
		filteredInvoices = filteredInvoices.filter((inv) => !inv.isValidUtilityCost);
	}

	// Sort by date descending
	filteredInvoices.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());

	// Paginate
	const start = (page - 1) * pageSize;
	const paginatedInvoices = filteredInvoices.slice(start, start + pageSize);

	return {
		invoices: paginatedInvoices,
		total: filteredInvoices.length,
		page,
		pageSize,
		buildings: mockBuildings,
		categories: mockCategories
	};
};
