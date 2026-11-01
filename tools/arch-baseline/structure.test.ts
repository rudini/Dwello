import { describe, expect, it } from 'vitest';
import { abstractness, analyze, levels, markdown, report, snapshot } from './structure';

describe('levels', () => {
	it('gibt einem Modul ohne Abhängigkeit Level 1 und jedem Verwender eins mehr als seine höchste Abhängigkeit', () => {
		const l = levels(
			[
				{ from: 'be:routes/a', to: 'be:services/a' },
				{ from: 'be:services/a', to: 'db:schema' },
				{ from: 'be:routes/a', to: 'db:schema' }
			],
			[]
		);
		expect(Object.fromEntries(l)).toEqual({ 'db:schema': 1, 'be:services/a': 2, 'be:routes/a': 3 });
	});

	it('legt die Module eines Zyklus auf dasselbe Level', () => {
		const l = levels(
			[
				{ from: 'be:a', to: 'be:b' },
				{ from: 'be:b', to: 'be:a' },
				{ from: 'be:b', to: 'db:schema' },
				{ from: 'be:c', to: 'be:a' }
			],
			[{ modules: 'be:a be:b' }]
		);
		expect(Object.fromEntries(l)).toEqual({ 'db:schema': 1, 'be:a': 2, 'be:b': 2, 'be:c': 3 });
	});
});

describe('abstractness', () => {
	it('zählt exportierte Typen und Interfaces als abstrakt, Funktionen, Konstanten und Klassen als konkret', () => {
		const src = [
			'export interface Building { id: string }',
			'export type Status = "draft" | "sent";',
			'export abstract class Repo {}',
			'export function load() {}',
			'export async function save() {}',
			'export const x = 1;',
			'export class Service {}',
			'export default function page() {}',
			'type Local = string;',
			'export { a, b } from "./c";',
			'export type { D } from "./d";',
			'export type { E };'
		].join('\n');
		expect(abstractness(src)).toEqual({ abstract: 3, exports: 8 });
	});
});

const health = { findings: [], hotspots: [], health_score: { score: 90, grade: 'A' }, vital_signs: { duplication_pct: 1, maintainability_avg: 90 } };
const files = [
	{ path: 'backend/src/routes/a.ts', kind: 'prod', module: 'be:routes/a' },
	{ path: 'backend/src/services/a.ts', kind: 'prod', module: 'be:services/a' },
	{ path: 'backend/src/services/types.ts', kind: 'prod', module: 'be:services/a' },
	{ path: 'backend/src/db/schema.ts', kind: 'prod', module: 'db:schema' },
	{ path: 'tests/e2e/x.ts', kind: 'test', module: 'tests/e2e' }
];
const sources: Record<string, string> = {
	'backend/src/routes/a.ts': 'export const routes = 1;',
	'backend/src/services/a.ts': 'export function a() {}',
	'backend/src/services/types.ts': 'export interface A {}\nexport type B = string;\nexport type C = number;',
	'backend/src/db/schema.ts': 'export const t = 1;'
};
const edges = [
	{ from: 'be:routes/a', to: 'be:services/a', file_edges: '2' },
	{ from: 'be:services/a', to: 'db:schema', file_edges: '1' },
	{ from: 'tests/e2e', to: 'be:routes/a', file_edges: '1' }
];
const input = { edges, cycles: [], files, source: (p: string) => sources[p], health };

describe('analyze', () => {
	it('rechnet pro Produktivmodul Instabilität, Abstraktheit und Abstand zur Hauptreihe', () => {
		const m = Object.fromEntries(analyze(input).modules.map((x) => [x.name, x]));
		expect(Object.keys(m).sort()).toEqual(['be:routes/a', 'be:services/a', 'db:schema']);
		expect(m['be:services/a']).toMatchObject({ ca: 1, ce: 1, i: 0.5, a: 0.75, d: 0.25, level: 2, files: 2 });
		expect(m['db:schema']).toMatchObject({ ca: 1, ce: 0, i: 0, a: 0, d: 1 });
		expect(m['be:routes/a']).toMatchObject({ ca: 0, ce: 1, i: 1, a: 0, d: 0 });
	});
});

describe('Ampel', () => {
	it('bewertet Abstand, Komplexität und Hotspot je Modul und nimmt die schlechteste Farbe als Gesamtfarbe', () => {
		const h = {
			...health,
			findings: [
				{ path: 'backend/src/services/a.ts', name: 'a', cyclomatic: 22, cognitive: 22, severity: 'critical' },
				{ path: 'backend/src/routes/a.ts', name: 'r', cyclomatic: 12, cognitive: 16, severity: 'moderate' }
			],
			hotspots: [
				{ path: 'backend/src/routes/a.ts', score: 12 },
				{ path: 'backend/src/services/types.ts', score: 3 },
				{ path: 'tests/e2e/x.ts', score: 40 }
			]
		};
		const m = Object.fromEntries(analyze({ ...input, health: h }).modules.map((x) => [x.name, x]));
		expect(m['be:routes/a'].lights).toEqual({ distance: 'green', complexity: 'yellow', hotspot: 'yellow', fat: 'green', tests: 'green', coupling: 'green' });
		expect(m['be:services/a'].lights).toEqual({ distance: 'green', complexity: 'red', hotspot: 'green', fat: 'green', tests: 'green', coupling: 'green' });
		expect(m['db:schema'].lights).toEqual({ distance: 'yellow', complexity: 'green', hotspot: 'green', fat: 'green', tests: 'green', coupling: 'green' });
		expect([m['be:routes/a'].light, m['be:services/a'].light, m['db:schema'].light]).toEqual(['yellow', 'red', 'yellow']);
	});

	it('färbt einen grossen Abstand erst ab 5 Verwendern rot, darunter gelb', () => {
		const users = ['a', 'b', 'c', 'd'].map((x) => ({ path: `backend/src/routes/${x}x.ts`, kind: 'prod', module: `be:routes/${x}x` }));
		const more = {
			...input,
			files: [...files, ...users],
			source: (p: string) => sources[p] ?? 'export const r = 1;',
			edges: [...edges, ...users.map((u) => ({ from: u.module, to: 'db:schema', file_edges: '1' }))]
		};
		const schema = analyze(more).modules.find((m) => m.name === 'db:schema')!;
		expect(schema).toMatchObject({ ca: 5, d: 1 });
		expect(schema.lights.distance).toBe('red');
	});

	it('wertet ein Modul, von dem nichts abhängt, als instabil (I = 1), auch ohne eigene Abhängigkeiten', () => {
		const lone = { ...input, files: [...files, { path: 'src/routes/health/+server.ts', kind: 'prod', module: 'bff:endpoint/health' }], source: (p: string) => sources[p] ?? 'export function GET() {}' };
		expect(analyze(lone).modules.find((m) => m.name === 'bff:endpoint/health')).toMatchObject({ ca: 0, ce: 0, i: 1, d: 0, light: 'green' });
	});
});

describe('fallow ohne Hotspots', () => {
	it('wertet einen Stand, für den fallow keine Hotspots meldet, als hotspotfrei', () => {
		const { hotspots: _, ...noHotspots } = health;
		const m = analyze({ ...input, health: noHotspots as typeof health }).modules.find((x) => x.name === 'be:routes/a')!;
		expect(m).toMatchObject({ hotspot: 0, lights: { hotspot: 'green' } });
	});
});

describe('Kennzahlen', () => {
	it('gibt jeder Gesamtkennzahl eine Ampelfarbe: Zyklen im Produktivcode, Health-Score, Duplikate, Wartbarkeit', () => {
		const h = { ...health, health_score: { score: 75, grade: 'B' }, vital_signs: { duplication_pct: 6, maintainability_avg: 88 } };
		const cycles = [{ modules: 'be:routes/a be:services/a' }, { modules: 'e2e:questions e2e:tasks' }];
		const k = Object.fromEntries(analyze({ ...input, cycles, health: h }).kpis.map((x) => [x.key, x]));
		expect(k.tangles).toMatchObject({ value: 1, light: 'red' });
		expect(k.health).toMatchObject({ value: 75, light: 'yellow' });
		expect(k.duplication).toMatchObject({ value: 6, light: 'red' });
		expect(k.maintainability).toMatchObject({ value: 88, light: 'green' });
		expect(analyze(input).kpis.find((x) => x.key === 'tangles')).toMatchObject({ value: 0, light: 'green' });
	});
});

describe('report', () => {
	it('zeichnet das A/I-Diagramm mit Hauptreihe und einem Punkt pro Position, der die Module nennt', () => {
		const html = report(analyze(input));
		expect(html).toContain('id="ai-graph"');
		expect(html).toMatch(/<line[^>]*class="main-sequence"/);
		expect(html).toMatch(/<circle[^>]*><title>be:services\/a: I 0.5, A 0.75, D 0.25<\/title>/);
	});

	it('zeigt in der DSM eine Abhängigkeit gegen die Level-Ordnung als Rückkante, die übrigen nicht', () => {
		const cyclic = { ...input, edges: [...edges, { from: 'be:services/a', to: 'be:routes/a', file_edges: '1' }], cycles: [{ modules: 'be:routes/a be:services/a' }] };
		const cells = [...report(analyze(cyclic)).matchAll(/<rect class="cell( back)?"[^>]*><title>([^<]*)<\/title>/g)].map((m) => [m[2], !!m[1]]);
		expect(cells).toEqual(
			expect.arrayContaining([
				['be:services/a → db:schema: 1 import(s)', false],
				['be:routes/a → be:services/a: 2 import(s)', true]
			])
		);
		expect(cells.filter(([, back]) => back)).toHaveLength(1);
	});

	it('nennt die Abhängigkeiten zwischen den beiden DSM-Gruppen, die keine Matrix zeigt', () => {
		const cross = { ...input, files: [...files, { path: 'src/lib/types.ts', kind: 'prod', module: 'shared:types' }], source: (p: string) => sources[p] ?? 'export type T = 1;', edges: [...edges, { from: 'shared:types', to: 'be:services/a', file_edges: '1' }] };
		expect(report(analyze(cross))).toContain('Dependencies between the two groups, shown in neither matrix: 1');
	});

	it('listet die Funktionen über den Schwellen aus Produktivcode, die komplexeste zuerst', () => {
		const h = {
			...health,
			findings: [
				{ path: 'backend/src/routes/a.ts', name: 'small', cyclomatic: 12, cognitive: 16, severity: 'moderate' },
				{ path: 'tests/e2e/x.ts', name: 'test', cyclomatic: 30, cognitive: 30, severity: 'critical' },
				{ path: 'backend/src/services/a.ts', name: 'big', cyclomatic: 22, cognitive: 22, severity: 'critical' }
			]
		};
		const names = [...report(analyze({ ...input, health: h })).matchAll(/<tr><td><code>[^<]*<\/code><\/td><td><code>([^<]*)<\/code>/g)].map((m) => m[1]);
		expect(names).toEqual(['big', 'small']);
	});

	it('listet die Module mit der schlechtesten Ampel zuerst und schreibt die Farbe englisch aus', () => {
		const h = { ...health, findings: [{ path: 'backend/src/routes/a.ts', name: 'r', cyclomatic: 12, cognitive: 16, severity: 'moderate' }] };
		const rows = [...report(analyze({ ...input, health: h })).matchAll(/<tr class="module"><td>([^<]*)<\/td><td><span class="\w+">([^<]*)<\/span><\/td>/g)].map((m) => [m[1], m[2]]);
		expect(rows).toEqual([
			['be:routes/a', '● Yellow'],
			['db:schema', '● Yellow'],
			['be:services/a', '● Green']
		]);
	});
});

describe('snapshot', () => {
	it('fasst einen Stand zusammen: Kennzahlen, Ampelzählung, Funktionen über den Schwellen, I, A und D pro Modul', () => {
		const h = { ...health, findings: [{ path: 'backend/src/services/a.ts', name: 'a', cyclomatic: 22, cognitive: 22, severity: 'critical' }] };
		expect(snapshot(analyze({ ...input, health: h }), 'abc123', '2026-10-26')).toEqual({
			commit: 'abc123',
			date: '2026-10-26',
			kpis: { xs: 0, tangles: 0, health: 90, duplication: 1, maintainability: 90 },
			lights: { green: 1, yellow: 1, red: 1 },
			functions: 1,
			modules: { 'be:routes/a': [1, 0, 0], 'be:services/a': [0.5, 0.75, 0.25], 'db:schema': [0, 0, 1] }
		});
	});
});

const snap = (date: string, health: number, red: number, d: number) => ({
	commit: date,
	date,
	kpis: { xs: 3, tangles: 0, health, duplication: 1, maintainability: 90 },
	lights: { green: 5, yellow: 3, red },
	functions: 10,
	modules: { 'be:services/a': [0.5, 0.75, d] as [number, number, number], 'be:routes/a': [1, 0, 0] as [number, number, number] }
});

describe('report mit Verlauf', () => {
	it('zeichnet pro Kennzahl eine Linie mit einem Punkt pro Stand, der Datum und Wert nennt', () => {
		const html = report(analyze(input), [snap('2026-05-04', 70, 9, 0.8), snap('2026-10-26', 87.1, 4, 0.2)]);
		expect(html).toMatch(/<svg id="history-health"[\s\S]*?<title>2026-05-04: 70<\/title>[\s\S]*?<title>2026-10-26: 87.1<\/title>/);
		expect(html).toMatch(/<svg id="history-lights"[\s\S]*?<title>2026-05-04 red: 9<\/title>/);
		expect(html).toContain('id="history-functions"');
		expect(html).toContain('id="history-tangles"');
	});

	it('listet die Module, deren Abstand D sich seit dem ersten Stand am stärksten verändert hat, ohne unveränderte', () => {
		const html = report(analyze(input), [snap('2026-05-04', 70, 9, 0.8), snap('2026-08-03', 80, 6, 0.5), snap('2026-10-26', 87.1, 4, 0.2)]);
		const rows = [...html.matchAll(/<tr class="moved"><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td>/g)].map((m) => m.slice(1));
		expect(rows).toEqual([['be:services/a', '0.8', '0.25']]);
	});
});

describe('markdown', () => {
	it('gibt den Verlauf als Tabelle aus, eine Zeile pro Stand, der neueste zuerst', () => {
		expect(markdown([snap('2026-05-04', 70, 9, 0.8), snap('2026-10-26', 87.1, 4, 0.2)]).split('\n')).toEqual([
			'| Date | XS % | Health score | Functions above thresholds | Green | Yellow | Red | Tangles |',
			'|---|---|---|---|---|---|---|---|',
			'| 2026-10-26 | 3 | 87.1 | 10 | 5 | 3 | 4 | 0 |',
			'| 2026-05-04 | 3 | 70 | 10 | 5 | 3 | 9 | 0 |'
		]);
	});
});

describe('Verlauf: Reihenfolge und Zeitachse', () => {
	it('ordnet Stände nach Zeitpunkt, auch zwei vom selben Tag, unabhängig von der Reihenfolge der Eingabe', () => {
		const late = snap('2026-10-26T17:00:00Z', 87.1, 4, 0.2), early = snap('2026-10-26T08:00:00Z', 80, 6, 0.8);
		const [, , first] = markdown([late, early]).split('\n');
		expect(first).toBe('| 2026-10-26 | 3 | 87.1 | 10 | 5 | 3 | 4 | 0 |');
		const rows = [...report(analyze(input), [late, early]).matchAll(/<tr class="moved"><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td>/g)].map((m) => m.slice(1));
		expect(rows).toEqual([['be:services/a', '0.8', '0.25']]);
	});

	it('setzt die Punkte nach der Zeit, so dass eine Pause als Lücke erscheint', () => {
		const html = report(analyze(input), [snap('2026-01-01', 70, 9, 0.8), snap('2026-01-02', 71, 9, 0.8), snap('2026-01-31', 80, 4, 0.2)]);
		const cx = [...html.matchAll(/<circle cx="([\d.]+)"[^>]*><title>2026-01-\d\d: (?:70|71|80)<\/title>/g)].map((m) => Number(m[1]));
		expect(cx).toHaveLength(3);
		expect(cx[1] - cx[0]).toBeLessThan((cx[2] - cx[1]) / 10);
	});
});

describe('Verlauf: D jetzt', () => {
	it('nimmt «D now» aus dem analysierten Stand, nicht aus dem neuesten Stand des Verlaufs', () => {
		const at = (date: string, d: number) => ({ ...snap(date, 80, 4, 0), modules: { 'be:services/a': [0.5, 0.75, d] as [number, number, number] } });
		const html = report(analyze(input), [at('2026-10-01', 0.8), at('2026-11-01', 0.6)]);
		const rows = [...html.matchAll(/<tr class="moved"><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td>/g)].map((m) => m.slice(1));
		expect(rows).toEqual([['be:services/a', '0.8', '0.25']]);
	});
});

describe('XS (Fat und Tangles)', () => {
	it('zählt den Überschuss zu grosser Module, Dateien und Funktionen und ganzer Zyklen als Anteil der Codezeilen', () => {
		const ui = Array.from({ length: 40 }, (_, k) => ({ path: `src/lib/ui/C${k}.svelte`, kind: 'prod', module: 'fe:ui', loc: '10' }));
		const xsInput = {
			...input,
			files: [
				{ path: 'backend/src/services/big.ts', kind: 'prod', module: 'be:services/big', loc: '600' },
				{ path: 'backend/src/services/ok.ts', kind: 'prod', module: 'be:services/ok', loc: '200' },
				{ path: 'backend/src/routes/x.ts', kind: 'prod', module: 'be:routes/x', loc: '100' },
				{ path: 'backend/src/routes/y.ts', kind: 'prod', module: 'be:routes/y', loc: '100' },
				{ path: 'messages/de.json', kind: 'prod', module: 'fe:i18n', loc: '5000' },
				...ui
			],
			edges: [
				{ from: 'be:routes/x', to: 'be:routes/y', file_edges: '1' },
				{ from: 'be:routes/y', to: 'be:routes/x', file_edges: '1' }
			],
			cycles: [{ modules: 'be:routes/x be:routes/y' }],
			source: () => 'export const a = 1;',
			health: { ...health, findings: [{ path: 'backend/src/services/ok.ts', name: 'f', cyclomatic: 40, cognitive: 10, severity: 'high', line_count: 50 }] }
		};
		const a = analyze(xsInput);
		const m = Object.fromEntries(a.modules.map((x) => [x.name, x]));
		// big.ts: 600 - 400 = 200; ok.ts: f with cyclomatic 40 / 20 → half of its 50 lines; x, y: whole cycle; fe:ui: 40 files / 30 → a quarter of 400
		expect([m['be:services/big'].xs, m['be:services/ok'].xs, m['be:routes/x'].xs, m['fe:ui'].xs, m['fe:i18n'].xs]).toEqual([33.3, 12.5, 100, 25, 0]);
		expect(a.kpis.find((k) => k.key === 'xs')).toMatchObject({ value: 37.5, light: 'red' });
		expect([m['be:services/big'].lights.fat, m['be:services/ok'].lights.fat, m['be:routes/x'].lights.fat, m['fe:ui'].lights.fat]).toEqual(['yellow', 'green', 'red', 'red']);
	});
});

describe('Testabdeckung (statisch)', () => {
	it('zeigt pro Modul den Anteil der Dateien, die kein Test erreicht, und die Abdeckung des Codes als Kennzahl', () => {
		const gaps = { summary: { file_coverage_pct: 80 }, files: [{ path: 'backend/src/services/types.ts' }, { path: 'backend/src/routes/a.ts' }] };
		const a = analyze({ ...input, gaps });
		const m = Object.fromEntries(a.modules.map((x) => [x.name, x]));
		expect([m['be:services/a'].untested, m['be:routes/a'].untested, m['db:schema'].untested]).toEqual([50, 100, 0]);
		expect([m['be:services/a'].lights.tests, m['be:routes/a'].lights.tests, m['db:schema'].lights.tests]).toEqual(['yellow', 'red', 'green']);
		expect(a.kpis.find((k) => k.key === 'reach')).toMatchObject({ value: 80, light: 'yellow' });
	});
});

describe('Versteckte Kopplung', () => {
	it('zählt Dateipaare, die oft gemeinsam geändert werden, aus Modulen ohne Import zwischen ihnen', () => {
		const pair = (path_a: string, path_b: string) => ({ path_a, path_b, shared_revisions: 6, degree: 0.5 });
		const change_coupling = {
			pairs: [
				pair('backend/src/routes/a.ts', 'backend/src/db/schema.ts'),
				pair('backend/src/services/a.ts', 'backend/src/db/schema.ts'),
				pair('backend/src/services/a.ts', 'backend/src/services/types.ts'),
				pair('backend/src/routes/a.ts', 'tests/e2e/x.ts')
			]
		};
		const a = analyze({ ...input, health: { ...health, change_coupling } });
		const m = Object.fromEntries(a.modules.map((x) => [x.name, x]));
		expect([m['be:routes/a'].hidden, m['db:schema'].hidden, m['be:services/a'].hidden]).toEqual([1, 1, 0]);
		expect([m['be:routes/a'].lights.coupling, m['be:services/a'].lights.coupling]).toEqual(['yellow', 'green']);
		expect(a.kpis.find((k) => k.key === 'hidden')).toMatchObject({ value: 1, light: 'green' });
	});
});

describe('report: neue Spalten und Verlauf', () => {
	it('zeigt pro Modul XS, ungetestete Dateien und versteckte Kopplung mit Ampel und zeichnet den XS-Verlauf', () => {
		const gaps = { summary: { file_coverage_pct: 80 }, files: [{ path: 'backend/src/routes/a.ts' }] };
		const html = report(analyze({ ...input, gaps }), [snap('2026-05-04', 70, 9, 0.8), snap('2026-10-26', 87.1, 4, 0.2)]);
		const row = html.match(/<tr class="module"><td>be:routes\/a<\/td>.*?<\/tr>/)![0];
		expect(row).toContain('<td><span class="green">0</span></td><td><span class="red">100</span></td><td><span class="green">0</span></td>');
		expect(html).toContain('id="history-xs"');
	});
});

describe('report: DSM aufklappen', () => {
	it('verlinkt jede Zelle auf die Datei-Imports dahinter und listet pro Modul seine Dateien', () => {
		const fileEdges = [
			{ from: 'backend/src/routes/a.ts', to: 'backend/src/services/a.ts', from_module: 'be:routes/a', to_module: 'be:services/a' },
			{ from: 'backend/src/routes/a.ts', to: 'backend/src/services/types.ts', from_module: 'be:routes/a', to_module: 'be:services/a' },
			{ from: 'tests/e2e/x.ts', to: 'backend/src/routes/a.ts', from_module: 'tests/e2e', to_module: 'be:routes/a' }
		];
		const html = report(analyze({ ...input, fileEdges }));
		expect(html).toMatch(/<a href="#dep-be-routes-a--be-services-a"><rect class="cell"/);
		const dep = html.match(/<h4 id="dep-be-routes-a--be-services-a">[\s\S]*?<\/ul>/)![0];
		expect([...dep.matchAll(/<li><code>([^<]*)<\/code> → <code>([^<]*)<\/code><\/li>/g)].map((m) => `${m[1]} → ${m[2]}`)).toEqual([
			'backend/src/routes/a.ts → backend/src/services/a.ts',
			'backend/src/routes/a.ts → backend/src/services/types.ts'
		]);
		expect(html.match(/<details id="m-be-services-a">[\s\S]*?<\/details>/)![0]).toContain('<code>backend/src/services/types.ts</code>');
		expect(html).not.toContain('tests/e2e/x.ts');
	});
});

describe('Versteckte Kopplung: Framework', () => {
	it('zählt kein Paar aus demselben Ordner, das SvelteKit ohne Import verbindet (Seite und Lade-Funktion)', () => {
		const route = [
			{ path: 'src/routes/x/+page.svelte', kind: 'prod', module: 'fe:routes/x' },
			{ path: 'src/routes/x/+page.server.ts', kind: 'prod', module: 'bff:load/x' }
		];
		const change_coupling = { pairs: [{ path_a: 'src/routes/x/+page.svelte', path_b: 'src/routes/x/+page.server.ts', shared_revisions: 9, degree: 0.8 }] };
		const a = analyze({ ...input, files: [...files, ...route], source: () => '', health: { ...health, change_coupling } });
		expect(a.kpis.find((k) => k.key === 'hidden')).toMatchObject({ value: 0 });
	});
});
