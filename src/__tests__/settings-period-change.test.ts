import { describe, expect, it } from 'vitest';
import { saveSettings } from '$lib/server/settings';
import config from '../../tests/contracts/config.json';
import periodChange from '../../tests/contracts/config-period-change.json';

// #1036 (Option 1): after saving another Abrechnungsperiode the settings name the contracts whose tenants must agree
const form = (fields: Record<string, string>) => {
	const body = new FormData();
	for (const [key, value] of Object.entries(fields)) body.set(key, value);
	return new Request('http://localhost/', { method: 'POST', body });
};

// the stored settings of config.json (july-june), the save, and the change after it
const backend = (asked: string[]) =>
	(async (url: string, init?: RequestInit) => {
		asked.push(`${init?.method ?? 'GET'} ${url.replace(/^.*\/api\/v1\//, '')}`);
		if (init?.method === 'PUT') return Response.json({ data: {} });
		return Response.json(url.endsWith('/period-change') ? periodChange : config);
	}) as unknown as typeof fetch;

describe('Wechsel der Abrechnungsperiode in den Einstellungen', () => {
	it('nennt nach dem Speichern einer anderen Abrechnungsperiode die Mietverträge mit ihrem Brief zur Zustimmung', async () => {
		const result = await saveSettings(backend([]), form({ accountingPeriod: 'calendar' }));
		expect(result).toEqual({
			saved: true,
			periodChange: {
				start: '2027-01-01',
				short: { start: '2026-11-01', end: '2026-12-31' },
				started: false,
				contracts: [
					{
						id: 'c1',
						tenant: 'Anna Keller',
						apartment: '2.01',
						letter: '/contracts/c1/consent-letter'
					}
				]
			}
		});
	});

	it('nennt ohne Wechsel der Abrechnungsperiode keine', async () => {
		const asked: string[] = [];
		expect(await saveSettings(backend(asked), form({ accountingPeriod: 'july-june' }))).toEqual({
			saved: true,
			periodChange: null
		});
		expect(asked).not.toContain('GET config/period-change');
	});

	// code review 1036-1 C-1, fallback review of PR #1083: the settings are saved; a hint that does not load costs no error page
	it('bestätigt das Speichern, auch wenn der Hinweis zum Wechsel nicht lädt', async () => {
		const failing = (async (url: string, init?: RequestInit) =>
			url.endsWith('/period-change')
				? Promise.reject(new TypeError('fetch failed'))
				: backend([])(url, init)) as unknown as typeof fetch;
		expect(await saveSettings(failing, form({ accountingPeriod: 'calendar' }))).toEqual({
			saved: true,
			periodChange: null
		});
	});
});
