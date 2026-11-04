import { afterEach, beforeEach, describe, it, expect } from 'vitest';
import { pdfRefusal } from '../lib/server/statement';
import { proxyFile } from '../lib/server/file-proxy';
import documentNotFound from '../../tests/contracts/document-not-found.json';
import invoiceNotFound from '../../tests/contracts/invoice-not-found.json';
import { load as refusedPage } from '../routes/documents/refused/+page.server';

const from = (referer?: string) =>
	new Request('http://dwello.test/statements/s-1/pdf', { headers: referer ? { referer } : {} });
const target = (response: Response) =>
	new URL(response.headers.get('location')!, 'http://dwello.test');

// #734: a refused PDF opens the app's own error page, which leads back where the Liegenschaftsverwalter came from
describe('Abgelehntes PDF', () => {
	it('führt auf die Fehlerseite der App mit dem Code der Ablehnung', () => {
		const response = pdfRefusal(from(), { code: 'IBAN_MISSING', message: 'no IBAN' });

		expect(response.status).toBe(303);
		expect(target(response).pathname).toBe('/documents/refused');
		expect(target(response).searchParams.get('code')).toBe('IBAN_MISSING');
	});

	it('führt zurück zur Seite von Dwello, von der das PDF angefordert wurde', () => {
		const response = pdfRefusal(from('http://dwello.test/statements?status=draft&building=b-1'), {
			code: 'IBAN_MISSING'
		});

		expect(target(response).searchParams.get('back')).toBe('/statements?status=draft&building=b-1');
	});

	it('führt nicht zurück zu einer fremden Seite', () => {
		const response = pdfRefusal(from('http://elsewhere.test/statements'), { code: 'IBAN_MISSING' });

		expect(target(response).searchParams.has('back')).toBe(false);
	});

	// the page it came from shows the statement that is gone (its detail page, the run of the wizard)
	it('führt bei einer gelöschten Abrechnung nur zur Liste zurück', () => {
		const gone = { code: 'STATEMENT_NOT_FOUND' };

		expect(
			target(pdfRefusal(from('http://dwello.test/statements/s-1'), gone)).searchParams.has('back')
		).toBe(false);
		expect(
			target(pdfRefusal(from('http://dwello.test/statements?building=b-1'), gone)).searchParams.get(
				'back'
			)
		).toBe('/statements?building=b-1');
	});
});

// the page reads only what `pdfRefusal` puts in its address, which anyone can also type or send as a link
describe('Fehlerseite eines abgelehnten PDF', () => {
	const pageOf = (query: string) =>
		refusedPage({ url: new URL(`http://dwello.test/documents/refused?${query}`) } as never) as {
			title: string;
			sentence: string;
			back: string | null;
		};

	// code review 734 C-1: the browser drops a tab or line break, so «/<tab>/x» leads to //x, another site
	it('führt nie zu einer anderen Seite als Dwello zurück', () => {
		for (const back of [
			'%2F%09%2Fevil.example',
			'%2F%0A%2Fevil.example',
			'%2F%2Fevil.example',
			'https%3A%2F%2Fevil.example',
			'%2F%5Cevil.example',
			// code review 734 C-1 (round 2): a path the URL resolves to //x, and C-5: no URL at all
			'%2F.%2F%2Fevil.example',
			'%2Fx%2F..%2F%2Fevil.example',
			'http%3A%2F%2F%5B'
		])
			expect({ back, to: pageOf(`back=${back}`).back }).toEqual({ back, to: null });
		expect(pageOf('back=%2Fstatements%3Fstatus%3Ddraft').back).toBe('/statements?status=draft');
	});

	// code review 734 C-3
	it('nennt ein PDF, das nicht erstellt werden kann, im Titel und sagt beim Ansehen, den Tab zu schliessen', () => {
		expect(pageOf('view').title).toBe('PDF nicht verfügbar');
		expect(pageOf('view').sentence).toBe(
			'Das PDF konnte nicht erstellt werden. Schliessen Sie diesen Tab und versuchen Sie es später erneut.'
		);
	});
});

// fallback review of #1095: Node 20, which README and package.json still name, has no URL.parse
describe('Abgelehntes PDF unter Node 20', () => {
	const parse = URL.parse;
	beforeEach(() => {
		Reflect.deleteProperty(URL, 'parse');
	});
	afterEach(() => {
		URL.parse = parse;
	});

	it('führt auch ohne URL.parse auf die Fehlerseite und von dort zurück', () => {
		const response = pdfRefusal(from('http://dwello.test/statements?building=b-1'), {
			code: 'IBAN_MISSING'
		});
		const back = target(response).searchParams.get('back');

		expect(back).toBe('/statements?building=b-1');
		expect((refusedPage({ url: target(response) } as never) as { back: string | null }).back).toBe(
			'/statements?building=b-1'
		);
	});
});

// #1093: a refused Beleg or Dokument opens the same error page, not a download of the backend's answer
describe('Abgelehnte Datei', () => {
	const backend = (status: number, body: unknown) =>
		(async () => Response.json(body, { status })) as typeof fetch;

	it('führt auf die Fehlerseite der App und zurück zur Seite, von der sie angefordert wurde', async () => {
		const request = new Request('http://dwello.test/documents/d-1/pdf', {
			headers: { referer: 'http://dwello.test/tenants/t-1' }
		});

		const response = await proxyFile(backend(404, documentNotFound), request, 'http://api/x');

		expect(response.status).toBe(303);
		expect(target(response).pathname).toBe('/documents/refused');
		expect(target(response).searchParams.get('code')).toBe('DOCUMENT_NOT_FOUND');
		expect(target(response).searchParams.get('back')).toBe('/tenants/t-1');
	});

	// the invoice's page is gone with it
	it('führt bei einer gelöschten Rechnung zur Liste der Rechnungen', () => {
		const response = pdfRefusal(from('http://dwello.test/invoices/i-1'), invoiceNotFound);
		const page = refusedPage({ url: target(response) } as never) as {
			title: string;
			back: string | null;
			list: string;
		};

		expect(page).toMatchObject({ title: 'Rechnung nicht gefunden', back: null, list: '/invoices' });
	});

	// personas Helga and Marco 1093 P-1, code review 1093 C-2: reloading the error page shows it again
	it('sagt bei einer gelöschten Rechnung oder einem gelöschten Dokument, dass es gelöscht wurde, ohne neu laden zu lassen', () => {
		const sentenceOf = (code: string) =>
			(
				refusedPage({
					url: new URL(`http://dwello.test/documents/refused?code=${code}`)
				} as never) as { sentence: string }
			).sentence;

		expect(sentenceOf('INVOICE_NOT_FOUND')).toBe(
			'Diese Rechnung gibt es nicht mehr. Wahrscheinlich wurde sie gelöscht.'
		);
		expect(sentenceOf('DOCUMENT_NOT_FOUND')).toBe(
			'Dieses Dokument gibt es nicht mehr. Wahrscheinlich wurde es gelöscht.'
		);
	});

	// fallback review of #1107: a name every object has is no code
	it('zeigt die Fehlerseite auch mit einem Code, den Dwello nicht kennt', () => {
		for (const code of ['__proto__', 'constructor', 'toString'])
			expect(
				refusedPage({
					url: new URL(`http://dwello.test/documents/refused?code=${code}`)
				} as never)
			).toMatchObject({ title: 'PDF nicht verfügbar', list: '/statements' });
	});

	it('nennt ein gelöschtes Dokument im Titel', () => {
		const page = refusedPage({
			url: new URL('http://dwello.test/documents/refused?code=DOCUMENT_NOT_FOUND')
		} as never);

		expect(page).toMatchObject({ title: 'Dokument nicht gefunden', list: '/statements' });
	});
});

// #1093: without the link's `download`, WebKit shows a photo sent as an attachment instead of saving it (#424)
describe('Datei zum Herunterladen', () => {
	const photo = (async () =>
		new Response(new Uint8Array([0xff, 0xd8, 0xff]), {
			headers: {
				'content-type': 'image/jpeg',
				'content-disposition': 'attachment; filename="ausweis.jpg"'
			}
		})) as typeof fetch;
	const request = new Request('http://dwello.test/documents/d-1/pdf');

	it('wird von jedem Browser gespeichert, mit ihrem Namen', async () => {
		const response = await proxyFile(photo, request, 'http://api/x');

		expect(response.headers.get('content-type')).toBe('application/octet-stream');
		expect(response.headers.get('content-disposition')).toBe('attachment; filename="ausweis.jpg"');
	});

	it('wird als Beleg im Browser mit seiner Art angezeigt', async () => {
		const response = await proxyFile(photo, request, 'http://api/x', true);

		expect(response.headers.get('content-type')).toBe('image/jpeg');
		expect(response.headers.get('content-disposition')).toBe('inline; filename="ausweis.jpg"');
	});
});
