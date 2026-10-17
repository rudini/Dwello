import { describe, it, expect } from 'vitest';
import { actions as newActions } from '../routes/config/heating-profiles/new/+page.server';
import {
	actions as editActions,
	load as editLoad
} from '../routes/config/heating-profiles/[id]/edit/+page.server';
import { load as listLoad } from '../routes/config/heating-profiles/+page.server';
import { actions as detailActions } from '../routes/config/heating-profiles/[id]/+page.server';
import { profileTotal } from '../lib/heating-profile';
import { runAction } from './helpers/action';

const API = 'http://localhost:3001/api/v1/heating-profiles';
const months = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december'
];

// January 16.4 %, the other months 7.6 % each: 100 % in total
const form = (january = '16.4') => ({
	name: ' Bergtal ',
	description: 'Lange Heizperiode',
	...Object.fromEntries(months.map((month) => [month, month === 'january' ? january : '7.6']))
});
const shares = Object.fromEntries(
	months.map((month) => [`${month}Pct`, month === 'january' ? 16.4 : 7.6])
);

describe('Heizprofil-Summe', () => {
	it('rundet die Summe der Monatsanteile auf Hundertstel', () => {
		expect(profileTotal({ january: 8.37, february: 91.63000000000001 })).toBe(100);
	});
});

describe('Neues Heizprofil', () => {
	it('erfasst das Profil mit allen Monatsanteilen und öffnet es', async () => {
		const { calls, result } = runAction(newActions.default, '', 201, form(), { id: 'hp9' });

		await expect(result).rejects.toMatchObject({
			status: 303,
			location: '/config/heating-profiles/hp9'
		});
		expect(calls).toEqual([
			{
				method: 'POST',
				url: API,
				body: { name: 'Bergtal', description: 'Lange Heizperiode', ...shares }
			}
		]);
	});

	it('verlangt einen Namen und 100 % Summe', async () => {
		const { calls, result } = runAction(newActions.default, '', 201, { ...form('6.4'), name: '' });

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: {
					name: 'Name ist erforderlich.',
					total: 'Die Monatsanteile müssen zusammen 100 % ergeben (aktuell 90 %).'
				}
			}
		});
		expect(calls).toEqual([]);
	});

	it('zeigt die Meldung des Backends, wenn der Name vergeben ist', async () => {
		const message = 'Ein Heizprofil mit dem Namen "Bergtal" existiert bereits.';
		const { result } = runAction(newActions.default, '', 409, form(), { error: message });

		expect(await result).toMatchObject({ status: 409, data: { errors: { form: message } } });
	});
});

describe('Heizprofil bearbeiten', () => {
	it('speichert Monatsanteile mit Nachkommastellen und öffnet das Profil', async () => {
		const { calls, result } = runAction(editActions.default, 'hp1', 200, form());

		await expect(result).rejects.toMatchObject({
			status: 303,
			location: '/config/heating-profiles/hp1'
		});
		expect(calls[0]).toEqual({
			method: 'PUT',
			url: `${API}/hp1`,
			body: { name: 'Bergtal', description: 'Lange Heizperiode', ...shares }
		});
	});
});

describe('Heizprofil löschen', () => {
	it('löscht das Profil und zeigt die Heizprofile', async () => {
		const { calls, result } = runAction(detailActions.delete, 'hp1', 204);

		await expect(result).rejects.toMatchObject({
			status: 303,
			location: '/config/heating-profiles'
		});
		expect(calls).toEqual([{ method: 'DELETE', url: `${API}/hp1`, body: undefined }]);
	});

	it('erklärt, warum das Standard-Heizprofil bleibt', async () => {
		const message = 'Das Heizprofil ist in den Einstellungen als Standard hinterlegt.';
		const { result } = runAction(detailActions.delete, 'hp1', 409, {}, { error: message });

		expect(await result).toMatchObject({ status: 409, data: { error: message } });
	});
});

describe('Heizprofile laden', () => {
	it('lädt alle Heizprofile für die Übersicht', async () => {
		const fetch = (async (url: string) => {
			expect(url).toBe('http://localhost:3001/api/v1/heating-profiles?limit=100');
			return Response.json({
				data: [{ id: 'hp1', name: 'Winter', type: 'custom', januaryPct: '18' }]
			});
		}) as typeof globalThis.fetch;

		const { profiles } = (await listLoad({ fetch } as never)) as { profiles: { id: string }[] };
		expect(profiles.map((p) => p.id)).toEqual(['hp1']);
	});

	it('verweigert das Bearbeiten vordefinierter Profile', async () => {
		const fetch = (async () =>
			Response.json({
				data: { id: 'hp1', name: 'Standard', type: 'predefined' }
			})) as typeof globalThis.fetch;

		await expect(editLoad({ fetch, params: { id: 'hp1' } } as never)).rejects.toMatchObject({
			status: 403
		});
	});
});
