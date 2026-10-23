// Step 1: repo map. Every tracked file at HEAD -> layer, kind, module, LOC.
// Out: out/files.csv, out/layers.csv, out/excluded.csv
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, classify, csv, excludedBecause, git } from './lib';

const files = git(['ls-files', '-z']).split('\0').filter(Boolean);
const rows: Record<string, unknown>[] = [];
const excluded: Record<string, unknown>[] = [];
for (const path of files) {
	const reason = excludedBecause(path);
	if (reason) {
		excluded.push({ path, reason });
		continue;
	}
	let loc = 0;
	try {
		const text = readFileSync(join(ROOT, path), 'utf8');
		loc = text.split('\n').filter((l) => l.trim()).length;
	} catch {
		/* unreadable, e.g. a symlink */
	}
	rows.push({ path, ...classify(path), loc });
}
csv('files.csv', rows, ['path', 'layer', 'kind', 'module', 'loc']);
csv('excluded.csv', excluded, ['path', 'reason']);

const agg = new Map<string, { layer: string; kind: string; files: number; loc: number; modules: Set<string> }>();
for (const r of rows as { layer: string; kind: string; module: string; loc: number }[]) {
	const k = `${r.layer}|${r.kind}`;
	const a = agg.get(k) ?? { layer: r.layer, kind: r.kind, files: 0, loc: 0, modules: new Set() };
	a.files++;
	a.loc += r.loc;
	a.modules.add(r.module);
	agg.set(k, a);
}
csv(
	'layers.csv',
	[...agg.values()].sort((a, b) => b.loc - a.loc).map((a) => ({ ...a, modules: a.modules.size })),
	['layer', 'kind', 'files', 'loc', 'modules']
);
const byReason = new Map<string, number>();
for (const e of excluded as { reason: string }[]) byReason.set(e.reason, (byReason.get(e.reason) ?? 0) + 1);
csv('excluded-summary.csv', [...byReason].map(([reason, files]) => ({ reason, files })));
