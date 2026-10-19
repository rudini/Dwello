import { error } from '@sveltejs/kit';
import { strToU8, zipSync } from 'fflate';
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

	const zip = zipSync({
		[dataFile]: strToU8(JSON.stringify(data, null, 2)),
		...Object.fromEntries(
			files.map(({ path, content }) => [path, new Uint8Array(Buffer.from(content, 'base64'))])
		)
	});
	// the name keeps its umlauts where the browser reads filename*, an ASCII name elsewhere
	const ascii = fileName
		.normalize('NFD')
		.replace(/[^\x20-\x7e]/g, '')
		.replace(/"/g, '');
	return new Response(zip, {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
		}
	});
};
