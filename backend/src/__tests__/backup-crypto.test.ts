import { afterAll, describe, expect, it } from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import { createReadStream } from 'fs';
import { randomBytes } from 'crypto';
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

// #1373: the salt and the public key stand in clear in every file, so anyone can encrypt to them; the signature proves
// that the Dwello installation that knew the code made the file
describe('Signatur der Sicherung', () => {
	const forged = async (real: string, macKey?: Buffer) => {
		const head = await readFile(real);
		const file = join(dir, `${crypto.randomUUID()}.backup`);
		await writeFile(join(dir, 'forged-plain'), 'DROP TABLE tenants');
		await encryptStream(createReadStream(join(dir, 'forged-plain')), file, {
			salt: head.subarray(16, 32),
			publicKey: head.subarray(32, 64),
			macKey
		});
		return file;
	};

	it('lehnt eine Datei ab, die nur mit Salt und öffentlichem Schlüssel einer echten Sicherung gebaut ist', async () => {
		const code = generateCode();
		const file = await forged(await encrypted(code), randomBytes(32));
		await expect(decryptFile(file, code, join(dir, 'forged'))).rejects.toThrow(
			'nicht von Ihrer Dwello-Installation erstellt'
		);
	});

	// Decided (product owner) #1373: a code confirmed before the signature has no key for it; its Sicherungen stay unsigned
	const warning =
		'Diese Sicherung ist nicht signiert; Dwello kann nicht prüfen, wer sie erstellt hat. Stellen Sie sie nur wieder her, wenn sie aus Ihrem eigenen Sicherungsordner stammt.';

	it('stellt eine nicht signierte Sicherung nur nach der Warnung und der Bestätigung wieder her', async () => {
		const code = generateCode();
		const file = await forged(await encrypted(code));
		const shown: string[] = [];
		await decryptFile(file, code, join(dir, 'unsigned'), (text) => (shown.push(text), true));
		expect(shown).toEqual([warning]);
		expect(await readFile(join(dir, 'unsigned'), 'utf8')).toBe('DROP TABLE tenants');
	});

	it('lehnt eine nicht signierte Sicherung ohne Bestätigung ab und schreibt nichts', async () => {
		const code = generateCode();
		const file = await forged(await encrypted(code));
		await expect(decryptFile(file, code, join(dir, 'refused'), () => false)).rejects.toThrow(
			'Die Sicherung ist nicht signiert und wurde nicht wiederhergestellt.'
		);
		await expect(decryptFile(file, code, join(dir, 'refused'))).rejects.toThrow('nicht signiert');
		expect(await Bun.file(join(dir, 'refused')).exists()).toBe(false);
	});

	// 1373 review C-2: the AES-GCM tag still guards an unsigned Sicherung
	it('lehnt eine veränderte nicht signierte Sicherung auch nach der Bestätigung ab', async () => {
		const code = generateCode();
		const file = await forged(await encrypted(code));
		const bytes = await readFile(file);
		bytes[bytes.length - 20] ^= 1;
		await writeFile(file, bytes);
		await expect(
			decryptFile(file, code, join(dir, 'changed-unsigned'), () => true)
		).rejects.toThrow('Die Sicherung ist beschädigt');
	});

	// 1373 review 4 C-1: kept behaviour, pinned after the reading of the file was rewritten
	it('lehnt eine leere, eine fremde und eine abgeschnittene signierte Datei als keine Sicherung ab', async () => {
		const code = generateCode();
		const signed = await readFile(await encrypted(code));
		for (const [name, bytes] of [
			['leer', Buffer.alloc(0)],
			['fremd', Buffer.concat([Buffer.from('PK'), signed.subarray(2)])],
			['abgeschnitten', signed.subarray(0, 150)]
		] as const) {
			await writeFile(join(dir, name), bytes);
			await expect(decryptFile(join(dir, name), code, join(dir, `${name}.out`))).rejects.toThrow(
				'Die Datei ist keine Sicherung von Dwello.'
			);
		}
	});
});
