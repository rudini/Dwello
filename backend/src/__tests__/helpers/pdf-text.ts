import { inflateSync } from 'zlib';

/** The pages of a pdfkit PDF and the text printed on them (standard fonts, hex strings in TJ arrays) */
export function readPdf(pdf: Buffer) {
	const raw = pdf.toString('latin1');
	const pages = raw.match(/\/Type \/Page\b(?!s)/g)?.length ?? 0;
	const streams = [...raw.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)].map(([, body]) => {
		try {
			return inflateSync(Buffer.from(body, 'latin1')).toString('latin1');
		} catch {
			return body;
		}
	});
	// Every TJ array is one piece of text; its hex strings are WinAnsi (Windows-1252) characters, kerned apart
	const winAnsi = new TextDecoder('windows-1252');
	const text = streams
		.flatMap((content) => [...content.matchAll(/\[([^\]]*)\]\s*TJ/g)])
		.map(([, array]) =>
			[...array.matchAll(/<([0-9a-fA-F]*)>/g)]
				.map(([, hex]) => winAnsi.decode(Buffer.from(hex, 'hex')))
				.join('')
		)
		.join('\n');
	// flowing: wrapped lines joined, for sentences the PDF breaks over two lines
	return { pages, text, flowing: text.replace(/\s*\n\s*/g, ' ') };
}
