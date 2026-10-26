import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

const git = (cwd: string, ...args: string[]) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const lines = (out: string) => out.split('\n').filter(Boolean);

export const repoRoot = (cwd: string) => git(cwd, 'rev-parse', '--show-toplevel');

/** The commit changed files are judged against: the merge-base with `since`, else HEAD. */
export const baseOf = (root: string, since?: string) => (since ? git(root, 'merge-base', since, 'HEAD') : git(root, 'rev-parse', 'HEAD'));

/** Files changed since `base`, working tree and untracked files included, relative to the repository root. */
export function changedFiles(root: string, base: string): string[] {
	const files = [...lines(git(root, 'diff', '--name-only', base)), ...lines(git(root, 'ls-files', '--others', '--exclude-standard'))];
	return [...new Set(files)].filter((f) => existsSync(join(root, f)));
}

/** Every rule, for suppressions and the README. */
export const RULES = new Set(['empty-test', 'dangling-expect', 'unawaited-assertion', 'tautology', 'swallowed-assertion', 'catch-only-assertion', 'loop-only-assertion', 'callback-only-assertion', 'duplicate-title', 'duplicate-body']);

/** Rules whose measured precision is too low to fail a change: shown as hints (testcheck-validation.md). */
export const HINT_RULES = new Set(['loop-only-assertion']);
export const BASELINE = '.testcheck-baseline.json';

export const fingerprint = (f: { file: string; test: string; rule: string }) => `${f.file}#${f.test}#${f.rule}`;

/** The baseline as it was at `base`: a change cannot baseline its own findings. Missing means empty. */
export function baselineAt(root: string, base: string): Set<string> {
	try {
		return new Set(JSON.parse(git(root, 'show', `${base}:${BASELINE}`)).findings as string[]);
	} catch {
		return new Set();
	}
}

export const trackedFiles = (root: string) => lines(git(root, 'ls-files', '--cached', '--others', '--exclude-standard')).filter((f) => existsSync(join(root, f)));

/** The comments of a file with their 0-based line, found through the syntax tree, so text in strings is no comment. */
function comments(text: string): { text: string; line: number }[] {
	const sf = ts.createSourceFile('x.tsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
	const found = new Map<number, { text: string; line: number }>();
	const visit = (node: ts.Node): void => {
		for (const pos of [node.pos, node.end])
			for (const c of [...(ts.getLeadingCommentRanges(text, pos) ?? []), ...(ts.getTrailingCommentRanges(text, pos) ?? [])])
				found.set(c.pos, { text: text.slice(c.pos, c.end), line: sf.getLineAndCharacterOfPosition(c.pos).line });
		ts.forEachChild(node, visit);
	};
	visit(sf);
	return [...found.values()];
}

const SUPPRESSION = /testcheck-ignore(?:\s+([\w-]+))?(?:\s+--\s*(\S.*))?/;

/** `// testcheck-ignore <rule> -- <reason>` on the line above a test or a finding. */
export function suppressions(text: string, rules: Set<string>) {
	const valid = new Map<number, string>();
	const invalid: { line: number; message: string }[] = [];
	for (const { text: comment, line: i } of comments(text)) {
		const m = SUPPRESSION.exec(comment);
		if (!m) continue;
		if (!m[1] || !rules.has(m[1])) invalid.push({ line: i + 1, message: `testcheck-ignore needs a known rule, one of: ${[...rules].join(', ')}` });
		else if (!m[2]) invalid.push({ line: i + 1, message: 'testcheck-ignore needs a reason: add "-- <why the test is right>"' });
		else valid.set(i + 2, m[1]);
	}
	return { suppresses: (f: { line: number; testLine: number; rule: string }) => valid.get(f.line) === f.rule || valid.get(f.testLine) === f.rule, invalid };
}
