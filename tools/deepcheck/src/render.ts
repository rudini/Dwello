import type { ModuleReport, ScanOutput } from './types.ts';

const indent = (lines: string[], by: string) => lines.map((l) => `${by}${l}\n`).join('');

function moduleBlock(m: ModuleReport): string {
	return `  ${m.score}  ${m.path}\n${indent(m.reasons, '      - ')}`;
}

const criterion = (out: ScanOutput) =>
	out.minScore === null ? `the threshold of ${out.failThreshold}` : `the min score of ${out.minScore}`;
const topNote = (out: ScanOutput) => (out.summary.shown < out.summary.shallow ? `, showing the top ${out.summary.shown}` : '');

export function renderHuman(out: ScanOutput): string {
	const { analyzed, shallow } = out.summary;
	const threshold = out.minScore === null ? `threshold ${out.failThreshold}` : `min score ${out.minScore}`;
	if (shallow === 0) return `deepcheck: no shallow modules among ${analyzed} analyzed (${threshold})\n`;
	const body = out.findings.map(moduleBlock).join('\n');
	const groups = out.groups ? `\nBy ${out.groups.length} group(s):\n${indent(out.groups.map((g) => `${g.count}  ${g.key} (max ${g.maxScore})`), '  ')}` : '';
	return `deepcheck: ${shallow} shallow module(s) of ${analyzed} analyzed (${threshold})${topNote(out)}\n\n${body}${groups}`;
}

const cell = (s: string) => `\`${s.replace(/\|/g, '\\|')}\``;
const html = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function markdownGroups(out: ScanOutput): string {
	if (!out.groups) return '';
	const rows = out.groups.map((g) => `| ${cell(g.key)} | ${g.count} | ${g.maxScore} |`);
	return `\n| Group | Modules | Max score |\n|---|---:|---:|\n${rows.join('\n')}\n`;
}

export function renderMarkdown(out: ScanOutput): string {
	const { analyzed, shallow } = out.summary;
	const head = `## deepcheck: ${shallow} shallow module(s) of ${analyzed} analyzed${topNote(out)}\n\n`;
	if (shallow === 0) return `${head}No module reaches ${criterion(out)}.\n`;
	const rows = out.findings.map(
		(m) =>
			`| ${m.score} | ${cell(m.path)} | ${m.metrics.interfaceSize} | ${m.metrics.implementationSize} | ${m.metrics.passThroughs.length} |`
	);
	const details = out.findings.map(
		(m) => `<details><summary><code>${html(m.path)}</code></summary>\n\n${m.reasons.map((r) => `- ${r}`).join('\n')}\n\n</details>`
	);
	return `${head}| Score | Module | Interface | Statements | Pass-throughs |\n|---:|---|---:|---:|---:|\n${rows.join('\n')}\n${markdownGroups(out)}\n${details.join('\n')}\n`;
}

/** Workflow-command escaping (data and properties) so messages stay on one line. */
const escapeData = (s: string) => s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
const escapeProperty = (s: string) => escapeData(s).replace(/:/g, '%3A').replace(/,/g, '%2C');

function annotation(level: 'warning' | 'error', path: string, title: string, message: string): string {
	return `::${level} file=${escapeProperty(path)},line=1,title=${escapeProperty(title)}::${escapeData(message)}\n`;
}

export function renderGithub(out: ScanOutput): string {
	return out.findings
		.map((m) => annotation('warning', m.path, `Shallow module (score ${m.score})`, m.reasons.join('\n')))
		.join('');
}

export function renderExplain(m: ModuleReport, failThreshold: number): string {
	const { metrics: x } = m;
	const status = m.flagged ? 'flagged' : m.eligible ? 'not flagged' : 'not flagged, below minimum interface size';
	const list = (items: { name: string; line: number }[]) => items.map((i) => ` ${i.name}:${i.line}`).join(',');
	const components = Object.entries(m.components).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(', ');
	const lines = [
		`interfaceSize ${x.interfaceSize}`,
		`implementationSize ${x.implementationSize}`,
		`depthRatio ${x.depthRatio.toFixed(2)}`,
		`passThroughs ${x.passThroughs.length}${list(x.passThroughs)}`,
		`leakyExports ${x.leakyExports.length}${x.leakyExports.map((l) => ` ${l.name} -> ${l.type}`).join(',')}`,
		`classitis ${x.classitis}, dataOnlyClasses ${x.dataOnlyClasses.join(', ') || 'none'}`,
		`fanIn ${x.fanIn}, fanOut ${x.fanOut}`,
		`complexity ${x.complexity} (${x.complexitySource}), unusedExports ${x.unusedExports ?? 'n/a (no Fallow data)'}`,
		...m.classes.map((c) => `class ${c.name}: interface ${c.interfaceSize}, statements ${c.implementationSize}, depthRatio ${c.depthRatio.toFixed(2)}${c.dataOnly ? ', data only' : ''}`),
		`components: ${components}`
	];
	return `${m.path}: score ${m.score} (${status}, threshold ${failThreshold})\n${indent(lines, '  ')}Why:\n${indent(m.reasons, '  - ')}`;
}
