import { describe, expect, it } from 'vitest';
import { listDistributionKeys } from '../lib/server/distribution-key';
import { load as profilesLoad } from '../routes/config/heating-profiles/+page.server';
import { load as settingsLoad } from '../routes/config/+page.server';
import { load as newInvoiceLoad } from '../routes/invoices/new/+page.server';
import { load as generateLoad } from '../routes/statements/generate/+page.server';
import keyList from '../../tests/contracts/distribution-keys.json';
import profileList from '../../tests/contracts/heating-profiles.json';

// #588: the backend sends at most as many Verteilschlüssel and Heizprofile as asked for
const records = <T extends object>(sample: T) =>
	Array.from({ length: 150 }, (_, i) => ({ ...sample, id: `r${i}`, nameDE: `Eintrag ${i}` }));
const keys = records(keyList.data[0]);
const profiles = records(profileList.data[0]);

const fetch = (async (url: string) => {
	const { pathname, searchParams } = new URL(url);
	const limit = Number(searchParams.get('limit') ?? 100);
	if (pathname.endsWith('/distribution-keys')) return Response.json({ data: keys.slice(0, limit) });
	if (pathname.endsWith('/heating-profiles'))
		return Response.json({ data: profiles.slice(0, limit) });
	if (pathname.endsWith('/config')) return Response.json({ data: {} });
	return Response.json({});
}) as typeof globalThis.fetch;

describe('Listen mit mehr als 100 Verteilschlüsseln und Heizprofilen', () => {
	it('nennt auf der Seite «Verteilschlüssel» jeden Verteilschlüssel', async () => {
		expect(await listDistributionKeys(fetch)).toHaveLength(150);
	});

	it('bietet in der Rechnung jeden Verteilschlüssel an', async () => {
		const url = new URL('http://localhost/invoices/new');
		const data = (await newInvoiceLoad({ url, fetch } as never)) as { distributionKeys: unknown[] };
		expect(data.distributionKeys).toHaveLength(150);
	});

	it('nennt auf der Seite «Heizprofile» jedes Heizprofil', async () => {
		const data = (await profilesLoad({ fetch } as never)) as { profiles: unknown[] };
		expect(data.profiles).toHaveLength(150);
	});

	it('bietet in den Einstellungen jedes Heizprofil und jeden Verteilschlüssel an', async () => {
		const data = (await settingsLoad({ fetch } as never)) as {
			heatingProfiles: unknown[];
			distributionKeys: unknown[];
		};
		expect([data.heatingProfiles.length, data.distributionKeys.length]).toEqual([150, 150]);
	});

	it('bietet beim Erstellen der Abrechnungen jedes Heizprofil an', async () => {
		const url = new URL('http://localhost/statements/generate');
		const data = (await generateLoad({ url, fetch } as never)) as { heatingProfiles: unknown[] };
		expect(data.heatingProfiles).toHaveLength(150);
	});
});
