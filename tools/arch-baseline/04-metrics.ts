// Step 3: M1 change size per unit, M2 change coupling, M3 hotspots.
// Needs 02-imports.ts and 03-history.ts output, and out/fallow-health.json
// (`bunx fallow health --format json`, written by run.sh).
// Out: m1-*.csv, m2-*.csv, m3-hotspots.csv
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { OUT, classify, csv, logicalName, median, quantile, readCsv } from './lib';

const MIN_SHARED = +(process.env.ARCH_MIN_SHARED ?? 5);
const MIN_DEGREE = +(process.env.ARCH_MIN_DEGREE ?? 0.3);
const MAX_TX = +(process.env.ARCH_MAX_TX ?? 50); // larger change sets are left out of M2

const units = readCsv('units.csv');
const unitFiles = readCsv('unit-files.csv');
const commitFiles = readCsv('commit-files.csv');
const num = (r: Record<string, string>, k: string) => +r[k];

// ---------------------------------------------------------------- M1
const groups: Record<string, (u: Record<string, string>) => boolean> = {
	feat: (u) => u.type === 'feat',
	'feat-single': (u) => u.type === 'feat' && +u.feat_commits <= 1,
	fix: (u) => u.type === 'fix',
	'feat+fix': (u) => u.type === 'feat' || u.type === 'fix',
	all: () => true
};
const metrics = ['files_total', 'files_prod', 'files_test', 'files_other', 'modules_prod', 'modules_test', 'layers_prod', 'i18n_files', 'loc_prod', 'loc_test', ...Object.keys(units[0]).filter((k) => k.startsWith('n_'))];
const m1: Record<string, unknown>[] = [];
for (const [g, pick] of Object.entries(groups)) {
	const us = units.filter(pick);
	for (const k of metrics) {
		const v = us.map((u) => num(u, k)).sort((a, b) => a - b);
		m1.push({ group: g, units: us.length, metric: k, median: median(v), p90: quantile(v, 0.9), max: v.at(-1) ?? 0, mean: +(v.reduce((s, x) => s + x, 0) / (v.length || 1)).toFixed(1) });
	}
	const share = (f: (u: Record<string, string>) => boolean) => +((100 * us.filter(f).length) / (us.length || 1)).toFixed(1);
	m1.push({ group: g, units: us.length, metric: 'pct_units_with_>=3_prod_layers', median: share((u) => num(u, 'layers_prod') >= 3) });
	m1.push({ group: g, units: us.length, metric: 'pct_units_touching_i18n', median: share((u) => num(u, 'i18n_files') > 0) });
	m1.push({ group: g, units: us.length, metric: 'pct_units_touching_Process', median: share((u) => num(u, 'n_Process') > 0) });
	m1.push({ group: g, units: us.length, metric: 'pct_units_touching_Tests-Acceptance', median: share((u) => num(u, 'n_Tests-Acceptance') > 0) });
}
csv('m1-summary.csv', m1, ['group', 'units', 'metric', 'median', 'p90', 'max', 'mean']);

const topCols = ['id', 'date', 'type', 'title', 'commits', 'files_total', 'files_prod', 'files_test', 'files_other', 'modules_prod', 'modules_test', 'layers_prod', 'layers_prod_list', 'i18n_files', 'n_FE', 'n_BFF', 'n_Backend', 'n_DB', 'n_Shared/Contracts', 'n_Tests-Unit', 'n_Tests-Acceptance', 'n_Process'];
for (const g of ['feat', 'feat+fix']) {
	csv(`m1-top10-${g.replace('+', '-')}.csv`, units.filter(groups[g]).sort((a, b) => num(b, 'files_prod') - num(a, 'files_prod')).slice(0, 10), topCols);
}

// Where feature changes land: share of feat units that touch each module / layer.
const featIds = new Set(units.filter(groups.feat).map((u) => u.id));
const behIds = new Set(units.filter(groups['feat+fix']).map((u) => u.id));
const touch = (key: 'module' | 'layer', ids: Set<string>) => {
	const m = new Map<string, { units: Set<string>; files: number; kind: string; layer: string }>();
	for (const f of unitFiles) {
		if (!ids.has(f.id)) continue;
		const e = m.get(f[key]) ?? { units: new Set(), files: 0, kind: f.kind, layer: f.layer };
		e.units.add(f.id);
		e.files++;
		m.set(f[key], e);
	}
	return [...m].map(([name, e]) => ({ name, layer: e.layer, kind: e.kind, units: e.units.size, pct_of_units: +((100 * e.units.size) / ids.size).toFixed(1), file_changes: e.files })).sort((a, b) => b.units - a.units);
};
csv('m1-modules-feat.csv', touch('module', featIds));
csv('m1-layers-feat.csv', touch('layer', featIds));
csv('m1-modules-featfix.csv', touch('module', behIds));

// ---------------------------------------------------------------- M2
const importFile = new Set(readCsv('imports-file.csv').flatMap((e) => [`${e.from}\t${e.to}`, `${e.to}\t${e.from}`]));
const importMod = new Set(readCsv('imports-module.csv').flatMap((e) => [`${e.from}\t${e.to}`, `${e.to}\t${e.from}`]));
// Modifiability counts production files only (product owner, 23.10.2026); prod+test views stay as context.
const PROD = new Set(['prod']);
const CODE = new Set(['prod', 'test']);

type Tx = Map<string, Set<string>>;
function transactions(rows: Record<string, string>[], key: string, item: (r: Record<string, string>) => string, kinds = CODE): Tx {
	const tx: Tx = new Map();
	for (const r of rows) {
		if (!kinds.has(r.kind)) continue;
		const s = tx.get(r[key]) ?? new Set<string>();
		s.add(item(r));
		tx.set(r[key], s);
	}
	return tx;
}

const inc = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);

function addPairs(items: string[], pairs: Map<string, number>) {
	items.forEach((a, i) => items.slice(i + 1).forEach((b) => inc(pairs, `${a}\t${b}`)));
}

/** Changes per item and per item pair, over the transactions of at most MAX_TX items. */
function countChanges(tx: Tx) {
	const revs = new Map<string, number>();
	const pairs = new Map<string, number>();
	for (const s of [...tx.values()].filter((t) => t.size <= MAX_TX)) {
		const items = [...s].sort();
		items.forEach((a) => inc(revs, a));
		addPairs(items, pairs);
	}
	return { revs, pairs };
}

type Related = (a: string, b: string) => boolean;
const degreeOf = (k: string, shared: number, revs: Map<string, number>) => {
	const [a, b] = k.split('\t');
	return shared / (revs.get(a)! + revs.get(b)! - shared);
};

function pairRow(k: string, shared: number, revs: Map<string, number>, related: Related, layerOf: (x: string) => string) {
	const [a, b] = k.split('\t');
	const na = revs.get(a)!;
	const nb = revs.get(b)!;
	const la = layerOf(a);
	const lb = layerOf(b);
	return { a, b, shared, revs_a: na, revs_b: nb, degree: +degreeOf(k, shared, revs).toFixed(3), conf_a_to_b: +(shared / na).toFixed(2), conf_b_to_a: +(shared / nb).toFixed(2), layer_a: la, layer_b: lb, cross_layer: la === lb ? 'same' : 'cross', import: related(a, b) ? 'yes' : 'no' };
}

const byStrength = (x: { degree: number; shared: number }, y: { degree: number; shared: number }) => y.degree * y.shared - x.degree * x.shared || y.shared - x.shared;

function coupling(tx: Tx, name: string, related: Related, layerOf: (x: string) => string) {
	const { revs, pairs } = countChanges(tx);
	const rows = [...pairs]
		.filter(([k, shared]) => shared >= MIN_SHARED && degreeOf(k, shared, revs) >= MIN_DEGREE)
		.map(([k, shared]) => pairRow(k, shared, revs, related, layerOf))
		.sort(byStrength);
	csv(name, rows);
	return { tx: tx.size, big: [...tx.values()].filter((s) => s.size > MAX_TX).length, pairs: rows.length };
}

const fileLayer = (p: string) => classify(p).layer;
const fileRelated = (a: string, b: string) => importFile.has(`${a}\t${b}`);
const modLayer = (m: string) => {
	const r = unitFiles.find((f) => f.module === m) ?? commitFiles.find((f) => f.module === m);
	return r?.layer ?? '?';
};
const stats = [
	{ view: 'file/unit prod (primary)', ...coupling(transactions(unitFiles, 'id', (r) => logicalName(r.path), PROD), 'm2-file-pairs-units-prod.csv', fileRelated, fileLayer) },
	{ view: 'module/unit prod', ...coupling(transactions(unitFiles, 'id', (r) => r.module, PROD), 'm2-module-pairs-units-prod.csv', (a, b) => importMod.has(`${a}\t${b}`), modLayer) },
	{ view: 'file/unit prod+test', ...coupling(transactions(unitFiles, 'id', (r) => logicalName(r.path)), 'm2-file-pairs-units.csv', fileRelated, fileLayer) },
	{ view: 'file/commit', ...coupling(transactions(commitFiles, 'sha', (r) => logicalName(r.path)), 'm2-file-pairs-commits.csv', fileRelated, fileLayer) },
	{ view: 'module/unit', ...coupling(transactions(unitFiles, 'id', (r) => r.module), 'm2-module-pairs-units.csv', (a, b) => importMod.has(`${a}\t${b}`), modLayer) },
	{ view: 'file/unit raw i18n (quartet not collapsed)', ...coupling(transactions(unitFiles, 'id', (r) => r.path), 'm2-file-pairs-units-raw.csv', fileRelated, fileLayer) }
];
// M1 by scope: production files of feat and fix units per Conventional-Commit scope.
const scopes = new Map<string, number[]>();
for (const u of units.filter(groups['feat+fix'])) scopes.set(u.scope, [...(scopes.get(u.scope) ?? []), num(u, 'files_prod')]);
csv(
	'm1-scope-prod.csv',
	[...scopes]
		.filter(([, v]) => v.length >= 5)
		.map(([scope, v]) => ({ scope, units: v.length, files_prod_median: median(v), files_prod_p90: quantile([...v].sort((a, b) => a - b), 0.9) }))
		.sort((a, b) => b.units - a.units)
);
csv('m2-stats.csv', stats.map((s) => ({ ...s, min_shared: MIN_SHARED, min_degree: MIN_DEGREE, max_tx_files: MAX_TX })));

// ---------------------------------------------------------------- M3
const health = JSON.parse(readFileSync(join(OUT, 'fallow-health.json'), 'utf8'));
const score = new Map<string, { total_cyclomatic: number; total_cognitive: number; crap_max: number; maintainability_index: number; lines: number; fan_in: number }>(
	health.file_scores.map((f: { path: string }) => [f.path, f])
);
const fallowHot = new Map<string, number>(health.hotspots.map((h: { path: string; score: number }) => [h.path, h.score]));
const freq = new Map<string, { commits: number; units: Set<string> }>();
for (const r of commitFiles) {
	const e = freq.get(r.path) ?? { commits: 0, units: new Set() };
	e.commits++;
	freq.set(r.path, e);
}
for (const r of unitFiles) freq.get(r.path)?.units.add(r.id);
const hot = [];
for (const [path, f] of freq) {
	const s = score.get(path);
	if (!s) continue; // not at HEAD or not analysed (non-code)
	const c = classify(path);
	hot.push({ path, layer: c.layer, kind: c.kind, commits: f.commits, units: f.units.size, total_cyclomatic: s.total_cyclomatic, crap_max: s.crap_max, maintainability: s.maintainability_index, lines: s.lines, fan_in: s.fan_in, score_cyclo: f.commits * s.total_cyclomatic, score_crap: +(f.commits * s.crap_max).toFixed(1), fallow_hotspot: fallowHot.get(path) ?? '' });
}
hot.sort((a, b) => b.score_cyclo - a.score_cyclo);
const rankCrap = [...hot].sort((a, b) => b.score_crap - a.score_crap).map((h) => h.path);
csv('m3-hotspots.csv', hot.map((h, i) => ({ rank_cyclo: i + 1, rank_crap: rankCrap.indexOf(h.path) + 1, ...h })));
console.log(stats);
