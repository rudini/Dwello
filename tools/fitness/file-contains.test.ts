import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fileContains } from './file-contains';

// R1 (#974): restore-check.ts looks for plain text in a Sicherung of several GB, read in pieces
const file = (content: string) => {
	const path = join(mkdtempSync(join(tmpdir(), 'file-contains-')), 'sicherung');
	writeFileSync(path, content, 'latin1');
	return path;
};

describe('fileContains', () => {
	it('findet einen Text, der über die Grenze zweier Stücke reicht', async () => {
		expect(await fileContains(file('xxxxxxCREATE TABLExx'), ['CREATE TABLE'], 8)).toBe(true);
	});

	it('findet keinen Text, den die Datei nicht enthält', async () => {
		expect(await fileContains(file('CREATE TABLxCREATE'), ['CREATE TABLE', 'Muster'], 8)).toBe(false);
	});
});
