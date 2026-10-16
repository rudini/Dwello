// The pages of an uploaded invoice file as the KI reads them: JPEG images of at most 1600 px, at most 3 pages.
// Rendered in the browser, so the file itself is sent only when the invoice is created (BODY_SIZE_LIMIT), and
// pdf.js comes with the app, not from a CDN (privacy statement, «Weitergabe an Dritte»)

import { MAX_PAGES } from '$lib/invoice-upload';

const LONGEST_SIDE = 1600;

function jpeg(source: CanvasImageSource, width: number, height: number) {
	const scale = Math.min(1, LONGEST_SIDE / Math.max(width, height));
	const canvas = document.createElement('canvas');
	canvas.width = Math.round(width * scale);
	canvas.height = Math.round(height * scale);
	canvas.getContext('2d')!.drawImage(source, 0, 0, canvas.width, canvas.height);
	return canvas.toDataURL('image/jpeg', 0.85);
}

async function pdfPages(file: File) {
	// the legacy build: the modern one needs functions browsers only just got (Map.getOrInsertComputed)
	const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
	pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')).default;
	const document_ = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
	const pages: string[] = [];
	for (let number = 1; number <= Math.min(MAX_PAGES, document_.numPages); number++) {
		const page = await document_.getPage(number);
		const unscaled = page.getViewport({ scale: 1 });
		const viewport = page.getViewport({ scale: LONGEST_SIDE / Math.max(unscaled.width, unscaled.height) });
		const canvas = document.createElement('canvas');
		canvas.width = viewport.width;
		canvas.height = viewport.height;
		await page.render({ canvas, viewport }).promise;
		pages.push(canvas.toDataURL('image/jpeg', 0.85));
	}
	return { pages, morePages: document_.numPages > MAX_PAGES };
}

/** The pages to show the KI, and whether the file has more; throws when the file cannot be opened */
export async function pagesOf(file: File): Promise<{ pages: string[]; morePages: boolean }> {
	// a PDF starts with «%», told by its first byte as Dwello checks files, not by its name
	if (new Uint8Array(await file.slice(0, 1).arrayBuffer())[0] === 0x25) return pdfPages(file);
	const image = await createImageBitmap(file);
	return { pages: [jpeg(image, image.width, image.height)], morePages: false };
}
