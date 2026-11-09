import { zipSync, type Zippable } from 'fflate';

/** A ZIP to download; its name keeps its umlauts where the browser reads filename*, an ASCII name elsewhere */
export function zipDownload(fileName: string, files: Zippable) {
	const ascii = fileName
		.normalize('NFD')
		.replace(/[^\x20-\x7e]/g, '')
		.replace(/"/g, '');
	return new Response(zipSync(files), {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
		}
	});
}
