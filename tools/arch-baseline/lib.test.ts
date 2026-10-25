import { describe, expect, it } from 'vitest';
import { classify } from './lib';

describe('classify', () => {
	it('ordnet einen Endpunkt +server.ts unter src/routes einem BFF-Modul zu', () => {
		expect(classify('src/routes/statements/[id]/pdf/+server.ts')).toMatchObject({
			layer: 'BFF',
			module: 'bff:endpoint/statements'
		});
	});

	it('lässt die Endpunkte unter src/routes/auth im Modul bff:auth', () => {
		expect(classify('src/routes/auth/login/+server.ts').module).toBe('bff:auth');
	});

	it('zählt die Demo-Daten zum Tooling, nicht zur Datenbank-Schicht', () => {
		expect(classify('backend/src/db/demo-data.ts')).toEqual({
			layer: 'Tooling',
			kind: 'other',
			module: 'backend/demo'
		});
	});
});
