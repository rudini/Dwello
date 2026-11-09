import { zipSync, type Zippable } from 'fflate';

/** A file to download; its name keeps its umlauts where the browser reads filename*, an ASCII name elsewhere */
export function fileDownload(fileName: string, contentType: string, body: BodyInit) {
	const ascii = fileName
		.normalize('NFD')
		.replace(/[^\x20-\x7e]/g, '')
		.replace(/"/g, '');
	return new Response(body, {
		headers: {
			'Content-Type': contentType,
			'Content-Disposition': `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
		}
	});
}

/** A ZIP to download */
export const zipDownload = (fileName: string, files: Zippable) =>
	fileDownload(fileName, 'application/zip', zipSync(files));
