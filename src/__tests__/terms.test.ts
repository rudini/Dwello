import { afterEach, describe, it, expect } from 'vitest';
import { load } from '../routes/terms/+page.server';

const keys = ['OPERATOR_NAME', 'OPERATOR_ADDRESS', 'OPERATOR_CONTACT'] as const;
const saved = keys.map((key) => process.env[key]);
afterEach(() =>
	keys.forEach((key, i) => (saved[i] === undefined ? delete process.env[key] : (process.env[key] = saved[i])))
);

describe('Nutzungsbedingungen laden', () => {
	it('nennt den Betreiber mit Adresse und Kontakt aus der Konfiguration', () => {
		Object.assign(process.env, {
			OPERATOR_NAME: 'Muster Hosting AG',
			OPERATOR_ADDRESS: 'Bahnhofstrasse 1, 8001 Zürich',
			OPERATOR_CONTACT: 'betrieb@muster-hosting.ch'
		});

		expect(load({} as never)).toEqual({
			operator: {
				name: 'Muster Hosting AG',
				address: 'Bahnhofstrasse 1, 8001 Zürich',
				contact: 'betrieb@muster-hosting.ch'
			}
		});
	});

	it('nennt keinen Betreiber, solange keiner konfiguriert ist', () => {
		keys.forEach((key) => delete process.env[key]);

		expect(load({} as never)).toEqual({ operator: null });
	});
});
