import { error } from '@sveltejs/kit';
import { strToU8 } from 'fflate';
import { zipDownload } from '$lib/server/zip-download';
import type { RequestHandler } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type TenantExport = {
	fileName: string;
	dataFile: string;
	data: object;
	files: { path: string; content: string }[];
};

/** Everything Dwello holds about the tenant as one ZIP, for the right to data handover (#435, Art. 28 DSG) */
export const GET: RequestHandler = async ({ fetch, params }) => {
	const response = await fetch(
		`${BACKEND_URL}/api/v1/tenants/${encodeURIComponent(params.id)}/export`
	);
	if (!response.ok) error(response.status === 404 ? 404 : 500);
	const { fileName, dataFile, data, files }: TenantExport = await response.json();

	return zipDownload(fileName, {
		[dataFile]: strToU8(JSON.stringify(data, null, 2)),
		// PDFs and photos are compressed already: stored as they are
		...Object.fromEntries(
			files.map(({ path, content }) => [path, [Buffer.from(content, 'base64'), { level: 0 }]])
		)
	});
};
