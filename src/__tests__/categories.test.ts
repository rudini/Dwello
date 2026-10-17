import { describe, it, expect } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { actions as listActions, load } from '../routes/config/categories/+page.server';
import {
	actions as newActions,
	load as loadNew
} from '../routes/config/categories/new/+page.server';
import {
	actions as editActions,
	load as loadEdit
} from '../routes/config/categories/[id]/edit/+page.server';
import { runAction } from './helpers/action';
import { agreeableCategories } from '$lib/server/category';
import proposal from '../../tests/contracts/category-proposal.json';
import unsure from '../../tests/contracts/category-proposal-refused.json';
import invalid from '../../tests/contracts/validation-refused.json';
import contract from '../../tests/contracts/category.json';
import fuelRefused from '../../tests/contracts/category-fuel-refused.json';
import recipient from '../../tests/contracts/llm-recipient.json';

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
	isFuel: false,
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

	// The key names a predefined category's reason (#186), whatever its German name
	it('behält den Schlüssel einer Kategorie', async () => {
		const fetch = (async () => Response.json({ categories: [contract], total: 1 })) as typeof globalThis.fetch;

		const data = (await load({ fetch } as never)) as { categories: { key: string }[] };

		expect(data.categories[0].key).toBe('Internet');
	});
});

describe('Neue Kategorie', () => {
	// #219: «Von der KI prüfen lassen» nur, solange der Betreiber die KI eingeschaltet hat
	it('fragt das Backend, ob die KI eingeschaltet ist', async () => {
		const urls: string[] = [];
		const answer = (enabled: boolean) =>
			(async (url: string) => {
				urls.push(url);
				return Response.json({ ...recipient, enabled });
			}) as typeof globalThis.fetch;

		expect(await loadNew({ fetch: answer(true) } as never)).toEqual({ kiEnabled: true });
		expect(await loadNew({ fetch: answer(false) } as never)).toEqual({ kiEnabled: false });
		expect(urls[0]).toMatch(/\/api\/v1\/invoices\/llm-recipient$/);
	});

	// Code-Review W5b C-2: ohne Antwort bleibt die Prüfung angeboten; eine Ablehnung sagt dann, warum
	it('bietet die KI an, wenn das Backend nicht sagt, ob sie eingeschaltet ist', async () => {
		const fails = (async () => {
			throw new Error('offline');
		}) as typeof globalThis.fetch;

		expect(await loadNew({ fetch: fails } as never)).toEqual({ kiEnabled: true });
		const silent = (async () => Response.json({})) as typeof globalThis.fetch;
		expect(await loadNew({ fetch: silent } as never)).toEqual({ kiEnabled: true });
	});

	// Fachreview W5b V-3: der Hinweis einer vordefinierten Kategorie nennt die KI nur, wenn sie eingeschaltet ist
	it('fragt beim Bearbeiten das Backend, ob die KI eingeschaltet ist', async () => {
		const fetch = (async (url: string) =>
			url.endsWith('/llm-recipient')
				? Response.json({ ...recipient, enabled: false })
				: Response.json(contract)) as typeof globalThis.fetch;

		const data = await loadEdit({ fetch, params: { id: 'c1' } } as never);

		expect(data).toEqual({
			category: expect.objectContaining({ key: 'Internet' }),
			kiEnabled: false
		});
	});

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

	// #100: Brennstoff ist ein Merkmal von Heizkosten (das Backend speichert es nur mit ihnen)
	it('übernimmt «Brennstoff»', async () => {
		const { calls, result } = runAction(newActions.save, '', 201, {
			name: 'Pellets',
			isAllowedUtilityCost: 'true',
			isHeatingCost: 'on',
			isFuel: 'on'
		});
		await result.catch(() => {});

		expect(calls[0].body).toMatchObject({ isFuel: true });
	});

	it('verlangt einen Namen', async () => {
		const { calls, result } = runAction(newActions.save, '', 201, { ...form, name: ' ' });

		expect(await result).toMatchObject({
			status: 400,
			data: { errors: { name: 'Name ist erforderlich.' } }
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

	// «non è sicura» / «n’est pas sûre» lesen sich auch als «nicht ungefährlich» (Persona Marco P-1, Code-Review M-9);
	// Englisch «Decide yourself» (Fachreview H-28)
	it.each([
		['it', unsure, 'L’IA non ne è certa. Indichi Lei se i costi sono addebitabili.'],
		['fr', unsure, 'L’IA n’en est pas certaine. Indiquez vous-même si les frais sont imputables.'],
		['en', unsure, 'The AI is not sure. Decide yourself whether the costs are allocable.'],
		[
			'en',
			{ ...unsure, code: 'KI_PROPOSAL_UNAVAILABLE' },
			'The AI cannot be reached. Try again later or decide yourself whether the costs are allocable.'
		]
	] as const)('sagt auf %s ohne Doppeldeutigkeit, warum die KI nichts vorschlägt', async (locale, body, text) => {
		overwriteGetLocale(() => locale);
		try {
			expect(await hint(503, body)).toBe(text);
		} finally {
			overwriteGetLocale(() => baseLocale);
		}
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

		expect(await result).toMatchObject({ status: 400, data: { errors: { name: 'Name ist erforderlich.' } } });
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

	// #100 (Fachreview V-2): eine Kategorie mit Tankbestand bleibt Brennstoff; das betrifft nicht den Namen
	it('sagt für das ganze Formular, dass eine Kategorie mit Tankbestand Brennstoff bleibt', async () => {
		const { result } = runAction(editActions.default, 'c1', 200, form, {}, { status: 400, answer: fuelRefused });

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: {
					// names both checkboxes: removing the heating cost alone is refused too (Fachreview V-10)
					form: 'Die Kategorie hat Tankbestände. Deshalb bleiben die Häkchen «Heizkosten nach dem Heizprofil verteilen» und «Brennstoff» gesetzt. Wenn Sie sie entfernen möchten, löschen Sie zuerst die Tankbestände auf der Seite des Gebäudes.'
				}
			}
		});
	});

	it('erklärt, warum eine verwendete Kategorie bleibt', async () => {
		const message = 'Die Kategorie wird von 1 Rechnung verwendet und kann nicht gelöscht werden.';
		const { result } = runAction(listActions.delete, '', 409, { id: 'c1' }, { error: message });

		expect(await result).toMatchObject({ status: 409, data: { error: message } });
	});
});

// #91: the categories a Mietvertrag can agree, named in the UI language
describe('Kategorien, die ein Mietvertrag vereinbaren kann', () => {
	const answer = (status = 200) =>
		(async (url: string) =>
			url === `${API}?limit=100`
				? Response.json(
						{
							categories: [
								{ ...contract, id: 'c1', nameDE: 'Internet' },
								{ ...contract, id: 'c2', nameDE: 'Verwaltung', isAllowedUtilityCost: false }
							]
						},
						{ status }
					)
				: Response.json({}, { status: 404 })) as typeof globalThis.fetch;

	it('nennt nur die umlagefähigen', async () => {
		expect(await agreeableCategories(answer())).toEqual([{ id: 'c1', name: 'Internet' }]);
	});

	// a list that failed to load would save every category as not agreed
	it('scheitert, wenn die Kategorien nicht geladen werden können', async () => {
		await expect(agreeableCategories(answer(500))).rejects.toMatchObject({
			status: 500,
			body: { message: 'Die Kategorien konnten nicht geladen werden. Laden Sie die Seite neu.' }
		});
	});
});
