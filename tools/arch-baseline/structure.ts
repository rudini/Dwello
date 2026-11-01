// Structure report: levels, tangles, abstractness and instability, traffic lights, as one HTML page.
// Usage: bun run structure:report   (writes build/structure/index.html)

type Edge = { from: string; to: string };
type Health = {
	findings: { path: string; name: string; cyclomatic: number; cognitive: number; severity: string; line_count?: number }[];
	hotspots?: { path: string; score: number }[]; // missing when no file has enough commits
	health_score: { score: number; grade: string };
	vital_signs: { duplication_pct: number; maintainability_avg: number };
	change_coupling?: { pairs: { path_a: string; path_b: string; shared_revisions: number; degree: number }[] };
};
export type Input = {
	edges: (Edge & { file_edges: string })[];
	cycles: { modules: string }[];
	files: { path: string; kind: string; module: string; loc?: string }[];
	source: (path: string) => string;
	health: Health;
	/** fallow health --coverage-gaps: runtime files no test reaches (static, not line coverage) */
	gaps?: { summary: { file_coverage_pct: number }; files: { path: string }[] };
	/** 02-imports imports-file.csv, for the files behind a DSM cell */
	fileEdges?: { from: string; to: string; from_module: string; to_module: string }[];
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
	xs: number;
	untested: number;
	hidden: number;
	lights: { distance: Light; complexity: Light; hotspot: Light; fat: Light; tests: Light; coupling: Light };
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
	// ponytail: line regex, not the TypeScript AST; re-exports (also `export type { … }`) count where they are declared
	const decl = [...src.matchAll(/^export\s+(?:default\s+)?(?:declare\s+)?(abstract\s+class|interface|type(?!\s*\{)|async\s+function|function|const|let|class|enum)\b/gm)];
	return { abstract: decl.filter((d) => /^(abstract|interface|type)/.test(d[1])).length, exports: decl.length };
}

const round = (x: number) => Math.round(x * 100) / 100;

/** Limits for green and yellow; beyond the second a value is red (for scores where higher is better: lower limits). */
export const LIMITS = {
	xs: [5, 10],
	fatModule: { files: 30, ce: 15 },
	fatFile: 400,
	untested: [0, 50],
	reach: [90, 75],
	hidden: [0, 2],
	hiddenTotal: [2, 10],
	fatFunction: { cyclomatic: 20, cognitive: 15 },
	distance: [0.3, 0.6], painUsers: 5, hotspot: [10, 20], health: [85, 70], duplication: [3, 5], maintainability: [85, 70] } as const;
const scale = (x: number, [green, yellow]: readonly number[]): Light => (x <= green ? 'green' : x <= yellow ? 'yellow' : 'red');
const ORDER: Light[] = ['green', 'yellow', 'red'];
const worst = (lights: Light[]): Light => ORDER[Math.max(...lights.map((l) => ORDER.indexOf(l)))];

/** Exports of one file: a Svelte component is one concrete export, other non-TypeScript files have none. */
function fileExports(path: string, source: (path: string) => string) {
	if (path.endsWith('.svelte')) return { abstract: 0, exports: 1 };
	return /\.ts$/.test(path) ? abstractness(source(path)) : { abstract: 0, exports: 0 };
}

export type Kpi = { key: string; label: string; value: number; light: Light };

type CodeFile = { path: string; module: string; loc: number; untested: boolean };
export type Analysis = {
	modules: Module[];
	kpis: Kpi[];
	edges: (Edge & { weight: number })[];
	functions: Health['findings'];
	files: CodeFile[];
	fileEdges: NonNullable<Input['fileEdges']>;
};

export function analyze(input: Input): Analysis {
	const prod = input.files.filter((f) => f.kind === 'prod');
	const names = new Set(prod.map((f) => f.module));
	const edges = input.edges.filter((e) => names.has(e.from) && names.has(e.to) && e.from !== e.to);
	const level = levels(edges, input.cycles);
	const count = (side: 'from' | 'to', m: string) => edges.filter((e) => e[side] === m).length;
	const tangled = new Set(input.cycles.flatMap((c) => c.modules.split(' ')));
	const code = (path: string) => /\.(ts|svelte)$/.test(path);
	const loc = new Map(prod.filter((f) => code(f.path)).map((f) => [f.path, Number(f.loc ?? 0)]));
	const over = (ratio: number) => (ratio > 1 ? 1 - 1 / ratio : 0); // share of an item beyond its limit
	const fnExcess = (path: string) =>
		input.health.findings
			.filter((f) => f.path === path)
			.reduce((s, f) => s + (f.line_count ?? 0) * over(Math.max(f.cyclomatic / LIMITS.fatFunction.cyclomatic, f.cognitive / LIMITS.fatFunction.cognitive)), 0);
	// file pairs changed together whose modules import neither way: coupling the import graph does not show;
	// a pair in one route folder is SvelteKit's own wiring (a page and its load function), not hidden
	const moduleOf = new Map(prod.map((f) => [f.path, f.module]));
	const linked = new Set(edges.flatMap((e) => [`${e.from} ${e.to}`, `${e.to} ${e.from}`]));
	const routeFolder = (path: string) => (path.startsWith('src/routes/') ? path.slice(0, path.lastIndexOf('/')) : path);
	const hiddenPairs = (input.health.change_coupling?.pairs ?? [])
		.filter((p) => routeFolder(p.path_a) !== routeFolder(p.path_b))
		.map((p) => [moduleOf.get(p.path_a), moduleOf.get(p.path_b)])
		.filter(([a, b]) => a && b && a !== b && !linked.has(`${a} ${b}`)) as [string, string][];
	const untestedFiles = new Set((input.gaps?.files ?? []).map((f) => f.path));
	const share = (part: number, whole: number) => (whole ? Math.round((part / whole) * 1000) / 10 : 0);
	// XS like Structure101: lines beyond the limits of fat modules, files and functions; a tangled module counts whole
	const excessOf = (name: string, paths: string[], ce: number) => {
		const lines = paths.reduce((s, p) => s + (loc.get(p) ?? 0), 0);
		const fatModule = over(Math.max(paths.length / LIMITS.fatModule.files, ce / LIMITS.fatModule.ce));
		const fatFiles = paths.filter((p) => (loc.get(p) ?? 0) > LIMITS.fatFile);
		const inner = fatFiles.reduce((s, p) => s + loc.get(p)! - LIMITS.fatFile, 0) + paths.reduce((s, p) => s + fnExcess(p), 0);
		const excess = tangled.has(name) ? lines : Math.min(lines, lines * fatModule + inner); // ponytail: overlaps summed, capped at the module
		const fat: Light = tangled.has(name) || fatModule ? 'red' : fatFiles.length ? 'yellow' : 'green';
		return { lines, excess, fat };
	};
	const abstractOf = (paths: string[]) => {
		const own = paths.map((p) => fileExports(p, input.source));
		const exports = own.reduce((s, x) => s + x.exports, 0);
		return exports ? own.reduce((s, x) => s + x.abstract, 0) / exports : 0;
	};
	const untestedOf = (paths: string[]) => {
		const codeFiles = paths.filter(code);
		return codeFiles.length ? Math.round((codeFiles.filter((p) => untestedFiles.has(p)).length / codeFiles.length) * 100) : 0;
	};
	let excessLines = 0;
	const modules = [...names].sort().map((name) => {
		const paths = prod.filter((f) => f.module === name).map((f) => f.path);
		const a = abstractOf(paths);
		const [ca, ce] = [count('to', name), count('from', name)];
		const i = ca ? ce / (ca + ce) : 1; // nothing depends on it: free to change
		const d = round(Math.abs(a + i - 1));
		const severities = input.health.findings.filter((f) => paths.includes(f.path)).map((f) => f.severity);
		const hotspot = Math.max(0, ...(input.health.hotspots ?? []).filter((h) => paths.includes(h.path)).map((h) => h.score));
		const { lines, excess, fat } = excessOf(name, paths, ce);
		excessLines += excess;
		const hidden = hiddenPairs.filter((p) => p.includes(name)).length;
		const untested = untestedOf(paths);
		const lights = {
			distance: ca < LIMITS.painUsers && d > LIMITS.distance[1] ? 'yellow' : scale(d, LIMITS.distance),
			complexity: severities.some((s) => s === 'critical' || s === 'high') ? 'red' : severities.length ? 'yellow' : 'green',
			hotspot: scale(hotspot, LIMITS.hotspot),
			fat,
			tests: scale(untested, LIMITS.untested),
			coupling: scale(hidden, LIMITS.hidden)
		} satisfies Module['lights'];
		const xs = share(excess, lines);
		return { name, files: paths.length, level: level.get(name) ?? 1, ca, ce, i: round(i), a: round(a), d, findings: severities.length, hotspot: round(hotspot), xs, untested, hidden, lights, light: worst(Object.values(lights)) };
	});
	const tangles = input.cycles.filter((c) => c.modules.split(' ').some((m) => names.has(m))).length;
	const { health_score, vital_signs } = input.health;
	const kpi = (key: string, label: string, value: number, limits: readonly number[], higherIsBetter = false): Kpi => ({
		key,
		label,
		value,
		light: higherIsBetter ? scale(-value, limits.map((l) => -l)) : scale(value, limits)
	});
	const codeLines = [...loc.values()].reduce((s, l) => s + l, 0);
	const kpis = [
		kpi('xs', 'XS: excess (fat and tangles) in % of code lines', share(excessLines, codeLines), LIMITS.xs),
		kpi('tangles', 'Tangles (module cycles)', tangles, [0, 0]),
		kpi('health', `fallow health score (${health_score.grade})`, health_score.score, LIMITS.health, true),
		kpi('duplication', 'Duplication in %', vital_signs.duplication_pct, LIMITS.duplication),
		kpi('maintainability', 'Maintainability index (avg)', vital_signs.maintainability_avg, LIMITS.maintainability, true),
		...(input.health.change_coupling ? [kpi('hidden', 'File pairs changed together across modules without import', hiddenPairs.length, LIMITS.hiddenTotal)] : []),
		...(input.gaps ? [kpi('reach', 'Code files a test reaches, in % (static)', input.gaps.summary.file_coverage_pct, LIMITS.reach, true)] : [])
	];
	const functions = input.health.findings.filter((f) => prod.some((p) => p.path === f.path)).sort((a, b) => b.cyclomatic - a.cyclomatic);
	const files = prod.filter((f) => code(f.path)).map((f) => ({ path: f.path, module: f.module, loc: loc.get(f.path)!, untested: untestedFiles.has(f.path) }));
	const fileEdges = (input.fileEdges ?? []).filter((e) => e.from_module !== e.to_module && names.has(e.from_module) && names.has(e.to_module));
	return { modules, kpis, edges: edges.map((e) => ({ from: e.from, to: e.to, weight: Number(e.file_edges) })), functions, files, fileEdges };
}

const id = (m: string) => m.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
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
	return `<svg id="ai-graph" viewBox="0 0 ${S + 2 * P} ${S + 2 * P}" width="100%" style="max-width:${S + 2 * P}px" role="img" aria-label="Abstractness over instability">
<rect x="${P}" y="${P}" width="${S}" height="${S}" fill="var(--surface)" stroke="var(--line)"/>
<polygon points="${x(0)},${y(1 - g)} ${x(0)},${y(1)} ${x(g)},${y(1)} ${x(1)},${y(g)} ${x(1)},${y(0)} ${x(1 - g)},${y(0)}" fill="var(--band)"/>
<line class="main-sequence" x1="${x(0)}" y1="${y(1)}" x2="${x(1)}" y2="${y(0)}" stroke="var(--ink2)" stroke-dasharray="4 4"/>
<text x="${x(0) + 12}" y="${y(0) + 14}" font-size="11" fill="var(--ink2)">Zone of pain (stable, concrete)</text>
<text x="${x(1)}" y="${y(1) - 8}" font-size="11" fill="var(--ink2)" text-anchor="end">Zone of uselessness (unstable, abstract)</text>
<text x="${x(0.5)}" y="${S + P + 32}" font-size="12" fill="var(--ink2)" text-anchor="middle">Instability I = Ce / (Ca + Ce)</text>
<text transform="translate(14 ${y(0.5)}) rotate(-90)" font-size="12" fill="var(--ink2)" text-anchor="middle">Abstractness A</text>
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
			return `<a href="#dep-${id(e.from)}--${id(e.to)}"><rect class="cell${c > r ? ' back' : ''}" x="${L + c * C + 1}" y="${r * C + 1}" width="${C - 2}" height="${C - 2}" rx="1" fill="var(${c > r ? '--crit' : shade(e.weight)})"><title>${esc(e.from)} → ${esc(e.to)}: ${e.weight} import(s)</title></rect></a>`;
		});
	return `<svg width="${L + n * C}" height="${n * C}" role="img" aria-label="Dependency Structure Matrix"><rect x="${L}" y="0" width="${n * C}" height="${n * C}" fill="var(--surface)" stroke="var(--line)"/>${rows.join('')}${cells.join('')}</svg>`;
}

export type Snapshot = {
	commit: string;
	date: string;
	kpis: Record<string, number>;
	lights: Record<Light, number>;
	functions: number;
	modules: Record<string, [number, number, number]>;
};

/** One point of the history: what the charts and the D comparison need, nothing else. */
export function snapshot(analysis: Analysis, commit: string, date: string): Snapshot {
	const lights = { green: 0, yellow: 0, red: 0 };
	for (const m of analysis.modules) lights[m.light]++;
	return {
		commit,
		date,
		kpis: Object.fromEntries(analysis.kpis.map((k) => [k.key, k.value])),
		lights,
		functions: analysis.functions.length,
		modules: Object.fromEntries(analysis.modules.map((m) => [m.name, [m.i, m.a, m.d]]))
	};
}

/** Snapshots in the order they were taken (dates are ISO timestamps in UTC, or days). */
const byTime = (history: Snapshot[]) => [...history].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

/** The history as a markdown table for the CI job summary, newest first. */
export function markdown(history: Snapshot[]): string {
	const rows = byTime(history)
		.reverse()
		.map((h) => `| ${h.date.slice(0, 10)} | ${h.kpis.xs} | ${h.kpis.health} | ${h.functions} | ${h.lights.green} | ${h.lights.yellow} | ${h.lights.red} | ${h.kpis.tangles} |`);
	return ['| Date | XS % | Health score | Functions above thresholds | Green | Yellow | Red | Tangles |', '|---|---|---|---|---|---|---|---|', ...rows].join('\n');
}

const LABEL: Record<Light, string> = { green: '● Green', yellow: '● Yellow', red: '● Red' };
const badge = (l: Light, text = LABEL[l]) => `<span class="${l}">${text}</span>`;
const GROUPS = [
	{ title: 'Backend and database', layers: ['be', 'db'] },
	{ title: 'BFF, frontend and shared types', layers: ['bff', 'fe', 'shared'] }
];

type Series = { label: string; color: string; values: number[] };

/** One measure over the snapshots: one y-axis from 0, a dot per snapshot whose title names date and value. */
function lineChart(id: string, title: string, dates: string[], series: Series[]): string {
	const W = 1000, H = 200, P = 40, n = dates.length;
	const max = Math.max(1, ...series.flatMap((s) => s.values)) * 1.1;
	const t = dates.map((d) => Date.parse(d)), span = t[n - 1] - t[0] || 1;
	const x = (k: number) => P + ((t[k] - t[0]) / span) * (W - 2 * P), y = (v: number) => H - P + 10 - (v / max) * (H - P - 10);
	const day = (k: number) => dates[k].slice(0, 10);
	const label = (s: Series, k: number) => `${day(k)}${series.length > 1 ? ` ${s.label}` : ''}: ${s.values[k]}`;
	const lines = series.map(
		(s) =>
			`<polyline fill="none" stroke="${s.color}" stroke-width="2" points="${s.values.map((v, k) => `${x(k)},${y(v)}`).join(' ')}"/>` +
			s.values.map((v, k) => `<circle cx="${x(k)}" cy="${y(v)}" r="4" fill="${s.color}" stroke="var(--surface)" stroke-width="2"><title>${esc(label(s, k))}</title></circle>`).join('')
	);
	const legend = series.length > 1 ? `<p>${series.map((s) => `<span style="color:${s.color}">●</span> ${s.label}`).join(' &nbsp; ')}</p>` : '';
	return `<div class="chart"><h3>${title}</h3>${legend}<svg id="${id}" viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px" role="img" aria-label="${esc(title)}">
<line x1="${P}" y1="${y(0)}" x2="${W - P}" y2="${y(0)}" stroke="var(--line)"/>
<text x="${P - 6}" y="${y(0) + 4}" font-size="14" fill="var(--ink2)" text-anchor="end">0</text><text x="${P - 6}" y="${y(max / 1.1) + 4}" font-size="14" fill="var(--ink2)" text-anchor="end">${round(max / 1.1)}</text>
<text x="${x(0)}" y="${H - 6}" font-size="14" fill="var(--ink2)">${day(0)}</text><text x="${x(n - 1)}" y="${H - 6}" font-size="14" fill="var(--ink2)" text-anchor="end">${day(n - 1)}</text>
${lines.join('')}</svg></div>`;
}

/** Modules whose distance D changed most between the first snapshot that has them and the analysed state now. */
function moved(history: Snapshot[], now: Module[]): string {
	const rows = now
		.map(({ name, d }) => {
			const first = history.find((h) => h.modules[name]);
			return { name, from: first?.modules[name][2] ?? d, to: d, since: first?.date ?? '' };
		})
		.filter((r) => r.from !== r.to)
		.sort((a, b) => Math.abs(b.to - b.from) - Math.abs(a.to - a.from))
		.slice(0, 15)
		.map((r) => `<tr class="moved"><td>${esc(r.name)}</td><td>${r.from}</td><td>${r.to}</td><td>${r.since.slice(0, 10)}</td></tr>`);
	return `<h3>Modules whose distance D changed most</h3><div class="scroll"><table><tr><th>Module</th><th>D at first snapshot</th><th>D now</th><th>First snapshot</th></tr>${rows.join('')}</table></div>`;
}

function historySection(unsorted: Snapshot[], now: Module[]): string {
	if (unsorted.length < 2) return '';
	const history = byTime(unsorted);
	const dates = history.map((h) => h.date);
	const kpi = (key: string) => history.map((h) => h.kpis[key]);
	return `<h2>History</h2><p>${history.length} snapshots of <code>main</code>, measured with today's tools and thresholds. Hover over a dot for date and value.</p><div class="charts">
${lineChart('history-lights', 'Modules per traffic light', dates, [
	{ label: 'green', color: 'var(--good)', values: history.map((h) => h.lights.green) },
	{ label: 'yellow', color: 'var(--warn)', values: history.map((h) => h.lights.yellow) },
	{ label: 'red', color: 'var(--crit)', values: history.map((h) => h.lights.red) }
])}
${lineChart('history-health', 'fallow health score', dates, [{ label: 'health', color: 'var(--l1)', values: kpi('health') }])}
${lineChart('history-functions', "Functions above fallow's thresholds", dates, [{ label: 'functions', color: 'var(--l1)', values: history.map((h) => h.functions) }])}
${lineChart('history-xs', 'XS: excess (fat and tangles) in % of code lines', dates, [{ label: 'XS', color: 'var(--l1)', values: kpi('xs') }])}
${lineChart('history-tangles', 'Tangles (module cycles)', dates, [{ label: 'tangles', color: 'var(--l1)', values: kpi('tangles') }])}
</div>${moved(history, now)}`;
}

/** Per module its files and, per module it uses, the file imports behind the DSM cell; opened from a cell link. */
function details(analysis: Analysis): string {
	return [...analysis.modules]
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((m) => {
			const files = analysis.files
				.filter((f) => f.module === m.name)
				.map((f) => `<tr><td><code>${esc(f.path)}</code></td><td>${f.loc}</td><td>${f.loc > LIMITS.fatFile ? badge('yellow', 'fat') : ''}</td><td>${f.untested ? badge('yellow', 'no test reaches it') : ''}</td></tr>`);
			const uses = Map.groupBy(
				analysis.fileEdges.filter((e) => e.from_module === m.name),
				(e) => e.to_module
			);
			const deps = [...uses].map(
				([to, es]) =>
					`<h4 id="dep-${id(m.name)}--${id(to)}">→ ${esc(to)}</h4><ul>${es.map((e) => `<li><code>${esc(e.from)}</code> → <code>${esc(e.to)}</code></li>`).join('')}</ul>`
			);
			return `<details id="m-${id(m.name)}"><summary>${esc(m.name)} ${badge(m.light)} · ${m.files} files</summary><table><tr><th>File</th><th>Lines</th><th></th><th></th></tr>${files.join('')}</table>${deps.join('')}</details>`;
		})
		.join('\n');
}

export function report(analysis: Analysis, history: Snapshot[] = []): string {
	const { modules, kpis, edges, functions } = analysis;
	const sorted = [...modules].sort((a, b) => ORDER.indexOf(b.light) - ORDER.indexOf(a.light) || a.name.localeCompare(b.name));
	const count = (l: Light) => modules.filter((m) => m.light === l).length;
	const legend = `<p>${Object.entries({ be: 'Backend', db: 'Database', bff: 'BFF', fe: 'Frontend', shared: 'Shared types' })
		.map(([k, v]) => `<span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:${LAYER[k]}"></span> ${v}`)
		.join(' &nbsp; ')}</p>`;
	const tiles = kpis.map((k) => `<div class="kpi"><b>${k.value}</b><span>${esc(k.label)}</span>${badge(k.light)}</div>`).join('');
	const groups = GROUPS.map((g) => {
		const ms = modules.filter((m) => g.layers.includes(m.name.split(':')[0]));
		return `<h3>${g.title} (${ms.length} modules)</h3><div class="scroll">${dsm(ms, edges)}</div>`;
	}).join('');
	const group = (m: string) => GROUPS.findIndex((g) => g.layers.includes(m.split(':')[0]));
	const cross = edges.filter((e) => group(e.from) !== group(e.to)).length;
	const rows = sorted
		.map(
			(m) =>
				`<tr class="module"><td>${esc(m.name)}</td><td>${badge(m.light)}</td><td>${badge(m.lights.distance, String(m.d))}</td><td>${badge(m.lights.complexity, String(m.findings))}</td><td>${badge(m.lights.hotspot, String(m.hotspot))}</td><td>${badge(m.lights.fat, String(m.xs))}</td><td>${badge(m.lights.tests, String(m.untested))}</td><td>${badge(m.lights.coupling, String(m.hidden))}</td><td>${m.level}</td><td>${m.files}</td><td>${m.ca}</td><td>${m.ce}</td><td>${m.i}</td><td>${m.a}</td></tr>`
		)
		.join('');
	const fns = functions.map((f) => `<tr><td><code>${esc(f.path)}</code></td><td><code>${esc(f.name)}</code></td><td>${f.cyclomatic}</td><td>${f.cognitive}</td></tr>`).join('');
	return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dwello: structure report</title><style>
:root{--surface:#fcfcfb;--plane:#f9f9f7;--ink:#0b0b0b;--ink2:#52514e;--line:#e4e3df;--band:#e6f4e6;--crit:#d03b3b;--good:#0ca30c;--warn:#b37a00;
--l1:#2a78d6;--l2:#eb6834;--l3:#1baf7a;--l4:#eda100;--l5:#e87ba4;--s0:#cde2fb;--s1:#86b6ef;--s2:#2a78d6;--s3:#184f95}
@media (prefers-color-scheme:dark){:root{--surface:#1a1a19;--plane:#0d0d0d;--ink:#f0efec;--ink2:#c3c2b7;--line:#383835;--band:#1f3320;--warn:#fab219;
--l1:#3987e5;--l2:#d95926;--l3:#199e70;--l4:#c98500;--l5:#d55181;--s0:#184f95;--s1:#256abf;--s2:#5598e7;--s3:#b7d3f6}}
body{margin:0;background:var(--plane);color:var(--ink);font:15px/1.5 system-ui,sans-serif}main{max-width:1100px;margin:0 auto;padding:24px 16px 64px}
h1{font-size:28px;margin:0}h2{font-size:20px;margin:40px 0 8px}h3{font-size:16px;margin:24px 0 8px}p,li{color:var(--ink2)}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px}.kpi{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:12px}
.kpi b{display:block;font-size:26px}.kpi span{display:block;font-size:13px;color:var(--ink2)}.green{color:var(--good)}.yellow{color:var(--warn)}.red{color:var(--crit)}
.kpi span.green{color:var(--good);font-weight:600}.kpi span.yellow{color:var(--warn);font-weight:600}.kpi span.red{color:var(--crit);font-weight:600}
.charts{display:grid;gap:16px}.chart h3{margin:8px 0}
.scroll{overflow-x:auto;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:12px}
table{border-collapse:collapse;width:100%;font-size:13px}td,th{text-align:left;padding:4px 8px;border-bottom:1px solid var(--line)}th{color:var(--ink2)}
</style></head><body><main>
<h1>Dwello: structure and code quality</h1>
<p>Production code (backend, database, BFF, frontend): ${modules.length} modules, ${edges.length} module dependencies. Modules: ${badge('green', `${count('green')} green`)}, ${badge('yellow', `${count('yellow')} yellow`)}, ${badge('red', `${count('red')} red`)}.</p>
<div class="kpis">${tiles}</div>
${historySection(history, modules)}
<h2>Traffic lights</h2>
<ul><li><b>Distance D</b> from the main sequence A + I = 1 (Robert C. Martin): green up to ${LIMITS.distance[0]}, yellow up to ${LIMITS.distance[1]}, else red, but red only from ${LIMITS.painUsers} users (Ca), yellow below: with few users a change is cheap. Red at the bottom left means stable and concrete (zone of pain): many depend on it, so changes ripple. For helpers that rarely change (dates, formats) this is often intended; together with a yellow or red hotspot it is worth a look. A module nothing depends on has I = 1.</li>
<li><b>Complexity:</b> functions in the module above fallow's thresholds; one with severity high or critical makes it red, any other makes it yellow.</li>
<li><b>Hotspot:</b> highest fallow hotspot score (complexity × changes in the last 6 months) of a file in the module: green up to ${LIMITS.hotspot[0]}, yellow up to ${LIMITS.hotspot[1]}, else red.</li>
<li><b>XS</b> (excess complexity, after Structure101): lines beyond the limits of fat items, in % of the module's code lines. A module is fat with more than ${LIMITS.fatModule.files} files or more than ${LIMITS.fatModule.ce} module dependencies (Ce), a file with more than ${LIMITS.fatFile} lines, a function above fallow's thresholds (cyclomatic ${LIMITS.fatFunction.cyclomatic}, cognitive ${LIMITS.fatFunction.cognitive}); the share beyond the limit counts, a module in a tangle counts whole. Light: red for a fat or tangled module, yellow for a fat file in it. At the top: green up to ${LIMITS.xs[0]} %, yellow up to ${LIMITS.xs[1]} %.</li>
<li><b>Untested:</b> share of the module's code files that no test reaches through imports (fallow's static estimate, not line coverage; end-to-end tests reach code over HTTP, which it does not see, so API endpoints show as untested): green at ${LIMITS.untested[0]}, yellow up to ${LIMITS.untested[1]} %, else red.</li>
<li><b>Hidden coupling:</b> file pairs changed together often (fallow, at least 5 shared commits and 30 % of their commits) whose modules import neither way, without pairs in one route folder under src/routes (a SvelteKit page and its load function): green at ${LIMITS.hidden[0]}, yellow up to ${LIMITS.hidden[1]}, else red.</li>
<li><b>Overall:</b> the worst of the six colours. Indicators at the top: tangles green at 0, else red; health score and maintainability green from ${LIMITS.health[0]} and ${LIMITS.maintainability[0]}, yellow from ${LIMITS.health[1]} and ${LIMITS.maintainability[1]}; duplication green up to ${LIMITS.duplication[0]} %, yellow up to ${LIMITS.duplication[1]} %.</li></ul>
<h2>Abstractness and instability (A/I graph)</h2>
<p>I = Ce / (Ca + Ce): Ca = modules that use it, Ce = modules it uses. A = exported types and interfaces / all exports (a Svelte component counts as one concrete export). The green band is D ≤ ${LIMITS.distance[0]}. Dot size = number of modules at the same position. Hover over a dot for the names.</p>
${legend}
<div class="scroll">${aiGraph(modules)}</div>
<h2>Dependency Structure Matrix</h2>
<p>Row uses column; modules ordered by level (the base at the top). Blue below the diagonal: a dependency downwards, darker means more imports (1, 2–3, 4–9, 10 and more). Red above the diagonal: a back-edge, part of a tangle. Hover over a cell for the modules. Dependencies between the two groups, shown in neither matrix: ${cross} (e.g. types from the backend).</p>
${legend}
${groups}
<h2>Modules</h2>
<div class="scroll"><table><tr><th>Module</th><th>Overall</th><th>D</th><th>Complex functions</th><th>Hotspot</th><th>XS %</th><th>Untested %</th><th>Hidden coupling</th><th>Level</th><th>Files</th><th>Ca</th><th>Ce</th><th>I</th><th>A</th></tr>${rows}</table></div>
<h2>Functions above fallow's thresholds</h2>
<div class="scroll"><table><tr><th>File</th><th>Function</th><th>Cyclomatic</th><th>Cognitive</th></tr>${fns}</table></div>
<h2>Module details</h2>
<p>Every module with its files and, per module it uses, the file imports behind its DSM cell. A click on a DSM cell opens it here.</p>
${details(analysis)}
</main><script>
function openTarget() { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (!t) return; const d = t.closest('details'); if (d) d.open = true; t.scrollIntoView(); }
addEventListener('hashchange', openTarget); openTarget();
</script></body></html>`;
}

if (import.meta.main) {
	const { appendFileSync, existsSync, readdirSync, readFileSync } = await import('node:fs');
	const { join } = await import('node:path');
	const { OUT, ROOT, readCsv } = await import('./lib');
	// a failed fallow run still leaves the file its output was redirected to, empty
	const optionalJson = (path: string) => (existsSync(path) && readFileSync(path, 'utf8').trim() ? JSON.parse(readFileSync(path, 'utf8')) : undefined);
	const analysis = analyze({
		edges: readCsv('imports-module.csv') as Input['edges'],
		cycles: readCsv('cycles-module.csv') as Input['cycles'],
		files: readCsv('files.csv') as Input['files'],
		source: (path) => readFileSync(join(ROOT, path), 'utf8'),
		health: JSON.parse(readFileSync(join(OUT, 'fallow-health.json'), 'utf8')),
		gaps: optionalJson(join(OUT, 'fallow-gaps.json'))?.coverage_gaps,
		fileEdges: readCsv('imports-file.csv') as Input['fileEdges']
	});
	const [flag, commit, date] = process.argv.slice(2);
	if (flag === '--snapshot') console.log(JSON.stringify(snapshot(analysis, commit, date)));
	else {
		const dir = join(OUT, 'history');
		const history: Snapshot[] = existsSync(dir) ? readdirSync(dir)
					.filter((f) => f.endsWith('.json'))
					.map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8'))) : [];
		console.log(report(analysis, history));
		if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Structure report\n\n${markdown(history)}\n`);
	}
}
