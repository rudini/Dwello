import { describe, it, expect } from 'vitest';
import { load } from '../routes/contracts/[id]/edit/+page.server';
import contract from '../../tests/contracts/contract.json';

const backend: Record<string, unknown> = { '/api/v1/contracts/c1': contract };

const fetch = async (url: string) =>
	Response.json(backend[new URL(url).pathname + new URL(url).search]);

describe('Mietvertrag bearbeiten laden', () => {
	// B-15 (#152): Mieter und Wohnung stehen fest; das Formular nennt sie nur
	it('nennt Mieter und Wohnung des Mietvertrags', async () => {
		const data = await load({ params: { id: 'c1' }, fetch } as never);

		expect(data).toMatchObject({ tenant: 'Anna Keller', apartment: 'Wohnung 2.01 · Ahornhof' });
	});

	// A-1: das Formular bietet bei einer Kündigung «Kündigung aufheben» an
	it('gibt die Kündigung an das Formular weiter', async () => {
		const data = await load({ params: { id: 'c1' }, fetch } as never);

		expect(data).toMatchObject({ contract: { endDate: '2099-03-31', terminated: true } });
	});

	it('nennt ein Gebäude ohne Namen mit seiner Adresse', async () => {
		backend['/api/v1/contracts/c1'] = { ...contract, building: { ...contract.building, name: '' } };
		const data = await load({ params: { id: 'c1' }, fetch } as never);
		backend['/api/v1/contracts/c1'] = contract;

		expect(data).toMatchObject({ apartment: 'Wohnung 2.01 · Ahornweg 1' });
	});
});
