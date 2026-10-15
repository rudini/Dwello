import { describe, it, expect } from 'vitest';
import { actions as listActions, load } from '../routes/config/categories/+page.server';
import { actions as newActions } from '../routes/config/categories/new/+page.server';
import { actions as editActions } from '../routes/config/categories/[id]/edit/+page.server';
import { runAction } from './helpers/action';
import proposal from '../../tests/contracts/category-proposal.json';
import unsure from '../../tests/contracts/category-proposal-refused.json';
import invalid from '../../tests/contracts/validation-refused.json';

const API = 'http://localhost:3001/api/v1/categories';

const form = {
	name: ' Treppenhausreinigung ',
	description: 'Reinigung von Treppenhaus und Eingang',
	isAllowedUtilityCost: 'true',
	sortOrder: '15',
	nameFR: 'Nettoyage cage d’escalier',
	nameIT: '',
	nameEN: ''
};

const saved = {
	description: 'Reinigung von Treppenhaus und Eingang',
	isAllowedUtilityCost: true,
	isHeatingCost: false,
	sortOrder: 15,
	nameFR: 'Nettoyage cage d’escalier',
	nameIT: null,
	nameEN: null
};

describe('Kategorien anzeigen', () => {
	it('zeigt den deutschen Namen der Kategorie', async () => {
		const fetch = (async () =>
			Response.json({
				categories: [
					{
						id: 'c1',
						name: 'Heating',
						nameDE: 'Heizung',
						isAllowedUtilityCost: true,
						invoiceCount: '3'
					}
				],
				total: 1
			})) as typeof globalThis.fetch;

		const data = (await load({ fetch } as never)) as { categories: unknown[] };

		expect(data.categories).toEqual([
			expect.objectContaining({
				id: 'c1',
				name: 'Heizung',
				isAllowedUtilityCost: true,
				usageCount: 3
			})
		]);
	});
});

describe('Neue Kategorie', () => {
	it('erfasst die Kategorie unter ihrem deutschen Namen und zeigt die Kategorien', async () => {
		const { calls, result } = runAction(newActions.save, '', 201, form, { id: 'c9' });

		await expect(result).rejects.toMatchObject({ status: 303, location: '/config/categories' });
		expect(calls).toEqual([
			{
				method: 'POST',
				url: API,
				body: { name: 'Treppenhausreinigung', nameDE: 'Treppenhausreinigung', ...saved }
			}
		]);
	});

	it('erfasst nicht umlagefähige Kategorien', async () => {
		const { calls, result } = runAction(newActions.save, '', 201, {
			name: 'Reparaturen Dach',
			isAllowedUtilityCost: 'false'
		});
		await result.catch(() => {});

		expect(calls[0].body).toMatchObject({ isAllowedUtilityCost: false, isHeatingCost: false });
		expect(calls[0].body).not.toHaveProperty('sortOrder');
	});

	// Heiz- und Warmwasserkosten folgen beim Mieterwechsel dem Heizprofil
	it('erfasst eine Kategorie als Heiz- und Warmwasserkosten', async () => {
		const { calls, result } = runAction(newActions.save, '', 201, {
			name: 'Pellets',
			isAllowedUtilityCost: 'true',
			isHeatingCost: 'on'
		});
		await result.catch(() => {});

		expect(calls[0].body).toMatchObject({ isHeatingCost: true });
	});

	it('verlangt einen Namen', async () => {
		const { calls, result } = runAction(newActions.save, '', 201, { ...form, name: ' ' });

		expect(await result).toMatchObject({
			status: 400,
			data: { errors: { name: 'Name ist erforderlich' } }
		});
		expect(calls).toEqual([]);
	});

	// Eine Kategorie ist nie umlagefähig, nur weil niemand hingeschaut hat (#176)
	it('verlangt die Wahl, ob die Kosten umlagefähig sind', async () => {
		const { isAllowedUtilityCost: _, ...unchosen } = form;
		const { calls, result } = runAction(newActions.save, '', 201, unchosen);

		expect(await result).toMatchObject({
			status: 400,
			data: { errors: { isAllowedUtilityCost: 'Wählen Sie, ob die Kosten umlagefähig sind.' } }
		});
		expect(calls).toEqual([]);
	});

	it('zeigt die Meldung des Backends beim Namen, wenn der Name vergeben ist', async () => {
		const message = 'Eine Kategorie mit dem Namen "Treppenhausreinigung" existiert bereits.';
		const { result } = runAction(newActions.save, '', 409, form, { error: message });

		expect(await result).toEqual(
			expect.objectContaining({ status: 409, data: { errors: { name: message } } })
		);
	});

	it('meldet andere Fehler des Backends für das ganze Formular', async () => {
		const { result } = runAction(newActions.save, '', 500, form, {});

		expect(await result).toMatchObject({
			status: 500,
			data: { errors: { form: 'Kategorie konnte nicht gespeichert werden.' } }
		});
	});
});

describe('Vorschlag der KI', () => {
	it('fragt die KI mit Name und Beschreibung und zeigt ihre Einstufung', async () => {
		const { calls, result } = runAction(newActions.propose, '', 200, form, proposal);

		// The proposal holds for the name the KI checked
		expect(await result).toEqual({
			proposal: { name: 'Treppenhausreinigung', description: 'Reinigung von Treppenhaus und Eingang', ...proposal }
		});
		expect(calls).toEqual([
			{
				method: 'POST',
				url: `${API}/propose`,
				// The KI answers in the language of the interface
				body: {
					name: 'Treppenhausreinigung',
					description: 'Reinigung von Treppenhaus und Eingang',
					language: 'de'
				}
			}
		]);
	});

	const hint = async (status: number, body: unknown) =>
		((await runAction(newActions.propose, '', status, form, body).result) as { proposal: { error: string } }).proposal.error;
	const UNSURE = 'Die KI ist sich nicht sicher. Wählen Sie selbst, ob die Kosten umlagefähig sind.';
	const UNAVAILABLE =
		'Die KI ist nicht erreichbar. Versuchen Sie es später nochmals oder wählen Sie selbst, ob die Kosten umlagefähig sind.';

	// Whether trying again can help (#186)
	it('sagt, dass die KI unsicher ist und der Liegenschaftsverwalter selbst wählt', async () => {
		const { result } = runAction(newActions.propose, '', 503, form, unsure);

		expect(await result).toEqual({
			proposal: { name: 'Treppenhausreinigung', description: 'Reinigung von Treppenhaus und Eingang', error: UNSURE }
		});
	});

	it('sagt, dass die KI nicht erreichbar ist und ein späterer Versuch helfen kann', async () => {
		expect(await hint(503, { ...unsure, code: 'KI_PROPOSAL_UNAVAILABLE' })).toBe(UNAVAILABLE);
	});

	// Nie der eigene Text des Backends, z. B. Elysias Meldung zu einem zu langen Namen (E-6)
	it('zeigt bei einer anderen Ablehnung des Backends den Hinweis «nicht erreichbar»', async () => {
		expect(await hint(422, invalid)).toBe(UNAVAILABLE);
	});

	it('zeigt den Hinweis auch, wenn eine Antwort ohne Inhalt kommt', async () => {
		expect(await hint(200, null)).toBe(UNAVAILABLE);
	});

	it('verlangt zuerst einen Namen', async () => {
		const { calls, result } = runAction(newActions.propose, '', 200, { ...form, name: ' ' });

		expect(await result).toMatchObject({ status: 400, data: { errors: { name: 'Name ist erforderlich' } } });
		expect(calls).toEqual([]);
	});
});

describe('Kategorie bearbeiten', () => {
	it('ändert den deutschen Namen und behält den Namen für die Rechnungserkennung', async () => {
		const { calls, result } = runAction(editActions.default, 'c1', 200, form);

		await expect(result).rejects.toMatchObject({ status: 303, location: '/config/categories' });
		expect(calls).toEqual([
			{ method: 'PUT', url: `${API}/c1`, body: { nameDE: 'Treppenhausreinigung', ...saved } }
		]);
	});
});

describe('Kategorie löschen', () => {
	it('löscht die Kategorie', async () => {
		const { calls, result } = runAction(listActions.delete, '', 204, { id: 'c1' });

		await expect(result).rejects.toMatchObject({ status: 303, location: '/config/categories' });
		expect(calls).toEqual([{ method: 'DELETE', url: `${API}/c1`, body: undefined }]);
	});

	it('erklärt, warum eine verwendete Kategorie bleibt', async () => {
		const message = 'Die Kategorie wird von 1 Rechnung verwendet und kann nicht gelöscht werden.';
		const { result } = runAction(listActions.delete, '', 409, { id: 'c1' }, { error: message });

		expect(await result).toMatchObject({ status: 409, data: { error: message } });
	});
});
