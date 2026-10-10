import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { analyze } from './analyze.ts';
import { loadConfig, type Config } from './config.ts';
import { ToolError } from './errors.ts';
import { inScope, scanOutput, within } from './scan.ts';
import { createBaseline, readBaseline, writeBaseline } from './baseline.ts';
import { runGate } from './gate.ts';
import { renderCheck, renderCheckGithub, renderCheckMarkdown, renderExplain, renderGithub, renderHuman, renderMarkdown } from './render.ts';
import type { Report, ScanOutput } from './types.ts';

export interface Io {
	cwd: string;
	env: Record<string, string | undefined>;
	stdout: (text: string) => void;
	stderr: (text: string) => void;
}

const OPTIONS = {
	fallow: { type: 'string', default: 'auto' },
	'fail-on-score': { type: 'string' },
	format: { type: 'string', default: 'human' },
	top: { type: 'string', default: '50' },
	'min-score': { type: 'string' },
	'group-by': { type: 'string' },
	output: { type: 'string' },
	explain: { type: 'string' },
	'changed-since': { type: 'string' },
	agent: { type: 'boolean', default: false },
	scope: { type: 'string' },
	'use-baseline': { type: 'boolean', default: false }
} as const;

const FORMATS = ['human', 'json', 'markdown', 'github'] as const;
const GROUPS = ['directory', 'package'] as const;
const SCOPES = { changed: 'check', all: 'scan' } as const;

export interface Options {
	fallow: string;
	format: (typeof FORMATS)[number];
	failOnScore?: number;
	top: number;
	minScore?: number;
	groupBy?: (typeof GROUPS)[number];
	output?: string;
	explain?: string;
	changedSince?: string;
	/** Changed scope for an agent loop: top findings only, nothing at all when clean. */
	agent: boolean;
	useBaseline: boolean;
}

function oneOf<T extends string>(name: string, value: string | undefined, allowed: readonly T[]): T | undefined {
	if (value === undefined || allowed.includes(value as T)) return value as T | undefined;
	throw new ToolError(`--${name} must be one of ${allowed.join(', ')}`);
}

function number(name: string, value: string | undefined, valid: (n: number) => boolean, expected: string) {
	if (value === undefined) return undefined;
	const n = Number(value);
	if (value.trim() === '' || !valid(n)) throw new ToolError(`--${name} must be ${expected}`);
	return n;
}

const isScore = (n: number) => n >= 0 && n <= 100;

function parseOptions(argv: string[]): { command: string; options: Options; positionals: string[] } {
	const { values: v, positionals } = parseArgs({ args: argv, allowPositionals: true, options: OPTIONS });
	const [command = 'scan', ...rest] = positionals;
	const options: Options = {
		fallow: v.fallow,
		format: oneOf('format', v.format, FORMATS)!,
		failOnScore: number('fail-on-score', v['fail-on-score'], isScore, 'a number from 0 to 100'),
		top: number('top', v.top, (n) => Number.isInteger(n) && n > 0, 'a positive whole number')!,
		minScore: number('min-score', v['min-score'], isScore, 'a number from 0 to 100'),
		groupBy: oneOf('group-by', v['group-by'], GROUPS),
		output: v.output,
		explain: v.explain,
		changedSince: v['changed-since'],
		agent: v.agent,
		useBaseline: v['use-baseline']
	};
	if (options.explain) return { command: 'explain', options, positionals: rest };
	const scope = oneOf('scope', v.scope, Object.keys(SCOPES) as (keyof typeof SCOPES)[]);
	return scope ? { command: SCOPES[scope], options, positionals } : { command, options, positionals: rest };
}

/** Writes the rendered report to --output or stdout; the GitHub format also writes the step summary. */
function emit(options: Options, io: Io, text: string, summary?: string): void {
	if (options.output) {
		const file = resolve(io.cwd, options.output);
		mkdirSync(dirname(file), { recursive: true });
		writeFileSync(file, text);
	}
	else io.stdout(text);
	if (summary !== undefined && io.env.GITHUB_STEP_SUMMARY) appendFileSync(io.env.GITHUB_STEP_SUMMARY, summary);
}

const RENDER: Record<Options['format'], (out: ScanOutput) => string> = {
	human: renderHuman,
	json: (out) => `${JSON.stringify(out, null, 2)}\n`,
	markdown: renderMarkdown,
	github: renderGithub
};

/** The path argument relative to the project root ('/'-separated), undefined for the whole project. */
function projectPath(io: Io, path: string | undefined): string | undefined {
	if (path === undefined) return undefined;
	const rel = relative(io.cwd, resolve(io.cwd, path)).split(sep).join('/');
	return rel === '' ? undefined : rel;
}

/** Modules recorded in the baseline that did not worsen beyond the tolerance (hidden by --use-baseline). */
function baselined(root: string, report: Report, config: Config): Set<string> {
	const scores = new Map(readBaseline(root).entries.map((e) => [e.path, e.score]));
	const hidden = report.modules.filter((m) => scores.has(m.path) && m.score - scores.get(m.path)! <= config.tolerance);
	return new Set(hidden.map((m) => m.path));
}

function scan(options: Options, io: Io, positionals: string[]): number {
	if (positionals.length > 1) throw new ToolError(`scan takes at most one path, got ${positionals.join(' ')}`);
	const path = projectPath(io, positionals[0]);
	const config = loadConfig(io.cwd);
	const report = analyze({ root: io.cwd, fallow: options.fallow, config });
	const known = [...report.modules, ...report.excluded].some((m) => within(m.path, path));
	if (path && !known) throw new ToolError(`${path} matches no source file`);
	const output = scanOutput(io.cwd, report, config, { ...options, path, hidden: options.useBaseline ? baselined(io.cwd, report, config) : undefined });
	if (options.format !== 'json') report.warnings.forEach((w) => io.stderr(`deepcheck: warning: ${w}\n`));
	emit(options, io, RENDER[options.format](output), options.format === 'github' ? renderMarkdown(output) : undefined);
	const failOn = options.failOnScore;
	return failOn !== undefined && inScope(report, path).some((m) => m.score >= failOn) ? 1 : 0;
}

function explain(options: Options, io: Io): number {
	const config = loadConfig(io.cwd);
	const path = options.explain!;
	const report = analyze({ root: io.cwd, fallow: options.fallow, config });
	const module = report.modules.find((m) => m.path === path);
	if (module) {
		emit(options, io, options.format === 'json' ? `${JSON.stringify(module, null, 2)}\n` : renderExplain(module, config.failThreshold));
		return 0;
	}
	const excluded = report.excluded.find((m) => m.path === path);
	throw new ToolError(`${path} is not analyzed: ${excluded ? `excluded as ${excluded.reason}` : 'not found among the included source files'}`);
}

function suppressions(options: Options, io: Io): number {
	const { suppressions: list, suppressionFindings } = analyze({ root: io.cwd, fallow: 'off' });
	const problem = (path: string, line: number) => suppressionFindings.find((f) => f.path === path && f.line === line);
	const text = list.map((s) => {
		const invalid = problem(s.path, s.line);
		const what = [`ignore-${s.kind}`, s.rule, s.reason && `-- ${s.reason}`].filter(Boolean).join(' ');
		return `${s.path}:${s.line}  ${what}${invalid ? `  INVALID: ${invalid.message}` : ''}\n`;
	});
	emit(options, io, options.format === 'json' ? `${JSON.stringify(list, null, 2)}\n` : text.join(''));
	return 0;
}

/** Failures an agent sees at once; more would bury the first fix. */
const AGENT_LIMIT = 3;

function check(options: Options, io: Io): number {
	const output = runGate(io.cwd, options.fallow, options.changedSince);
	if (options.agent && output.passed) return 0;
	if (options.format !== 'json' && !options.agent) output.warnings.forEach((w) => io.stderr(`deepcheck: warning: ${w}\n`));
	const render: Record<Options['format'], () => string> = {
		human: () => renderCheck(output, options.agent ? AGENT_LIMIT : Infinity),
		json: () => `${JSON.stringify(output, null, 2)}\n`,
		markdown: () => renderCheckMarkdown(output),
		github: () => renderCheckGithub(output)
	};
	emit(options, io, render[options.format](), options.format === 'github' ? renderCheckMarkdown(output) : undefined);
	return output.passed ? 0 : 1;
}

function baseline(options: Options, io: Io): number {
	const config = loadConfig(io.cwd);
	const report = analyze({ root: io.cwd, fallow: options.fallow, config });
	const created = createBaseline(report, config);
	writeBaseline(io.cwd, created);
	io.stdout(
		`deepcheck: baseline .deepcheck-baseline.json written: ${created.entries.length} module(s) at or above ${config.failThreshold} of ${report.modules.length} analyzed\n`
	);
	return 0;
}

const COMMANDS: Record<string, (options: Options, io: Io, positionals: string[]) => number> = {
	scan,
	check,
	baseline,
	explain,
	suppressions
};

function run(argv: string[], io: Io): number {
	const { command: name, options, positionals } = parseOptions(argv);
	const command = COMMANDS[name];
	if (!command) throw new ToolError(`unknown command "${name}"`);
	if (name !== 'scan' && positionals.length) throw new ToolError(`unexpected argument ${positionals.join(' ')}`);
	return command(options, io, positionals);
}

/** --format json, read from the raw arguments so it also applies when they cannot be parsed. */
const wantsJson = (argv: string[]) =>
	argv.includes('--format=json') || argv.some((a, i) => a === '--format' && argv[i + 1] === 'json');

/** Exit codes: 0 ok, 1 gate failed, 2 tool or config error. Never throws. */
export function main(argv: string[], io: Io): number {
	try {
		return run(argv, io);
	} catch (error) {
		const message = (error as Error).message;
		if (wantsJson(argv)) io.stdout(`${JSON.stringify({ error: true, message, exitCode: 2 }, null, 2)}\n`);
		io.stderr(`deepcheck: ${message}\n`);
		return 2;
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	process.exitCode = main(process.argv.slice(2), {
		cwd: process.cwd(),
		env: process.env,
		stdout: (text) => process.stdout.write(text),
		stderr: (text) => process.stderr.write(text)
	});
}
