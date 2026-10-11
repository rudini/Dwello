/**
 * Reading the text of a pdfkit PDF in tests (helpers/pdf-text.ts)
 */

import { describe, expect, it } from 'bun:test';
import { deflateSync } from 'zlib';
import { readPdf } from './helpers/pdf-text';

const page = (text: string) => `BT [<${Buffer.from(text, 'latin1').toString('hex')}>] TJ ET`;

describe('PDF-Text lesen', () => {
	// pdfkit schreibt «stream\n…\nendstream»; endet der komprimierte Inhalt zufällig auf das Byte \r, gehört es dazu
	it('liest eine Seite, deren komprimierter Inhalt auf \\r endet', () => {
		const text = Array.from({ length: 5000 }, (_, i) => `Seite ${i}`).find(
			(candidate) => deflateSync(page(candidate)).at(-1) === 0x0d
		)!;
		const pdf = Buffer.concat([
			Buffer.from('1 0 obj\n<< /Type /Page >>\nstream\n', 'latin1'),
			deflateSync(page(text)),
			Buffer.from('\nendstream\nendobj\n', 'latin1')
		]);

		expect(readPdf(pdf).text).toBe(text);
	});
});
