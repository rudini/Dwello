import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/** Writes a throwaway project (path -> content) into a temp dir and returns its root. */
export function writeProject(files: Record<string, string>): string {
	const root = mkdtempSync(join(tmpdir(), 'deepcheck-'));
	for (const [path, content] of Object.entries(files)) {
		mkdirSync(dirname(join(root, path)), { recursive: true });
		writeFileSync(join(root, path), content);
	}
	return root;
}

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
