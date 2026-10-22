import { inflateSync } from 'zlib';

// Windows-1252 at 0x80–0x9F, where it differs from Latin-1 (unassigned bytes stay as they are)
const CP1252 = '€\u0081‚ƒ„…†‡ˆ‰Š‹Œ\u008dŽ\u008f\u0090‘’“”•–—˜™š›œ\u009džŸ';

type CMap = Map<number, string>;

// pdfkit's ToUnicode map of an embedded font: «<first> <last> [<unicode> …]» ranges and «<code> <unicode>» pairs
function cmapOf(text: string): CMap {
	const map: CMap = new Map();
	const unicode = (hex: string) => String.fromCodePoint(...(hex.match(/.{4}/g) ?? []).map((h) => parseInt(h, 16)));
	for (const [, first, list] of text.matchAll(/<([0-9a-fA-F]+)>\s*<[0-9a-fA-F]+>\s*\[([^\]]*)\]/g))
		[...list.matchAll(/<([0-9a-fA-F]+)>/g)].forEach(([, hex], i) => map.set(parseInt(first, 16) + i, unicode(hex)));
	for (const [, block] of text.matchAll(/beginbfchar([\s\S]*?)endbfchar/g))
		for (const [, code, hex] of block.matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/g)) map.set(parseInt(code, 16), unicode(hex));
	return map;
}

/** The pages of a pdfkit PDF and the text printed on them (hex strings in TJ arrays: glyphs of an embedded font
 * decoded by its ToUnicode map, #465; a standard font's WinAnsi bytes) */
export function readPdf(pdf: Buffer) {
	const raw = pdf.toString('latin1');
	const pages = raw.match(/\/Type \/Page\b(?!s)/g)?.length ?? 0;
	const inflate = (body: string) => {
		try {
			return inflateSync(Buffer.from(body, 'latin1')).toString('latin1');
		} catch {
			return body;
		}
	};
	// every object by its number, a stream inflated
	const objects = new Map<string, string>();
	for (const [, number, body] of raw.matchAll(/(\d+) 0 obj([\s\S]*?)endobj/g)) {
		const stream = body.match(/stream\n([\s\S]*?)\nendstream/);
		objects.set(number, stream ? body.replace(stream[0], `stream\n${inflate(stream[1])}\nendstream`) : body);
	}
	// a font resource name (/F2) → the ToUnicode map of its font object
	const maps = new Map<string, CMap>();
	for (const [, fonts] of raw.matchAll(/\/Font\s*<<([^>]*)>>/g))
		for (const [, name, number] of fonts.matchAll(/\/(\w+)\s+(\d+) 0 R/g)) {
			const toUnicode = objects.get(number)?.match(/\/ToUnicode (\d+) 0 R/);
			if (toUnicode) maps.set(name, cmapOf(objects.get(toUnicode[1]) ?? ''));
		}
	// pdfkit writes «stream\n…\nendstream»; a \r before \nendstream is the last byte of the compressed content
	const streams = [...raw.matchAll(/stream\n([\s\S]*?)\nendstream/g)].map(([, body]) => inflate(body));
	// Every TJ array is one piece of text in the font set before it; a standard font's hex strings are WinAnsi
	// (Windows-1252) characters, kerned apart (Node decodes 'windows-1252' as Latin-1, so 0x80–0x9F come out as control
	// characters: «–» from the table, #226)
	const winAnsi = (bytes: Buffer) => bytes.toString('latin1').replace(/[\u0080-\u009f]/g, (c) => CP1252[c.charCodeAt(0) - 0x80]);
	const decode = (hex: string, map?: CMap) =>
		map ? (hex.match(/.{4}/g) ?? []).map((code) => map.get(parseInt(code, 16)) ?? '').join('') : winAnsi(Buffer.from(hex, 'hex'));
	const textOf = (content: string) => {
		let font: string | undefined;
		return [...content.matchAll(/\/(\w+)\s+[\d.]+\s+Tf|\[([^\]]*)\]\s*TJ/g)]
			.map(([, name, array]) => {
				if (name) font = name;
				return array === undefined ? null : [...array.matchAll(/<([0-9a-fA-F]*)>/g)].map(([, hex]) => decode(hex, maps.get(font!))).join('');
			})
			.filter((piece) => piece !== null)
			.join('\n')
			.replace(/\u00a0/g, ' '); // a protected space reads as a space
	};
	// one content stream per page, in page order
	const pageTexts = streams.map(textOf).filter(Boolean);
	const text = pageTexts.join('\n');
	// flowing: wrapped lines joined, for sentences the PDF breaks over two lines
	return { pages, text, flowing: text.replace(/\s*\n\s*/g, ' '), pageTexts, streams };
}
