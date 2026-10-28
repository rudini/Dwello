import { afterAll, describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import { createReadStream } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { decryptFile, encryptStream, generateCode, recipientOf } from '../services/backup-crypto';

const dir = await mkdtemp(join(tmpdir(), 'backup-crypto-'));
afterAll(() => rm(dir, { recursive: true }));

const plain = 'CREATE TABLE tenants; Hans Muster, Lindenweg 3';

async function encrypted(code: string) {
	await writeFile(join(dir, 'plain'), plain);
	const file = join(dir, `${crypto.randomUUID()}.backup`);
	await encryptStream(createReadStream(join(dir, 'plain')), file, await recipientOf(code));
	return file;
}

describe('Verschlüsselung der Sicherung', () => {
	it('erzeugt einen Wiederherstellungscode aus 6 Gruppen zu 4 Zeichen ohne 0, O, 1 und I', () => {
		const code = generateCode();
		expect(code).toMatch(/^([2-9A-HJ-NP-Z]{4}-){5}[2-9A-HJ-NP-Z]{4}$/);
		expect(generateCode()).not.toBe(code);
	});

	it('stellt mit dem Wiederherstellungscode den Inhalt wieder her, auch klein und ohne Bindestriche getippt', async () => {
		const code = generateCode();
		const file = await encrypted(code);
		await decryptFile(file, code.toLowerCase().replaceAll('-', ' '), join(dir, 'out'));
		expect(await readFile(join(dir, 'out'), 'utf8')).toBe(plain);
	});

	it('enthält ohne den Code weder Namen noch Tabellen im Klartext', async () => {
		const content = await readFile(await encrypted(generateCode()), 'latin1');
		expect(content).not.toContain('Hans Muster');
		expect(content).not.toContain('CREATE TABLE');
	});

	it('lehnt einen anderen Wiederherstellungscode ab', async () => {
		const file = await encrypted(generateCode());
		await expect(decryptFile(file, generateCode(), join(dir, 'other'))).rejects.toThrow(
			'Der Wiederherstellungscode passt nicht zu dieser Sicherung'
		);
	});

	it('lehnt eine veränderte Sicherung ab', async () => {
		const code = generateCode();
		const file = await encrypted(code);
		const bytes = await readFile(file);
		bytes[bytes.length - 20] ^= 1;
		await writeFile(file, bytes);
		await expect(decryptFile(file, code, join(dir, 'changed'))).rejects.toThrow(
			'Die Sicherung ist beschädigt'
		);
	});
});
