import { afterEach, describe, it, expect, vi } from 'vitest';
import { POST as markPaid } from '../routes/statements/[id]/mark-paid/+server';
import { POST as sendReminder } from '../routes/statements/[id]/send-reminder/+server';
import { GET as getPdf } from '../routes/statements/[id]/pdf/+server';
import { GET as getListPdf } from '../routes/api/statements/[id]/pdf/+server';
import { GET as getBilled } from '../routes/api/statements/billed/+server';
import { GET as getRunInvoices } from '../routes/api/statements/invoices/+server';
import forStatement from '../../tests/contracts/invoices-for-statement.json';
import statementRun from '../../tests/contracts/statement-run.json';
import { GET as getZip } from '../routes/statements/zip/+server';
import { unzipSync } from 'fflate';
import refusedPdf from '../../tests/contracts/statement-pdf-refused.json';
import creditorRefused from '../../tests/contracts/statement-pdf-creditor-refused.json';
import reminderPaid from '../../tests/contracts/reminder-paid-refused.json';
import { localToday } from '$lib/contract-status';
import { load as refusedPage } from '../routes/documents/refused/+page.server';

const API = 'http://localhost:3001/api/v1/statements/s1';

/** The app's refusal page a refused PDF leads to in its tab (#734) */
function refusalOf(response: Response) {
	expect(response.status).toBe(303);
	const url = new URL(response.headers.get('location')!, 'http://localhost');
	return refusedPage({ url } as never) as Exclude<ReturnType<typeof refusedPage>, void | Promise<unknown>>;
}
const sentenceOf = (response: Response) => refusalOf(response).sentence;

function call(handler: unknown, status: number, answer: object) {
	const calls: { method?: string; url: string; body?: unknown }[] = [];
	const fetch = async (url: string, init?: RequestInit) => {
		calls.push({ method: init?.method, url, body: init?.body && JSON.parse(String(init.body)) });
		return Response.json(answer, { status });
	};
	const result = (handler as (event: never) => Promise<Response>)({
		params: { id: 's1' },
		fetch,
		request: new Request('http://localhost/', { method: 'POST' }) // no body: the defaults apply
	} as never);
	return { calls, result };
}

describe('POST /statements/[id]/mark-paid', () => {
	// #138: die Liste sendet das Abrechnungsdatum mit; ein früherer Tag geht nicht ans Backend
	it('lehnt ein Zahlungsdatum vor dem Ende der Abrechnungsperiode ab, ohne zu speichern', async () => {
		const calls: unknown[] = [];
		const fetch = async (url: string) => (calls.push(url), Response.json({}));
		const request = new Request('http://localhost/', {
			method: 'POST',
			body: JSON.stringify({ paidDate: '2024-12-30', periodEnd: '2024-12-31' })
		});
		const response = await (markPaid as (event: never) => Promise<Response>)({ params: { id: 's1' }, fetch, request } as never);

		expect(response.status).toBe(400);
		expect((await response.json()).message).toContain('vor dem Ende der Abrechnungsperiode am 31.12.2024');
		expect(calls).toEqual([]);
	});

	it('speichert den Zahlungseingang mit heutigem Datum in der Datenbank', async () => {
		const { calls, result } = call(markPaid, 200, { id: 's1', status: 'paid' });

		expect((await result).status).toBe(200);
		expect(calls).toEqual([
			{
				method: 'PUT',
				url: `${API}/status`,
				body: { status: 'paid', paidDate: localToday() }
			}
		]);
	});
});

describe('POST /statements/[id]/mark-paid (Ablehnung)', () => {
	it('sagt in Worten, was passiert ist und was zu tun ist, wenn das Backend ablehnt', async () => {
		const { result } = call(markPaid, 409, { error: 'Statement must be sent first' });

		const response = await result;
		expect(response.status).toBe(409);
		expect(await response.json()).toEqual({
			message: 'Abrechnung konnte nicht als bezahlt markiert werden. Versuchen Sie es erneut.'
		});
	});
});

describe('POST /statements/[id]/send-reminder', () => {
	it('versendet die nächste Mahnung über den Korrespondenzkanal des Mieters', async () => {
		const document = { reminderLevel: 2, channel: 'letter', status: 'to_send' };
		const { calls, result } = call(sendReminder, 201, { document });

		const response = await result;
		expect(response.status).toBe(201);
		expect(await response.json()).toEqual({ document });
		expect(calls).toEqual([{ method: 'POST', url: `${API}/reminders`, body: undefined }]);
	});

	it('gibt die Ablehnung des Backends weiter', async () => {
		const { result } = call(sendReminder, 409, reminderPaid);

		const response = await result;
		expect(response.status).toBe(409);
		expect(await response.json()).toEqual({
			error: 'Die Abrechnung ist bereits bezahlt. Schicken Sie diese Mahnung nicht mehr ab.'
		});
	});
});

// the backend names the file after the statement number
const NAMED = { 'Content-Disposition': 'attachment; filename="NK-1A2B3C4D-2025-0001.pdf"' };

describe('GET /statements/[id]/pdf', () => {
	const pdf = () => new Response(new Uint8Array([37, 80, 68, 70]), { status: 200, headers: NAMED });

	function backend() {
		const calls: string[] = [];
		const fetch = async (url: string, init?: RequestInit) => {
			calls.push(`${init?.method ?? 'GET'} ${url}`);
			return pdf();
		};
		return { calls, fetch };
	}
	const get = (fetch: unknown, search = '') =>
		getPdf({
			params: { id: 's1' },
			fetch,
			request: new Request('http://localhost/statements/s1/pdf'),
			url: new URL(`http://localhost/statements/s1/pdf${search}`)
		} as never);

	// the landlord tells the files apart by the number printed on the PDF (#101)
	it('lädt das PDF unter der Nummer der Abrechnung herunter', async () => {
		const response = await get(backend().fetch);
		expect(response.headers.get('Content-Disposition')).toBe(
			'attachment; filename="NK-1A2B3C4D-2025-0001.pdf"'
		);
	});

	it('lässt im Dateinamen nur Buchstaben, Ziffern, Unterstrich, Punkt und Bindestrich zu', async () => {
		const fetch = async () =>
			new Response(new Uint8Array([37]), {
				headers: { 'Content-Disposition': 'attachment; filename="NK-1/../é\\"x.pdf"' }
			});
		expect((await get(fetch)).headers.get('Content-Disposition')).toBe(
			'attachment; filename="NK-1..x.pdf"'
		);
	});

	// Before marking a statement as sent, the user looks at the document the tenant gets
	it('sagt in Worten, wenn das PDF nicht erstellt werden kann', async () => {
		// a refusal without a code the UI knows (an older backend, a proxy in between)
		const fetch = async () => new Response('Bad Gateway', { status: 502 });
		const response = await get(fetch, '?ansehen');
		expect(sentenceOf(response)).toContain('Das PDF konnte nicht erstellt werden');
	});

	// A tab with a statement deleted in the meantime: the download opens in the tab, as the view does
	it('sagt beim Herunterladen in Worten, dass es die Abrechnung nicht gibt', async () => {
		const response = await get(async () => Response.json(refusedPdf, { status: 404 }));
		expect(sentenceOf(response)).toBe('Diese Abrechnung gibt es nicht mehr. Wahrscheinlich wurde sie gelöscht.');
	});

	it('nennt beim Ansehen den Grund, den das Backend mit Code angibt', async () => {
		const response = await get(async () => Response.json(refusedPdf, { status: 404 }), '?ansehen');
		expect(sentenceOf(response)).toBe('Diese Abrechnung gibt es nicht mehr. Wahrscheinlich wurde sie gelöscht.');
	});

	// #450: an installation from before has an IBAN without the Firmenadresse; the page says where to add it
	it('sagt, dass für den Zahlteil die Firmenadresse fehlt und wo man sie ergänzt', async () => {
		const response = await get(async () => Response.json(creditorRefused, { status: 400 }));
		expect(sentenceOf(response)).toBe(
			'Für den Zahlteil fehlt die Firmenadresse. Ergänzen Sie Name, PLZ und Ort unter «Einstellungen».'
		);
	});

	// persona Dr. Weber P-2 (#450): the way to where the landlord adds what is missing, only when the settings help
	it('führt bei fehlender Firmenadresse auch zu den Einstellungen', async () => {
		const pageFor = async (body: object, status = 400) =>
			refusalOf(await get(async () => Response.json(body, { status })));

		for (const code of ['CREDITOR_ADDRESS_MISSING', 'IBAN_MISSING', 'IBAN_INVALID']) {
			expect({ code, settings: (await pageFor({ ...creditorRefused, code })).settings }).toEqual({
				code,
				settings: true
			});
		}
		expect((await pageFor(refusedPdf, 404)).settings).toBe(false);
	});

	// Helga, Marco (#125, #734): the tab names the error; without a page of Dwello it came from, the way leads to the list
	it('nennt den Fehler im Titel und führt ohne Herkunft zurück zur Liste', async () => {
		const page = refusalOf(await get(async () => Response.json(refusedPdf, { status: 404 })));
		expect(page.title).toBe('Abrechnung nicht gefunden');
		expect(page.back).toBeNull();
	});

	// The backend makes a missing PDF itself (getStatementPdf)
	it('zeigt das PDF zum Ansehen im Browser', async () => {
		const { calls, fetch } = backend();
		const response = await get(fetch, '?ansehen');
		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Disposition')).toBe(
			'inline; filename="NK-1A2B3C4D-2025-0001.pdf"'
		);
		expect(calls).toEqual([`GET ${API}/pdf`]);
	});
});

// All PDFs of an Abrechnungslauf as one download, e.g. to print them in one go (#356)
describe('GET /statements/zip', () => {
	const pdfOf = (id: string) =>
		new Response(new TextEncoder().encode(`%PDF-${id}`), {
			headers: {
				'Content-Disposition': `attachment; filename="NK-1A2B3C4D-2024-000${id.slice(1)}.pdf"`
			}
		});
	const get = (fetch: unknown, ids = 's1,s2') =>
		getZip({
			fetch,
			request: new Request('http://localhost/statements/zip'),
			url: new URL(
				`http://localhost/statements/zip?ids=${ids}&periodStart=2024-01-01&periodEnd=2024-12-31`
			)
		} as never);

	it('packt die PDFs der Abrechnungen unter ihrer Nummer in eine ZIP-Datei der Periode', async () => {
		const calls: string[] = [];
		const response = await get(async (url: string) => {
			calls.push(url);
			return pdfOf(url.split('/').at(-2)!);
		});
		expect(response.headers.get('Content-Type')).toBe('application/zip');
		expect(response.headers.get('Content-Disposition')).toBe(
			'attachment; filename="NK-2024-01-01-2024-12-31.zip"'
		);
		const files = unzipSync(new Uint8Array(await response.arrayBuffer()));
		expect(
			Object.entries(files).map(([name, pdf]) => [name, new TextDecoder().decode(pdf)])
		).toEqual([
			['NK-1A2B3C4D-2024-0001.pdf', '%PDF-s1'],
			['NK-1A2B3C4D-2024-0002.pdf', '%PDF-s2']
		]);
		expect(calls).toEqual([
			'http://localhost:3001/api/v1/statements/s1/pdf',
			'http://localhost:3001/api/v1/statements/s2/pdf'
		]);
	});

	// a statement of the run deleted in the meantime: the refusal page of a single PDF, not a broken ZIP
	it('sagt in Worten, wenn es eine Abrechnung des Laufs nicht mehr gibt', async () => {
		const response = await get(async (url: string) =>
			url.includes('/s2/') ? Response.json(refusedPdf, { status: 404 }) : pdfOf('s1')
		);
		expect(sentenceOf(response)).toBe('Diese Abrechnung gibt es nicht mehr. Wahrscheinlich wurde sie gelöscht.');
	});

	// an id from the address stays one path segment: it cannot reach another backend route
	it('fragt nur PDFs von Abrechnungen ab', async () => {
		const calls: string[] = [];
		await get(async (url: string) => {
			calls.push(url);
			return pdfOf('s1');
		}, '..%2Fconfig%3F');
		expect(calls).toEqual(['http://localhost:3001/api/v1/statements/..%2Fconfig%3F/pdf']);
	});
});

describe('GET /api/statements/[id]/pdf (PDF aus der Liste)', () => {
	afterEach(() => vi.unstubAllGlobals());
	const get = () =>
		getListPdf({
			params: { id: 's1' },
			cookies: { get: () => 'jwt' },
			request: new Request('http://localhost/api/statements/s1/pdf')
		} as never);

	it('lädt das PDF unter der Nummer der Abrechnung herunter', async () => {
		vi.stubGlobal(
			'fetch',
			async () =>
				new Response(new Uint8Array([37, 80, 68, 70]), {
					headers: { ...NAMED, 'Content-Type': 'application/pdf' }
				})
		);
		expect((await get()).headers.get('Content-Disposition')).toBe(
			'attachment; filename="NK-1A2B3C4D-2025-0001.pdf"'
		);
	});

	it('sagt in Worten, dass es die Abrechnung nicht gibt, statt die Antwort als PDF auszugeben', async () => {
		vi.stubGlobal('fetch', async () => Response.json(refusedPdf, { status: 404 }));
		const response = await get();
		expect(sentenceOf(response)).toBe('Diese Abrechnung gibt es nicht mehr. Wahrscheinlich wurde sie gelöscht.');
	});

	it('sagt in Worten, wenn das Backend nicht erreichbar ist', async () => {
		vi.stubGlobal('fetch', async () => {
			throw new TypeError('fetch failed');
		});
		const response = await get();
		expect(sentenceOf(response)).toBe('Das PDF konnte nicht erstellt werden. Versuchen Sie es später erneut.');
	});
});

describe('GET /api/statements/billed', () => {
	it('zählt je Gebäude die Mietverträge der Periode und die schon abgerechneten', async () => {
		const urls: string[] = [];
		const fetch = async (url: string) => {
			urls.push(url);
			return Response.json({
				...statementRun,
				contracts: [{ ...statementRun.contracts[0], billed: true }],
				overlap: [],
				skipped: []
			});
		};
		const response = await getBilled({
			url: new URL(
				'http://localhost/api/statements/billed?buildingIds=b%2F1&periodStart=2024-01-01&periodEnd=2024-12-31'
			),
			fetch
		} as never);

		expect(await response.json()).toEqual([
			// the contracts without an agreed fee as the backend names them (H-28, #717)
			{ buildingId: 'b/1', contracts: 1, billed: 1, otherPeriod: null, overlap: [], withoutFee: statementRun.withoutFee }
		]);
		// an id goes into the backend address encoded, as in the preview (code review C-4)
		expect(urls).toEqual([
			'http://localhost:3001/api/v1/statements/run?buildingId=b%2F1&periodStart=2024-01-01&periodEnd=2024-12-31'
		]);
	});
});

// #686 O-1: step 2 counts the invoices the statement takes, as the preview does
describe('GET /api/statements/invoices', () => {
	it('gibt je Gebäude die Rechnungen, die die Abrechnung der Periode nimmt', async () => {
		const urls: string[] = [];
		const fetch = async (url: string) => {
			urls.push(url);
			return Response.json(url.includes('/b%2F1?') ? forStatement : []);
		};
		const response = await getRunInvoices({
			url: new URL(
				'http://localhost/api/statements/invoices?buildingIds=b%2F1,b2&periodStart=2024-01-01&periodEnd=2024-12-31'
			),
			fetch
		} as never);

		expect(await response.json()).toEqual({ invoices: forStatement });
		expect(urls).toEqual([
			'http://localhost:3001/api/v1/invoices/for-statement/b%2F1?periodStart=2024-01-01&periodEnd=2024-12-31',
			'http://localhost:3001/api/v1/invoices/for-statement/b2?periodStart=2024-01-01&periodEnd=2024-12-31'
		]);
	});
});
