import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { ToolError } from './errors.ts';

export interface ChangedFile {
	path: string;
	/** Path at the base (differs after a rename); null for a new file. */
	previousPath: string | null;
}

function git(root: string, args: string[], env?: Record<string, string>, input?: string): string {
	try {
		return execFileSync('git', args, {
			cwd: root,
			encoding: 'utf8',
			input,
			stdio: [input === undefined ? 'ignore' : 'pipe', 'pipe', 'pipe'],
			env: { ...process.env, ...env }
		});
	} catch (error) {
		const stderr = String((error as { stderr?: string }).stderr ?? '').trim();
		throw new ToolError(`git ${args.join(' ')} failed${stderr ? `: ${stderr}` : ''}`);
	}
}

/** Parses `git diff --name-status -M -z`: deleted files are dropped, renames keep their old path. */
function parseNameStatus(output: string): ChangedFile[] {
	const fields = output.split('\0').filter(Boolean);
	const files: ChangedFile[] = [];
	for (let i = 0; i < fields.length; i += 2) {
		const status = fields[i];
		if (status.startsWith('R') || status.startsWith('C')) {
			files.push({ path: fields[i + 2], previousPath: status.startsWith('R') ? fields[i + 1] : null });
			i++;
		} else if (status !== 'D') files.push({ path: fields[i + 1], previousPath: status === 'A' ? null : fields[i + 1] });
	}
	return files;
}

/**
 * Files changed against HEAD (working tree and staged, plus untracked), or with `since` against the
 * merge-base of `since` and HEAD (the PR base in CI). Paths are relative to `root`, sorted.
 * The working tree is diffed through a throwaway copy of the index with everything added, so a plain
 * `mv` without `git add` is still detected as a rename.
 */
export function changedFiles(root: string, since?: string): ChangedFile[] {
	const base = baseRevision(root, since);
	const dir = mkdtempSync(join(tmpdir(), 'deepcheck-index-'));
	try {
		const env = { GIT_INDEX_FILE: join(dir, 'index') };
		const real = resolve(root, git(root, ['rev-parse', '--git-path', 'index']).trim());
		if (existsSync(real)) copyFileSync(real, env.GIT_INDEX_FILE);
		// Only TypeScript sources: other files cannot change a result, and e.g. nested repositories would break `git add`.
		const sources = git(root, ['ls-files', '-z', '-c', '-o', '--exclude-standard', '--', '.']).split('\0').filter((p) => SOURCE.test(p));
		if (sources.length) git(root, ['add', '-A', '--pathspec-from-file=-', '--pathspec-file-nul'], env, sources.join('\0'));
		const diff = git(root, ['diff', '--cached', '--name-status', '-M', '-z', '--relative', base], env);
		return parseNameStatus(diff).sort((a, b) => (a.path < b.path ? -1 : 1));
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}

/** The commit changes are judged against: HEAD, or the merge-base of `since` and HEAD. */
export function baseRevision(root: string, since?: string): string {
	if (!git(root, ['rev-list', '-n', '1', '--all']).trim())
		throw new ToolError('the repository has no commits yet: commit once before running deepcheck check');
	return since ? git(root, ['merge-base', since, 'HEAD']).trim() : git(root, ['rev-parse', 'HEAD']).trim();
}

/**
 * The project a run inside `dir` belongs to: the nearest directory up to the repository top level with
 * deepcheck.config.json, .deepcheck-baseline.json or package.json, else the top level.
 */
export function projectRoot(dir: string): string {
	const top = git(dir, ['rev-parse', '--show-toplevel']).trim();
	for (let d = resolve(dir); d.startsWith(top) && d !== top; d = dirname(d))
		if (MARKERS.some((m) => existsSync(join(d, m)))) return d;
	return top;
}

const MARKERS = ['deepcheck.config.json', '.deepcheck-baseline.json', 'package.json'];
const SOURCE = /\.(ts|tsx|mts|cts)$/;

/** A file's content at a commit (path relative to `root`), or null when it does not exist there. */
export function fileAtRevision(root: string, revision: string, path: string): string | null {
	const listed = git(root, ['ls-tree', '--name-only', revision, '--', path]).trim();
	return listed ? git(root, ['show', `${revision}:./${path}`]) : null;
}
