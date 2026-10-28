import { describe, expect, it } from 'vitest';
import { LITERAL_UNION, classify, entityFiles } from './lib';

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

describe('LITERAL_UNION', () => {
	const unions = (text: string) => [...text.matchAll(LITERAL_UNION)].map((m) => m[0]);

	it('findet eine Werteliste als Union von Literalen', () => {
		expect(unions("type Status = 'draft' | 'sent' | 'paid';")).toEqual(["'draft' | 'sent' | 'paid'"]);
	});

	it('findet die Literale einer Union, die mit einem Typnamen beginnt', () => {
		expect(unions("type Shown = StatementStatus | 'overdue' | 'replaced';")).toEqual(["'overdue' | 'replaced'"]);
	});

	it('überspringt die Schlüssel von Pick und Omit, weil sie Feldnamen und keine Werte sind', () => {
		expect(unions("type A = Pick<ContractRow, 'id' | 'startDate'>; type B = Omit<Row, 'id' | 'name' | 'area'>;")).toEqual([]);
	});
});
