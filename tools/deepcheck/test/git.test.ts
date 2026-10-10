import { describe, expect, it } from 'vitest';
import { changedFiles } from '../src/git.ts';
import { ToolError } from '../src/errors.ts';
import { commitAll, git, removeFile, writeFiles, writeProject, writeRepo } from './helpers.ts';

describe('changed set', () => {
	it('dev loop: working tree and staged changes against HEAD plus untracked files', () => {
		const root = writeRepo({ 'src/a.ts': 'export const a = 1;\n', 'src/b.ts': 'export const b = 1;\n', 'src/c.ts': 'export const c = 1;\n' });
		writeFiles(root, { 'src/a.ts': 'export const a = 2;\n', 'src/b.ts': 'export const b = 2;\n', 'src/new.ts': 'export const n = 1;\n' });
		git(root, 'add', 'src/b.ts');
		removeFile(root, 'src/c.ts');
		expect(changedFiles(root)).toEqual([
			{ path: 'src/a.ts', previousPath: 'src/a.ts' },
			{ path: 'src/b.ts', previousPath: 'src/b.ts' },
			{ path: 'src/new.ts', previousPath: null }
		]);
	});

	it('keeps the old path of a renamed file', () => {
		const root = writeRepo({ 'src/old.ts': 'export const keep = (a: number) => a * 2 + 1;\n'.repeat(3) });
		git(root, 'mv', 'src/old.ts', 'src/new.ts');
		expect(changedFiles(root)).toEqual([{ path: 'src/new.ts', previousPath: 'src/old.ts' }]);
	});

	it('CI: everything changed since the merge-base with the base branch, not what the base did since', () => {
		const root = writeRepo({ 'src/a.ts': 'export const a = 1;\n' });
		git(root, 'checkout', '-q', '-b', 'feature');
		writeFiles(root, { 'src/feature.ts': 'export const f = 1;\n' });
		commitAll(root, 'feature');
		git(root, 'checkout', '-q', 'main');
		writeFiles(root, { 'src/on-main.ts': 'export const m = 1;\n' });
		commitAll(root, 'main moves on');
		git(root, 'checkout', '-q', 'feature');
		expect(changedFiles(root, 'main')).toEqual([{ path: 'src/feature.ts', previousPath: null }]);
	});

	it('turns an unknown base ref or a directory outside git into a tool error', () => {
		expect(() => changedFiles(writeRepo({ 'a.ts': '' }), 'origin/nope')).toThrow(ToolError);
		expect(() => changedFiles(writeProject({ 'a.ts': '' }))).toThrow(/git .* failed/);
	});
});
