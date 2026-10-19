import { describe, expect, it } from 'vitest';
import { load as apartments } from '../routes/apartments/+page.server';
import { load as newApartment } from '../routes/apartments/new/+page.server';
import { load as contracts } from '../routes/contracts/+page.server';
import { load as invoices } from '../routes/invoices/+page.server';
import { load as newInvoice } from '../routes/invoices/new/+page.server';
import { load as editInvoice } from '../routes/invoices/[id]/edit/+page.server';
import { load as statements } from '../routes/statements/+page.server';
import { load as generate } from '../routes/statements/generate/+page.server';

const loads = {
	apartments,
	newApartment,
	contracts,
	invoices,
	newInvoice,
	editInvoice,
	statements,
	generate
};

// Only the requests count: the backend refuses everything, so no load reads an answer
describe('Gebäudelisten', () => {
	it.each(Object.entries(loads))(
		'%s bietet bis zu 1000 Gebäude an, nicht nur die ersten 20 des Backends',
		async (_, load) => {
			const urls: string[] = [];
			const fetch = (async (input: string) => {
				urls.push(input);
				return new Response('{}', { status: 500 });
			}) as typeof globalThis.fetch;

			await (load as (event: unknown) => Promise<unknown>)({
				params: { id: 'i1' },
				url: new URL('http://localhost/x'),
				fetch
			}).catch(() => {});

			expect(urls).toContain('http://localhost:3001/api/v1/buildings?limit=1000');
		}
	);
});
