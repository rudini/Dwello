import { describe, expect, it } from 'vitest';
import { formerTenantDocuments } from '$lib/former-tenant-documents';
import documentList from '../../tests/contracts/documents.json';

const upload = documentList.data[0];
const uploadedOn = (createdAt: string, title = upload.title) => ({ ...upload, title, createdAt });
// ended by notice: the tenant has left (a fixed-term contract needs «Mieter ist ausgezogen», A-6)
const contract = (
	startDate: string,
	endDate: string | null,
	flags = { terminated: true, movedOut: false }
) => ({
	startDate,
	endDate,
	...flags
});

describe('Dokumente eines ehemaligen Mieters (#178)', () => {
	it('nennt hochgeladene Dokumente, die vor dem Ende des letzten Mietvertrags hochgeladen wurden', () => {
		const documents = [uploadedOn('2025-03-10T09:00:00.000Z')];

		expect(
			formerTenantDocuments([contract('2025-04-01', '2026-03-31')], documents, '2026-10-16')
		).toEqual({ endDate: '2026-03-31', documents });
	});

	const ended = [contract('2025-04-01', '2026-03-31')];

	it('nennt kein Dokument vom Tag des Vertragsendes oder später, etwa das Rückgabeprotokoll', () => {
		const documents = [
			uploadedOn('2026-03-31T08:00:00.000Z'),
			uploadedOn('2026-04-03T08:00:00.000Z')
		];

		expect(formerTenantDocuments(ended, documents, '2026-10-16')).toBeNull();
	});

	it('nimmt den Tag des Hochladens in der Schweiz, nicht in UTC', () => {
		// 30.3. 23:30 UTC is 31.3. 01:30 in Zurich, the day of the end
		expect(
			formerTenantDocuments(ended, [uploadedOn('2026-03-30T23:30:00.000Z')], '2026-10-16')
		).toBeNull();
	});

	it('nennt nichts, solange ein Mietvertrag läuft, auch einer, der heute endet', () => {
		const documents = [uploadedOn('2025-03-10T09:00:00.000Z')];

		expect(
			formerTenantDocuments([contract('2025-04-01', '2026-10-16')], documents, '2026-10-16')
		).toBeNull();
		expect(
			formerTenantDocuments([...ended, contract('2026-04-01', null)], documents, '2026-10-16')
		).toBeNull();
		expect(
			formerTenantDocuments([...ended, contract('2026-11-01', null)], documents, '2026-10-16')
		).toBeNull();
	});

	it('nennt nichts bei einem Mieter ohne Mietvertrag', () => {
		expect(
			formerTenantDocuments([], [uploadedOn('2025-03-10T09:00:00.000Z')], '2026-10-16')
		).toBeNull();
	});

	it('nennt keine Mahnungen, nur hochgeladene Dokumente', () => {
		const reminder = { ...uploadedOn('2025-06-10T09:00:00.000Z'), type: 'reminder' };

		expect(formerTenantDocuments(ended, [reminder], '2026-10-16')).toBeNull();
	});

	it('misst am Ende des letzten von mehreren beendeten Mietverträgen', () => {
		const documents = [uploadedOn('2023-05-01T09:00:00.000Z')];

		expect(
			formerTenantDocuments(
				[contract('2020-04-01', '2022-03-31'), contract('2026-01-01', '2026-03-31')],
				documents,
				'2026-10-16'
			)
		).toEqual({ endDate: '2026-03-31', documents });
	});

	// A-6: after the agreed end of a fixed-term contract the tenant may have stayed; deleting cannot be undone
	it('nennt nichts, solange offen ist, ob der Mieter nach einem befristeten Mietvertrag geblieben ist', () => {
		const documents = [uploadedOn('2025-03-10T09:00:00.000Z')];
		const fixedTerm = (movedOut: boolean) => [
			contract('2025-04-01', '2026-03-31', { terminated: false, movedOut })
		];

		expect(formerTenantDocuments(fixedTerm(false), documents, '2026-10-16')).toBeNull();
		expect(formerTenantDocuments(fixedTerm(true), documents, '2026-10-16')).toEqual({
			endDate: '2026-03-31',
			documents
		});
	});
});
