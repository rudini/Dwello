// Step 2: feature units and commit history.
// Unit = one change that landed on main: a PR merge commit on the first-parent
// line of main (title = PR title from the merge body), or a direct/squashed
// commit on that line. The unit's diff is first-parent..merge (net change of the PR).
// Also the commit-level history (all non-merge commits reachable from main),
// used for change frequency (M3) and commit-level coupling (M2, alternative view).
// Out: out/units.csv, out/unit-files.csv, out/commits.csv, out/commit-files.csv,
//      out/excluded-units.csv
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ARCH_LAYERS, BASE, FORMAT_ONLY, SINCE, changedFiles, classify, csv, excludedBecause, git, parseNumstat , HERE } from './lib';

const TYPE_RE = /^(\w+)(?:\(([^)]*)\))?!?:\s*(.*)$/;
const parseType = (title: string) => {
	const m = title.match(TYPE_RE);
	return m ? { type: m[1].toLowerCase(), scope: m[2] ?? '' } : { type: 'none', scope: '' };
};

const overrides: Record<string, string> = JSON.parse(readFileSync(join(HERE, 'unit-types.json'), 'utf8'));

const log = git(['log', BASE, `--since=${SINCE}`, '--first-parent', '--format=%H%x1f%P%x1f%ad%x1f%s%x1f%b%x1e', '--date=short']);
const units: Record<string, unknown>[] = [];
const unitFiles: Record<string, unknown>[] = [];
const excludedUnits: Record<string, unknown>[] = [];

for (const rec of log.split('\x1e')) {
	const [sha, parents, date, subject, body] = rec.trim().split('\x1f');
	if (!sha) continue;
	const ps = parents.split(' ');
	const merge = ps.length > 1;
	let pr: string;
	let branch = '';
	let title = subject;
	if (merge) {
		const m = subject.match(/^Merge pull request #(\d+) from [^/]+\/(.+)$/);
		pr = m?.[1] ?? subject.match(/\(#(\d+)\)\s*$/)?.[1] ?? '';
		branch = m?.[2] ?? '';
		title = m ? ((body ?? '').split('\n').find((l) => l.trim())?.trim() ?? subject) : subject;
	} else {
		pr = subject.match(/\(#(\d+)\)\s*$/)?.[1] ?? '';
	}
	if (merge && !pr) {
		excludedUnits.push({ sha: sha.slice(0, 10), pr, title: subject, reason: 'sync merge on main (not a PR): diff would repeat other units' });
		continue;
	}
	const id0 = pr ? `PR#${pr}` : `c:${sha.slice(0, 8)}`;
	const parsed = parseType(title);
	const type = overrides[id0] ?? parsed.type;
	const scope = parsed.scope;
	if (FORMAT_ONLY.test(title)) {
		excludedUnits.push({ sha: sha.slice(0, 10), pr, title, reason: 'formatting-only title' });
		continue;
	}
	const subjects = merge ? git(['log', '--no-merges', '--format=%s', `${ps[0]}..${ps[1]}`]).trim().split('\n').filter(Boolean) : [subject];
	const commits = subjects.length;
	const featCommits = subjects.filter((s) => /^feat\b/.test(s)).length;
	const all = changedFiles(ps[0], sha);
	const files = all.filter((f) => !excludedBecause(f.path));
	if (!files.length) {
		excludedUnits.push({ sha: sha.slice(0, 10), pr, title, reason: all.length ? 'only excluded files' : 'whitespace-only or empty diff' });
		continue;
	}
	const id = id0;
	const cls = files.map((f) => ({ ...f, ...classify(f.path) }));
	const of = (k: string) => cls.filter((c) => c.kind === k);
	const prod = of('prod');
	const test = of('test');
	const prodLayers = [...new Set(prod.map((c) => c.layer))].filter((l) => ARCH_LAYERS.includes(l));
	const perLayer = Object.fromEntries(
		['FE', 'BFF', 'Backend', 'DB', 'Shared/Contracts', 'Tests-Unit', 'Tests-Acceptance', 'Tooling', 'Docs', 'Process', 'Marketing'].map((l) => [
			`n_${l}`,
			cls.filter((c) => c.layer === l).length
		])
	);
	units.push({
		id,
		sha: sha.slice(0, 10),
		date,
		kind: merge ? 'pr-merge' : pr ? 'squash' : 'direct',
		type,
		type_source: overrides[id0] ? 'override' : 'title',
		scope,
		title,
		branch,
		commits,
		feat_commits: featCommits,
		files_total: cls.length,
		files_prod: prod.length,
		files_test: test.length,
		files_other: of('other').length,
		modules_prod: new Set(prod.map((c) => c.module)).size,
		modules_test: new Set(test.map((c) => c.module)).size,
		layers_prod: prodLayers.length,
		layers_prod_list: prodLayers.join('|'),
		layers_all: new Set(cls.map((c) => c.layer)).size,
		i18n_files: cls.filter((c) => c.module === 'fe:i18n').length,
		loc_prod: prod.reduce((s, c) => s + c.added + c.deleted, 0),
		loc_test: test.reduce((s, c) => s + c.added + c.deleted, 0),
		...perLayer
	});
	for (const c of cls)
		unitFiles.push({ id, date, type, path: c.path, layer: c.layer, kind: c.kind, module: c.module, added: c.added, deleted: c.deleted });
}
csv('units.csv', units);
csv('unit-files.csv', unitFiles);

// Commit level: every non-merge commit reachable from main in the window.
const clog = git(['log', BASE, `--since=${SINCE}`, '--no-merges', '-w', '--ignore-blank-lines', '-M', '--numstat', '--format=\x1e%H\x1f%ad\x1f%s', '--date=short']);
const commits: Record<string, unknown>[] = [];
const commitFiles: Record<string, unknown>[] = [];
let fmt = 0;
for (const rec of clog.split('\x1e')) {
	const nl = rec.indexOf('\n');
	const head = nl < 0 ? rec : rec.slice(0, nl);
	const [sha, date, subject] = head.split('\x1f');
	if (!sha) continue;
	if (FORMAT_ONLY.test(subject)) {
		fmt++;
		excludedUnits.push({ sha: sha.slice(0, 10), pr: '', title: subject, reason: 'commit: formatting-only subject' });
		continue;
	}
	const files = parseNumstat(rec.slice(nl + 1)).filter((f) => !excludedBecause(f.path));
	if (!files.length) continue;
	const { type, scope } = parseType(subject);
	commits.push({ sha: sha.slice(0, 10), date, type, scope, subject, files: files.length });
	for (const f of files) {
		const c = classify(f.path);
		commitFiles.push({ sha: sha.slice(0, 10), date, type, path: f.path, layer: c.layer, kind: c.kind, module: c.module, added: f.added, deleted: f.deleted });
	}
}
csv('commits.csv', commits);
csv('commit-files.csv', commitFiles);
csv('excluded-units.csv', excludedUnits, ['sha', 'pr', 'title', 'reason']);
console.log(`units ${units.length}, commits ${commits.length}, formatting-only commits ${fmt}`);
