// Step 3, M4: knowledge spread. Heuristic, text-based searches over production
// code (FE, BFF, Backend, DB, Shared/Contracts) plus the API contract fixtures.
//  A entity mirrors: files outside the DB layer that declare most fields of a DB table
//  B type names declared in more than one file (exact name, and per entity stem)
//  C string-literal sets (unions, t.Literal unions, pgEnum, literal arrays) declared in 2+ files
//  D regex literals declared in 2+ files
//  E validation keywords per layer
//  F fallow clone groups that span layers (out/fallow-dupes.json)
// Out: m4-*.csv
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ANCHORED_RE, OUT, ROOT, STATUS, STATUS_CMP, classify, csv, excludedBecause, git, tablesOf } from './lib';

const CODE_LAYERS = new Set(['FE', 'BFF', 'Backend', 'DB', 'Shared/Contracts']);
const all = git(['ls-files', '-z']).split('\0').filter((p) => p && !excludedBecause(p));
const prod = all.filter((p) => /\.(ts|svelte)$/.test(p) && classify(p).kind === 'prod' && CODE_LAYERS.has(classify(p).layer));
const contracts = all.filter((p) => p.startsWith('tests/contracts/') && p.endsWith('.json'));
const text = new Map<string, string>(prod.concat(contracts).map((p) => [p, readFileSync(join(ROOT, p), 'utf8')]));
const layer = (p: string) => classify(p).layer;
const layersOf = (ps: string[]) => [...new Set(ps.map(layer))].sort().join('|');

// ---------------------------------------------------------------- A entity mirrors
const schema = text.get('backend/src/db/schema.ts')!;
const GENERIC = new Set(['id', 'createdAt', 'updatedAt', 'name', 'notes', 'description', 'status', 'type', 'email', 'phone', 'amount', 'date', 'year', 'label']);
const tables = tablesOf(schema);
const keysOf = (p: string) => {
	const t = text.get(p)!;
	const re = p.endsWith('.json') ? /"(\w+)"\s*:/g : /(?<![\w.$'"`])(\w+)\??:(?!:)/g;
	return new Set([...t.matchAll(re)].map((m) => m[1]));
};
const keyCache = new Map([...text.keys()].map((p) => [p, keysOf(p)]));
const mirrorRows: Record<string, unknown>[] = [];
const mirrorFiles: Record<string, unknown>[] = [];
for (const { table, fields } of tables) {
	const distinct = fields.filter((f) => !GENERIC.has(f));
	if (distinct.length < 3) continue;
	const need = Math.max(3, Math.ceil(distinct.length * 0.5));
	const hits: string[] = [];
	for (const [p, keys] of keyCache) {
		if (layer(p) === 'DB') continue;
		const n = distinct.filter((f) => keys.has(f)).length;
		if (n >= need) {
			hits.push(p);
			mirrorFiles.push({ table, path: p, layer: layer(p), fields_matched: n, fields_distinctive: distinct.length });
		}
	}
	const by = (l: string) => hits.filter((h) => layer(h) === l && !h.startsWith('tests/')).length;
	mirrorRows.push({ table, fields: fields.length, distinctive: distinct.length, threshold: need, files: hits.length, FE: by('FE'), BFF: by('BFF'), Backend: by('Backend'), Shared: hits.filter((h) => h === 'src/lib/types.ts').length, contract_fixtures: hits.filter((h) => h.startsWith('tests/contracts/')).length });
}
mirrorRows.sort((a, b) => (b.files as number) - (a.files as number));
csv('m4-entity-mirrors.csv', mirrorRows);
csv('m4-entity-mirror-files.csv', mirrorFiles);

// ---------------------------------------------------------------- B type names
const decl = new Map<string, Set<string>>();
for (const [p, t] of text) {
	if (p.endsWith('.json')) continue;
	for (const m of t.matchAll(/^\s*(?:export\s+)?(?:declare\s+)?(?:interface|type|enum|class)\s+([A-Z]\w*)/gm)) {
		const s = decl.get(m[1]) ?? new Set();
		s.add(p);
		decl.set(m[1], s);
	}
}
const dupTypes = [...decl].filter(([, s]) => s.size > 1).map(([name, s]) => ({ name, files: s.size, layers: layersOf([...s]), where: [...s].join(' ') }));
dupTypes.sort((a, b) => b.files - a.files);
csv('m4-type-names.csv', dupTypes);
const STEMS = ['Building', 'Apartment', 'Tenant', 'Contract', 'Category', 'DistributionKey', 'HeatingProfile', 'Invoice', 'Statement', 'LineItem', 'Document', 'Reminder', 'AdvancePayment', 'FuelStock', 'Ki'];
const stemRows = STEMS.map((stem) => {
	const names = [...decl].filter(([n]) => n.startsWith(stem) || n.endsWith(stem));
	const files = names.flatMap(([, s]) => [...s]);
	const per = (l: string) => names.filter(([, s]) => [...s].some((f) => layer(f) === l)).length;
	return { entity: stem, type_declarations: names.reduce((n, [, s]) => n + s.size, 0), distinct_names: names.length, files: new Set(files).size, names_in_FE: per('FE'), names_in_BFF: per('BFF'), names_in_Backend: per('Backend'), names_in_DB: per('DB'), names_in_Shared: per('Shared/Contracts'), names: names.map(([n]) => n).join(' ') };
});
csv('m4-entity-types.csv', stemRows.sort((a, b) => b.type_declarations - a.type_declarations));

// ---------------------------------------------------------------- C literal sets
const sets = new Map<string, Set<string>>();
const addSet = (vals: string[], p: string) => {
	const v = [...new Set(vals)].sort();
	if (v.length < 2) return;
	const k = v.join('|');
	const s = sets.get(k) ?? new Set();
	s.add(p);
	sets.set(k, s);
};
for (const [p, t] of text) {
	if (p.endsWith('.json')) continue;
	for (const m of t.matchAll(/(?:'[\w-]+'\s*\|\s*)+'[\w-]+'/g)) addSet([...m[0].matchAll(/'([\w-]+)'/g)].map((x) => x[1]), p);
	for (const m of t.matchAll(/t\.Union\(\s*\[((?:\s*t\.Literal\('[\w-]+'\)(?:\s*,)?)+)\s*\]/g)) addSet([...m[1].matchAll(/'([\w-]+)'/g)].map((x) => x[1]), p);
	for (const m of t.matchAll(/pgEnum\(\s*'\w+',\s*\[([^\]]+)\]/g)) addSet([...m[1].matchAll(/'([\w-]+)'/g)].map((x) => x[1]), p);
	for (const m of t.matchAll(/\[((?:\s*'[\w-]+'\s*,){1,}\s*'[\w-]+'\s*,?\s*)\](?:\s*as\s+const)?/g)) addSet([...m[1].matchAll(/'([\w-]+)'/g)].map((x) => x[1]), p);
}
const litRows = [...sets]
	.filter(([, s]) => s.size > 1)
	.map(([values, s]) => ({ values, n_values: values.split('|').length, files: s.size, layers: layersOf([...s]), cross_layer: new Set([...s].map(layer)).size > 1 ? 'yes' : 'no', where: [...s].join(' ') }))
	.sort((a, b) => b.files - a.files || b.n_values - a.n_values);
csv('m4-literal-sets.csv', litRows);

// ---------------------------------------------------------------- D regex literals
const regexes = new Map<string, Set<string>>();
for (const [p, t] of text) {
	if (p.endsWith('.json')) continue;
	for (const m of t.matchAll(/(?:[=(:,!&|?]|return)\s*(\/(?![*/\s])(?:\\.|\[(?:\\.|[^\]\n\\])*\]|[^/\n\\[])+\/[dgimsuy]*)/g)) {
		const r = m[1];
		if (r.length < 6) continue;
		const s = regexes.get(r) ?? new Set();
		s.add(p);
		regexes.set(r, s);
	}
}
csv(
	'm4-regex.csv',
	[...regexes].filter(([, s]) => s.size > 1).map(([regex, s]) => ({ regex, files: s.size, layers: layersOf([...s]), where: [...s].join(' ') })).sort((a, b) => b.files - a.files)
);

// ---------------------------------------------------------------- E validation keywords per layer
const VALID = /\b(minLength|maxLength|maxlength|minlength|minimum|maximum|exclusiveMinimum|pattern|required|t\.Numeric|t\.String|t\.Number)\b/g;
const vRows = new Map<string, { layer: string; files: number; occurrences: number }>();
for (const [p, t] of text) {
	if (p.endsWith('.json')) continue;
	const n = [...t.matchAll(VALID)].length;
	if (!n) continue;
	const e = vRows.get(layer(p)) ?? { layer: layer(p), files: 0, occurrences: 0 };
	e.files++;
	e.occurrences += n;
	vRows.set(layer(p), e);
}
csv('m4-validation-per-layer.csv', [...vRows.values()]);

// ---------------------------------------------------------------- F cross-layer clones
const dupesFile = join(OUT, 'fallow-dupes.json');
if (existsSync(dupesFile)) {
	const d = JSON.parse(readFileSync(dupesFile, 'utf8'));
	csv(
		'm4-clones.csv',
		d.clone_groups.map((g: { instances: { file: string; start_line: number; end_line: number }[] }) => ({
			instances: g.instances.length,
			lines: g.instances[0].end_line - g.instances[0].start_line + 1,
			layers: layersOf(g.instances.map((i) => i.file)),
			cross_layer: new Set(g.instances.map((i) => layer(i.file))).size > 1 ? 'yes' : 'no',
			where: g.instances.map((i) => `${i.file}:${i.start_line}`).join(' ')
		}))
	);
	csv('m4-clone-stats.csv', [d.stats]);
}

// FE <-> backend imports: a shared type module would show up here.
const imp = readFileSync(join(OUT, 'imports-file.csv'), 'utf8').split('\n').slice(1).filter(Boolean);
const feToBe = imp.filter((l) => /^src\//.test(l) && /,backend\//.test(l)).length;
csv('m4-shared-code.csv', [{ fe_or_bff_files_importing_backend: feToBe, tables: tables.length }]);
console.log(`tables ${tables.length}, dup type names ${dupTypes.length}, dup literal sets ${litRows.length}`);

// ---------------------------------------------------------------- G baselines for the modifiability scenarios
// G1: per DB field (names unique to one table, not generic): production files outside the DB layer that
// declare it as a key (type property, object literal, validation schema, mapper), and API contract fixtures.
const owner = new Map<string, string[]>();
for (const { table, fields } of tables) for (const f of fields) owner.set(f, [...(owner.get(f) ?? []), table]);
const fieldRows: Record<string, unknown>[] = [];
for (const { table, fields } of tables)
	for (const f of fields) {
		if (GENERIC.has(f) || owner.get(f)!.length > 1 || f.length < 5) continue;
		const files = [...keyCache].filter(([p, k]) => k.has(f) && layer(p) !== 'DB' && !p.startsWith('tests/')).map(([p]) => p);
		const fixtures = [...keyCache].filter(([p, k]) => k.has(f) && p.startsWith('tests/contracts/')).length;
		fieldRows.push({ table, field: f, prod_files: files.length, FE: files.filter((p) => layer(p) === 'FE').length, BFF: files.filter((p) => layer(p) === 'BFF').length, Backend: files.filter((p) => layer(p) === 'Backend').length, Shared: files.filter((p) => layer(p) === 'Shared/Contracts').length, contract_fixtures: fixtures, where: files.join(' ') });
	}
csv('m4-field-spread.csv', fieldRows.sort((a, b) => (b.prod_files as number) - (a.prod_files as number)));

// G2: per screen id of tests/a11y/screens.json: files under tests/ that name it.
const screens: string[] = JSON.parse(readFileSync(join(ROOT, 'tests/a11y/screens.json'), 'utf8')).screens.map((s: { name: string }) => s.name);
const testFiles = all.filter((p) => p.startsWith('tests/') && /\.(ts|feature|json)$/.test(p)).map((p) => [p, readFileSync(join(ROOT, p), 'utf8')] as const);
csv(
	'm4-screen-registry.csv',
	screens.map((s) => {
		const re = new RegExp(`(^|[^\\w-])${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\w-]|$)`);
		const files = testFiles.filter(([, t]) => re.test(t)).map(([p]) => p);
		return { screen: s, files: files.length, where: files.join(' ') };
	})
);

// G3: status values of statements and contracts: production files per layer that name the quoted value
// (a comparison, a filter or a label), i.e. places that decide something by that status.
csv(
	'm4-status-literals.csv',
	STATUS.map((value) => {
		const re = new RegExp(`['"\`]${value}['"\`]`);
		const files = prod.filter((p) => re.test(text.get(p)!));
		const per = (l: string) => files.filter((p) => layer(p) === l).length;
		return { value, files: files.length, FE: per('FE'), BFF: per('BFF'), Backend: per('Backend'), DB: per('DB'), Shared: per('Shared/Contracts'), layers: layersOf(files) };
	})
);

// G4: signs of domain decisions outside the backend (product owner, 23.10.2026: the BFF makes no domain
// decisions). Per FE/BFF production file: comparisons against a status value (`status !== 'replaced'`) and
// anchored regex literals (`/^\d{4}$/`, validation rules), plus fallow's cyclomatic sum.
const health = JSON.parse(readFileSync(join(OUT, 'fallow-health.json'), 'utf8'));
const cyclo = new Map<string, number>(health.file_scores.map((f: { path: string; total_cyclomatic: number }) => [f.path, f.total_cyclomatic]));
const decisionRows = prod
	.filter((p) => ['FE', 'BFF'].includes(layer(p)))
	.map((p) => ({ path: p, layer: layer(p), status_comparisons: [...text.get(p)!.matchAll(STATUS_CMP)].length, anchored_regex: [...text.get(p)!.matchAll(ANCHORED_RE)].length, total_cyclomatic: cyclo.get(p) ?? 0 }))
	.filter((r) => r.status_comparisons + r.anchored_regex > 0)
	.sort((a, b) => b.status_comparisons + b.anchored_regex - (a.status_comparisons + a.anchored_regex));
csv('m4-decisions-outside-backend.csv', decisionRows);
csv(
	'm4-decisions-per-layer.csv',
	['FE', 'BFF', 'Backend'].map((l) => {
		const files = prod.filter((p) => layer(p) === l);
		const count = (re: RegExp, p: string) => [...text.get(p)!.matchAll(re)].length;
		return {
			layer: l,
			files_with_status_comparison: files.filter((p) => count(STATUS_CMP, p) > 0).length,
			status_comparisons: files.reduce((s, p) => s + count(STATUS_CMP, p), 0),
			files_with_anchored_regex: files.filter((p) => count(ANCHORED_RE, p) > 0).length,
			anchored_regex: files.reduce((s, p) => s + count(ANCHORED_RE, p), 0),
			total_cyclomatic: files.reduce((s, p) => s + (cyclo.get(p) ?? 0), 0)
		};
	})
);
