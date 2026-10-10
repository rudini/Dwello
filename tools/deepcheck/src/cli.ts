import { appendFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { analyze } from './analyze.ts';
import { loadConfig } from './config.ts';
import { ToolError } from './errors.ts';
import { inScope, scanOutput } from './scan.ts';
import { renderExplain, renderGithub, renderHuman, renderMarkdown } from './render.ts';
import type { ScanOutput } from './types.ts';

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
	explain: { type: 'string' }
} as const;

const FORMATS = ['human', 'json', 'markdown', 'github'] as const;
const GROUPS = ['directory', 'package'] as const;

export interface Options {
	fallow: string;
	format: (typeof FORMATS)[number];
	failOnScore?: number;
	top: number;
	minScore?: number;
	groupBy?: (typeof GROUPS)[number];
	output?: string;
	explain?: string;
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
		failOnScore: number('fail-on-score', v['fail-on-score'], Number.isFinite, 'a number'),
		top: number('top', v.top, (n) => Number.isInteger(n) && n > 0, 'a positive whole number')!,
		minScore: number('min-score', v['min-score'], isScore, 'a number from 0 to 100'),
		groupBy: oneOf('group-by', v['group-by'], GROUPS),
		output: v.output,
		explain: v.explain
	};
	return { command: options.explain ? 'explain' : command, options, positionals: rest };
}

/** Writes the rendered report to --output or stdout; the GitHub format also writes the step summary. */
function emit(options: Options, io: Io, text: string, summary?: string): void {
	if (options.output) writeFileSync(resolve(io.cwd, options.output), text);
	else io.stdout(text);
	if (summary !== undefined && io.env.GITHUB_STEP_SUMMARY) appendFileSync(io.env.GITHUB_STEP_SUMMARY, summary);
}

const RENDER: Record<Options['format'], (out: ScanOutput) => string> = {
	human: renderHuman,
	json: (out) => `${JSON.stringify(out, null, 2)}\n`,
	markdown: renderMarkdown,
	github: renderGithub
};

function scan(options: Options, io: Io, [path]: string[]): number {
	const config = loadConfig(io.cwd);
	const report = analyze({ root: io.cwd, fallow: options.fallow, config });
	const output = scanOutput(io.cwd, report, config, { ...options, path });
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

const COMMANDS: Record<string, (options: Options, io: Io, positionals: string[]) => number> = { scan, explain, suppressions };

function run(argv: string[], io: Io): number {
	const { command: name, options, positionals } = parseOptions(argv);
	const command = COMMANDS[name];
	if (!command) throw new ToolError(`unknown command "${name}"`);
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
