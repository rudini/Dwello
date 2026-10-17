import { zipSync } from 'fflate';
import { pdfFileName, pdfRefusal } from '$lib/server/statement';
import type { RequestHandler } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/** The PDFs of an Abrechnungslauf's statements (?ids=) as one ZIP, named after its period (#356) */
export const GET: RequestHandler = async ({ fetch, url }) => {
	const files: Record<string, Uint8Array> = {};
	try {
		for (const id of (url.searchParams.get('ids') ?? '').split(',').filter(Boolean)) {
			// the backend makes a missing PDF first
			const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}/pdf`);
			if (!response.ok) return pdfRefusal(response.status, await response.json().catch(() => null));
			files[pdfFileName(response.headers)] = new Uint8Array(await response.arrayBuffer());
		}
	} catch (error) {
		console.error('ZIP download error:', error);
		return pdfRefusal(500, null);
	}
	// PDFs are compressed already: stored as they are
	const period = `${url.searchParams.get('periodStart')}-${url.searchParams.get('periodEnd')}`;
	return new Response(zipSync(files, { level: 0 }), {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename="NK-${period.replace(/[^\w-]/g, '')}.zip"`
		}
	});
};
