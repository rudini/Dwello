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

	// #1052: a fat module splits along the folders or families that already group it
	it('teilt die Seiten der Abrechnungen und der Einstellungen nach ihren Ordnern in eigene Module', () => {
		expect(
			[
				'src/routes/statements/+page.svelte',
				'src/routes/statements/[id]/+page.svelte',
				'src/routes/statements/generate/+page.svelte',
				'src/routes/config/+page.svelte',
				'src/routes/config/categories/+page.svelte'
			].map((p) => classify(p).module)
		).toEqual(['fe:routes/statements', 'fe:routes/statements/[id]', 'fe:routes/statements/generate', 'fe:routes/config', 'fe:routes/config/categories']);
	});

	it('teilt die UI-Komponenten in Formular, Navigation und Grundbausteine', () => {
		expect(['src/lib/ui/TextInput.svelte', 'src/lib/ui/field.ts', 'src/lib/ui/NavList.svelte', 'src/lib/ui/Button.svelte'].map((p) => classify(p).module)).toEqual([
			'fe:ui/form',
			'fe:ui/form',
			'fe:ui/navigation',
			'fe:ui'
		]);
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

	it('überspringt die Schlüssel von Pick auch bei einem generischen ersten Typargument', () => {
		expect(unions("type A = Pick<Json<Row>, 'a' | 'b'>; type B = Pick<Awaited<ReturnType<typeof f>>[number], 'c' | 'd'>;")).toEqual([]);
	});

	it('findet eine Werteliste nach einem Pick, dessen Schlüssel kein Literal sind', () => {
		expect(unions("function f(row: Pick<Row, Keys>, s: 'a' | 'b') {} type T = Pick<A, K> | Record<string, 'x' | 'y'>;")).toEqual(["'a' | 'b'", "'x' | 'y'"]);
	});
});
