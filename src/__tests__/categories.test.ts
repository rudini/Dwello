import { describe, it, expect } from 'vitest';
import { actions as listActions, load } from '../routes/config/categories/+page.server';
import { actions as newActions } from '../routes/config/categories/new/+page.server';
import { actions as editActions } from '../routes/config/categories/[id]/edit/+page.server';
import { runAction } from './helpers/action';

const API = 'http://localhost:3001/api/v1/categories';

const form = {
	name: ' Treppenhausreinigung ',
	description: 'Reinigung von Treppenhaus und Eingang',
	isAllowedUtilityCost: 'on',
	sortOrder: '15',
	nameFR: 'Nettoyage cage d’escalier',
	nameIT: '',
	nameEN: ''
};

const saved = {
	description: 'Reinigung von Treppenhaus und Eingang',
	isAllowedUtilityCost: true,
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
		const { calls, result } = runAction(newActions.default, '', 201, form, { id: 'c9' });

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
		const { calls, result } = runAction(newActions.default, '', 201, { name: 'Reparaturen Dach' });
		await result.catch(() => {});

		expect(calls[0].body).toMatchObject({ isAllowedUtilityCost: false });
		expect(calls[0].body).not.toHaveProperty('sortOrder');
	});

	it('verlangt einen Namen', async () => {
		const { calls, result } = runAction(newActions.default, '', 201, { ...form, name: ' ' });

		expect(await result).toMatchObject({
			status: 400,
			data: { errors: { name: 'Name ist erforderlich' } }
		});
		expect(calls).toEqual([]);
	});

	it('zeigt die Meldung des Backends beim Namen, wenn der Name vergeben ist', async () => {
		const message = 'Eine Kategorie mit dem Namen "Treppenhausreinigung" existiert bereits.';
		const { result } = runAction(newActions.default, '', 409, form, { error: message });

		expect(await result).toEqual(
			expect.objectContaining({ status: 409, data: { errors: { name: message } } })
		);
	});

	it('meldet andere Fehler des Backends für das ganze Formular', async () => {
		const { result } = runAction(newActions.default, '', 500, form, {});

		expect(await result).toMatchObject({
			status: 500,
			data: { errors: { form: 'Kategorie konnte nicht gespeichert werden.' } }
		});
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
