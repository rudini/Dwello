import { Zip, ZipDeflate, ZipPassThrough, zipSync, type Zippable } from 'fflate';

/** The headers of a ZIP to download; its name keeps its umlauts where the browser reads filename*, an ASCII name elsewhere */
function zipHeaders(fileName: string) {
	const ascii = fileName
		.normalize('NFD')
		.replace(/[^\x20-\x7e]/g, '')
		.replace(/"/g, '');
	return {
		'Content-Type': 'application/zip',
		'Content-Disposition': `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
	};
}

/** A ZIP to download, made at once */
export function zipDownload(fileName: string, files: Zippable) {
	return new Response(zipSync(files), { headers: zipHeaders(fileName) });
}

type Entry = { path: string; read: () => Promise<Uint8Array> | Uint8Array; stored?: boolean };

/**
 * #748: a ZIP to download as a stream: each entry read only when the browser takes the next part, so no server holds
 * all files at once; `stored` for files compressed already (PDFs, photos). An entry that cannot be read breaks the
 * download, which the browser names failed
 */
export function zipStreamDownload(fileName: string, entries: Entry[]) {
	const zip = new Zip();
	const rest = [...entries];
	const body = new ReadableStream<Uint8Array>({
		start(controller) {
			zip.ondata = (failure, chunk, final) => {
				if (failure) return controller.error(failure);
				controller.enqueue(chunk);
				if (final) controller.close();
			};
		},
		async pull() {
			const next = rest.shift();
			if (!next) return zip.end();
			const entry = next.stored ? new ZipPassThrough(next.path) : new ZipDeflate(next.path);
			zip.add(entry);
			entry.push(await next.read(), true);
		}
	});
	return new Response(body, { headers: zipHeaders(fileName) });
}
