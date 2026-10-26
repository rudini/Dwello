// Precision of testcheck per rule on Dwello and the pinned repositories of corpus.json, from the labels in
// labels.json (one per finding: "tp" when the finding is right, "fp" when not). Usage:
//   node tools/testcheck/eval/measure.ts <cache dir> [--unlabelled|--all <file>]
// Clones missing repositories into the cache dir; writes the findings without a label as JSON lines.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { scan } from '../src/cli.ts';

interface Repo {
	name: string;
	url: string;
	sha: string;
	/** Added after the rules were tuned on the others: their precision is the out-of-sample estimate. */
	holdout?: boolean;
}

const here = (file: string) => new URL(file, import.meta.url);
const corpus: Repo[] = JSON.parse(readFileSync(here('corpus.json'), 'utf8')).repos;
const labels: Record<string, 'tp' | 'fp'> = Object.fromEntries(
	Object.entries(JSON.parse(readFileSync(here('labels.json'), 'utf8')).labels as Record<string, { label: 'tp' | 'fp' }>).map(([k, v]) => [k, v.label])
);

/** A repository checked out at its pinned commit, cloned on first use. */
function checkout(cache: string, repo: Repo): string {
	const dir = join(cache, repo.name);
	if (!existsSync(join(dir, '.git'))) {
		mkdirSync(dir, { recursive: true });
		const git = (...args: string[]) => execFileSync('git', ['-C', dir, ...args], { stdio: 'ignore' });
		git('init', '-q');
		git('fetch', '-q', '--depth', '1', repo.url, repo.sha);
		git('checkout', '-q', 'FETCH_HEAD');
	}
	return dir;
}

/** Wilson score interval, lower bound at 95 %: how low the precision may be given the sample. */
function wilsonLow(tp: number, n: number): number {
	if (n === 0) return 0;
	const z = 1.96;
	const p = tp / n;
	return (p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / (1 + (z * z) / n);
}

const [cache, flag, out] = process.argv.slice(2);
if (!cache) throw new Error('usage: measure.ts <cache dir> [--unlabelled <file>]');
const root = new URL('../../..', import.meta.url).pathname;
const findings = [
	...scan(['src', 'backend/src', 'tools', 'tests'].map((p) => join(root, p)), root).map((f) => ({ ...f, repo: 'dwello', holdout: false })),
	...corpus.flatMap((repo) => {
		const dir = checkout(cache, repo);
		return scan([dir], dir).map((f) => ({ ...f, repo: repo.name, holdout: !!repo.holdout }));
	})
];
const key = (f: { repo: string; file: string; test: string; rule: string }) => `${f.repo}/${f.file}#${f.test}#${f.rule}`;
function tallyByRule(part: typeof findings) {
	const rules = new Map<string, { n: number; tp: number; fp: number }>();
	for (const f of part) {
		const r = rules.get(f.rule) ?? { n: 0, tp: 0, fp: 0 };
		r.n++;
		r.tp += Number(labels[key(f)] === 'tp');
		r.fp += Number(labels[key(f)] === 'fp');
		rules.set(f.rule, r);
	}
	return rules;
}

const percent = (part: number, whole: number) => (whole ? `${((100 * part) / whole).toFixed(0)} %` : '–');

function table(title: string, part: typeof findings): void {
	const rules = tallyByRule(part);
	console.log(`\n${title}\n\n| Rule | Findings | Labelled | Precision | 95 % lower bound |\n|---|---|---|---|---|`);
	for (const [rule, r] of [...rules].sort()) {
		const labelled = r.tp + r.fp;
		console.log(`| \`${rule}\` | ${r.n} | ${labelled} | ${percent(r.tp, labelled)} | ${percent(wilsonLow(r.tp, labelled), 1)} |`);
	}
}
table('Tuning corpus (Dwello and the repositories the rules were tuned on)', findings.filter((f) => !f.holdout));
table('Holdout corpus', findings.filter((f) => f.holdout));
if ((flag === "--unlabelled" || flag === "--all") && out)
	writeFileSync(out, findings.filter((f) => flag === "--all" || !labels[key(f)]).map((f) => JSON.stringify({ key: key(f), ...f })).join('\n') + '\n');
