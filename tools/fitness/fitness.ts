// Architecture fitness functions (phase 2a, docs/architecture/fitness-functions.md): measures the scenarios of
// docs/architecture/utility-tree.md with the phase 0 scripts and fails when a value gets worse than ratchet.json.
import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ANCHORED_RE, ARCH_LAYERS, ROOT, STATUS_CMP, changedFiles, classify, git, median, quantile } from '../arch-baseline/lib';

type Spread = { median: number; p90: number; max: number };
type Exception = { reason: string; scenario: string };

export type Measured = {
	fieldSpread: Spread;
	bffDecisions: { path: string; line: string }[];
	literalSets: { values: string; files: number }[];
	entityMirrors: { table: string; path: string }[];
	moduleCycles: string[];
	boundaryImports: string[];
};

export type Ratchet = {
	fieldSpread: Spread;
	/** Technical checks the BFF may make (UUID, ISO date of a query parameter, JWT duration); not shrink-only */
	technical: { path: string; line: string; reason: string }[];
	exceptions: {
		bffDecisions: ({ path: string; line: string } & Exception)[];
		literalSets: ({ values: string; files: number } & Exception)[];
		entityMirrors: ({ table: string; paths: string[] } & Exception)[];
		moduleCycles: ({ modules: string } & Exception)[];
	};
	prSizeWarn: { files: number; modules: number; layers: number };
	coChangeWarn: number;
};

export type Finding = { check: string; message: string };

export function judge(m: Measured, r: Ratchet): Finding[] {
	const findings: Finding[] = [];
	for (const k of ['median', 'p90', 'max'] as const)
		if (m.fieldSpread[k] > r.fieldSpread[k])
			findings.push({
				check: 'field-spread',
				message: `Ä1/AP1 «Eine Form hat eine Quelle»: field spread ${k} ${m.fieldSpread[k]} > ratchet ${r.fieldSpread[k]} (files outside the DB that declare a schema field by hand). Fix: derive the shape from the backend's API type or reuse the area's mapper in src/lib/server instead of declaring the field again.`
			});
	for (const d of unlisted(m.bffDecisions, [...r.technical, ...r.exceptions.bffDecisions], (d) => `${d.path}\t${d.line}`))
		findings.push({
			check: 'bff-decision',
			message: `Ä4/AP2 «Fachregeln entscheidet nur das Backend»: ${d.path}: \`${d.line}\` compares a status value or checks input with an anchored regex in the BFF. Fix: let the backend decide (a field or a coded error, shown with backendMessage()); a purely technical check (UUID, ISO date of a query parameter) goes into \`technical\` of tools/fitness/ratchet.json with its reason.`
		});
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
			message: `AP1/Architecture (BFF): ${b} imports code across the HTTP boundary between src/ and backend/ at runtime. Fix: call the backend over HTTP (the BFF via fetch and src/lib/server/api-proxy.ts); only \`import type\` of the backend's API types may cross.`
		});
	return findings;
}

/** Warnings, never failures: metrics that vary with the task or the time window. */
export function advise(a: { prSize?: Ratchet['prSizeWarn']; coChange?: number; technicalAdded?: number }, r: Ratchet): Finding[] {
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
	return findings;
}

/** Size of each exception list: entries, and for value lists the files each may span. */
const exceptionSizes = ({ exceptions: x }: Ratchet) => ({
	bffDecisions: x.bffDecisions.length,
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
	for (const k of Object.keys(now) as (keyof typeof now)[])
		if (now[k] > before[k]) loose(`exceptions.${k} grew from ${before[k]} to ${now[k]}.`);
	return findings;
}

/** The ratchet after an improvement: lower thresholds stay lower, and exceptions the code no longer needs drop out. */
export function tighten(m: Measured, r: Ratchet): Ratchet {
	const x = r.exceptions;
	const fieldSpread = { median: 0, p90: 0, max: 0 };
	for (const k of ['median', 'p90', 'max'] as const) fieldSpread[k] = Math.min(m.fieldSpread[k], r.fieldSpread[k]);
	const decisionKey = (d: { path: string; line: string }) => `${d.path}\t${d.line}`;
	const stale = unlisted(x.bffDecisions, unlisted(m.bffDecisions, r.technical, decisionKey), decisionKey);
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
			moduleCycles: x.moduleCycles.filter((c) => m.moduleCycles.includes(c.modules))
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

const BFF_FILE = /^src\/lib\/server\/|\+(page|layout)\.server\.ts$|\+server\.ts$|^src\/hooks\.server\.ts$/;

function measure(out: string): Measured {
	const read = scripts(out, ['02-imports.ts', '05-knowledge.ts']);
	const spread = read('m4-field-spread.csv')
		.map((r) => +r.prod_files)
		.sort((a, b) => a - b);
	const bff = git(['ls-files', 'src']).split('\n').filter((p) => BFF_FILE.test(p) && p.endsWith('.ts'));
	const isProdModule = (m: string) => /^(fe|bff|be|db|shared):/.test(m);
	return {
		fieldSpread: { median: median(spread), p90: quantile(spread, 0.9), max: spread.at(-1) ?? 0 },
		bffDecisions: bff.flatMap((path) =>
			readFileSync(join(ROOT, path), 'utf8')
				.split('\n')
				.filter((l) => [...l.matchAll(STATUS_CMP), ...l.matchAll(ANCHORED_RE)].length)
				.map((l) => ({ path, line: l.trim() }))
		),
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
			.filter((e) => e.type_only === 'no' && e.from.split('/')[0] !== e.to.split('/')[0] && [e.from, e.to].every((p) => /^(src|backend)\//.test(p)))
			.map((e) => `${e.from} -> ${e.to}`)
	};
}

function prSize(base: string) {
	const prod = changedFiles(base, 'HEAD')
		.map((f) => classify(f.path))
		.filter((c) => c.kind === 'prod' && ARCH_LAYERS.includes(c.layer));
	return { files: prod.length, modules: new Set(prod.map((c) => c.module)).size, layers: new Set(prod.map((c) => c.layer)).size };
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
	const technicalAdded = baseRatchet ? unlisted(ratchet.technical, baseRatchet.technical, (t) => `${t.path}\t${t.line}`).length : 0;
	const warnings = advise({ prSize: base && !cochange ? prSize(base) : undefined, coChange: pairs, technicalAdded }, ratchet);
	if (pairs !== undefined) console.log(`Fitness: ${pairs} production file pairs across layers change together without an import (6 months)`);
	const say = (level: 'error' | 'warning', f: Finding) => console.log(github ? `::${level} title=Fitness ${f.check}::${f.message}` : `${level} [${f.check}] ${f.message}`);
	errors.forEach((f) => say('error', f));
	warnings.forEach((f) => say('warning', f));
	if (m) {
		const values = `field spread median ${m.fieldSpread.median}, P90 ${m.fieldSpread.p90}, max ${m.fieldSpread.max}; BFF decisions ${m.bffDecisions.length}; cross-layer value lists ${m.literalSets.length}; entity mirrors ${m.entityMirrors.length}; module cycles ${m.moduleCycles.length}; boundary imports ${m.boundaryImports.length}`;
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
