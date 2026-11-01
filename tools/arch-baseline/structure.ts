// Structure report: levels, tangles, abstractness and instability, traffic lights, as one HTML page.
// Usage: bun run structure:report   (writes build/structure/index.html)

type Edge = { from: string; to: string };
type Health = {
	findings: { path: string; name: string; cyclomatic: number; cognitive: number; severity: string }[];
	hotspots: { path: string; score: number }[];
	health_score: { score: number; grade: string };
	vital_signs: { duplication_pct: number; maintainability_avg: number };
};
export type Input = {
	edges: (Edge & { file_edges: string })[];
	cycles: { modules: string }[];
	files: { path: string; kind: string; module: string }[];
	source: (path: string) => string;
	health: Health;
};
export type Light = 'green' | 'yellow' | 'red';
export type Module = {
	name: string;
	files: number;
	level: number;
	ca: number;
	ce: number;
	i: number;
	a: number;
	d: number;
	findings: number;
	hotspot: number;
	lights: { distance: Light; complexity: Light; hotspot: Light };
	light: Light;
};

/** Lakos level per module: 1 without dependencies, else 1 + the highest level it uses; a cycle shares one level. */
export function levels(edges: Edge[], cycles: { modules: string }[]): Map<string, number> {
	const rep = new Map(cycles.flatMap((c) => c.modules.split(' ').map((m) => [m, c.modules.split(' ')[0]] as const)));
	const node = (m: string) => rep.get(m) ?? m;
	const deps = new Map<string, Set<string>>();
	for (const e of edges) {
		const [a, b] = [node(e.from), node(e.to)];
		deps.set(b, deps.get(b) ?? new Set());
		if (a !== b) deps.set(a, (deps.get(a) ?? new Set()).add(b));
	}
	const memo = new Map<string, number>();
	const level = (n: string): number => {
		if (!memo.has(n)) memo.set(n, 1 + Math.max(0, ...[...deps.get(n)!].map(level)));
		return memo.get(n)!;
	};
	const modules = new Set(edges.flatMap((e) => [e.from, e.to]));
	return new Map([...modules].map((m) => [m, level(node(m))]));
}

/** Exported declarations of a TypeScript file; interfaces, type aliases and abstract classes count as abstract. */
export function abstractness(src: string): { abstract: number; exports: number } {
	// ponytail: line regex, not the TypeScript AST; re-exports count where they are declared
	const decl = [...src.matchAll(/^export\s+(?:default\s+)?(?:declare\s+)?(abstract\s+class|interface|type|async\s+function|function|const|let|class|enum)\b/gm)];
	return { abstract: decl.filter((d) => /^(abstract|interface|type)/.test(d[1])).length, exports: decl.length };
}

const round = (x: number) => Math.round(x * 100) / 100;

/** Limits for green and yellow; beyond the second a value is red (for scores where higher is better: lower limits). */
export const LIMITS = { distance: [0.3, 0.6], painUsers: 5, hotspot: [10, 20], health: [85, 70], duplication: [3, 5], maintainability: [85, 70] } as const;
const scale = (x: number, [green, yellow]: readonly number[]): Light => (x <= green ? 'green' : x <= yellow ? 'yellow' : 'red');
const ORDER: Light[] = ['green', 'yellow', 'red'];
const worst = (lights: Light[]): Light => ORDER[Math.max(...lights.map((l) => ORDER.indexOf(l)))];

/** Exports of one file: a Svelte component is one concrete export, other non-TypeScript files have none. */
function fileExports(path: string, source: (path: string) => string) {
	if (path.endsWith('.svelte')) return { abstract: 0, exports: 1 };
	return /\.ts$/.test(path) ? abstractness(source(path)) : { abstract: 0, exports: 0 };
}

export type Kpi = { key: string; label: string; value: number; light: Light };

export type Analysis = { modules: Module[]; kpis: Kpi[]; edges: (Edge & { weight: number })[]; functions: Health['findings'] };

export function analyze(input: Input): Analysis {
	const prod = input.files.filter((f) => f.kind === 'prod');
	const names = new Set(prod.map((f) => f.module));
	const edges = input.edges.filter((e) => names.has(e.from) && names.has(e.to) && e.from !== e.to);
	const level = levels(edges, input.cycles);
	const count = (side: 'from' | 'to', m: string) => edges.filter((e) => e[side] === m).length;
	const modules = [...names].sort().map((name) => {
		const paths = new Set(prod.filter((f) => f.module === name).map((f) => f.path));
		const own = [...paths].map((p) => fileExports(p, input.source));
		const exports = own.reduce((s, x) => s + x.exports, 0);
		const a = exports ? own.reduce((s, x) => s + x.abstract, 0) / exports : 0;
		const [ca, ce] = [count('to', name), count('from', name)];
		const i = ca ? ce / (ca + ce) : 1; // nothing depends on it: free to change
		const d = round(Math.abs(a + i - 1));
		const severities = input.health.findings.filter((f) => paths.has(f.path)).map((f) => f.severity);
		const hotspot = Math.max(0, ...input.health.hotspots.filter((h) => paths.has(h.path)).map((h) => h.score));
		const lights = {
			distance: ca < LIMITS.painUsers && d > LIMITS.distance[1] ? 'yellow' : scale(d, LIMITS.distance),
			complexity: severities.some((s) => s === 'critical' || s === 'high') ? 'red' : severities.length ? 'yellow' : 'green',
			hotspot: scale(hotspot, LIMITS.hotspot)
		} satisfies Module['lights'];
		const light = worst(Object.values(lights));
		return { name, files: paths.size, level: level.get(name) ?? 1, ca, ce, i: round(i), a: round(a), d, findings: severities.length, hotspot: round(hotspot), lights, light };
	});
	const tangles = input.cycles.filter((c) => c.modules.split(' ').some((m) => names.has(m))).length;
	const { health_score, vital_signs } = input.health;
	const kpi = (key: string, label: string, value: number, limits: readonly number[], higherIsBetter = false): Kpi => ({
		key,
		label,
		value,
		light: higherIsBetter ? scale(-value, limits.map((l) => -l)) : scale(value, limits)
	});
	const kpis = [
		kpi('tangles', 'Tangles (Modulzyklen)', tangles, [0, 0]),
		kpi('health', `fallow Health-Score (${health_score.grade})`, health_score.score, LIMITS.health, true),
		kpi('duplication', 'Duplikate in %', vital_signs.duplication_pct, LIMITS.duplication),
		kpi('maintainability', 'Maintainability-Index Ø', vital_signs.maintainability_avg, LIMITS.maintainability, true)
	];
	const functions = input.health.findings.filter((f) => prod.some((p) => p.path === f.path)).sort((a, b) => b.cyclomatic - a.cyclomatic);
	return { modules, kpis, edges: edges.map((e) => ({ from: e.from, to: e.to, weight: Number(e.file_edges) })), functions };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const LAYER: Record<string, string> = { be: 'var(--l1)', db: 'var(--l2)', bff: 'var(--l3)', fe: 'var(--l4)', shared: 'var(--l5)' };
const layerColor = (m: string) => LAYER[m.split(':')[0]] ?? 'var(--ink2)';

/** Abstractness (y) over instability (x): main sequence A + I = 1, band D <= LIMITS.distance[0], one dot per position. */
function aiGraph(modules: Module[]): string {
	const S = 400, P = 40, x = (i: number) => P + i * S, y = (a: number) => P + (1 - a) * S;
	const at = new Map<string, Module[]>();
	for (const m of modules) at.set(`${m.i} ${m.a}`, [...(at.get(`${m.i} ${m.a}`) ?? []), m]);
	const g = LIMITS.distance[0];
	const dots = [...at.values()].map((ms) => {
		const title = ms.map((m) => `${m.name}: I ${m.i}, A ${m.a}, D ${m.d}`).join('\n');
		const r = Math.min(16, 4 + 2 * Math.sqrt(ms.length - 1));
		return `<circle cx="${x(ms[0].i)}" cy="${y(ms[0].a)}" r="${r}" fill="${layerColor(ms[0].name)}" stroke="var(--surface)" stroke-width="2"><title>${esc(title)}</title></circle>`;
	});
	return `<svg id="ai-graph" viewBox="0 0 ${S + 2 * P} ${S + 2 * P}" width="100%" style="max-width:${S + 2 * P}px" role="img" aria-label="Abstraktheit über Instabilität">
<rect x="${P}" y="${P}" width="${S}" height="${S}" fill="var(--surface)" stroke="var(--line)"/>
<polygon points="${x(0)},${y(1 - g)} ${x(0)},${y(1)} ${x(g)},${y(1)} ${x(1)},${y(g)} ${x(1)},${y(0)} ${x(1 - g)},${y(0)}" fill="var(--band)"/>
<line class="main-sequence" x1="${x(0)}" y1="${y(1)}" x2="${x(1)}" y2="${y(0)}" stroke="var(--ink2)" stroke-dasharray="4 4"/>
<text x="${x(0) + 12}" y="${y(0) + 14}" font-size="11" fill="var(--ink2)">Zone of Pain (stabil, konkret)</text>
<text x="${x(1)}" y="${y(1) - 8}" font-size="11" fill="var(--ink2)" text-anchor="end">Zone of Uselessness (instabil, abstrakt)</text>
<text x="${x(0.5)}" y="${S + P + 32}" font-size="12" fill="var(--ink2)" text-anchor="middle">Instabilität I = Ce / (Ca + Ce)</text>
<text transform="translate(14 ${y(0.5)}) rotate(-90)" font-size="12" fill="var(--ink2)" text-anchor="middle">Abstraktheit A</text>
<text x="${x(0)}" y="${S + P + 14}" font-size="11" fill="var(--ink2)" text-anchor="middle">0</text><text x="${x(1)}" y="${S + P + 14}" font-size="11" fill="var(--ink2)" text-anchor="middle">1</text>
<text x="${P - 6}" y="${y(0) + 4}" font-size="11" fill="var(--ink2)" text-anchor="end">0</text><text x="${P - 6}" y="${y(1) + 4}" font-size="11" fill="var(--ink2)" text-anchor="end">1</text>
${dots.join('\n')}
</svg>`;
}

/** Dependency structure matrix: rows use columns, ordered by level, so every edge above the diagonal is a back-edge. */
function dsm(modules: Module[], edges: (Edge & { weight: number })[]): string {
	const order = [...modules].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
	const pos = new Map(order.map((m, k) => [m.name, k]));
	const C = 12, L = 280, n = order.length;
	const shade = (w: number) => (w >= 10 ? '--s3' : w >= 4 ? '--s2' : w >= 2 ? '--s1' : '--s0');
	const rows = order.map(
		(m, k) =>
			`<rect x="0" y="${k * C}" width="6" height="${C}" fill="${layerColor(m.name)}"/><text x="10" y="${k * C + C - 2}" font-size="10" fill="var(--ink2)">${esc(m.name)} · L${m.level}</text>` +
			`<line x1="${L + k * C}" y1="${k * C}" x2="${L + (k + 1) * C}" y2="${(k + 1) * C}" stroke="var(--ink2)"/>`
	);
	const cells = edges
		.filter((e) => pos.has(e.from) && pos.has(e.to))
		.map((e) => {
			const [r, c] = [pos.get(e.from)!, pos.get(e.to)!];
			return `<rect class="cell${c > r ? ' back' : ''}" x="${L + c * C + 1}" y="${r * C + 1}" width="${C - 2}" height="${C - 2}" rx="1" fill="var(${c > r ? '--crit' : shade(e.weight)})"><title>${esc(e.from)} → ${esc(e.to)}: ${e.weight} Import(s)</title></rect>`;
		});
	return `<svg width="${L + n * C}" height="${n * C}" role="img" aria-label="Dependency Structure Matrix"><rect x="${L}" y="0" width="${n * C}" height="${n * C}" fill="var(--surface)" stroke="var(--line)"/>${rows.join('')}${cells.join('')}</svg>`;
}

const LABEL: Record<Light, string> = { green: '● Grün', yellow: '● Gelb', red: '● Rot' };
const badge = (l: Light, text = LABEL[l]) => `<span class="${l}">${text}</span>`;
const GROUPS = [
	{ title: 'Backend und Datenbank', layers: ['be', 'db'] },
	{ title: 'BFF, Frontend und gemeinsame Typen', layers: ['bff', 'fe', 'shared'] }
];

export function report(analysis: Analysis): string {
	const { modules, kpis, edges, functions } = analysis;
	const sorted = [...modules].sort((a, b) => ORDER.indexOf(b.light) - ORDER.indexOf(a.light) || a.name.localeCompare(b.name));
	const count = (l: Light) => modules.filter((m) => m.light === l).length;
	const legend = `<p>${Object.entries({ be: 'Backend', db: 'Datenbank', bff: 'BFF', fe: 'Frontend', shared: 'gemeinsame Typen' })
		.map(([k, v]) => `<span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:${LAYER[k]}"></span> ${v}`)
		.join(' &nbsp; ')}</p>`;
	const tiles = kpis.map((k) => `<div class="kpi"><b>${k.value}</b><span>${esc(k.label)}</span>${badge(k.light)}</div>`).join('');
	const groups = GROUPS.map((g) => {
		const ms = modules.filter((m) => g.layers.includes(m.name.split(':')[0]));
		return `<h3>${g.title} (${ms.length} Module)</h3><div class="scroll">${dsm(ms, edges)}</div>`;
	}).join('');
	const rows = sorted
		.map(
			(m) =>
				`<tr class="module"><td>${esc(m.name)}</td><td>${badge(m.light)}</td><td>${badge(m.lights.distance, String(m.d))}</td><td>${badge(m.lights.complexity, String(m.findings))}</td><td>${badge(m.lights.hotspot, String(m.hotspot))}</td><td>${m.level}</td><td>${m.files}</td><td>${m.ca}</td><td>${m.ce}</td><td>${m.i}</td><td>${m.a}</td></tr>`
		)
		.join('');
	const fns = functions.map((f) => `<tr><td><code>${esc(f.path)}</code></td><td><code>${esc(f.name)}</code></td><td>${f.cyclomatic}</td><td>${f.cognitive}</td></tr>`).join('');
	return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dwello: Strukturbericht</title><style>
:root{--surface:#fcfcfb;--plane:#f9f9f7;--ink:#0b0b0b;--ink2:#52514e;--line:#e4e3df;--band:#e6f4e6;--crit:#d03b3b;--good:#0ca30c;--warn:#b37a00;
--l1:#2a78d6;--l2:#eb6834;--l3:#1baf7a;--l4:#eda100;--l5:#e87ba4;--s0:#cde2fb;--s1:#86b6ef;--s2:#2a78d6;--s3:#184f95}
@media (prefers-color-scheme:dark){:root{--surface:#1a1a19;--plane:#0d0d0d;--ink:#f0efec;--ink2:#c3c2b7;--line:#383835;--band:#1f3320;--warn:#fab219;
--l1:#3987e5;--l2:#d95926;--l3:#199e70;--l4:#c98500;--l5:#d55181;--s0:#184f95;--s1:#256abf;--s2:#5598e7;--s3:#b7d3f6}}
body{margin:0;background:var(--plane);color:var(--ink);font:15px/1.5 system-ui,sans-serif}main{max-width:1100px;margin:0 auto;padding:24px 16px 64px}
h1{font-size:28px;margin:0}h2{font-size:20px;margin:40px 0 8px}h3{font-size:16px;margin:24px 0 8px}p,li{color:var(--ink2)}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px}.kpi{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:12px}
.kpi b{display:block;font-size:26px}.kpi span{display:block;font-size:13px;color:var(--ink2)}.green{color:var(--good)}.yellow{color:var(--warn)}.red{color:var(--crit)}
.kpi span.green{color:var(--good);font-weight:600}.kpi span.yellow{color:var(--warn);font-weight:600}.kpi span.red{color:var(--crit);font-weight:600}
.scroll{overflow-x:auto;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:12px}
table{border-collapse:collapse;width:100%;font-size:13px}td,th{text-align:left;padding:4px 8px;border-bottom:1px solid var(--line)}th{color:var(--ink2)}
</style></head><body><main>
<h1>Dwello: Struktur und Code-Qualität</h1>
<p>Produktivcode (Backend, DB, BFF, Frontend): ${modules.length} Module, ${edges.length} Modul-Abhängigkeiten. Module: ${badge('green', `${count('green')} grün`)}, ${badge('yellow', `${count('yellow')} gelb`)}, ${badge('red', `${count('red')} rot`)}.</p>
<div class="kpis">${tiles}</div>
<h2>Ampel</h2>
<ul><li><b>Abstand D</b> zur Hauptreihe A + I = 1 (Robert C. Martin): grün bis ${LIMITS.distance[0]}, gelb bis ${LIMITS.distance[1]}, sonst rot, aber erst ab ${LIMITS.painUsers} Verwendern (Ca), darunter gelb: Bei wenigen Verwendern ist eine Änderung billig. Rot unten links heisst stabil und konkret («Zone of Pain»): viele hängen davon ab, Änderungen ziehen Kreise. Für Helfer, die sich selten ändern (Datum, Formate), ist das oft gewollt; zusammen mit einem gelben oder roten Hotspot lohnt sich ein Blick. Ein Modul, von dem nichts abhängt, hat I = 1.</li>
<li><b>Komplexität:</b> Funktionen über den Schwellen von fallow im Modul; eine mit Schwere hoch oder kritisch macht rot, sonst eine gelb.</li>
<li><b>Hotspot:</b> höchster Hotspot-Score von fallow (Komplexität × Änderungen der letzten 6 Monate) einer Datei im Modul: grün bis ${LIMITS.hotspot[0]}, gelb bis ${LIMITS.hotspot[1]}, sonst rot.</li>
<li><b>Gesamt:</b> die schlechteste der drei Farben. Kennzahlen oben: Tangles 0 grün, sonst rot; Health-Score und Wartbarkeit grün ab ${LIMITS.health[0]} bzw. ${LIMITS.maintainability[0]}, gelb ab ${LIMITS.health[1]} bzw. ${LIMITS.maintainability[1]}; Duplikate grün bis ${LIMITS.duplication[0]} %, gelb bis ${LIMITS.duplication[1]} %.</li></ul>
<h2>Abstraktheit und Instabilität (A/I-Diagramm)</h2>
<p>I = Ce / (Ca + Ce): Ca = Module, die es verwenden, Ce = Module, die es verwendet. A = exportierte Typen und Interfaces / alle Exporte (eine Svelte-Komponente zählt als ein konkreter Export). Das grüne Band ist D ≤ ${LIMITS.distance[0]}. Punktgrösse = Anzahl Module an derselben Stelle. Fahren Sie über einen Punkt für die Namen.</p>
${legend}
<div class="scroll">${aiGraph(modules)}</div>
<h2>Dependency Structure Matrix</h2>
<p>Zeile verwendet Spalte; Module nach Level geordnet (oben die Basis). Blau unter der Diagonale: Abhängigkeit nach unten, je dunkler, desto mehr Imports (1, 2–3, 4–9, ab 10). Rot über der Diagonale: Rückkante, Teil eines Tangles. Fahren Sie über eine Zelle für die Module.</p>
${legend}
${groups}
<h2>Module</h2>
<div class="scroll"><table><tr><th>Modul</th><th>Gesamt</th><th>D</th><th>Komplexe Funktionen</th><th>Hotspot</th><th>Level</th><th>Dateien</th><th>Ca</th><th>Ce</th><th>I</th><th>A</th></tr>${rows}</table></div>
<h2>Funktionen über den Schwellen von fallow</h2>
<div class="scroll"><table><tr><th>Datei</th><th>Funktion</th><th>zyklomatisch</th><th>kognitiv</th></tr>${fns}</table></div>
</main></body></html>`;
}

if (import.meta.main) {
	const { readFileSync } = await import('node:fs');
	const { join } = await import('node:path');
	const { OUT, ROOT, readCsv } = await import('./lib');
	const input: Input = {
		edges: readCsv('imports-module.csv') as Input['edges'],
		cycles: readCsv('cycles-module.csv') as Input['cycles'],
		files: readCsv('files.csv') as Input['files'],
		source: (path) => readFileSync(join(ROOT, path), 'utf8'),
		health: JSON.parse(readFileSync(join(OUT, 'fallow-health.json'), 'utf8'))
	};
	console.log(report(analyze(input)));
}
