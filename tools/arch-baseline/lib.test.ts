import { describe, expect, it } from 'vitest';
import { classify, entityFiles } from './lib';

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

// Ä1 (#843, product owner 26.10.2026): a file copies an entity's field only where it declares another field of it too
describe('entityFiles', () => {
	it('zählt eine Datei nur für die Felder einer Tabelle, von der sie mindestens zwei deklariert', () => {
		const files = new Map([
			['value', ['settings.ts', 'chart.ts']],
			['key', ['settings.ts']]
		]);
		expect(entityFiles(files)).toEqual(
			new Map([
				['value', ['settings.ts']],
				['key', ['settings.ts']]
			])
		);
	});
});
