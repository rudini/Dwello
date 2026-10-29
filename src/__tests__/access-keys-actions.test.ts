import { describe, expect, it } from 'vitest';
import { actions } from '../routes/config/access-keys/+page.server';
import { runAction } from './helpers/action';
import created from '../../tests/contracts/access-key-created.json';

const API = 'http://localhost:3001/api/v1/access-keys';

// #817, code review 817-1 C-2: what the dialogs of «Zugangsschlüssel für KI-Programme» get back
describe('Zugangsschlüssel erstellen', () => {
	it('gibt den neuen Schlüssel einmal an die Seite', async () => {
		const { calls, result } = runAction(
			actions.create,
			'',
			201,
			{ name: 'Claude Desktop Büro' },
			created
		);

		expect(await result).toEqual({ created: { name: created.name, key: created.key } });
		expect(calls).toEqual([{ method: 'POST', url: API, body: { name: 'Claude Desktop Büro' } }]);
	});

	it('sagt, warum das Backend ablehnt', async () => {
		const { result } = runAction(
			actions.create,
			'',
			422,
			{ name: '' },
			{ code: 'ACCESS_KEY_NAME_MISSING', params: {} }
		);

		expect(await result).toMatchObject({
			status: 422,
			data: { createError: 'Geben Sie dem Zugangsschlüssel einen Namen.' }
		});
	});

	it('sagt ohne bekannten Code, dass nichts erstellt wurde', async () => {
		const { result } = runAction(actions.create, '', 500, { name: 'Büro' }, { error: 'boom' });

		expect(await result).toMatchObject({
			status: 500,
			data: { createError: 'Der Zugangsschlüssel wurde nicht erstellt. Versuchen Sie es erneut.' }
		});
	});
});

describe('Zugangsschlüssel widerrufen', () => {
	it('widerruft den Schlüssel', async () => {
		const { calls, result } = runAction(actions.revoke, '', 200, { id: 'k1' }, { id: 'k1' });

		expect(await result).toEqual({ revoked: true });
		expect(calls).toEqual([{ method: 'DELETE', url: `${API}/k1`, body: undefined }]);
	});

	it('gilt als erledigt, wenn der Schlüssel schon widerrufen ist', async () => {
		const { result } = runAction(actions.revoke, '', 404, { id: 'k1' });

		expect(await result).toEqual({ revoked: true });
	});

	it('sagt bei einem anderen Fehler, dass nichts widerrufen wurde', async () => {
		const { result } = runAction(actions.revoke, '', 500, { id: 'k1' });

		expect(await result).toMatchObject({
			status: 500,
			data: { revokeError: 'Der Zugangsschlüssel wurde nicht widerrufen. Versuchen Sie es erneut.' }
		});
	});
});
