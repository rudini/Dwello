import { inflateSync } from 'zlib';

// Windows-1252 at 0x80–0x9F, where it differs from Latin-1 (unassigned bytes stay as they are)
const CP1252 = '€\u0081‚ƒ„…†‡ˆ‰Š‹Œ\u008dŽ\u008f\u0090‘’“”•–—˜™š›œ\u009džŸ';

/** The pages of a pdfkit PDF and the text printed on them (standard fonts, hex strings in TJ arrays) */
export function readPdf(pdf: Buffer) {
	const raw = pdf.toString('latin1');
	const pages = raw.match(/\/Type \/Page\b(?!s)/g)?.length ?? 0;
	// pdfkit writes «stream\n…\nendstream»; a \r before \nendstream is the last byte of the compressed content
	const streams = [...raw.matchAll(/stream\n([\s\S]*?)\nendstream/g)].map(([, body]) => {
		try {
			return inflateSync(Buffer.from(body, 'latin1')).toString('latin1');
		} catch {
			return body;
		}
	});
	// Every TJ array is one piece of text; its hex strings are WinAnsi (Windows-1252) characters, kerned apart (Node
	// decodes 'windows-1252' as Latin-1, so 0x80–0x9F come out as control characters: «–» from the table, #226)
	const winAnsi = (bytes: Buffer) => bytes.toString('latin1').replace(/[\u0080-\u009f]/g, (c) => CP1252[c.charCodeAt(0) - 0x80]);
	const textOf = (content: string) =>
		[...content.matchAll(/\[([^\]]*)\]\s*TJ/g)]
			.map(([, array]) =>
				[...array.matchAll(/<([0-9a-fA-F]*)>/g)].map(([, hex]) => winAnsi(Buffer.from(hex, 'hex'))).join('')
			)
			.join('\n')
			.replace(/\u00a0/g, ' '); // a protected space reads as a space
	// one content stream per page, in page order
	const pageTexts = streams.map(textOf).filter(Boolean);
	const text = pageTexts.join('\n');
	// flowing: wrapped lines joined, for sentences the PDF breaks over two lines
	return { pages, text, flowing: text.replace(/\s*\n\s*/g, ' '), pageTexts };
}
