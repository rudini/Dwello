// Step 1: import graph on file and module level, cycles via Tarjan SCC.
// Static imports, re-exports and dynamic import('...') of .ts/.js/.svelte files.
// Resolves relative paths and the SvelteKit alias $lib; packages, $app, $env and
// generated ./$types are external and dropped.
// Out: out/imports-file.csv, out/imports-module.csv, out/cycles-file.csv, out/cycles-module.csv
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { ROOT, classify, csv, excludedBecause, git } from './lib';

const SRC = /\.(ts|js|mjs|svelte)$/;
const files = git(['ls-files', '-z'])
	.split('\0')
	.filter((p) => SRC.test(p) && !excludedBecause(p) && !p.endsWith('.d.ts'));
const known = new Set(files);

const IMPORT_RE =
	/(?:import|export)\s+(type\s+)?(?:[\w*{}\s,$]+?\s+from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;

/** Path a specifier points to before extensions are tried: $lib alias or relative; null for packages. */
function basePath(from: string, spec: string): string | null {
	if (spec.startsWith('$lib')) return normalize('src/lib' + spec.slice(4));
	return spec.startsWith('.') ? normalize(join(dirname(from), spec)) : null;
}

function resolve(from: string, spec: string): string | null {
	const base = basePath(from, spec);
	if (base === null) return null;
	const stem = base.replace(/\.js$/, '');
	const candidates = [base, stem + '.ts', base + '.ts', base + '.js', base + '.svelte', base + '/index.ts', base + '/index.js'];
	return candidates.find((c) => known.has(c)) ?? null;
}

const edges: { from: string; to: string; typeOnly: boolean }[] = [];
const unresolved = new Map<string, number>();
for (const f of files) {
	const text = readFileSync(join(ROOT, f), 'utf8');
	const seen = new Set<string>();
	for (const m of text.matchAll(IMPORT_RE)) {
		const spec = m[2] ?? m[3];
		if (spec.endsWith('/$types') || spec.includes('paraglide')) continue;
		const to = resolve(f, spec);
		if (to) {
			const typeOnly = !!m[1];
			const prev = edges.find((e) => e.from === f && e.to === to);
			if (prev) prev.typeOnly &&= typeOnly;
			else if (to !== f && !seen.has(to)) {
				edges.push({ from: f, to, typeOnly });
				seen.add(to);
			}
		} else if (spec.startsWith('.') || spec.startsWith('$lib')) {
			if (!existsSync(join(ROOT, dirname(f), spec))) unresolved.set(f, (unresolved.get(f) ?? 0) + 1);
		}
	}
}

csv(
	'imports-file.csv',
	edges.map((e) => ({
		from: e.from,
		to: e.to,
		type_only: e.typeOnly ? 'yes' : 'no',
		from_layer: classify(e.from).layer,
		to_layer: classify(e.to).layer,
		from_module: classify(e.from).module,
		to_module: classify(e.to).module
	}))
);

const modEdges = new Map<string, number>();
for (const e of edges) {
	const a = classify(e.from).module;
	const b = classify(e.to).module;
	if (a !== b) modEdges.set(`${a}\t${b}`, (modEdges.get(`${a}\t${b}`) ?? 0) + 1);
}
csv(
	'imports-module.csv',
	[...modEdges].map(([k, n]) => {
		const [from, to] = k.split('\t');
		return { from, to, file_edges: n };
	})
);

/** Nodes reachable from start (start included). */
function reach(start: string, adj: Map<string, string[]>): Set<string> {
	const next = (v: string) => adj.get(v) ?? [];
	const seen = new Set([start]);
	const queue = [start];
	for (const v of queue)
		for (const w of next(v)) {
			if (seen.has(w)) continue;
			seen.add(w);
			queue.push(w);
		}
	return seen;
}

/** Strongly connected components with more than one node: nodes that reach each other. */
function tarjan(nodes: string[], adj: Map<string, string[]>): string[][] {
	const reachable = new Map(nodes.map((n) => [n, reach(n, adj)]));
	const done = new Set<string>();
	const out: string[][] = [];
	for (const n of nodes) {
		if (done.has(n)) continue;
		const comp = [...reachable.get(n)!].filter((m) => reachable.get(m)!.has(n));
		comp.forEach((c) => done.add(c));
		if (comp.length > 1) out.push(comp.sort());
	}
	return out;
}

const fileAdj = new Map<string, string[]>();
for (const e of edges) fileAdj.set(e.from, [...(fileAdj.get(e.from) ?? []), e.to]);
const fileCycles = tarjan(files, fileAdj);
const runtimeAdj = new Map<string, string[]>();
for (const e of edges) if (!e.typeOnly) runtimeAdj.set(e.from, [...(runtimeAdj.get(e.from) ?? []), e.to]);
const runtimeCycles = tarjan(files, runtimeAdj);
csv(
	'cycles-file.csv',
	fileCycles.map((c, i) => ({ cycle: i + 1, size: c.length, runtime: runtimeCycles.some((r) => r.join() === c.join()) ? 'yes' : 'no (type-only edge)', layers: [...new Set(c.map((f) => classify(f).layer))].join('|'), files: c.join(' ') }))
);

const modAdj = new Map<string, string[]>();
for (const k of modEdges.keys()) {
	const [a, b] = k.split('\t');
	modAdj.set(a, [...(modAdj.get(a) ?? []), b]);
}
const modCycles = tarjan([...new Set([...modEdges.keys()].flatMap((k) => k.split('\t')))], modAdj);
csv(
	'cycles-module.csv',
	modCycles.map((c, i) => ({ cycle: i + 1, size: c.length, modules: c.join(' ') }))
);

// Layer-to-layer edge matrix (production files only), for the report.
const layerEdges = new Map<string, number>();
for (const e of edges) {
	const a = classify(e.from);
	const b = classify(e.to);
	const k = `${a.layer}\t${b.layer}`;
	layerEdges.set(k, (layerEdges.get(k) ?? 0) + 1);
}
csv(
	'imports-layer.csv',
	[...layerEdges].map(([k, n]) => ({ from_layer: k.split('\t')[0], to_layer: k.split('\t')[1], file_edges: n }))
);
console.log(`files ${files.length}, edges ${edges.length}, file cycles ${fileCycles.length} (runtime ${runtimeCycles.length}), module cycles ${modCycles.length}, files with unresolved relative specs ${unresolved.size}`);
if (unresolved.size) console.log('files with unresolved relative specs:', [...unresolved]);
