import { describe, it, expect } from 'vitest';
import { pdfRefusal } from '../lib/server/statement';

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
