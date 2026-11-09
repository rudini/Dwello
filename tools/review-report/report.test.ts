import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { comment, dsmDiff, erDiagram, GATE_FILE, html, flowDiagram, flowsFor, inComment, moduleDiagram, type Tree } from './report';

const edge = (from: string, to: string) => ({ from, to });

describe('Modul-Abhängigkeiten im Prüfbericht (#1273)', () => {
	it('zeigt neue Kanten grün und entfernte rot, nur an geänderten Modulen; unveränderte Kanten nicht', () => {
		const base = [edge('fe:a', 'fe:b'), edge('fe:b', 'fe:c'), edge('fe:x', 'fe:y')];
		const head = [edge('fe:a', 'fe:b'), edge('fe:a', 'fe:c')];
		const d = moduleDiagram({ edges: base, cycles: [] }, { edges: head, cycles: [] }, ['fe:a', 'fe:b']);
		expect(d.nodes).toEqual(['fe:a', 'fe:b', 'fe:c']);
		expect(d.mermaid.split('\n')).toEqual([
			'flowchart LR',
			'  n0["fe:a"]',
			'  n1["fe:b"]',
			'  n2["fe:c"]',
			'  n0 -->|new| n2',
			'  n1 -.->|removed| n2',
			'  linkStyle 0 stroke:#1a7f37,stroke-width:2px',
			'  linkStyle 1 stroke:#cf222e,stroke-width:2px'
		]);
	});

	it('nennt einen neuen Zyklus', () => {
		const d = moduleDiagram({ edges: [], cycles: [] }, { edges: [edge('fe:a', 'fe:b'), edge('fe:b', 'fe:a')], cycles: ['fe:a fe:b'] }, ['fe:a']);
		expect(d.notes).toEqual(['New cycle: fe:a fe:b']);
	});

	it('nennt eine neue Kante gegen die Schichtrichtung', () => {
		const d = moduleDiagram({ edges: [], cycles: [] }, { edges: [edge('fe:lib/ui', 'bff:lib/server'), edge('shared:types', 'fe:lib/ui')], cycles: [] }, ['fe:lib/ui']);
		expect(d.notes).toEqual(['Against the layer direction: fe:lib/ui → bff:lib/server', 'Against the layer direction: shared:types → fe:lib/ui']);
	});
});

describe('Grösse eines Diagramms im Kommentar (#1273)', () => {
	it('zeigt ein Diagramm bis 30 Knoten und fasst ein grösseres zusammen, mit Verweis auf den HTML-Bericht', () => {
		const small = { mermaid: 'flowchart LR', nodes: ['a'], notes: [] };
		expect(inComment('Modules', small)).toBe('### Modules\n\n```mermaid\nflowchart LR\n```\n');
		const big = { ...small, nodes: Array.from({ length: 31 }, (_, i) => `m${i}`), notes: ['New cycle: a b'] };
		expect(inComment('Modules', big)).toBe('### Modules\n\n31 nodes, too many for the comment: see the full diagram in the HTML report (artifact «review-report»).\n\n- New cycle: a b\n');
	});
});

describe('Datenmodell im Prüfbericht (#1273)', () => {
	const table = (name: string, body: string) => `export const ${name} = pgTable('${name}', {\n${body}});\n`;
	const base =
		table('buildings', '\tid: uuid(\'id\'),\n') +
		table('tenants', '\tid: uuid(\'id\'),\n\tname: text(\'name\'),\n') +
		table('fuelStocks', '\tid: uuid(\'id\'),\n');
	const head =
		table('buildings', '\tid: uuid(\'id\'),\n') +
		table('tenants', '\tid: uuid(\'id\'),\n\tmailCountry: text(\'mail_country\'),\n') +
		table('meters', '\tid: uuid(\'id\'),\n\tbuildingId: uuid(\'building_id\').references(() => buildings.id),\n');

	it('zeigt neue, geänderte und entfernte Tabellen mit ihren Feldern und Beziehungen, unveränderte nur als Ziel einer Beziehung', () => {
		const d = erDiagram(base, head, ['backend/migrations/0042_meters.sql']);
		expect(d.nodes).toEqual(['fuelStocks', 'meters', 'tenants', 'buildings']);
		expect(d.mermaid.split('\n')).toEqual([
			'erDiagram',
			'  t0["fuelStocks (removed)"] {',
			'    col id "removed"',
			'  }',
			'  t1["meters (new)"] {',
			'    col id "new"',
			'    col buildingId "new"',
			'  }',
			'  t2["tenants"] {',
			'    col id',
			'    col mailCountry "new"',
			'    col name "removed"',
			'  }',
			'  t3["buildings"]',
			'  t3 ||--o{ t1 : "new"'
		]);
		expect(d.notes).toEqual(['New migration: backend/migrations/0042_meters.sql']);
		const kept = erDiagram(head, head.replace("\tbuildingId:", "\tserial: text('serial'),\n\tbuildingId:"), []);
		expect(kept.mermaid).toContain('t1 ||--o{ t0 : "references"');
	});

	it('hat ohne geänderte Tabelle keine Knoten', () => {
		expect(erDiagram(base, base, []).nodes).toEqual([]);
	});
});

describe('Ablauf pro geänderter Route im Prüfbericht (#1273)', () => {
	const tree = (files: Record<string, string>, imports: [string, string][]): Tree => ({ read: (p) => files[p], files: Object.keys(files), imports: imports.map(([from, to]) => ({ from, to })) });
	const page = 'src/routes/buildings/+page.server.ts';
	const route = 'backend/src/routes/buildings.ts';
	const files = {
		[page]: "import { list } from '$lib/server/buildings';",
		'src/lib/server/buildings.ts': 'fetch(`${BACKEND_URL}/api/v1/buildings?x`)',
		[route]: "new Elysia({ prefix: '/api/v1/buildings' })",
		'backend/src/services/building.service.ts': "import { buildings, type Building } from '../db/schema';"
	};
	const imports: [string, string][] = [
		[page, 'src/lib/server/buildings.ts'],
		[route, 'backend/src/services/building.service.ts']
	];

	it('zeigt den Weg vom Browser bis zu den Tabellen und markiert einen neuen Aufruf grün, einen entfernten rot', () => {
		const head = tree({ ...files, 'src/lib/server/buildings.ts': files['src/lib/server/buildings.ts'] + ' fetch(`${BACKEND_URL}/api/v1/tenants`)', 'backend/src/routes/tenants.ts': "new Elysia({ prefix: '/api/v1/tenants' })" }, imports);
		const base = tree({ ...files, 'backend/src/services/building.service.ts': "import { buildings, apartments } from '../db/schema';" }, imports);
		const d = flowDiagram(base, head, page);
		expect(d.mermaid.split('\n')).toEqual([
			'sequenceDiagram',
			'  participant p0 as Browser',
			'  participant p1 as src/routes/buildings/+page.server.ts',
			'  participant p2 as backend/src/routes/buildings.ts',
			'  participant p3 as backend/src/services/building.service.ts',
			'  participant p4 as Database',
			'  participant p5 as backend/src/routes/tenants.ts',
			'  p0->>p1: request',
			'  p1->>p2: /api/v1/buildings',
			'  p2->>p3: call',
			'  p3->>p4: buildings',
			'  rect rgb(218, 251, 225)',
			'  p1->>p5: /api/v1/tenants (new)',
			'  end',
			'  rect rgb(255, 235, 233)',
			'  p3->>p4: apartments (removed)',
			'  end'
		]);
		expect(d.nodes).toHaveLength(6);
	});

	it('erkennt Aufrufe über eine Konstante mit /api/v1 und Elysia-Routen mit dem Präfix /api/v1 allein', () => {
		const t = tree(
			{
				[page]: "const API = `${BACKEND_URL}/api/v1`;\nfetch(`${API}/reports/1`);",
				'backend/src/routes/reports.ts': "new Elysia({ prefix: '/api/v1' }).get('/reports/:id', x)"
			},
			[]
		);
		expect(flowDiagram(tree({}, []), t, page).mermaid).toContain('p1->>p2: /api/v1/reports (new)');
	});

	it('markiert bei einer neuen Route auch den Aufruf aus dem Browser als neu', () => {
		expect(flowDiagram(tree({}, []), tree(files, imports), page).mermaid).toContain('p0->>p1: request (new)');
	});

	it('findet zu einer geänderten Elysia-Route die BFF-Dateien, die sie aufrufen', () => {
		expect(flowsFor(tree(files, imports), [route])).toEqual([page]);
		expect(flowsFor(tree(files, imports), ['src/lib/ui/Button.svelte'])).toEqual([]);
	});
});

describe('Kommentar des Prüfberichts (#1273)', () => {
	const empty = { mermaid: '', nodes: [], notes: [] };
	const input = {
		body: '## Type\n\nNFR: nfr:maintainability\n\n## Decisions\n\n- one table, not two\n\n## Other\n\nx',
		labels: ['nfr:maintainability'],
		changed: ['tests/e2e/features/rechnungen.feature', 'tests/e2e/steps/invoices.steps.ts', '.github/workflows/ci.yml', 'src/lib/a.ts'],
		modules: { mermaid: 'flowchart LR', nodes: ['fe:lib'], notes: [] },
		flows: [],
		er: empty,
		fitness: ['error [structure-xs] XS rises'],
		structure: '| Indicator | Base | Pull request |',
		run: 'https://github.com/rudini/Dwello/actions/runs/1'
	};

	it('nennt Einordnung, Szenarien, Schrittdefinitionen, Prüfdateien, Kennzahlen, Entscheide und Risiken, mit einer Markierung zum Ersetzen', () => {
		const text = comment(input);
		expect(text.startsWith('<!-- review-report -->\n## Reviewer report')).toBe(true);
		for (const part of [
			'**Type:** NFR: nfr:maintainability · **Issue label:** nfr:maintainability',
			'### Scenarios and step definitions\n\n- `tests/e2e/features/rechnungen.feature`\n- `tests/e2e/steps/invoices.steps.ts`',
			'### Gate files\n\n- `.github/workflows/ci.yml`',
			'- error [structure-xs] XS rises',
			'| Indicator | Base | Pull request |',
			'### Decisions\n\n- one table, not two',
			'### Risks\n\n_Not given._',
			'```mermaid\nflowchart LR\n```',
			'### Data model\n\n_Not touched._',
			'[HTML report and run](https://github.com/rudini/Dwello/actions/runs/1)'
		])
			expect(text).toContain(part);
	});

	it('zeigt nur Abläufe mit geänderten Aufrufen, nennt die übrigen und fasst sie über 30 Knoten zusammen', () => {
		const flow = (n: number, changes: number) => ({ mermaid: 'sequenceDiagram', nodes: Array.from({ length: n }, (_, i) => `p${i}`), notes: [], changes });
		const text = comment({ ...input, flows: [{ route: 'src/routes/a/+page.server.ts', diagram: flow(5, 1) }, { route: 'src/routes/b/+page.server.ts', diagram: flow(5, 0) }] });
		expect(text).toContain('### Flow of src/routes/a/+page.server.ts\n\n```mermaid\nsequenceDiagram\n```');
		expect(text).toContain('Flows without a changed call: `src/routes/b/+page.server.ts`');
		const many = comment({ ...input, flows: Array.from({ length: 4 }, (_, i) => ({ route: `r${i}`, diagram: flow(8, 2) })) });
		expect(many).toContain('### Flows\n\n4 routes with changed calls, 32 nodes, too many for the comment: see the HTML report (artifact «review-report»).\n\n- `r0`: 2 changed calls');
		expect(many).not.toContain('```mermaid\nsequenceDiagram');
	});

	it('nennt eine neue Migration auch ohne geänderte Tabelle', () => {
		const text = comment({ ...input, er: { mermaid: '', nodes: [], notes: ['New migration: backend/migrations/0042_data.sql'] } });
		expect(text).toContain('### Data model\n\n_Not touched._\n\n- New migration: backend/migrations/0042_data.sql');
	});

	it('erkennt dieselben Prüfdateien wie die Prüfung «Gate change approved» (check-issues.mjs)', () => {
		const script = readFileSync(new URL('../open-work/check-issues.mjs', import.meta.url), 'utf8');
		expect(script).toContain(`const gateFile =\n\t${GATE_FILE.toString()};`);
	});
});

describe('HTML-Bericht (#1273)', () => {
	const big = { mermaid: 'flowchart LR\n  n0["m0"]', nodes: Array.from({ length: 31 }, (_, i) => `m${i}`), notes: [] };
	const r = { body: '', labels: [], changed: [], modules: big, flows: [], er: { mermaid: '', nodes: [], notes: [] }, fitness: [], structure: '', run: '' };

	it('zeigt auch ein Diagramm über 30 Knoten ganz und die geänderten Zellen der DSM', () => {
		const dsm = dsmDiff([{ from: 'fe:a', to: 'fe:b', weight: 2 }, { from: 'fe:a', to: 'fe:c', weight: 1 }], [{ from: 'fe:a', to: 'fe:b', weight: 3 }, { from: 'fe:a', to: 'fe:c', weight: 1 }, { from: 'fe:d', to: 'fe:a', weight: 1 }]);
		expect(dsm.split('\n')).toEqual(['| From | To | Base | Pull request |', '|---|---|---|---|', '| fe:a | fe:b | 2 | 3 |', '| fe:d | fe:a | 0 | 1 |']);
		const page = html({ ...r, dsm });
		expect(page).toContain('flowchart LR\\n  n0[\\"m0\\"]');
		expect(page).not.toContain('too many for the comment');
		expect(page).toContain('| fe:d | fe:a | 0 | 1 |');
		// HTML in the pull request text stays text: marked renders raw HTML escaped
		expect(page).toContain("marked.use({ renderer: { html: (html) => html.replace(/</g, '&lt;') } });");
	});
});

describe('Fitness-Schritt mit den Daten des Prüfberichts (#1273)', () => {
	it('behält den Exit-Code der Fitness, obwohl tee ihre Ausgabe mitschreibt', () => {
		const ci = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');
		const step = ci.slice(ci.indexOf('- name: Architecture fitness'), ci.indexOf('esac', ci.indexOf('- name: Architecture fitness')));
		expect(step).toContain('| tee build/review/fitness.txt');
		expect(step).toMatch(/run: \|\n {10}set -o pipefail/);
		// Dependabot gets a read-only token: no comment job for it
		const job = ci.slice(ci.indexOf('  review-comment:'), ci.indexOf('    runs-on:', ci.indexOf('  review-comment:')));
		expect(job).toContain("github.actor != 'dependabot[bot]'");
	});
});
