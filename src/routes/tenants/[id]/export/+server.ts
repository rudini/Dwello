import { error } from '@sveltejs/kit';
import { strToU8 } from 'fflate';
import { zipStreamDownload } from '$lib/server/zip-download';
import type { RequestHandler } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type TenantExport = {
	fileName: string;
	dataFile: string;
	data: object;
	files: { path: string; source: string }[];
};

/** Everything Dwello holds about the tenant as one ZIP, for the right to data handover (#435, Art. 28 DSG) */
export const GET: RequestHandler = async ({ fetch, params }) => {
	const api = `${BACKEND_URL}/api/v1/tenants/${encodeURIComponent(params.id)}/export`;
	const response = await fetch(api);
	if (!response.ok) error(response.status === 404 ? 404 : 500);
	const { fileName, dataFile, data, files }: TenantExport = await response.json();

	// #748: each file fetched on its own while the ZIP streams; PDFs and photos are compressed already: stored
	const read = async (source: string) => {
		const file = await fetch(`${api}/files/${source}`);
		if (!file.ok) throw new Error(`export file ${source}: ${file.status}`);
		return new Uint8Array(await file.arrayBuffer());
	};
	return zipStreamDownload(fileName, [
		{ path: dataFile, read: () => strToU8(JSON.stringify(data, null, 2)) },
		...files.map(({ path, source }) => ({ path, read: () => read(source), stored: true }))
	]);
};
