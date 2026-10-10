import { execFileSync } from 'node:child_process';
import { ToolError } from './errors.ts';

export interface ChangedFile {
	path: string;
	/** Path at the base (differs after a rename); null for a new file. */
	previousPath: string | null;
}

function git(root: string, args: string[]): string {
	try {
		return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
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
 * merge-base of `since` and HEAD (the PR base in CI). Sorted by path.
 */
export function changedFiles(root: string, since?: string): ChangedFile[] {
	const base = since ? git(root, ['merge-base', since, 'HEAD']).trim() : 'HEAD';
	const tracked = parseNameStatus(git(root, ['diff', '--name-status', '-M', '-z', base]));
	const untracked = git(root, ['ls-files', '--others', '--exclude-standard', '-z'])
		.split('\0')
		.filter(Boolean)
		.map((path) => ({ path, previousPath: null }));
	return [...tracked, ...untracked].sort((a, b) => (a.path < b.path ? -1 : 1));
}
