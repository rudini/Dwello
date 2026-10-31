/**
 * The export of everything Dwello holds about one tenant, for the right to data handover (#435, Art. 28 DSG), against
 * the real database
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, invoices, rentalContracts, tenants, utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { idOf, insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';
import { createContract, deleteContract } from '../services/contract.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { swissToday } from '../services/today';

type Export = {
	fileName: string;
	data: {
		tenant: { firstName: string; lastName: string };
		contracts: { apartment: { number: string; building: { name: string } }; file?: string | null; advancePayments: { validFrom: string; amount: string }[] }[];
		statements: { number: string; status: string; file: string | null; statementDate: string | null; paymentDeadline: string | null }[];
		documents: { title: string; file: string }[];
		reminders: { statement: string; level: number; status: string; file: string }[];
	};
	files: { path: string; content: string }[];
};

const pdf = (text: string) => Buffer.from(`%PDF-1.4 ${text}\n%%EOF\n`).toString('base64');
const exportOf = async (tenant: string) => (await (await callApi(`/api/v1/tenants/${tenant}/export`)).json()) as Export;

let rental: Awaited<ReturnType<typeof createRental>>;
let statementNumber: string;
// the Vormieter of the same apartment, with a statement and a document of their own (domain review F-2)
let former: { tenant: string; contract: string; statementNumber: string };

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2024-01-01', monthlyAdvancePayment: '100' });
	await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2024-03-31' });
	const id = await idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31'
		})
	);
	// sent, with the PDF sending made: what the tenant received
	await db.update(utilityStatements).set({ status: 'sent', pdfBlob: pdf('statement') }).where(eq(utilityStatements.id, id));
	[{ statementNumber }] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, id));
	await sendJson('POST', `/api/v1/tenants/${rental.tenant}/documents`, {
		title: 'Übergabeprotokoll',
		fileName: 'scan.pdf',
		content: pdf('upload')
	});

	const tenant = await createTenant({ firstName: 'Beat', lastName: `Vormieter ${crypto.randomUUID()}` });
	const contract = await createContract({
		apartmentId: rental.apartment,
		tenantId: tenant.id,
		startDate: '2022-01-01',
		endDate: '2023-12-31',
		baseRent: '900',
		monthlyAdvancePayment: '100'
	});
	const statement = await idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: contract.id,
			buildingId: rental.building,
			periodStart: '2023-01-01',
			periodEnd: '2023-12-31'
		})
	);
	await db.update(utilityStatements).set({ status: 'sent', pdfBlob: pdf('former') }).where(eq(utilityStatements.id, statement));
	const [stored] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, statement));
	await sendJson('POST', `/api/v1/tenants/${tenant.id}/documents`, { title: 'Kündigung', fileName: 'k.pdf', content: pdf('former') });
	former = { tenant: tenant.id, contract: contract.id, statementNumber: stored.statementNumber };
});

afterAll(async () => {
	for (const tenant of [rental.tenant, former.tenant]) await db.delete(documents).where(eq(documents.tenantId, tenant));
	for (const contract of [rental.contract, former.contract])
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, contract));
	await deleteContract(former.contract, true);
	await deleteTenant(former.tenant);
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Daten eines Mieters exportieren', () => {
	it('gibt Name, Mietvertrag, Abrechnung und Dokumente des Mieters mit ihren Dateien heraus', async () => {
		const { data, files } = await exportOf(rental.tenant);
		const today = swissToday();

		expect(data.tenant.firstName).toBe('Anna');
		expect(data.contracts.map((contract) => contract.apartment.number)).toEqual(['2.01']);
		// #464 (domain review 464-1 F-15): every Akonto amount with its «Gültig ab»
		expect(data.contracts[0].advancePayments).toEqual([{ validFrom: '2024-01-01', amount: '100.00' }]);
		expect(data.statements).toEqual([
			expect.objectContaining({ number: statementNumber, status: 'sent', file: `abrechnungen/${statementNumber}.pdf` })
		]);
		expect(data.documents).toEqual([
			expect.objectContaining({ title: 'Übergabeprotokoll', file: `dokumente/${today} Übergabeprotokoll.pdf` })
		]);
		expect(files.map((file) => file.path).sort()).toEqual(
			[`abrechnungen/${statementNumber}.pdf`, `dokumente/${today} Übergabeprotokoll.pdf`].sort()
		);
		expect(Buffer.from(files.find((file) => file.path.startsWith('abrechnungen/'))!.content, 'base64').toString()).toContain(
			'statement'
		);
	});

	it('gibt keine Daten des Vormieters derselben Wohnung heraus (Art. 26 und 29 DSG)', async () => {
		const { data, files } = await exportOf(rental.tenant);
		const exported = JSON.stringify(data);

		for (const theirs of ['Vormieter', former.statementNumber, 'Kündigung']) expect(exported).not.toContain(theirs);
		for (const { content } of files) expect(Buffer.from(content, 'base64').toString()).not.toContain('former');
	});

	it('gibt einen Entwurf nur als Daten heraus, ohne seine PDF, und ändert nichts (Fachreview F-4)', async () => {
		const draft = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2025-01-01',
				periodEnd: '2025-12-31'
			})
		);
		// a draft's PDF shown earlier: with a payment slip the tenant never received
		await db.update(utilityStatements).set({ pdfBlob: pdf('draft') }).where(eq(utilityStatements.id, draft));
		const rows = () => db.select().from(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
		const before = await rows();
		try {
			const { data, files } = await exportOf(rental.tenant);
			const [{ statementNumber: number }] = before.filter((row) => row.id === draft);

			expect(data.statements.find((statement) => statement.number === number)).toMatchObject({
				status: 'draft',
				file: null,
				// a draft's dates are as if sent today: never issued to the tenant (persona Dr. Weber 435 P-1)
				statementDate: null,
				paymentDeadline: null
			});
			for (const { content } of files) expect(Buffer.from(content, 'base64').toString()).not.toContain('draft');
			expect(await rows()).toEqual(before);
		} finally {
			await db.delete(utilityStatements).where(eq(utilityStatements.id, draft));
		}
	});

	it('nimmt die per E-Mail versandte Kopie der Abrechnung und legt die Mahnungen bei (Fachreview F-4, F-14)', async () => {
		const [sent] = await db.select().from(utilityStatements).where(eq(utilityStatements.statementNumber, statementNumber));
		const own = { tenantId: rental.tenant, statementId: sent.id, fileName: 'x.pdf' };
		const added = await db
			.insert(documents)
			.values([
				{ ...own, type: 'statement', title: `Abrechnung ${statementNumber}`, content: pdf('mailed'), channel: 'email', status: 'sent' },
				{ ...own, type: 'reminder', reminderLevel: 1, title: 'Zahlungserinnerung', content: pdf('reminder'), channel: 'letter', status: 'to_send' }
			])
			.returning({ id: documents.id });
		try {
			const { data, files } = await exportOf(rental.tenant);
			const today = swissToday();
			const content = (path: string) => Buffer.from(files.find((file) => file.path === path)!.content, 'base64').toString();

			expect(content(`abrechnungen/${statementNumber}.pdf`)).toContain('mailed');
			expect(data.reminders).toEqual([
				expect.objectContaining({ statement: statementNumber, level: 1, status: 'to_send', file: `dokumente/${today} Zahlungserinnerung.pdf` })
			]);
			expect(content(`dokumente/${today} Zahlungserinnerung.pdf`)).toContain('reminder');
			expect(files.filter((file) => Buffer.from(file.content, 'base64').toString().includes('mailed'))).toHaveLength(1);
		} finally {
			for (const { id } of added) await db.delete(documents).where(eq(documents.id, id));
		}
	});

	// #969 (Fachreview 969-1 V-7): sent without a Dokument, the PDF kept before the first change is the closest to the sent one
	it('nimmt ohne Dokument des Versands das PDF vor der ersten Änderung', async () => {
		const [sent] = await db.select().from(utilityStatements).where(eq(utilityStatements.statementNumber, statementNumber));
		const own = { tenantId: rental.tenant, statementId: sent.id, fileName: 'x.pdf', type: 'pdf_before_change' as const, title: 'PDF vor der Änderung' };
		const added = await db
			.insert(documents)
			.values([
				{ ...own, content: pdf('before-first'), createdAt: new Date('2025-02-01T09:00:00Z') },
				{ ...own, content: pdf('before-second'), createdAt: new Date('2025-03-01T09:00:00Z') }
			])
			.returning({ id: documents.id });
		try {
			const { files } = await exportOf(rental.tenant);
			const content = (path: string) => Buffer.from(files.find((file) => file.path === path)!.content, 'base64').toString();

			expect(content(`abrechnungen/${statementNumber}.pdf`)).toContain('before-first');
		} finally {
			for (const { id } of added) await db.delete(documents).where(eq(documents.id, id));
		}
	});

	it('benennt Dateien sicher und eindeutig, mit ihrer Endung (Fachreview F-11)', async () => {
		const photo = { tenantId: rental.tenant, type: 'upload' as const, fileName: 'IMG.JPG', mimeType: 'image/jpeg' as const, content: pdf('photo') };
		const added = await db
			.insert(documents)
			.values([
				{ ...photo, title: 'Foto / Küche' },
				{ ...photo, title: 'Foto / Küche' },
				{ ...photo, title: '../geheim' }
			])
			.returning({ id: documents.id });
		try {
			const today = swissToday();
			const paths = (await exportOf(rental.tenant)).files.map((file) => file.path);

			expect(paths).toEqual(
				expect.arrayContaining([`dokumente/${today} Foto _ Küche.jpg`, `dokumente/${today} Foto _ Küche (2).jpg`, `dokumente/${today} .._geheim.jpg`])
			);
			for (const path of paths) expect(path.split('/')).toHaveLength(2);
		} finally {
			for (const { id } of added) await db.delete(documents).where(eq(documents.id, id));
		}
	});

	it('benennt Ordner und ZIP in der Sprache des Mieters (Fachreview, offener Punkt 4)', async () => {
		await db.update(tenants).set({ language: 'fr' }).where(eq(tenants.id, rental.tenant));
		try {
			const { fileName, files } = await exportOf(rental.tenant);

			expect(fileName).toStartWith('Données-Keller');
			expect(files.map((file) => file.path.split('/')[0]).sort()).toEqual(['documents', 'décomptes']);
		} finally {
			await db.update(tenants).set({ language: 'de' }).where(eq(tenants.id, rental.tenant));
		}
	});

	it('datiert ein Dokument nach dem Schweizer Tag, nicht nach UTC (Fachreview F-17)', async () => {
		// 23:30 UTC on 1 March is already 2 March in Switzerland
		const [late] = await db
			.insert(documents)
			.values({ tenantId: rental.tenant, type: 'upload', title: 'Spät', fileName: 's.pdf', content: pdf('late'), createdAt: new Date('2026-03-01T23:30:00Z') })
			.returning({ id: documents.id });
		try {
			const { data } = await exportOf(rental.tenant);

			expect(data.documents.find((document) => document.title === 'Spät')!.file).toBe('dokumente/2026-03-02 Spät.pdf');
		} finally {
			await db.delete(documents).where(eq(documents.id, late.id));
		}
	});

	it('antwortet für einen unbekannten Mieter mit 404 (Review C-10)', async () => {
		expect((await callApi(`/api/v1/tenants/${crypto.randomUUID()}/export`)).status).toBe(404);
	});

	it('gibt eine Abrechnung mit abgelaufener Zahlungsfrist als überfällig heraus (Fachreview F-8)', async () => {
		const sent = eq(utilityStatements.statementNumber, statementNumber);
		const [{ paymentDeadline }] = await db.select().from(utilityStatements).where(sent);
		await db.update(utilityStatements).set({ paymentDeadline: '2025-01-31' }).where(sent);
		try {
			const { data } = await exportOf(rental.tenant);

			expect(data.statements.find((statement) => statement.number === statementNumber)!.status).toBe('overdue');
		} finally {
			await db.update(utilityStatements).set({ paymentDeadline }).where(sent);
		}
	});

	it('legt die PDF des Mietvertrags bei, wenn sie gespeichert ist (Fachreview F-18, Review C-3)', async () => {
		const contract = eq(rentalContracts.id, rental.contract);
		await db.update(rentalContracts).set({ contractPdf: pdf('contract') }).where(contract);
		try {
			const { data, files } = await exportOf(rental.tenant);
			const path = 'dokumente/2024-01-01 Mietvertrag Wohnung 2.01.pdf';

			expect(data.contracts[0]).toMatchObject({ file: path });
			expect(Buffer.from(files.find((file) => file.path === path)!.content, 'base64').toString()).toContain('contract');
		} finally {
			await db.update(rentalContracts).set({ contractPdf: null }).where(contract);
		}
	});
});

