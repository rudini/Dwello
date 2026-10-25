// Module dependency graph as Graphviz DOT, from the output of 02-imports: production modules only,
// edge label = number of file imports, edges inside a module cycle in red.
// Usage: bun run deps:graph   (writes build/deps/modules.svg; needs Graphviz `dot`)
import { readCsv } from './lib';

type Edge = { from: string; to: string; file_edges: string };

const COLORS: Record<string, string> = { fe: '#4e79a7', bff: '#f28e2b', be: '#59a14f', db: '#b07aa1', shared: '#9c755f' };
const layer = (m: string) => m.split(':')[0];

export function dot(edges: Edge[], cycles: { modules: string }[]): string {
	const prod = edges.filter((e) => COLORS[layer(e.from)] && COLORS[layer(e.to)]);
	const cycleOf = new Map(cycles.flatMap((c, i) => c.modules.split(' ').map((m) => [m, i] as const)));
	const nodes = new Set(prod.flatMap((e) => [e.from, e.to]));
	return [
		'digraph modules {',
		'\trankdir=LR; node [shape=box, style="rounded,filled", fontname=Helvetica, fontcolor=white];',
		...[...nodes].map((n) => `\t"${n}" [fillcolor="${COLORS[layer(n)]}"];`),
		...prod.map((e) => {
			const red = cycleOf.has(e.from) && cycleOf.get(e.from) === cycleOf.get(e.to);
			return `\t"${e.from}" -> "${e.to}" [label="${e.file_edges}"${red ? ', color=red' : ''}];`;
		}),
		'}'
	].join('\n');
}

if (import.meta.main) console.log(dot(readCsv('imports-module.csv') as Edge[], readCsv('cycles-module.csv') as { modules: string }[]));
