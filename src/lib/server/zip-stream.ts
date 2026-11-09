import { Zip, ZipDeflate, ZipPassThrough } from 'fflate';
import { zipDownload } from './zip-download';

type Entry = { path: string; read: () => Promise<Uint8Array> | Uint8Array; stored?: boolean };

/**
 * #748: a ZIP to download as a stream: each entry read only when the browser takes the next part, so no server holds
 * all files at once; `stored` for files compressed already (PDFs, photos). An entry that cannot be read breaks the
 * download, which the browser names failed. The headers are those of zipDownload
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
	return new Response(body, { headers: zipDownload(fileName, {}).headers });
}

/** The bytes of one file the backend hands out; a refusal breaks the download (#748) */
export async function bytesOf(fetch: typeof globalThis.fetch, url: string) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${url}: ${response.status}`);
	return new Uint8Array(await response.arrayBuffer());
}
