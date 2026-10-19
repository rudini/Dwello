/**
 * Categorizing invoices: without a running KI, and overriding its suggestion with a reason (real PostgreSQL database)
 */

import { app } from '../app';
import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { llmConfig } from '../config/llm';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { createInvoice, deleteInvoice } from '../services/invoice.service';
import { callApi, sendJson } from './helpers/auth';
import { openAiCompatible } from './helpers/llm';
import { expectRejection, invoicedBuilding, perAreaKey } from './helpers/records';

type Invoice = {
	id: string;
	categoryId: string;
	llmCategoryId: string | null;
	manualOverrideReason: string | null;
};

const token = crypto.randomUUID();
const configured = { ...llmConfig };

let removeBuilding = async () => {};
let invoice: Invoice;

beforeAll(async () => {
	// Nothing listens on port 9: the KI does not run, as in the test environment
	llmConfig.baseUrl = 'http://127.0.0.1:9';
	removeBuilding = await invoicedBuilding(`Kategorienhaus ${token}`, {
		description: `Hauswart ${token}`
	});
	const response = await callApi(`/api/v1/invoices?search=${token}`);
	[invoice] = ((await response.json()) as { invoices: Invoice[] }).invoices;
});

afterAll(async () => {
	Object.assign(llmConfig, configured);
	await removeBuilding();
});

describe('Neu kategorisieren', () => {
	it('meldet, dass die KI nicht kategorisieren konnte, und lässt die Rechnung unverändert', async () => {
		const response = await callApi(`/api/v1/invoices/${invoice.id}/recategorize`, {
			method: 'POST'
		});

		await expectRejection(
			response,
			503,
			'Die KI ist nicht erreichbar oder hat keine passende Kategorie geliefert.',
			'KI_UNAVAILABLE'
		);
		const detail = (await (await callApi(`/api/v1/invoices/${invoice.id}`)).json()) as Invoice;
		expect(detail).toMatchObject({ categoryId: invoice.categoryId, llmCategoryId: null });
	});

	it('übernimmt eine sichere Kategorie der KI, wie beim Erfassen', async () => {
		const building = await createBuilding({
			name: `Neu-kategorisiert-Haus ${token}`,
			address: 'Testweg 2',
			postalCode: '8400',
			city: 'Winterthur',
			canton: 'ZH'
		});
		// Erfasst, während die KI nicht läuft: ohne Kategorie
		const uncategorized = await createInvoice({
			buildingId: building.id,
			billingEntityName: 'Sanitär Meier',
			description: `Leck Hauptleitung ${token}`,
			amount: '800.00',
			invoiceDate: '2025-05-12',
			distributionKeyId: await perAreaKey()
		});
		const llm = openAiCompatible({ category: 'Repairs', confidence: 0.95, isAllowedUtilityCost: true });
		try {
			const response = await callApi(`/api/v1/invoices/${uncategorized.id}/recategorize`, { method: 'POST' });

			expect(response.status).toBe(200);
			const detail = (await (await callApi(`/api/v1/invoices/${uncategorized.id}`)).json()) as {
				category: { name: string };
				isValidUtilityCost: boolean;
			};
			expect(detail.category.name).toBe('Repairs');
			expect(detail.isValidUtilityCost).toBe(false);
		} finally {
			llm.stop();
			await deleteInvoice(uncategorized.id);
			await deleteBuilding(building.id);
		}
	});
});

describe('Neu kategorisieren einer ausgeschlossenen Rechnung', () => {
	// Auch in einer umlagefähigen Kategorie kann der Verwalter eine Rechnung ausschliessen; die KI hebt das nicht auf
	it('lässt den Ausschluss des Verwalters bestehen', async () => {
		const { categories } = (await (await callApi('/api/v1/categories?search=Caretaker')).json()) as {
			categories: { id: string }[];
		};
		const building = await createBuilding({
			name: `Ausgeschlossen-Haus ${token}`,
			address: 'Testweg 3',
			postalCode: '8400',
			city: 'Winterthur',
			canton: 'ZH'
		});
		const excluded = await createInvoice({
			buildingId: building.id,
			billingEntityName: 'Hauswart Huber',
			description: `Sonderreinigung nach Umbau ${token}`,
			amount: '300.00',
			invoiceDate: '2025-05-12',
			distributionKeyId: await perAreaKey(),
			categoryId: categories[0].id,
			isValidUtilityCost: false
		});
		const llm = openAiCompatible({ category: 'Caretaker', confidence: 0.95, isAllowedUtilityCost: true });
		try {
			await callApi(`/api/v1/invoices/${excluded.id}/recategorize`, { method: 'POST' });

			const detail = (await (await callApi(`/api/v1/invoices/${excluded.id}`)).json()) as {
				isValidUtilityCost: boolean;
			};
			expect(detail.isValidUtilityCost).toBe(false);
		} finally {
			llm.stop();
			await deleteInvoice(excluded.id);
			await deleteBuilding(building.id);
		}
	});
});

describe('Kategorie der KI überschreiben', () => {
	it('speichert den Grund und gibt ihn mit der Rechnung zurück', async () => {
		const { categories } = (await (await callApi('/api/v1/categories?search=Repairs')).json()) as {
			categories: { id: string }[];
		};
		await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, {
			llmCategoryId: invoice.categoryId,
			llmConfidence: '0.9'
		});

		const response = await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, {
			categoryId: categories[0].id,
			manualOverrideReason: 'Reparatur, keine Wartung'
		});

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({
			wasManuallyOverridden: true,
			manualOverrideReason: 'Reparatur, keine Wartung'
		});
		const detail = (await (await callApi(`/api/v1/invoices/${invoice.id}`)).json()) as Invoice;
		expect(detail.manualOverrideReason).toBe('Reparatur, keine Wartung');
	});
});

describe('Kategorie der KI für eine neue Rechnung', () => {
	// Ob Kosten umlagefähig sind, entscheidet die Kategorie (OR 257a), nicht die Einschätzung der KI
	it('legt eine Reparatur nicht auf die Mieter um, auch wenn die KI sie für umlagefähig hält', async () => {
		// OpenAI-kompatibler Anbieter an der Systemgrenze ersetzt: antwortet sicher mit "Repairs", aber umlagefähig
		const llm = openAiCompatible({ category: 'Repairs', confidence: 0.95, isAllowedUtilityCost: true });
		const building = await createBuilding({
			name: `KI-Haus ${token}`,
			address: 'Testweg 1',
			postalCode: '8400',
			city: 'Winterthur',
			canton: 'ZH'
		});
		try {
			const invoice = await createInvoice({
				buildingId: building.id,
				billingEntityName: 'Sanitär Meier',
				description: `Leck Steigleitung ${token}`,
				amount: '800.00',
				invoiceDate: '2025-05-12',
				distributionKeyId: await perAreaKey()
			});
			await deleteInvoice(invoice.id);

			expect(invoice.category?.name).toBe('Repairs');
			expect(invoice.isValidUtilityCost).toBe(false);
		} finally {
			llm.stop();
			await deleteBuilding(building.id);
		}
	});
});

describe('KI-Anbieter', () => {
	it('gilt als erreichbar, wenn der konfigurierte Anbieter mit dem API-Key antwortet', async () => {
		const llm = openAiCompatible({});
		try {
			const status = await (await callApi('/api/v1/invoices/llm-status')).json();

			expect(status).toMatchObject({ llmAvailable: true });
		} finally {
			llm.stop();
		}
	});
});

describe('Kategorien im Prompt', () => {
	it('bietet der KI auch eigene Kategorien an', async () => {
		const name = `Treppenhausreinigung ${token}`;
		const category = (await (
			await sendJson('POST', '/api/v1/categories', { name, nameDE: name, isAllowedUtilityCost: true })
		).json()) as { id: string };
		const llm = openAiCompatible({});
		try {
			await sendJson('POST', '/api/v1/invoices/categorize', {
				billingEntityName: 'Putz AG',
				description: `Reinigung ${token}`,
				amount: '120.00'
			});

			expect(llm.prompts[0]).toContain(`- ${name}\n`);
		} finally {
			llm.stop();
			await sendJson('DELETE', `/api/v1/categories/${category.id}`);
		}
	});

	// Eine Installation, eine Räumung oder eine Baumfällung soll die KI nicht umlegen (#204, #220)
	it('nennt bei Gartenpflege, TV/Kabelanschluss und Kehricht, was nicht dazugehört', async () => {
		const llm = openAiCompatible({});
		try {
			await sendJson('POST', '/api/v1/invoices/categorize', {
				billingEntityName: 'Kabelnetz AG',
				description: `Anschluss ans Kabelnetz ${token}`,
				amount: '450.00'
			});

			expect(llm.prompts[0]).toContain(`- Garden Maintenance (Gartenpflege): Laufende Pflege von Garten und Umgebung: Rasenmähen, Rückschnitt von Sträuchern, Laub- und Unkrautentfernung; ohne Neubepflanzung, Baumfällung, Rasensanierung und Anschaffung von Geräten\n`);
			expect(llm.prompts[0]).toContain(
				'- TV/Cable (TV/Kabelanschluss): Laufende Grundgebühr des Kabelnetzes; ohne Installation des Anschlusses\n'
			);
			expect(llm.prompts[0]).toContain(
				'- Waste Disposal (Kehricht): Kehrichtgebühren nach Gebrauch und Grünabfuhr; ohne Grümpelräumungen, die der Vermieter bestellt, und Grundgebühren, die vom Wert der Liegenschaft abhängen\n'
			);
		} finally {
			llm.stop();
		}
	});
});

describe('Kategorien im Prompt nach einer Änderung', () => {
	it('fragt die KI neu, sobald es eine neue Kategorie gibt', async () => {
		const llm = openAiCompatible({ category: 'Caretaker', confidence: 0.9, isAllowedUtilityCost: true });
		const invoice = { billingEntityName: 'Putz AG', description: `Treppenhaus ${token}`, amount: '80.00' };
		const name = `Treppenhaus ${token}`;
		let id = '';
		try {
			await sendJson('POST', '/api/v1/invoices/categorize', invoice);
			id = ((await (await sendJson('POST', '/api/v1/categories', { name, nameDE: name, isAllowedUtilityCost: true })).json()) as { id: string }).id;
			await sendJson('POST', '/api/v1/invoices/categorize', invoice);

			expect(llm.prompts).toHaveLength(2);
			expect(llm.prompts[1]).toContain(`- ${name}\n`);
		} finally {
			llm.stop();
			await sendJson('DELETE', `/api/v1/categories/${id}`);
		}
	});
});

describe('Empfänger der Rechnungsdaten für die Datenschutzerklärung', () => {
	it('nennt keinen, solange das Modell auf dem Server des Betreibers läuft', async () => {
		const response = await callApi('/api/v1/invoices/llm-recipient');

		expect(await response.json()).toEqual({ recipient: null, enabled: true });
	});

	// Sonst beschreibt die Datenschutzerklärung eine Bearbeitung, die nicht stattfindet (#216)
	it('sagt, wenn die KI abgeschaltet ist', async () => {
		llmConfig.enabled = false;
		try {
			const response = await callApi('/api/v1/invoices/llm-recipient');

			expect(await response.json()).toEqual({ recipient: null, enabled: false });
		} finally {
			llmConfig.enabled = true;
		}
	});

	it('ist ohne Anmeldung lesbar, weil die Datenschutzerklärung öffentlich ist', async () => {
		const response = await app.handle(new Request('http://localhost/api/v1/invoices/llm-recipient'));

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ recipient: null, enabled: true });
	});

	it('nennt Anbieter und Land eines externen Anbieters, nie den API-Key', async () => {
		Object.assign(llmConfig, {
			baseUrl: 'https://llm.example.com/v1',
			apiKey: 'geheim',
			provider: 'Beispiel AG',
			providerCountry: 'Schweiz'
		});
		try {
			const response = await callApi('/api/v1/invoices/llm-recipient');

			expect(await response.json()).toEqual({ recipient: { provider: 'Beispiel AG', country: 'Schweiz' }, enabled: true });
		} finally {
			Object.assign(llmConfig, { baseUrl: 'http://127.0.0.1:9', apiKey: '', provider: '', providerCountry: '' });
		}
	});
});

describe('Kategorie von Hand', () => {
	// Nicht umlagefähige Kosten (OR 257a) bleiben bei den Eigentümern, auch wenn das Formular anderes schickt
	const repairs = async () =>
		((await (await callApi('/api/v1/categories?search=Repairs')).json()) as { categories: { id: string }[] }).categories[0].id;

	it('lässt eine Rechnung beim Ändern in einer nicht umlagefähigen Kategorie nicht umlagefähig werden', async () => {
		const response = await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, {
			categoryId: await repairs(),
			isValidUtilityCost: true
		});

		expect(await response.json()).toMatchObject({ isValidUtilityCost: false });
	});

	it('lässt eine Rechnung einer nicht umlagefähigen Kategorie nicht umlagefähig werden, wenn nur das Häkchen ändert', async () => {
		await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, { categoryId: await repairs() });

		const response = await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, { isValidUtilityCost: true });

		expect(await response.json()).toMatchObject({ isValidUtilityCost: false });
	});

	it('erfasst eine Rechnung einer nicht umlagefähigen Kategorie als nicht umlagefähig', async () => {
		const { buildingId } = (await (await callApi(`/api/v1/invoices/${invoice.id}`)).json()) as { buildingId: string };
		const response = await sendJson('POST', '/api/v1/invoices', {
			buildingId,
			billingEntityName: `Sanitär ${token}`,
			description: 'Leck Steigleitung',
			amount: '800.00',
			invoiceDate: '2025-05-12',
			categoryId: await repairs(),
			distributionKeyId: await perAreaKey(),
			isValidUtilityCost: true
		});

		expect(await response.json()).toMatchObject({ isValidUtilityCost: false });
	});
});
