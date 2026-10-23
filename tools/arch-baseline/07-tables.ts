// Renders the report's tables from the CSVs in out/ (no number is typed by hand).
// Out: out/report-tables.md
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASE, OUT, SINCE, git, readCsv } from './lib';

const md: string[] = [];
const table = (rows: Record<string, unknown>[], cols: string[], head?: string[]) => {
	md.push(`| ${(head ?? cols).join(' | ')} |`, `|${cols.map(() => '---').join('|')}|`);
	for (const r of rows) md.push(`| ${cols.map((c) => String(r[c] ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
	md.push('');
};
const h = (t: string) => md.push(`### ${t}`, '');
const short = (p: string) => p.replace('backend/src/', 'be/').replace('src/routes/', 'routes/').replace('tests/e2e/', 'e2e/');

// History
h('History');
const months = git(['log', BASE, '--format=%ad', '--date=format:%Y-%m']).trim().split('\n');
const byMonth = new Map<string, number>();
for (const m of months) byMonth.set(m, (byMonth.get(m) ?? 0) + 1);
table([...byMonth].sort().map(([month, commits]) => ({ month, commits })), ['month', 'commits']);
const units = readCsv('units.csv');
const cnt = (f: (u: Record<string, string>) => boolean) => units.filter(f).length;
table(
	['feat', 'fix', 'docs', 'chore'].map((t) => ({ type: t, units: cnt((u) => u.type === t), pr: cnt((u) => u.type === t && u.kind !== 'direct'), direct: cnt((u) => u.type === t && u.kind === 'direct'), override: cnt((u) => u.type === t && u.type_source === 'override') })),
	['type', 'units', 'pr', 'direct', 'override'],
	['type', 'units', 'via PR', 'direct on main', 'type from unit-types.json']
);
md.push(`window: since ${SINCE} on ${BASE}; units ${units.length}; commits (non-merge) ${readCsv('commits.csv').length}`, '');
const featUnits = units.filter((u) => u.type === 'feat');
const fc = (f: (n: number) => boolean) => featUnits.filter((u) => f(+u.feat_commits)).length;
md.push(`feat units by number of feat commits inside: 0: ${fc((n) => n === 0)}, 1: ${fc((n) => n === 1)}, 2-3: ${fc((n) => n >= 2 && n <= 3)}, >=4: ${fc((n) => n >= 4)}`, '');
h('Excluded units and commits');
table(readCsv('excluded-units.csv'), ['sha', 'pr', 'title', 'reason']);
h('Excluded files (HEAD)');
table(readCsv('excluded-summary.csv'), ['reason', 'files']);

// Map
h('Layers (HEAD)');
table(readCsv('layers.csv'), ['layer', 'kind', 'files', 'loc', 'modules']);
h('Import edges between layers (file level)');
table(readCsv('imports-layer.csv').sort((a, b) => +b.file_edges - +a.file_edges), ['from_layer', 'to_layer', 'file_edges']);
h('Cycles');
table(readCsv('cycles-file.csv'), ['cycle', 'size', 'runtime', 'files']);
table(readCsv('cycles-module.csv'), ['cycle', 'size', 'modules']);
const dc = JSON.parse(readFileSync(join(OUT, 'deepcheck-scan.json'), 'utf8')).summary;
const fd = JSON.parse(readFileSync(join(OUT, 'fallow-deadcode.json'), 'utf8'));
md.push(`fallow circular_dependencies: ${fd.circular_dependencies.length}; deepcheck scan: analyzed ${dc.analyzed}, shallow ${dc.shallow}, excluded ${dc.excluded}`, '');

// M1
h('M1 summary');
const m1 = readCsv('m1-summary.csv');
const pick = (g: string, m: string) => m1.find((r) => r.group === g && r.metric === m)!;
const metrics = ['files_total', 'files_prod', 'files_test', 'files_other', 'modules_prod', 'modules_test', 'layers_prod', 'loc_prod', 'loc_test'];
table(
	metrics.map((m) => ({ metric: m, f_med: pick('feat', m).median, f_p90: pick('feat', m).p90, f_max: pick('feat', m).max, s_med: pick('feat-single', m).median, s_p90: pick('feat-single', m).p90, x_med: pick('fix', m).median, x_p90: pick('fix', m).p90, b_med: pick('feat+fix', m).median, b_p90: pick('feat+fix', m).p90 })),
	['metric', 'f_med', 'f_p90', 'f_max', 's_med', 's_p90', 'x_med', 'x_p90', 'b_med', 'b_p90'],
	['Metrik', 'feat Median', 'feat P90', 'feat Max', 'feat (1 feat-Commit) Median', 'feat (1 feat-Commit) P90', 'fix Median', 'fix P90', 'feat+fix Median', 'feat+fix P90']
);
const pcts = m1.filter((r) => r.metric.startsWith('pct_') && ['feat', 'fix'].includes(r.group));
table(pcts, ['group', 'metric', 'median'], ['Gruppe', 'Anteil', '%']);
h('M1 per layer (files per unit)');
const layerKeys = m1.filter((r) => r.group === 'feat' && r.metric.startsWith('n_')).map((r) => r.metric);
table(
	layerKeys.map((k) => ({ layer: k.slice(2), f_med: pick('feat', k).median, f_p90: pick('feat', k).p90, x_med: pick('fix', k).median, x_p90: pick('fix', k).p90 })),
	['layer', 'f_med', 'f_p90', 'x_med', 'x_p90'],
	['Schicht', 'feat Median', 'feat P90', 'fix Median', 'fix P90']
);
const uf = readCsv('unit-files.csv');
const featFiles = uf.filter((f) => f.type === 'feat');
const share = (k: string) => ((100 * featFiles.filter((f) => f.kind === k).length) / featFiles.length).toFixed(1);
md.push(`file changes in feat units: ${featFiles.length}; prod ${share('prod')} %, test ${share('test')} %, other ${share('other')} %`, '');
h('M1 top 10 feat');
table(readCsv('m1-top10-feat.csv').map((r) => ({ ...r, title: r.title.slice(0, 70) })), ['id', 'date', 'title', 'commits', 'files_prod', 'files_test', 'files_other', 'modules_prod', 'layers_prod', 'n_FE', 'n_BFF', 'n_Backend', 'n_DB', 'n_Tests-Unit', 'n_Tests-Acceptance', 'n_Process']);
h('M1 modules touched by most feat units (top 25)');
table(readCsv('m1-modules-feat.csv').slice(0, 25), ['name', 'layer', 'kind', 'units', 'pct_of_units', 'file_changes']);

// M2
h('M2 views');
table(readCsv('m2-stats.csv'), ['view', 'tx', 'big', 'pairs', 'min_shared', 'min_degree', 'max_tx_files'], ['Sicht', 'Transaktionen', '> max_tx (ausgelassen)', 'Paare über Schwelle', 'min. gemeinsam', 'min. Grad', 'max_tx']);
const pairs = readCsv('m2-file-pairs-units.csv');
const cross = new Map<string, number>();
for (const p of pairs) cross.set(`${p.cross_layer}/${p.import}`, (cross.get(`${p.cross_layer}/${p.import}`) ?? 0) + 1);
table([...cross].map(([k, n]) => ({ k, n })), ['k', 'n'], ['Schicht/Import', 'Paare']);
const kind = new Map(readCsv('files.csv').map((f) => [f.path, f.kind]));
kind.set('messages/{de,fr,it,en}.json', 'prod');
const kk = (p: Record<string, string>) => [kind.get(p.a), kind.get(p.b)].sort().join('-');
const kinds = new Map<string, number>();
for (const p of pairs) kinds.set(kk(p), (kinds.get(kk(p)) ?? 0) + 1);
table([...kinds].map(([k, n]) => ({ k, n })), ['k', 'n'], ['Art (prod/test)', 'Paare']);
h('M2 top 20 file pairs (primary view: unit)');
const ex = readCsv('s4-pair-examples.csv');
table(ex.map((r) => ({ ...r, a: short(r.a), b: short(r.b) })), ['rank', 'a', 'b', 'shared', 'degree', 'cross_layer', 'import', 'example_sha']);
h('M2 production-only file pairs');
table(readCsv('s4-prod-pairs.csv').map((r) => ({ ...r, a: short(r.a), b: short(r.b) })), ['a', 'b', 'shared', 'degree', 'cross_layer', 'import']);
const pp = readCsv('s4-prod-pairs.csv');
const crossNo = pp.filter((r) => r.cross_layer === 'cross' && r.import === 'no');
md.push(`production pairs: ${pp.length}; cross-layer without import: ${crossNo.length}, of which naming contract files: ${crossNo.filter((r) => /contract/i.test(r.a + r.b)).length}`, '');
h('M2 production module pairs (top 20)');
table(readCsv('s4-prod-module-pairs.csv').slice(0, 20), ['a', 'b', 'shared', 'degree', 'cross_layer', 'import']);
h('M2 commit-level file pairs (top 10, for comparison)');
table(readCsv('m2-file-pairs-commits.csv').slice(0, 10).map((r) => ({ ...r, a: short(r.a), b: short(r.b) })), ['a', 'b', 'shared', 'degree', 'cross_layer', 'import']);

// M3
h('M3 hotspots, production (top 15, ranked by commits x total cyclomatic)');
const hot = readCsv('m3-hotspots.csv');
table(hot.filter((r) => r.kind === 'prod').slice(0, 15), ['rank_cyclo', 'rank_crap', 'path', 'layer', 'commits', 'units', 'total_cyclomatic', 'crap_max', 'lines', 'fan_in']);
h('M3 hotspots, tests (top 5)');
table(hot.filter((r) => r.kind === 'test').slice(0, 5), ['path', 'commits', 'units', 'total_cyclomatic', 'crap_max', 'lines']);
const health = JSON.parse(readFileSync(join(OUT, 'fallow-health.json'), 'utf8'));
const crapValues = health.file_scores.map((f: { crap_max: number }) => f.crap_max);
const at265 = crapValues.filter((v: number) => v === 26.5).length;
md.push(`fallow coverage_model: ${health.summary.coverage_model}; files scored ${health.summary.files_scored}; functions above threshold ${health.summary.functions_above_threshold}; files whose crap_max is exactly 26.5: ${at265}`, '');

// M4
h('M4 entity mirrors (files outside DB that declare >= threshold of a table\'s distinctive fields)');
table(readCsv('m4-entity-mirrors.csv'), ['table', 'fields', 'distinctive', 'threshold', 'files', 'FE', 'BFF', 'Backend', 'Shared', 'contract_fixtures']);
h('M4 type declarations per entity');
table(readCsv('m4-entity-types.csv'), ['entity', 'type_declarations', 'distinct_names', 'files', 'names_in_FE', 'names_in_BFF', 'names_in_Backend', 'names_in_DB', 'names_in_Shared']);
h('M4 same type name in several files (top 15)');
table(readCsv('m4-type-names.csv').slice(0, 15).map((r) => ({ ...r, where: r.where.split(' ').map(short).join(', ') })), ['name', 'files', 'layers', 'where']);
h('M4 identical string-literal sets in several files');
table(readCsv('m4-literal-sets.csv').map((r) => ({ ...r, where: r.where.split(' ').map(short).join(', ') })), ['values', 'files', 'layers', 'cross_layer', 'where']);
h('M4 identical regex literals in several files');
table(readCsv('m4-regex.csv').map((r) => ({ ...r, regex: '`' + r.regex + '`', where: r.where.split(' ').map(short).join(', ') })), ['regex', 'files', 'layers', 'where']);
h('M4 validation keywords per layer');
table(readCsv('m4-validation-per-layer.csv'), ['layer', 'files', 'occurrences']);
h('M4 textual clones (fallow dupes)');
table(readCsv('m4-clone-stats.csv'), ['total_files', 'files_with_clones', 'clone_groups', 'duplicated_lines', 'duplication_percentage']);
const clones = readCsv('m4-clones.csv');
md.push(`clone groups spanning layers: ${clones.filter((c) => c.cross_layer === 'yes').length} of ${clones.length}; FE/BFF files importing backend code: ${readCsv('m4-shared-code.csv')[0].fe_or_bff_files_importing_backend}`, '');

// Step 4
h('S4 top 5 features');
const churn = new Map(readCsv('s4-top5-test-churn.csv').map((r) => [r.id, r]));
table(
	readCsv('s4-top5-features.csv').map((r) => ({ ...r, title: r.title.slice(0, 60), tl: churn.get(r.id)?.test_lines_changed, sl: churn.get(r.id)?.selector_or_text_lines })),
	['id', 'sha', 'title', 'commits', 'files_prod', 'files_test', 'files_other', 'layers_prod_list', 'tl', 'sl'],
	['id', 'merge', 'title', 'commits', 'prod', 'test', 'other', 'prod layers', 'test lines', 'selector/text lines']
);
h('S4 registry files and contract fixtures');
table(readCsv('s4-ritual-files.csv'), ['type', 'units', 'units_touching_any_ritual_file', 'units_touching_3plus_ritual_files', 'ritual_file_changes', 'units_touching_contract_fixtures', 'contract_fixture_changes', 'units_touching_types_ts']);

h('Baselines for the modifiability scenarios');
const fs = readCsv('m4-field-spread.csv');
const fv = fs.map((r) => +r.prod_files).sort((a, b) => a - b);
const q = (v: number[], p: number) => v[Math.max(0, Math.ceil(p * v.length) - 1)];
md.push(`DB fields checked: ${fs.length} (unique to one table, not generic); production files outside DB declaring the field: median ${q(fv, 0.5)}, P90 ${q(fv, 0.9)}, max ${fv.at(-1)}`, '');
table(fs.slice(0, 10), ['table', 'field', 'prod_files', 'FE', 'BFF', 'Backend', 'Shared', 'contract_fixtures']);
const sr = readCsv('m4-screen-registry.csv');
const sv = sr.map((r) => +r.files).sort((a, b) => a - b);
const inAll3 = sr.filter((r) => ['tests/a11y/screens.json', 'tests/e2e/features/accessibility.feature', 'tests/e2e/features/sprachen-bildschirme.feature'].every((f) => r.where.split(' ').includes(f))).length;
md.push(`screens in tests/a11y/screens.json: ${sr.length}; files under tests/ naming a screen id: min ${sv[0]}, median ${q(sv, 0.5)}, max ${sv.at(-1)}; screens named in all three registries (screens.json, accessibility.feature, sprachen-bildschirme.feature): ${inAll3}`, '');

writeFileSync(join(OUT, 'report-tables.md'), md.join('\n'));
console.log(`wrote report-tables.md (${md.length} lines)`);
