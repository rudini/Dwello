import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeSource, type Finding } from './analyze.ts';
import { BASELINE, HINT_RULES, RULES, baselineAt, baseOf, changedFiles, fingerprint, repoRoot, suppressions, trackedFiles } from './gate.ts';

const TEST_FILE = /\.(test|spec)\.[cm]?tsx?$/;
const SKIP_DIR = new Set(['node_modules', '.git', '.svelte-kit', 'dist', 'build', 'coverage']);

export function testFiles(path: string): string[] {
	if (!statSync(path).isDirectory()) return TEST_FILE.test(path) ? [path] : [];
	return readdirSync(path).flatMap((e) => (SKIP_DIR.has(e) ? [] : testFiles(join(path, e))));
}

export function scan(paths: string[], root = process.cwd()): Finding[] {
	return paths.flatMap(testFiles).flatMap((f) => analyzeSource(relative(root, f), readFileSync(f, 'utf8')));
}

interface Io {
	cwd: string;
	stdout: (text: string) => void;
	stderr: (text: string) => void;
}

const line = (f: Finding) => `${f.file}:${f.line} ${f.rule} ${f.test}: ${f.message}${f.code ? ` [${f.code}]` : ''}\n`;
const isTest = (f: string) => TEST_FILE.test(f) && !f.split('/').some((d) => SKIP_DIR.has(d));
const option = (argv: string[], name: string) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : undefined);

/** The findings of some test files of the repository, suppressed ones left out and invalid suppressions added. */
function findingsOf(root: string, files: string[]): Finding[] {
	return files.flatMap((file) => {
		const text = readFileSync(join(root, file), 'utf8');
		const { suppresses, invalid } = suppressions(text, RULES);
		const bad = invalid.map((s) => ({ file, line: s.line, test: '', testLine: s.line, rule: 'invalid-suppression', message: s.message, code: '' }));
		return [...analyzeSource(file, text).filter((f) => !suppresses(f)), ...bad];
	});
}

function check(argv: string[], io: Io): number {
	const root = repoRoot(io.cwd);
	const base = baseOf(root, option(argv, '--changed-since'));
	const baseline = baselineAt(root, base);
	const findings = findingsOf(root, changedFiles(root, base).filter(isTest)).filter((f) => !baseline.has(fingerprint(f)));
	const failures = findings.filter((f) => !HINT_RULES.has(f.rule));
	io.stdout(report(argv, findings, failures));
	return failures.length > 0 ? 1 : 0;
}

const annotation = (f: Finding) => `::${HINT_RULES.has(f.rule) ? 'warning' : 'error'} file=${f.file},line=${f.line},title=testcheck ${f.rule}::${f.test ? `${f.test}: ` : ''}${f.message}\n`;

/** Agent mode: nothing on success, else the first failures; GitHub: annotations; else failures, then hints. */
function report(argv: string[], findings: Finding[], failures: Finding[]): string {
	if (argv.includes('--agent'))
		return failures.length === 0 ? '' : `testcheck: ${failures.length === 1 ? '1 finding fails' : `${failures.length} findings fail`} the test gate; fix each as its message says or add "// testcheck-ignore <rule> -- <reason>" above the test:\n${failures.slice(0, 5).map(line).join('')}`;
	if (option(argv, '--format') === 'github') return findings.map(annotation).join('');
	return [...failures.map(line), ...findings.filter((f) => HINT_RULES.has(f.rule)).map((f) => `hint: ${line(f)}`)].join('');
}

/** Writes the baseline: every finding of the repository's test files that fails the gate. */
function baseline(io: Io): number {
	const root = repoRoot(io.cwd);
	const findings = findingsOf(root, trackedFiles(root).filter(isTest)).filter((f) => !HINT_RULES.has(f.rule));
	writeFileSync(join(root, BASELINE), `${JSON.stringify({ findings: findings.map(fingerprint).sort() }, null, '\t')}\n`);
	io.stdout(`testcheck: ${findings.length} finding(s) in ${BASELINE}\n`);
	return 0;
}

/** Runs a command; returns the exit code: 0 ok, 1 findings fail the gate, 2 tool error. */
export function main(argv: string[], io: Io): number {
	const [cmd, ...args] = argv;
	try {
		if (cmd === 'check') return check(args, io);
		if (cmd === 'baseline') return baseline(io);
		if (cmd === 'scan') {
			for (const f of scan(args.length ? args.map((a) => join(io.cwd, a)) : [io.cwd], io.cwd)) io.stdout(line(f));
			return 0;
		}
		throw new Error(`unknown command "${cmd ?? ''}": use scan, check or baseline`);
	} catch (error) {
		io.stderr(`testcheck: ${(error as Error).message}\n`);
		return 2;
	}
}

const processIo: Io = { cwd: process.cwd(), stdout: (text) => void process.stdout.write(text), stderr: (text) => void process.stderr.write(text) };
if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv.slice(2), processIo);
