// Architecture fitness functions (phase 2a, docs/architecture/fitness-functions.md): measures the scenarios of
// docs/architecture/utility-tree.md with the phase 0 scripts and fails when a value gets worse than ratchet.json.
import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ANCHORED_RE, ARCH_LAYERS, ROOT, STATUS_CMP, changedFiles, classify, git, median, quantile, tablesOf } from '../arch-baseline/lib';

type Spread = { median: number; p90: number; max: number };
type Exception = { reason: string; scenario: string };

export type Measured = {
	fieldSpread: Spread;
	bffDecisions: { path: string; line: string }[];
	/** The same heuristic over the frontend (#815): `src/lib` outside `server/`, and components */
	frontendDecisions?: { path: string; line: string }[];
	literalSets: { values: string; files: number }[];
	entityMirrors: { table: string; path: string }[];
	moduleCycles: string[];
	boundaryImports: string[];
};

export type Ratchet = {
	fieldSpread: Spread;
	/** Technical checks the BFF may make (UUID, ISO date of a query parameter, JWT duration); not shrink-only */
	technical: { path: string; line: string; reason: string }[];
	/** #815: display and format checks the frontend may make (a branch on the status value alone, a date format); not shrink-only */
	display?: { path: string; line: string; reason: string }[];
	/** #815: frontend pre-checks; each names the code the backend refuses the same input with and the test that shows it */
	preChecks?: { path: string; line: string; code: string; test: string }[];
	exceptions: {
		bffDecisions: ({ path: string; line: string } & Exception)[];
		/** Date derivations in the BFF found by the check of #788 part 0; shrink with #788 */
		bffDates?: ({ path: string; line: string } & Exception)[];
		/** Frontend derivations found when #815 extended the check; shrink with #815 */
		frontendDecisions?: ({ path: string; line: string } & Exception)[];
		literalSets: ({ values: string; files: number } & Exception)[];
		entityMirrors: ({ table: string; paths: string[] } & Exception)[];
		moduleCycles: ({ modules: string } & Exception)[];
	};
	prSizeWarn: { files: number; modules: number; layers: number };
	coChangeWarn: number;
};

export type Finding = { check: string; message: string };

const readRepoFile = (path: string) => {
	try {
		return readFileSync(join(ROOT, path), 'utf8');
	} catch {
		return undefined;
	}
};

/** #815: the frontend's derivations no list covers, and pre-checks whose backend test does not show their code */
function frontendFindings(m: Measured, r: Ratchet, read: (path: string) => string | undefined): Finding[] {
	const findings: Finding[] = [];
	const frontendAllowed = [...(r.display ?? []), ...(r.preChecks ?? []), ...(r.exceptions.frontendDecisions ?? [])];
	for (const d of unlisted(m.frontendDecisions ?? [], frontendAllowed, (d) => `${d.path}\t${d.line}`))
		findings.push({
			check: 'frontend-decision',
			message: `Ä4/AP2 «Fachregeln entscheidet nur das Backend»: ${d.path}: \`${d.line}\` compares a status value, checks input with an anchored regex or derives something from today's date in the frontend. Fix: let the backend decide (a response field, or a refusal with a code shown with backendMessage()). A branch on the status value alone or a format check goes into \`display\` of tools/fitness/ratchet.json with its reason; a pre-check into \`preChecks\` with the code the backend refuses the same input with and the backend test that shows it (#815).`
		});
	for (const p of r.preChecks ?? [])
		if (!read(p.test)?.includes(p.code))
			findings.push({
				check: 'pre-check',
				message: `Ä4/AP2: the pre-check ${p.path}: \`${p.line}\` names ${p.code} and ${p.test}, but that test does not show the backend refusing with ${p.code}. Fix: name the backend test that refuses the same input with this code, or add one; without it the check belongs to the backend alone (#815).`
			});
	return findings;
}

export function judge(m: Measured, r: Ratchet, read: (path: string) => string | undefined = readRepoFile): Finding[] {
	const findings: Finding[] = [];
	for (const k of ['median', 'p90', 'max'] as const)
		if (m.fieldSpread[k] > r.fieldSpread[k])
			findings.push({
				check: 'field-spread',
				message: `Ä1/AP1 «Eine Form hat eine Quelle»: field spread ${k} ${m.fieldSpread[k]} > ratchet ${r.fieldSpread[k]} (frontend and BFF files that declare a schema field by hand, #910). Fix: derive the shape from the backend's API type or reuse the area's mapper in src/lib/server instead of declaring the field again.`
			});
	const allowed = [...r.technical, ...r.exceptions.bffDecisions, ...(r.exceptions.bffDates ?? [])];
	for (const d of unlisted(m.bffDecisions, allowed, (d) => `${d.path}\t${d.line}`))
		findings.push({
			check: 'bff-decision',
			message: `Ä4/AP2 «Fachregeln entscheidet nur das Backend»: ${d.path}: \`${d.line}\` compares a status value, checks input with an anchored regex or derives something from today's date in the BFF. Fix: let the backend decide (a field or a coded error, shown with backendMessage()); a purely technical check (UUID, ISO date of a query parameter) goes into \`technical\` of tools/fitness/ratchet.json with its reason.`
		});
	findings.push(...frontendFindings(m, r, read));
	for (const s of m.literalSets) {
		const listed = r.exceptions.literalSets.find((l) => l.values === s.values);
		if (!listed || s.files > listed.files)
			findings.push({
				check: 'literal-set',
				message: `Ä1/AP1 «Eine Form hat eine Quelle»: the value list ${s.values} is declared in ${s.files} files across layers (allowed: ${listed?.files ?? 0}). Fix: declare it once in the backend's API type and take it from there, or import the one existing declaration of its layer.`
			});
	}
	const mirrored = r.exceptions.entityMirrors.flatMap((e) => e.paths.map((path) => ({ table: e.table, path })));
	for (const e of unlisted(m.entityMirrors, mirrored, (x) => `${x.table}\t${x.path}`))
		findings.push({
			check: 'entity-mirror',
			message: `Ä1/AP1 «Eine Form hat eine Quelle»: ${e.path} declares most fields of the table ${e.table} by hand. Fix: use the area's mapper in src/lib/server (one mapper per response) or derive the type from the backend's API type.`
		});
	for (const c of unlisted(m.moduleCycles, r.exceptions.moduleCycles, (x) => (typeof x === 'string' ? x : x.modules)))
		findings.push({
			check: 'module-cycle',
			message: `Ä1 «Änderung an einem Ort»: the modules ${c} import each other, so a change in one can force a change in the other. Fix: move what both need into one of them or into a module both import.`
		});
	for (const b of m.boundaryImports)
		findings.push({
			check: 'boundary-import',
			message: b.includes('backend/')
				? `AP1/Architecture (BFF): ${b} imports code across the HTTP boundary between src/ and backend/ at runtime. Fix: call the backend over HTTP (the BFF via fetch and src/lib/server/api-proxy.ts); only \`import type\` of the backend's API types may cross.`
				: `AP1/Architecture (BFF): ${b} imports against the layer direction (components may not import the BFF, the shared types not the frontend; #857), \`import type\` included. Fix: take page data from \`./$types\` (PageData) and move a shared type to src/lib/types.ts or the backend's API module.`
		});
	return findings;
}

/** Ä1 target (utility-tree.md): a new field is declared by hand in at most 4 production files outside the DB */
const NEW_FIELD_MAX = 4;

/** Warnings, never failures: metrics that vary with the task or the time window. */
export function advise(
	a: {
		prSize?: Ratchet['prSizeWarn'];
		coChange?: number;
		technicalAdded?: number;
		allowedAdded?: number;
		newFields?: { field: string; files: number }[];
	},
	r: Ratchet
): Finding[] {
	const w = r.prSizeWarn;
	const s = a.prSize;
	const findings: Finding[] = [];
	if (s && (s.files > w.files || s.modules > w.modules || s.layers > w.layers))
		findings.push({
			check: 'pr-size',
			message: `Ä1 change amplification: this pull request changes ${s.files} files, ${s.modules} modules and ${s.layers} layers of production code (9 of 10 features stay within ${w.files}, ${w.modules} and ${w.layers}). Consider splitting it, or note in the description which knowledge had to change in several places.`
		});
	if (a.coChange !== undefined && a.coChange > r.coChangeWarn)
		findings.push({
			check: 'co-change',
			message: `Ä1/AP1 hidden coupling: ${a.coChange} pairs of production files in different layers changed together in the last 6 months without importing each other (ratchet ${r.coChangeWarn}). Fix: look at the top pairs in m2-file-pairs-units-prod.csv; the knowledge they share belongs in one place.`
		});
	if ((a.technicalAdded ?? 0) > 0)
		findings.push({
			check: 'technical',
			message: `Ä4/AP2: tools/fitness/ratchet.json has ${a.technicalAdded} technical check(s) in the BFF that the base does not list. Confirm in the review that each new entry checks a format (UUID, ISO date of a query parameter), not a domain rule or form input; those belong to the backend.`
		});
	if ((a.allowedAdded ?? 0) > 0)
		findings.push({
			check: 'frontend-allowed',
			message: `Ä4/AP2: tools/fitness/ratchet.json has ${a.allowedAdded} display or pre-check entr(ies) in the frontend that the base does not list. Confirm in the review that each display entry branches on a status value alone or checks a format, and that each pre-check's backend test refuses the same input with its code (#815).`
		});
	for (const f of a.newFields ?? [])
		if (f.files > NEW_FIELD_MAX)
			findings.push({
				check: 'new-field',
				message: `Ä1/AP1 «Eine Form hat eine Quelle»: the new field ${f.field} is declared by hand in ${f.files} frontend and BFF files (target ${NEW_FIELD_MAX}). Fix: take it from the area's mapper or the backend's API type instead of declaring it again in each layer.`
			});
	return findings;
}

/** Size of each exception list: entries, and for value lists the files each may span. */
const exceptionSizes = ({ exceptions: x }: Ratchet) => ({
	bffDecisions: x.bffDecisions.length,
	bffDates: x.bffDates?.length,
	frontendDecisions: x.frontendDecisions?.length,
	literalSets: x.literalSets.reduce((n, e) => n + e.files, 0),
	entityMirrors: x.entityMirrors.reduce((n, e) => n + e.paths.length, 0),
	moduleCycles: x.moduleCycles.length
});

/**
 * Ratchet rule: a threshold never rises and an exception list never grows, compared with the base branch's file. An
 * entry may change (a renamed file, a reformatted line) as long as its list does not grow.
 */
export function loosened(working: Ratchet, base: Ratchet): Finding[] {
	const findings: Finding[] = [];
	const loose = (message: string) =>
		findings.push({ check: 'ratchet', message: `tools/fitness/ratchet.json: ${message} The ratchet only tightens; fix the code instead.` });
	for (const k of ['median', 'p90', 'max'] as const)
		if (working.fieldSpread[k] > base.fieldSpread[k]) loose(`fieldSpread.${k} rose from ${base.fieldSpread[k]} to ${working.fieldSpread[k]}.`);
	const [now, before] = [exceptionSizes(working), exceptionSizes(base)];
	// a list the base does not have yet comes with the check that needs it (visible in the diff)
	for (const k of Object.keys(now) as (keyof typeof now)[])
		if (before[k] !== undefined && now[k] === undefined) loose(`exceptions.${k} was removed; keep it, empty, so it cannot come back with entries unseen.`);
		else if (before[k] !== undefined && (now[k] ?? 0) > before[k]) loose(`exceptions.${k} grew from ${before[k]} to ${now[k]}.`);
	return findings;
}

/** The ratchet after an improvement: lower thresholds stay lower, and exceptions the code no longer needs drop out. */
export function tighten(m: Measured, r: Ratchet): Ratchet {
	const x = r.exceptions;
	const fieldSpread = { median: 0, p90: 0, max: 0 };
	for (const k of ['median', 'p90', 'max'] as const) fieldSpread[k] = Math.min(m.fieldSpread[k], r.fieldSpread[k]);
	const decisionKey = (d: { path: string; line: string }) => `${d.path}\t${d.line}`;
	const found = unlisted(m.bffDecisions, r.technical, decisionKey);
	const stale = unlisted(x.bffDecisions, found, decisionKey);
	const staleDates = unlisted(x.bffDates ?? [], unlisted(found, x.bffDecisions, decisionKey), decisionKey);
	const frontendFound = unlisted(m.frontendDecisions ?? [], [...(r.display ?? []), ...(r.preChecks ?? [])], decisionKey);
	const staleFrontend = unlisted(x.frontendDecisions ?? [], frontendFound, decisionKey);
	const files = (values: string) => m.literalSets.find((s) => s.values === values)?.files ?? 0;
	const mirrors = new Set(m.entityMirrors.map((e) => `${e.table}\t${e.path}`));
	return {
		...r,
		fieldSpread,
		exceptions: {
			bffDecisions: x.bffDecisions.filter((d) => !stale.includes(d)),
			literalSets: x.literalSets.map((s) => ({ ...s, files: Math.min(s.files, files(s.values)) })).filter((s) => s.files > 0),
			entityMirrors: x.entityMirrors
				.map((e) => ({ ...e, paths: e.paths.filter((p) => mirrors.has(`${e.table}\t${p}`)) }))
				.filter((e) => e.paths.length > 0),
			moduleCycles: x.moduleCycles.filter((c) => m.moduleCycles.includes(c.modules)),
			...(x.bffDates && { bffDates: x.bffDates.filter((d) => !staleDates.includes(d)) }),
			...(x.frontendDecisions && { frontendDecisions: x.frontendDecisions.filter((d) => !staleFrontend.includes(d)) })
		}
	};
}

/** Items left after taking out one listed entry per occurrence (a multiset difference by key). */
function unlisted<T, L>(items: T[], listed: L[], key: (x: T | L) => string): T[] {
	const left = new Map<string, number>();
	for (const l of listed) left.set(key(l), (left.get(key(l)) ?? 0) + 1);
	return items.filter((i) => {
		const n = left.get(key(i)) ?? 0;
		left.set(key(i), n - 1);
		return n <= 0;
	});
}

// ---------------------------------------------------------------- measuring (the phase 0 scripts) and the command line
// bun tools/fitness/fitness.ts [--base <ref>] [--update] [--cochange] [--format github]
//   --base      compare the ratchet with the merge-base's file and report the change size against it
//   --update    write improved values into ratchet.json (the ratchet only tightens)
//   --cochange  co-change coupling of the last 6 months (needs the full git history; nightly)

const scripts = (out: string, names: string[], env: Record<string, string> = {}) => {
	// 04 and 05 read fallow's per-file scores only for columns the checks do not use
	writeFileSync(join(out, 'fallow-health.json'), '{"file_scores":[],"hotspots":[]}');
	for (const s of names) {
		const p = spawnSync('bun', [join(ROOT, 'tools/arch-baseline', s)], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, ...env, ARCH_OUT: out } });
		if (p.status !== 0) throw new Error(`${s}: ${p.stderr}`);
	}
	return (name: string): Record<string, string>[] => JSON.parse(readFileSync(join(out, name + '.json'), 'utf8'));
};

// A date compared with today, or today handed to a function that decides by it (#788); not `today: localToday()`
// before, after or on today (#815 part D: also equal or not)
const DATE_CMP = /(?<![=])(?:[<>]=?|[!=]==)\s*(?:localToday\(\)|(?:\w+\.)?\btoday\b)|(?:localToday\(\)|\btoday\b)\s*(?:[<>]|[!=]==)/;
const TODAY_ARG = /[(,]\s*(?:localToday\(\)|(?:\w+\.)?today)\s*[,)]|^\s*localToday\(\)\s*[,)]/; // the last: a wrapped argument line

/** A line of BFF code that makes a domain decision: a status comparison, an anchored regex, a date against today */
export const decides = (line: string) =>
	[...line.matchAll(STATUS_CMP), ...line.matchAll(ANCHORED_RE)].length > 0 || DATE_CMP.test(line) || TODAY_ARG.test(line);

const BFF_FILE = /^src\/lib\/server\/|\+(page|layout)\.server\.ts$|\+server\.ts$|^src\/hooks\.server\.ts$/;
/** #815: the frontend's own code: every component and non-server `.ts` under src/; tests, types and Paraglide not */
export const isFrontendFile = (p: string) =>
	p.startsWith('src/') &&
	(p.endsWith('.svelte') || (p.endsWith('.ts') && !p.endsWith('.d.ts'))) &&
	!BFF_FILE.test(p) &&
	!/__tests__|\/paraglide\//.test(p);
const decisionsIn = (paths: string[]) =>
	paths.flatMap((path) =>
		readFileSync(join(ROOT, path), 'utf8')
			.split('\n')
			.filter(decides)
			.map((l) => ({ path, line: l.trim() }))
	);

/** A runtime import between src/ and backend/, or any import against the layer direction: a component into the BFF,
 * the shared types into the frontend (#857) */
export const crossesBoundary = (e: Record<string, string>) =>
	(e.type_only === 'no' && e.from.split('/')[0] !== e.to.split('/')[0] && [e.from, e.to].every((p) => /^(src|backend)\//.test(p))) ||
	(e.from_layer === 'FE' && e.to_layer === 'BFF') ||
	(e.from_layer === 'Shared/Contracts' && e.to_layer === 'FE');

function measure(out: string): Measured {
	const read = scripts(out, ['02-imports.ts', '05-knowledge.ts']);
	const spread = read('m4-field-spread.csv')
		.map(handDeclared)
		.sort((a, b) => a - b);
	const src = git(['ls-files', 'src']).split('\n');
	const bff = src.filter((p) => BFF_FILE.test(p) && p.endsWith('.ts'));
	const isProdModule = (m: string) => /^(fe|bff|be|db|shared):/.test(m);
	return {
		fieldSpread: { median: median(spread), p90: quantile(spread, 0.9), max: spread.at(-1) ?? 0 },
		bffDecisions: decisionsIn(bff),
		frontendDecisions: decisionsIn(src.filter(isFrontendFile)),
		literalSets: read('m4-literal-sets.csv')
			.filter((r) => r.cross_layer === 'yes')
			.map((r) => ({ values: r.values, files: +r.files })),
		entityMirrors: read('m4-entity-mirror-files.csv')
			.filter((r) => r.path.startsWith('src/'))
			.map((r) => ({ table: r.table, path: r.path })),
		moduleCycles: read('cycles-module.csv')
			.map((r) => r.modules)
			.filter((c) => c.split(' ').every(isProdModule)),
		boundaryImports: read('imports-file.csv')
			.filter(crossesBoundary)
			.map((e) => `${e.from} -> ${e.to}`)
	};
}

function prSize(base: string) {
	const prod = changedFiles(base, 'HEAD')
		.map((f) => classify(f.path))
		.filter((c) => c.kind === 'prod' && ARCH_LAYERS.includes(c.layer));
	return { files: prod.length, modules: new Set(prod.map((c) => c.module)).size, layers: new Set(prod.map((c) => c.layer)).size };
}

/** Ä1 counts a field in frontend and BFF files only: the backend is its source, `backend/src/api` the contract (#910) */
const handDeclared = (row: Record<string, string>) => +row.FE + +row.BFF;

/** Fields of schema.ts that the base does not have, with their spread from the measurement in `out`. */
export function newFields(spread: Record<string, string>[], baseSchema: string) {
	const known = new Set(tablesOf(baseSchema).flatMap((t) => t.fields.map((f) => `${t.table}.${f}`)));
	return spread.map((r) => ({ field: `${r.table}.${r.field}`, files: handDeclared(r) })).filter((f) => !known.has(f.field));
}

/** Technical checks the working ratchet lists and the base does not, a replaced entry included. */
export function addedTechnical(working: Ratchet, base: Ratchet): number {
	return unlisted(working.technical, base.technical, (t) => `${t.path}\t${t.line}`).length;
}

/** #815: display and pre-check entries the base does not list */
export function addedAllowed(working: Ratchet, base: Ratchet): number {
	const all = (r: Ratchet) => [...(r.display ?? []), ...(r.preChecks ?? [])];
	return unlisted(all(working), all(base), (t) => `${t.path}\t${t.line}`).length;
}

function coChange(out: string) {
	const since = new Date(Date.now() - 183 * 864e5).toISOString().slice(0, 10);
	const read = scripts(out, ['02-imports.ts', '03-history.ts', '04-metrics.ts'], { ARCH_SINCE: since, ARCH_BASE: 'HEAD' });
	return read('m2-file-pairs-units-prod.csv').filter((r) => r.cross_layer === 'cross' && r.import === 'no').length;
}

if (import.meta.main) {
	const args = process.argv.slice(2);
	const opt = (name: string) => (args.includes(name) ? (args[args.indexOf(name) + 1] ?? '') : undefined);
	const github = opt('--format') === 'github';
	const file = join(ROOT, 'tools/fitness/ratchet.json');
	const ratchet: Ratchet = JSON.parse(readFileSync(file, 'utf8'));
	const out = mkdtempSync(join(tmpdir(), 'fitness-'));
	const base = opt('--base') && git(['merge-base', opt('--base')!, 'HEAD']).trim();
	const cochange = args.includes('--cochange');
	const m = cochange ? undefined : measure(out);
	let baseRatchet: Ratchet | undefined;
	if (base) {
		try {
			baseRatchet = JSON.parse(git(['show', `${base}:tools/fitness/ratchet.json`]));
		} catch {
			// the base has no ratchet yet: this change introduces it
		}
	}
	const errors = [...(m ? judge(m, ratchet) : []), ...(baseRatchet ? loosened(ratchet, baseRatchet) : [])];
	const pairs = cochange ? coChange(out) : undefined;
	const technicalAdded = baseRatchet ? addedTechnical(ratchet, baseRatchet) : 0;
	const allowedAdded = baseRatchet ? addedAllowed(ratchet, baseRatchet) : 0;
	const warnings = advise({ prSize: base && !cochange ? prSize(base) : undefined, coChange: pairs, technicalAdded, allowedAdded, newFields: base && m ? newFields(JSON.parse(readFileSync(join(out, 'm4-field-spread.csv.json'), 'utf8')), git(['show', `${base}:backend/src/db/schema.ts`])) : undefined }, ratchet);
	if (pairs !== undefined) console.log(`Fitness: ${pairs} production file pairs across layers change together without an import (6 months)`);
	const say = (level: 'error' | 'warning', f: Finding) => console.log(github ? `::${level} title=Fitness ${f.check}::${f.message}` : `${level} [${f.check}] ${f.message}`);
	errors.forEach((f) => say('error', f));
	warnings.forEach((f) => say('warning', f));
	if (m) {
		const values = `field spread median ${m.fieldSpread.median}, P90 ${m.fieldSpread.p90}, max ${m.fieldSpread.max}; BFF decisions ${m.bffDecisions.length}; frontend decisions ${m.frontendDecisions?.length ?? 0} (exceptions ${ratchet.exceptions.frontendDecisions?.length ?? 0}); cross-layer value lists ${m.literalSets.length}; entity mirrors ${m.entityMirrors.length}; module cycles ${m.moduleCycles.length}; boundary imports ${m.boundaryImports.length}`;
		console.log(`Fitness: ${values}`);
		if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Architecture fitness\n\n${values}\n`);
	}
	if (args.includes('--update') && !errors.length) {
		const next = m ? tighten(m, ratchet) : ratchet;
		next.coChangeWarn = Math.min(pairs ?? Infinity, ratchet.coChangeWarn);
		writeFileSync(file, JSON.stringify(next, null, '\t') + '\n');
		console.log('ratchet.json tightened to the measured values');
	}
	rmSync(out, { recursive: true, force: true });
	process.exit(errors.length ? 1 : 0);
}
