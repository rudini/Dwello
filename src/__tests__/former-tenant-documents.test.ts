import { describe, expect, it } from 'vitest';
import { formerTenantDocuments } from '$lib/former-tenant-documents';
import documentList from '../../tests/contracts/documents.json';

const upload = documentList.data[0];
const uploadedOn = (createdAt: string, title = upload.title) => ({ ...upload, title, createdAt });
const contract = (startDate: string, endDate: string | null) => ({ startDate, endDate });

describe('Dokumente eines ehemaligen Mieters (#178)', () => {
	it('nennt hochgeladene Dokumente, die vor dem Ende des letzten Mietvertrags hochgeladen wurden', () => {
		const documents = [uploadedOn('2025-03-10T09:00:00.000Z')];

		expect(
			formerTenantDocuments([contract('2025-04-01', '2026-03-31')], documents, '2026-10-16')
		).toEqual({ endDate: '2026-03-31', documents });
	});
});
