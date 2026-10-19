import { asc, eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, buildings, categories, documents, rentalContracts, tenants, utilityStatements } from '../db/schema';
import { agreedCategoryIds } from './agreed-category.service';
import { getStatement } from './statement.service';
import { swissToday } from './today';

// Folder and file names in the tenant's language: the tenant receives the ZIP, and its PDFs are in that language
const NAMES = {
	de: { zip: 'Daten', data: 'daten.json', documents: 'dokumente', statements: 'abrechnungen' },
	fr: { zip: 'Données', data: 'données.json', documents: 'documents', statements: 'décomptes' },
	it: { zip: 'Dati', data: 'dati.json', documents: 'documenti', statements: 'conteggi' },
	en: { zip: 'Data', data: 'data.json', documents: 'documents', statements: 'statements' }
};
const EXTENSIONS: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png' };
// a name a user typed, safe as one file name in the ZIP (domain review F-11)
const safe = (name: string) => name.replace(/[\\/:*?"<>|]/g, '_');

/**
 * Everything Dwello holds about one tenant, for the right to data handover (#435, Art. 28 DSG; domain review
 * docs/reviews/435-fachreview-1.md): the data without internal ids, and the files as the tenant received them. Reads
 * only: a statement PDF missing is not made (F-4)
 */
export async function exportTenant(id: string) {
	const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
	if (!tenant) return null;

	const names = NAMES[tenant.language as keyof typeof NAMES] ?? NAMES.de;
	const files: { path: string; content: string }[] = [];
	// two documents of the same name both stay: the second gets a counter
	const file = (folder: string, name: string, content: string, extension = 'pdf') => {
		const base = `${folder}/${safe(name)}`;
		let path = `${base}.${extension}`;
		for (let n = 2; files.some((taken) => taken.path === path); n++) path = `${base} (${n}).${extension}`;
		files.push({ path, content });
		return path;
	};

	const contracts = await Promise.all(
		(
			await db
				.select({ contract: rentalContracts, apartment: apartments, building: buildings })
				.from(rentalContracts)
				.innerJoin(apartments, eq(rentalContracts.apartmentId, apartments.id))
				.innerJoin(buildings, eq(apartments.buildingId, buildings.id))
				.where(eq(rentalContracts.tenantId, id))
				.orderBy(asc(rentalContracts.startDate))
		).map(async ({ contract, apartment, building }) => ({
			apartment: {
				number: apartment.number,
				floor: apartment.floor,
				area: apartment.area,
				rooms: apartment.rooms,
				building: { name: building.name, address: building.address, postalCode: building.postalCode, city: building.city }
			},
			startDate: contract.startDate,
			endDate: contract.endDate,
			terminated: contract.terminated,
			noticeReceivedOn: contract.noticeReceivedOn,
			movedOut: contract.movedOut,
			billedUntil: contract.billedUntil,
			baseRent: contract.baseRent,
			additionalRent: contract.additionalRent,
			monthlyAdvancePayment: contract.monthlyAdvancePayment,
			flatRateUtilityCharge: contract.flatRateUtilityCharge,
			managementFeeAgreed: contract.managementFeeAgreed,
			managementFeePercent: contract.managementFeePercent,
			referenceIndex: contract.referenceIndex,
			agreedCategories: await categoryNames(await agreedCategoryIds(contract.id)),
			notes: contract.notes
		}))
	);

	const tenantDocuments = await db.select().from(documents).where(eq(documents.tenantId, id)).orderBy(asc(documents.createdAt));
	const ofType = (type: string) => tenantDocuments.filter((document) => document.type === type);
	// the copy sent by e-mail is exactly what the tenant received; the stored PDF otherwise
	const mailed = new Map(ofType('statement').map((copy) => [copy.statementId, copy.content]));
	const numbers = new Map<string, string>();

	const statementRows = await db
		.select({ id: utilityStatements.id, pdfBlob: utilityStatements.pdfBlob })
		.from(utilityStatements)
		.where(eq(utilityStatements.tenantId, id))
		.orderBy(asc(utilityStatements.periodStart), asc(utilityStatements.createdAt));
	const statements = [];
	for (const { id: statementId, pdfBlob } of statementRows) {
		const statement = (await getStatement(statementId))!;
		numbers.set(statementId, statement.statementNumber);
		// a draft's PDF would carry a payment slip the tenant never received: the draft only as data
		const pdf = statement.status === 'draft' ? null : (mailed.get(statementId) ?? pdfBlob);
		statements.push({
			number: statement.statementNumber,
			status: statement.status,
			periodStart: statement.periodStart,
			periodEnd: statement.periodEnd,
			statementDate: statement.statementDate,
			paymentDeadline: statement.paymentDeadline,
			apartment: statement.apartment?.number ?? null,
			rentalStart: statement.rentalStart,
			rentalEnd: statement.rentalEnd,
			rentalDays: statement.rentalDays,
			positions: statement.lineItems.map((item) => ({
				description: item.description,
				buildingCosts: item.totalAmount,
				apartmentShare: item.apartmentShare,
				periodShare: item.periodShare,
				tenantShare: item.tenantShare,
				invoices: (item.invoices ?? []).map(({ description, amount, start, end }) => ({ description, amount, start, end }))
			})),
			totalCosts: statement.totalCosts,
			managementFeePercent: statement.managementFeePercent,
			managementFee: statement.managementFee,
			totalAdvancePayments: statement.totalAdvancePayments,
			priorPayments: statement.priorPayments,
			balance: statement.balance,
			replaces: statement.replaces?.statementNumber ?? null,
			paidDate: statement.paidDate,
			paidAmount: statement.paidAmount,
			paymentResets: statement.paymentResets,
			qrBillReference: statement.qrBillReference,
			notes: statement.notes,
			file: pdf ? file(names.statements, statement.statementNumber, pdf) : null
		});
	}

	const documentFile = (document: (typeof tenantDocuments)[number]) => {
		const date = document.createdAt.toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
		return {
			date,
			file: file(names.documents, `${date} ${document.title}`, document.content, EXTENSIONS[document.mimeType] ?? 'pdf')
		};
	};

	return {
		fileName: `${names.zip}-${safe(tenant.lastName)}-${safe(tenant.firstName)}.zip`,
		dataFile: names.data,
		data: {
			exportedOn: swissToday(),
			tenant: {
				firstName: tenant.firstName,
				lastName: tenant.lastName,
				email: tenant.email,
				phone: tenant.phone,
				language: tenant.language,
				address: tenant.address,
				postalCode: tenant.postalCode,
				city: tenant.city,
				country: tenant.country,
				correspondenceChannel: tenant.correspondenceChannel
			},
			contracts,
			statements,
			reminders: ofType('reminder').map((reminder) => ({
				statement: reminder.statementId && numbers.get(reminder.statementId),
				level: reminder.reminderLevel,
				title: reminder.title,
				paymentDeadline: reminder.paymentDeadline,
				channel: reminder.channel,
				status: reminder.status,
				sentAt: reminder.sentAt,
				...documentFile(reminder)
			})),
			documents: ofType('upload').map((upload) => ({ title: upload.title, ...documentFile(upload) }))
		},
		files
	};
}

async function categoryNames(ids: string[]) {
	if (!ids.length) return [];
	return (await db.select({ name: categories.name }).from(categories).where(inArray(categories.id, ids))).map(({ name }) => name);
}
