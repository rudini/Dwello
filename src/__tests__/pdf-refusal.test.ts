import { describe, it, expect } from 'vitest';
import { pdfRefusal } from '../lib/server/statement';
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
			'%2F%5Cevil.example'
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
		expect(pageOf('letter&code=CONTRACT_NOT_FOUND').title).toBe('Brief nicht verfügbar');
	});
});
