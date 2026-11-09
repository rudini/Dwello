import { strToU8 } from 'fflate';
import { bytesOf, zipStreamDownload } from './zip-stream';

/** The backend's answer to `GET /tenants/:id/export`: the data and its files by source, without their content (#748) */
export type TenantExport = {
	fileName: string;
	dataFile: string;
	data: object;
	files: { path: string; source: string }[];
};

/** #748: the export as a ZIP stream, each file fetched from `api` on its own; PDFs and photos are compressed already */
export function tenantExportZip(
	fetch: typeof globalThis.fetch,
	api: string,
	{ fileName, dataFile, data, files }: TenantExport
) {
	return zipStreamDownload(fileName, [
		{ path: dataFile, read: () => strToU8(JSON.stringify(data, null, 2)) },
		...files.map(({ path, source }) => ({
			path,
			read: () => bytesOf(fetch, `${api}/files/${source}`),
			stored: true
		}))
	]);
}
