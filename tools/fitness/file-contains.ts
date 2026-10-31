import { createReadStream } from 'node:fs';

/** Whether the file holds one of the texts, read in pieces: a Sicherung of 10 years does not fit in memory (#974) */
export async function fileContains(path: string, texts: string[], piece = 16 * 1024 * 1024) {
	const keep = Math.max(...texts.map((text) => text.length)) - 1;
	let tail = '';
	for await (const chunk of createReadStream(path, { encoding: 'latin1', highWaterMark: piece })) {
		const window = tail + chunk;
		if (texts.some((text) => window.includes(text))) return true;
		tail = window.slice(-keep);
	}
	return false;
}
