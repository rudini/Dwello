import { describe, it, expect } from 'vitest';
import { actions, load } from '../routes/config/ki/+page.server';
import { runAction } from './helpers/action';
import settings from '../../tests/contracts/ki-settings.json';
import incomplete from '../../tests/contracts/ki-settings-incomplete.json';
import checked from '../../tests/contracts/ki-settings-check.json';
import loading from '../../tests/contracts/ki-model-loading.json';

const API = 'http://localhost:3001/api/v1';

const provider = {
	mode: 'provider',
	baseUrl: 'https://api.example.ch/v1',
	apiKey: 'geheim',
	model: 'bild-modell',
	provider: 'Muster KI AG',
	providerCountry: 'Deutschland',
	confirmed: 'on'
};

describe('Seite KI laden', () => {
	// #580: der API-Schlüssel verlässt den Server nie wieder (Fachreview 580 F-14)
	it('zeigt die KI-Einstellung und das KI-Modell, ohne API-Schlüssel', async () => {
		const fetch = (async (url: string) =>
			Response.json(url === `${API}/ki/model` ? loading : settings)) as typeof globalThis.fetch;

		const data = await load({ fetch } as never);

		expect(data).toEqual({
			ki: {
				mode: 'provider',
				baseUrl: 'https://api.example.ch/v1',
				model: 'bild-modell',
				provider: 'Muster KI AG',
				providerCountry: 'Deutschland',
				apiKeyStored: true,
				byOperator: false
			},
			model: { state: 'loading', percent: 40 }
		});
	});
});

describe('KI speichern', () => {
	it('schickt den Anbieter mit der Bestätigung', async () => {
		const { calls, result } = runAction(actions.save, '', 200, provider, settings);

		expect(await result).toEqual({ saved: true });
		expect(calls).toEqual([
			{
				method: 'PUT',
				url: `${API}/ki-settings`,
				body: { ...provider, confirmed: true }
			}
		]);
	});

	// Fachreview 580 F-2: ohne angekreuzte Bestätigung gilt sie als nicht gegeben
	it('schickt einen Anbieter ohne Häkchen als nicht bestätigt', async () => {
		const { calls, result } = runAction(
			actions.save,
			'',
			422,
			{ ...provider, confirmed: '' },
			incomplete
		);
		await result;

		expect(calls[0].body).toMatchObject({ confirmed: false });
	});

	it('nennt bei jedem fehlenden Feld, was fehlt', async () => {
		const { result } = runAction(actions.save, '', 422, provider, {
			...incomplete,
			params: { missing: 'baseUrl,model,provider,providerCountry,confirmed' }
		});

		expect(await result).toMatchObject({
			status: 422,
			data: {
				errors: {
					baseUrl:
						'Geben Sie die Adresse der KI an, die Ihnen der Anbieter nennt, zum Beispiel https://api.anbieter.ch/v1.',
					model: 'Geben Sie das Modell an. Wählen Sie eines, das Bilder liest.',
					provider: 'Geben Sie den Namen des Anbieters an. Die Datenschutzerklärung nennt ihn.',
					providerCountry:
						'Geben Sie das Land an, in dem der Anbieter die Daten bearbeitet. Die Datenschutzerklärung nennt es.',
					confirmed: 'Bestätigen Sie, dass Sie die drei Punkte zum Datenschutz geprüft haben.'
				}
			}
		});
	});

	// Fachreview 580 F-13
	it('verlangt den API-Schlüssel beim Feld, wenn sich die Adresse geändert hat', async () => {
		const { result } = runAction(
			actions.save,
			'',
			422,
			{ ...provider, apiKey: '' },
			{
				error: 'x',
				code: 'KI_KEY_FOR_NEW_ADDRESS',
				params: {}
			}
		);

		expect(await result).toMatchObject({
			data: {
				errors: {
					apiKey:
						'Geben Sie den API-Schlüssel erneut ein. Dwello schickt den gespeicherten Schlüssel nicht an eine andere Adresse.'
				}
			}
		});
	});

	it('sagt, wenn der Betreiber die KI festgelegt hat', async () => {
		const { result } = runAction(
			actions.save,
			'',
			409,
			{ mode: 'none' },
			{
				error: 'x',
				code: 'KI_SET_BY_OPERATOR',
				params: {}
			}
		);

		expect(await result).toMatchObject({
			data: {
				errors: {
					form: 'Die KI ist vom Betreiber in der Einstellungsdatei festgelegt und lässt sich hier nicht ändern.'
				}
			}
		});
	});

	it('schickt für die lokale KI nur die Wahl', async () => {
		const { calls, result } = runAction(
			actions.save,
			'',
			200,
			{ ...provider, mode: 'local' },
			settings
		);
		await result;

		expect(calls[0].body).toEqual({ mode: 'local' });
	});
});

describe('Verbindung prüfen', () => {
	it('sagt, was die Prüfung ergab und was zu tun ist', async () => {
		const { calls, result } = runAction(actions.check, '', 200, provider, checked);

		expect(await result).toEqual({
			check:
				'Der Anbieter lehnt den API-Schlüssel ab. Prüfen Sie den Schlüssel in Ihrem Konto beim Anbieter und geben Sie ihn erneut ein.'
		});
		expect(calls[0]).toMatchObject({ method: 'POST', url: `${API}/ki-settings/check` });
	});

	// Personas Anna P-5, Sven P-4: ohne Adresse gibt es nichts zu prüfen
	it('sagt ohne Adresse, dass sie fehlt, statt den Anbieter zu fragen', async () => {
		const { calls, result } = runAction(
			actions.check,
			'',
			200,
			{ ...provider, baseUrl: '' },
			checked
		);

		expect(await result).toMatchObject({
			data: {
				check:
					'Geben Sie die Adresse der KI an, die Ihnen der Anbieter nennt, zum Beispiel https://api.anbieter.ch/v1.'
			}
		});
		expect(calls).toEqual([]);
	});

	// Fachreview 580-2 F-16
	it('sagt, wenn eine neue Adresse den API-Schlüssel braucht', async () => {
		const { result } = runAction(
			actions.check,
			'',
			422,
			{ ...provider, apiKey: '' },
			{
				error: 'x',
				code: 'KI_KEY_FOR_NEW_ADDRESS',
				params: {}
			}
		);

		expect(await result).toMatchObject({
			data: {
				check:
					'Geben Sie den API-Schlüssel erneut ein. Dwello schickt den gespeicherten Schlüssel nicht an eine andere Adresse.'
			}
		});
	});
});

describe('KI-Modell herunterladen', () => {
	it('startet den Download', async () => {
		const { calls, result } = runAction(actions.download, '', 202, {}, loading);
		await result;

		expect(calls).toEqual([{ method: 'POST', url: `${API}/ki/model`, body: undefined }]);
	});
});
