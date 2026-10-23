// Shared helpers for the architecture baseline scripts: path classification,
// git access and CSV output. Run the scripts with Bun from the repo root.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HERE = dirname(fileURLToPath(import.meta.url));

export const ROOT = join(HERE, '..', '..');
// ARCH_OUT: another output directory, e.g. for tools/fitness, so the kept raw data stays untouched
export const OUT = process.env.ARCH_OUT ?? join(HERE, 'out');
mkdirSync(OUT, { recursive: true });

type Rule = { re: RegExp; layer?: string; kind?: string; module?: string; reason?: string; name?: string };
const cfg = JSON.parse(readFileSync(join(HERE, 'layers.json'), 'utf8'));
const compile = (rules: Record<string, string>[]): Rule[] =>
	rules.map((r) => ({ ...r, re: new RegExp(r.pattern) }));
const excludeRules = compile(cfg.exclude);
const layerRules = compile(cfg.layers);
const moduleRules = compile(cfg.modules);
const groupRules = compile(cfg.logicalGroups);
export const ARCH_LAYERS: string[] = cfg.architectureLayers;

export type FileClass = { layer: string; kind: 'prod' | 'test' | 'other'; module: string };

/** Reason a path is excluded from all metrics, or null. */
export function excludedBecause(path: string): string | null {
	return excludeRules.find((r) => r.re.test(path))?.reason ?? null;
}

const classCache = new Map<string, FileClass>();
export function classify(path: string): FileClass {
	let c = classCache.get(path);
	if (c) return c;
	const l = layerRules.find((r) => r.re.test(path))!;
	const m = moduleRules.find((r) => r.re.test(path))!;
	c = { layer: l.layer!, kind: l.kind as FileClass['kind'], module: path.replace(m.re, m.module!) };
	classCache.set(path, c);
	return c;
}

/** Logical file name for coupling: the i18n quartet collapses into one pseudo-file. */
export function logicalName(path: string): string {
	return groupRules.find((r) => r.re.test(path))?.name ?? path;
}

export function git(args: string[]): string {
	const p = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 30 });
	if (p.status !== 0) throw new Error(`git ${args.join(' ')}: ${p.stderr}`);
	return p.stdout;
}

export const BASE = process.env.ARCH_BASE ?? 'origin/main';
export const SINCE = process.env.ARCH_SINCE ?? '2026-04-23';

/**
 * Files changed in a diff, ignoring whitespace-only changes (`-w`): a file whose
 * change is only reformatting has 0 added and 0 deleted lines and is dropped.
 * Renames are followed so a moved file counts once under its new path.
 */
export function changedFiles(from: string, to: string): { path: string; added: number; deleted: number }[] {
	const out = git(['diff', '--numstat', '-w', '--ignore-blank-lines', '-M', from, to]);
	return parseNumstat(out);
}

const NUMSTAT = /^(\d+|-)\t(\d+|-)\t(.+)$/;
const count = (n: string) => (n === '-' ? 0 : +n);
// A text file with 0 added and 0 deleted lines changed only whitespace; '-' marks a binary file.
const changedText = (m: RegExpMatchArray) => m[1] === '-' || +m[1] + +m[2] > 0;

export function parseNumstat(out: string) {
	return out
		.split('\n')
		.map((line) => line.match(NUMSTAT))
		.filter((m): m is RegExpMatchArray => m !== null && changedText(m))
		.map((m) => ({ path: renameTarget(m[3]), added: count(m[1]), deleted: count(m[2]) }));
}

/** `a/{x => y}/b` and `x => y` rename notation -> new path. */
function renameTarget(p: string): string {
	if (!p.includes(' => ')) return p;
	const brace = p.match(/^(.*)\{(.*) => (.*)\}(.*)$/);
	if (brace) return (brace[1] + brace[3] + brace[4]).replace(/\/\//g, '/');
	return p.split(' => ')[1];
}

/** Subjects that mark a pure formatting change (rule 4). */
export const FORMAT_ONLY = /^\w+(\([^)]*\))?!?:\s*(re)?format\b|\bwith prettier\b|prettier --write|\bwhitespace only\b/i;

const cellText = (v: unknown) => (v === undefined || v === null ? '' : String(v));
const escapeCell = (v: unknown) => {
	const t = cellText(v);
	return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};

/** Writes out/<name> as CSV and, for the later scripts, the same rows as strings in out/<name>.json. */
export function csv(name: string, rows: Record<string, unknown>[], columns?: string[]): void {
	const cols = columns ?? Object.keys(rows[0] ?? {});
	const body = [cols.join(','), ...rows.map((r) => cols.map((c) => escapeCell(r[c])).join(','))].join('\n');
	const file = join(OUT, name);
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, body + '\n');
	writeFileSync(file + '.json', JSON.stringify(rows.map((r) => Object.fromEntries(cols.map((c) => [c, cellText(r[c])])))));
	console.log(`wrote ${name} (${rows.length} rows)`);
}

export function readCsv(name: string): Record<string, string>[] {
	return JSON.parse(readFileSync(join(OUT, name + '.json'), 'utf8'));
}

export function quantile(sorted: number[], q: number): number {
	if (!sorted.length) return 0;
	// nearest-rank method
	const idx = Math.max(0, Math.ceil(q * sorted.length) - 1);
	return sorted[idx];
}

export function median(values: number[]): number {
	const s = [...values].sort((a, b) => a - b);
	if (!s.length) return 0;
	const mid = Math.floor(s.length / 2);
	return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

// Signs of a domain decision (05-knowledge G4, tools/fitness): a comparison against a status value of statements or
// contracts (`status !== 'replaced'`) and an anchored regex literal (`/^\d{4}$/`, a validation rule)
export const STATUS = ['draft', 'sent', 'paid', 'replaced', 'overdue', 'settled', 'active', 'ended', 'future'];
const statusAlt = STATUS.join('|');
export const STATUS_CMP = new RegExp(`[!=]==\\s*['"\`](${statusAlt})['"\`]|['"\`](${statusAlt})['"\`]\\s*[!=]==`, 'g');
export const ANCHORED_RE = /\/\^[^/\n]+\$\/[a-z]*/g;

