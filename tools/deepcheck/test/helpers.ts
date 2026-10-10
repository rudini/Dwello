import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/** Writes a throwaway project (path -> content) into a temp dir and returns its root. */
export function writeProject(files: Record<string, string>): string {
	const root = mkdtempSync(join(tmpdir(), 'deepcheck-'));
	writeFiles(root, files);
	return root;
}

export function writeFiles(root: string, files: Record<string, string>): void {
	for (const [path, content] of Object.entries(files)) {
		mkdirSync(dirname(join(root, path)), { recursive: true });
		writeFileSync(join(root, path), content);
	}
}

export const git = (root: string, ...args: string[]) =>
	execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd: root, encoding: 'utf8' });

/** A project in a fresh git repository on branch main with one commit of `files`. */
export function writeRepo(files: Record<string, string>): string {
	const root = writeProject(files);
	git(root, 'init', '-q', '-b', 'main');
	commitAll(root, 'initial');
	return root;
}

export function commitAll(root: string, message: string): void {
	git(root, 'add', '-A');
	git(root, 'commit', '-q', '--allow-empty', '-m', message);
}

export const removeFile = (root: string, path: string) => rmSync(join(root, path));

/** Many statements behind one small exported function. */
export const DEEP_MODULE = `
const SEPARATOR = ',';
const QUOTE = '"';

function splitLine(line: string): string[] {
	const cells: string[] = [];
	let current = '';
	let quoted = false;
	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (char === QUOTE) {
			if (quoted && line[i + 1] === QUOTE) {
				current += QUOTE;
				i++;
			} else {
				quoted = !quoted;
			}
		} else if (char === SEPARATOR && !quoted) {
			cells.push(current.trim());
			current = '';
		} else {
			current += char;
		}
	}
	cells.push(current.trim());
	return cells;
}

function isBlank(line: string): boolean {
	return line.trim().length === 0;
}

export function parseCsv(text: string): string[][] {
	const rows: string[][] = [];
	const lines = text.split(/\\r?\\n/);
	for (const line of lines) {
		if (isBlank(line)) continue;
		const cells = splitLine(line);
		if (cells.every((cell) => cell === '')) continue;
		rows.push(cells);
	}
	return rows;
}
`;

/** A wide interface whose functions only forward to a store. */
export const SHALLOW_MODULE = `
import { store } from './store';

export function getName(id: string) {
	return store.get(id);
}
export function setName(id: string, name: string) {
	return store.set(id, name);
}
export function hasName(id: string) {
	return store.has(id);
}
export function deleteName(id: string) {
	return store.delete(id);
}
export const size = () => store.size;
`;
