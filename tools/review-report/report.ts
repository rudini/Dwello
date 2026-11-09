// Reviewer report of a pull request (#1273): what it changed, as a sticky comment with Mermaid diagrams and an HTML
// report with the full detail. Data from tools/arch-baseline (02-imports, schema.ts) and the fitness run. Never a gate.

import { tablesOf } from '../arch-baseline/lib';

type Edge = { from: string; to: string };
export type Graph = { edges: Edge[]; cycles: string[] };
/** changes: flows only, the number of calls the pull request adds or removes */
export type Diagram = { mermaid: string; nodes: string[]; notes: string[]; changes?: number };

const ADDED = 'stroke:#1a7f37,stroke-width:2px';
const REMOVED = 'stroke:#cf222e,stroke-width:2px';
const key = (e: Edge) => `${e.from} ${e.to}`;
/** Module dependencies against the layer direction (as boundary-import of tools/fitness): a component into the BFF, the shared types into the frontend */
const AGAINST = [
	['fe:', 'bff:'],
	['shared:', 'fe:']
];
/** Above this many nodes a diagram is summarised in the comment and shown in full in the HTML report only */
const COMMENT_NODES = 30;

/** Import graph around the changed modules: their new edges green, removed ones red (unchanged edges stay out) */
export function moduleDiagram(base: Graph, head: Graph, changed: string[]): Diagram {
	const near = (e: Edge) => changed.includes(e.from) || changed.includes(e.to);
	const [was, is] = [new Set(base.edges.map(key)), new Set(head.edges.map(key))];
	const edges = [...head.edges.filter((e) => !was.has(key(e))), ...base.edges.filter((e) => !is.has(key(e)))].filter(near);
	const nodes = [...new Set(edges.flatMap((e) => [e.from, e.to]))].sort();
	const id = (m: string) => `n${nodes.indexOf(m)}`;
	const lines = edges.map((e) => (is.has(key(e)) ? `${id(e.from)} -->|new| ${id(e.to)}` : `${id(e.from)} -.->|removed| ${id(e.to)}`));
	const styles = edges.map((e, i) => `linkStyle ${i} ${is.has(key(e)) ? ADDED : REMOVED}`);
	const against = edges.filter((e) => is.has(key(e)) && AGAINST.some(([from, to]) => e.from.startsWith(from) && e.to.startsWith(to)));
	const notes = [...head.cycles.filter((c) => !base.cycles.includes(c)).map((c) => `New cycle: ${c}`), ...against.map((e) => `Against the layer direction: ${e.from} → ${e.to}`)];
	return { mermaid: ['flowchart LR', ...nodes.map((m) => `${id(m)}["${m}"]`), ...lines, ...styles].join('\n  '), nodes, notes };
}

/** A diagram as a section of the comment, or its summary when it has more nodes than COMMENT_NODES */
export function inComment(title: string, d: Diagram): string {
	const body = d.nodes.length > COMMENT_NODES ? `${d.nodes.length} nodes, too many for the comment: see the full diagram in the HTML report (artifact «review-report»).` : '```mermaid\n' + d.mermaid + '\n```';
	return `### ${title}\n\n${body}\n${d.notes.map((n) => `\n- ${n}`).join('')}${d.notes.length ? '\n' : ''}`;
}

/** Tables of schema.ts the pull request adds, changes or removes, their fields and relations; the new migrations as notes */
export function erDiagram(baseSchema: string, headSchema: string, migrations: string[]): Diagram {
	const [was, is] = [new Map(tablesOf(baseSchema).map((t) => [t.table, t])), new Map(tablesOf(headSchema).map((t) => [t.table, t]))];
	const same = (a: string[], b: string[]) => a.join() === b.join();
	const changed = [...new Set([...was.keys(), ...is.keys()])]
		.filter((t) => !was.has(t) || !is.has(t) || !same(was.get(t)!.fields, is.get(t)!.fields) || !same(was.get(t)!.refs, is.get(t)!.refs))
		.sort();
	const relations = changed.flatMap((t) => {
		const [before, after] = [was.get(t)?.refs ?? [], is.get(t)?.refs ?? []];
		return [...new Set([...after, ...before])].map((to) => ({ from: t, to, mark: !before.includes(to) ? 'new' : !after.includes(to) ? 'removed' : 'references' }));
	});
	const nodes = [...changed, ...[...new Set(relations.map((r) => r.to))].filter((t) => !changed.includes(t))];
	const id = (t: string) => `t${nodes.indexOf(t)}`;
	const entity = (t: string) => {
		if (!changed.includes(t)) return [`${id(t)}["${t}"]`];
		const [before, after] = [was.get(t)?.fields ?? [], is.get(t)?.fields ?? []];
		const state = !was.has(t) ? ' (new)' : !is.has(t) ? ' (removed)' : '';
		const fields = [...after.map((f) => (before.includes(f) ? `  col ${f}` : `  col ${f} "new"`)), ...before.filter((f) => !after.includes(f)).map((f) => `  col ${f} "removed"`)];
		return [`${id(t)}["${t}${state}"] {`, ...fields, '}'];
	};
	const lines = [...nodes.flatMap(entity), ...relations.map((r) => `${id(r.to)} ||--o{ ${id(r.from)} : "${r.mark}"`)];
	return { mermaid: ['erDiagram', ...lines].join('\n  '), nodes, notes: migrations.map((m) => `New migration: ${m}`) };
}

/** A tree of files (base or head): its texts, its files and its file imports (02-imports) */
export type Tree = { read: (path: string) => string | undefined; files: string[]; imports: Edge[] };
type Call = { from: string; to: string; label: string };

const BFF_ROUTE = /^src\/routes\/(.*\/)?\+(page\.server|layout\.server|server)\.ts$/;
const callKey = (c: Call) => `${c.from}\t${c.to}\t${c.label}`;

/** The calls of one BFF route: Browser → BFF route (and its src/lib/server helpers) → Elysia route → service → tables */
function calls(t: Tree, bff: string): Call[] {
	const helpers = [bff];
	for (const f of helpers) for (const e of t.imports) if (e.from === f && e.to.startsWith('src/lib/server/') && !helpers.includes(e.to)) helpers.push(e.to);
	if (t.read(bff) === undefined) return [];
	const prefixes = [...new Set(helpers.flatMap((f) => endpoints(t.read(f) ?? '')))];
	return [{ from: 'Browser', to: bff, label: 'request' }, ...prefixes.flatMap((prefix) => backendCalls(t, bff, prefix))];
}

/** Backend prefixes a file calls: `/api/v1/<name>` written out, or `${API}/<name>` with a constant API that ends in /api/v1 */
function endpoints(text: string): string[] {
	const constants = [...text.matchAll(/const (\w+) = `[^`]*\/api\/v1`/g)].map((m) => m[1]);
	const viaConstant = constants.flatMap((name) => [...text.matchAll(new RegExp(`\\$\\{${name}\\}/([a-z0-9-]+)`, 'g'))].map((m) => `/api/v1/${m[1]}`));
	return [...[...text.matchAll(/\/api\/v1\/[a-z0-9-]+/g)].map((m) => m[0]), ...viaConstant];
}

/** The Elysia route with this prefix, its services and the schema tables each imports */
function backendCalls(t: Tree, bff: string, prefix: string): Call[] {
	const routes = t.files.filter((f) => f.startsWith('backend/src/routes/'));
	// an Elysia route with the prefix itself, or with the prefix /api/v1 alone and the rest in its paths
	const route =
		routes.find((f) => t.read(f)?.includes(`prefix: '${prefix}'`)) ??
		routes.find((f) => t.read(f)?.includes("prefix: '/api/v1'") && t.read(f)?.includes(`'${prefix.slice('/api/v1'.length)}`));
	if (!route) return [];
	const services = t.imports.filter((e) => e.from === route && e.to.startsWith('backend/src/services/')).map((e) => e.to);
	const tables = (service: string) => (/import \{([^}]*)\} from '\.\.\/db\/schema'/.exec(t.read(service) ?? '')?.[1] ?? '').split(',').map((n) => n.trim()).filter((n) => /^[a-z]\w*$/.test(n));
	return [
		{ from: bff, to: route, label: prefix },
		...services.flatMap((service) => [{ from: route, to: service, label: 'call' }, ...tables(service).map((table) => ({ from: service, to: 'Database', label: table }))])
	];
}

/** One changed route as a sequence diagram: calls only the head has green, calls only the base has red */
export function flowDiagram(base: Tree, head: Tree, bff: string): Diagram {
	const [was, is] = [calls(base, bff), calls(head, bff)];
	const [wasKeys, isKeys] = [new Set(was.map(callKey)), new Set(is.map(callKey))];
	const all = [...is, ...was.filter((c) => !isKeys.has(callKey(c)))];
	const nodes = [...new Set(all.flatMap((c) => [c.from, c.to]))];
	const id = (n: string) => `p${nodes.indexOf(n)}`;
	const arrow = (c: Call, mark = '') => `${id(c.from)}->>${id(c.to)}: ${c.label}${mark}`;
	const block = (colour: string, items: string[]) => (items.length ? [`rect rgb(${colour})`, ...items, 'end'] : []);
	const lines = [
		...nodes.map((n) => `participant ${id(n)} as ${n}`),
		...is.filter((c) => wasKeys.has(callKey(c))).map((c) => arrow(c)),
		...block('218, 251, 225', is.filter((c) => !wasKeys.has(callKey(c))).map((c) => arrow(c, ' (new)'))),
		...block('255, 235, 233', was.filter((c) => !isKeys.has(callKey(c))).map((c) => arrow(c, ' (removed)')))
	];
	return { mermaid: ['sequenceDiagram', ...lines].join('\n  '), nodes, notes: [], changes: all.length - is.filter((c) => wasKeys.has(callKey(c))).length };
}

/** The BFF routes whose flow a change touches: changed BFF routes, and those calling a changed Elysia route */
export function flowsFor(t: Tree, changed: string[]): string[] {
	const backend = changed.filter((f) => f.startsWith('backend/src/routes/'));
	const callers = t.files.filter((f) => BFF_ROUTE.test(f) && calls(t, f).some((c) => backend.includes(c.to)));
	return [...new Set([...changed.filter((f) => BFF_ROUTE.test(f)), ...callers])].sort();
}

/** Gate files as tools/open-work/check-issues.mjs knows them (#1269); a test keeps the two the same */
export const GATE_FILE =
	/^(\.github\/workflows\/|tools\/|\.claude\/(hooks|skills)\/)|(^|\/)CLAUDE\.md$|^(\.fallowrc\.json|deepcheck\.config\.json|\.(deepcheck|testcheck)-baseline\.json|vitest\.config\.ts|backend\/scripts\/coverage-check\.ts|backend\/bunfig\.toml)$/;

export type Report = {
	/** the pull request text, with the sections «Type», «Decisions» and «Risks» (#1271) */
	body: string;
	/** labels of the issues it closes */
	labels: string[];
	changed: string[];
	modules: Diagram;
	flows: { route: string; diagram: Diagram }[];
	er: Diagram;
	/** errors and warnings of the fitness run */
	fitness: string[];
	/** the structure indicators, base → pull request (tools/fitness --structure) */
	structure: string;
	/** the CI run, where the HTML report is an artifact */
	run: string;
	/** HTML report only: the DSM cells whose import count changed (dsmDiff) */
	dsm?: string;
};

/** A level-2 section of the pull request text, without its heading */
const section = (body: string, title: string) => new RegExp(`^## ${title}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm').exec(body)?.[1].trim() || '';
const list = (paths: string[]) => (paths.length ? paths.map((p) => `- \`${p}\``).join('\n') : '_None._');
const given = (text: string) => text || '_Not given._';

/** Flows with changed calls as diagrams (summarised above COMMENT_NODES nodes together), the others by name */
function flows(all: Report['flows'], full: boolean, diagram: (title: string, d: Diagram) => string): string {
	if (!all.length) return '### Flows\n\n_No route changed._\n';
	const [moving, same] = [all.filter((f) => f.diagram.changes), all.filter((f) => !f.diagram.changes)];
	const nodes = moving.reduce((n, f) => n + f.diagram.nodes.length, 0);
	const shown =
		nodes > COMMENT_NODES && !full
			? [`### Flows\n\n${moving.length} routes with changed calls, ${nodes} nodes, too many for the comment: see the HTML report (artifact «review-report»).\n\n${moving.map((f) => `- \`${f.route}\`: ${f.diagram.changes} changed calls`).join('\n')}\n`]
			: moving.map((f) => diagram(`Flow of ${f.route}`, f.diagram));
	return [...shown, ...(same.length ? [`Flows without a changed call: ${same.map((f) => `\`${f.route}\``).join(', ')}`] : [])].join('\n\n');
}

/** The sticky comment; `full` (the HTML report) shows every diagram whatever its size */
export function comment(r: Report, full = false): string {
	const diagram = (title: string, d: Diagram) => (d.nodes.length ? (full ? `### ${title}\n\n\`\`\`mermaid\n${d.mermaid}\n\`\`\`\n${d.notes.map((n) => `\n- ${n}`).join('')}\n` : inComment(title, d)) : `### ${title}\n\n_Not touched._\n`);
	return [
		'<!-- review-report -->\n## Reviewer report',
		`**Type:** ${given(section(r.body, 'Type'))} · **Issue label:** ${r.labels.join(', ') || '–'}`,
		`### Scenarios and step definitions\n\n${list(r.changed.filter((p) => /^tests\/e2e\/(features|steps)\//.test(p)))}`,
		`### Gate files\n\n${list(r.changed.filter((p) => GATE_FILE.test(p)))}`,
		`### Fitness and structure (base → pull request)\n\n${r.fitness.map((l) => `- ${l}`).join('\n') || '_No errors or warnings._'}\n\n${r.structure}`,
		`### Decisions\n\n${given(section(r.body, 'Decisions'))}`,
		`### Risks\n\n${given(section(r.body, 'Risks'))}`,
		diagram('Module dependencies', r.modules),
		flows(r.flows, full, diagram),
		diagram('Data model', r.er),
		'Screenshots before and after: the comment «UI screenshots», when the pull request changes a page.',
		`[HTML report and run](${r.run})`
	].join('\n\n');
}

/** Module pairs whose number of file imports changed, as a markdown table (the DSM diff of the HTML report) */
export function dsmDiff(base: (Edge & { weight: number })[], head: (Edge & { weight: number })[]): string {
	const weight = (edges: typeof base) => new Map(edges.map((e) => [key(e), e.weight]));
	const [was, is] = [weight(base), weight(head)];
	const rows = [...new Set([...is.keys(), ...was.keys()])]
		.filter((k) => (was.get(k) ?? 0) !== (is.get(k) ?? 0))
		.sort()
		.map((k) => `| ${k.split(' ').join(' | ')} | ${was.get(k) ?? 0} | ${is.get(k) ?? 0} |`);
	return ['| From | To | Base | Pull request |', '|---|---|---|---|', ...rows].join('\n');
}

/** The HTML report: the comment with every diagram in full and the DSM diff, rendered in the browser (marked, mermaid) */
export function html(r: Report): string {
	const markdown = `${comment(r, true)}\n\n### DSM diff\n\n${r.dsm ?? ''}\n`;
	return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Reviewer report</title>
<style>body{font-family:system-ui,sans-serif;max-width:1100px;margin:2rem auto;padding:0 1rem}table{border-collapse:collapse}td,th{border:1px solid #888;padding:2px 8px}</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.9.1/mermaid.min.js"></script></head><body><main id="report"></main><script>
const report = document.getElementById('report');
report.innerHTML = marked.parse(${JSON.stringify(markdown).replace(/</g, '\\u003c')});
for (const code of report.querySelectorAll('code.language-mermaid')) { const div = document.createElement('div'); div.className = 'mermaid'; div.textContent = code.textContent; code.parentElement.replaceWith(div); }
mermaid.run();
</script></body></html>
`;
}

// ---------------------------------------------------------------- command line (CI step «Reviewer report»)
// REVIEW_DIR=build/review bun tools/review-report/report.ts --base <ref>
//   reads $REVIEW_DIR/{base,head} and structure.md (tools/fitness/fitness.ts --structure with REVIEW_DIR) and fitness.txt
//   (its output), PR_BODY, GITHUB_TOKEN, GITHUB_REPOSITORY, RUN_URL; writes $REVIEW_DIR/comment.md and index.html
if (import.meta.main) {
	const { existsSync, readFileSync, writeFileSync } = await import('node:fs');
	const { join } = await import('node:path');
	const { ROOT, git } = await import('../arch-baseline/lib');
	const dir = process.env.REVIEW_DIR ?? 'build/review';
	const args = process.argv.slice(2);
	const base = git(['merge-base', args[args.indexOf('--base') + 1], 'HEAD']).trim();
	const text = (path: string) => (existsSync(path) ? readFileSync(path, 'utf8') : '');
	const rows = (side: string, name: string): Record<string, string>[] => JSON.parse(text(join(dir, side, name + '.json')) || '[]');
	const show = (path: string) => {
		try {
			return git(['show', `${base}:${path}`]);
		} catch {
			return undefined; // not on the base
		}
	};
	const tree = (side: string, read: (path: string) => string | undefined): Tree => ({
		read,
		files: rows(side, 'files.csv').map((f) => f.path),
		imports: rows(side, 'imports-file.csv').map((e) => ({ from: e.from, to: e.to }))
	});
	const [was, is] = [tree('base', show), tree('head', (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), 'utf8') : undefined))];
	const changed = git(['diff', '--name-only', base, 'HEAD']).split('\n').filter(Boolean);
	const prod = (m: string) => /^(fe|bff|be|db|shared):/.test(m);
	const graph = (side: string) => ({
		edges: rows(side, 'imports-module.csv').filter((e) => prod(e.from) && prod(e.to)).map((e) => ({ from: e.from, to: e.to, weight: +e.file_edges })),
		cycles: rows(side, 'cycles-module.csv')
			.map((c) => c.modules)
			.filter((c) => c.split(' ').every(prod))
	});
	const [baseGraph, headGraph] = [graph('base'), graph('head')];
	const modules = [...new Set([...rows('base', 'files.csv'), ...rows('head', 'files.csv')].filter((f) => changed.includes(f.path) && prod(f.module)).map((f) => f.module))];
	const body = process.env.PR_BODY ?? '';
	const labels: string[] = [];
	for (const [, n] of body.matchAll(/\b(?:fix(?:es|ed)?|close[sd]?|resolve[sd]?)\s+#(\d+)/gi)) {
		const response = process.env.GITHUB_TOKEN ? await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/issues/${n}`, { headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }) : undefined;
		if (response?.ok) labels.push(...((await response.json()) as { labels: { name: string }[] }).labels.map((l) => `#${n} ${l.name}`));
	}
	const schema = 'backend/src/db/schema.ts';
	const report: Report = {
		body,
		labels,
		changed,
		modules: moduleDiagram(baseGraph, headGraph, modules),
		flows: flowsFor(is, changed).map((route) => ({ route, diagram: flowDiagram(was, is, route) })),
		er: erDiagram(show(schema) ?? '', is.read(schema) ?? '', git(['diff', '--name-only', '--diff-filter=A', base, 'HEAD', '--', 'backend/migrations/*.sql']).split('\n').filter(Boolean)),
		fitness: text(join(dir, 'fitness.txt'))
			.split('\n')
			.map((l) => /^::(error|warning) title=([^:]*)::(.*)$/.exec(l))
			.filter((m) => m !== null)
			.map(([, level, title, message]) => `${level} [${title}] ${message}`),
		structure: text(join(dir, 'structure.md')),
		run: process.env.RUN_URL ?? '',
		dsm: dsmDiff(baseGraph.edges, headGraph.edges)
	};
	writeFileSync(join(dir, 'comment.md'), comment(report));
	writeFileSync(join(dir, 'index.html'), html(report));
	console.log(`Reviewer report: ${join(dir, 'comment.md')}, ${join(dir, 'index.html')}`);
}
