/**
 * Encryption of a Sicherung (#718): the Wiederherstellungscode derives an X25519 key pair; the server keeps only the
 * public key, so neither it nor a copy of its database can read a Sicherung without the code (R1, A7).
 * File: magic | salt | public key of the code | ephemeral public key | iv | AES-256-GCM ciphertext | tag
 */

import {
	createCipheriv,
	createDecipheriv,
	createPrivateKey,
	createPublicKey,
	diffieHellman,
	generateKeyPairSync,
	hkdfSync,
	randomBytes,
	randomInt,
	scryptSync,
	type KeyObject
} from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { open, rm } from 'fs/promises';
import type { Readable } from 'stream';
import { pipeline } from 'stream/promises';

const MAGIC = Buffer.from('DWELLO-BACKUP-1\n');
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 32 characters without 0, O, 1, I: 24 of them carry 120 bits
const PKCS8_X25519 = Buffer.from('302e020100300506032b656e04220420', 'hex');
const HEADER = MAGIC.length + 16 + 32 + 32 + 12;
const TAG = 16;

export type Recipient = { publicKey: Buffer; salt: Buffer };

export const generateCode = () =>
	Array.from({ length: 6 }, () =>
		Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
	).join('-');

const privateKeyOf = (code: string, salt: Buffer) => {
	const typed = code.toUpperCase().replace(/[^0-9A-Z]/g, '');
	const seed = scryptSync(typed, salt, 32, { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
	return createPrivateKey({
		key: Buffer.concat([PKCS8_X25519, seed]),
		format: 'der',
		type: 'pkcs8'
	});
};

const raw = (key: KeyObject) =>
	(createPublicKey(key).export({ format: 'der', type: 'spki' }) as Buffer).subarray(-32);

const publicKey = (bytes: Buffer) =>
	createPublicKey({
		key: Buffer.concat([Buffer.from('302a300506032b656e032100', 'hex'), bytes]),
		format: 'der',
		type: 'spki'
	});

const aesKey = (shared: Buffer, ephemeral: Buffer, recipient: Buffer) =>
	Buffer.from(
		hkdfSync('sha256', shared, Buffer.concat([ephemeral, recipient]), 'dwello-backup-1', 32)
	);

/** The public key and salt that a new code gives; only these are stored */
export async function recipientOf(code: string, salt = randomBytes(16)): Promise<Recipient> {
	return { publicKey: raw(privateKeyOf(code, salt)), salt };
}

/** Writes the encrypted stream to out */
export async function encryptStream(
	source: Readable,
	out: string,
	{ publicKey: recipient, salt }: Recipient
) {
	const ephemeral = generateKeyPairSync('x25519');
	const ephemeralRaw = raw(ephemeral.privateKey);
	const shared = diffieHellman({
		privateKey: ephemeral.privateKey,
		publicKey: publicKey(recipient)
	});
	const iv = randomBytes(12);
	const cipher = createCipheriv('aes-256-gcm', aesKey(shared, ephemeralRaw, recipient), iv);
	const file = createWriteStream(out);
	file.write(Buffer.concat([MAGIC, salt, recipient, ephemeralRaw, iv]));
	await pipeline(source, cipher, file, { end: false });
	await new Promise<void>((resolve, reject) =>
		file.end(cipher.getAuthTag(), () => resolve()).on('error', reject)
	);
}

/** Writes the content of a Sicherung to out; refuses another code and a changed file */
export async function decryptFile(file: string, code: string, out: string) {
	const handle = await open(file);
	const { size } = await handle.stat();
	const head = Buffer.alloc(HEADER);
	const tag = Buffer.alloc(TAG);
	if (size >= HEADER + TAG) {
		await handle.read(head, 0, HEADER, 0);
		await handle.read(tag, 0, TAG, size - TAG);
	}
	await handle.close();
	if (!head.subarray(0, MAGIC.length).equals(MAGIC))
		throw new Error('Die Datei ist keine Sicherung von Dwello.');
	let at = MAGIC.length;
	const [salt, recipient, ephemeral, iv] = [16, 32, 32, 12].map((length) =>
		head.subarray(at, (at += length))
	);
	const privateKey = privateKeyOf(code, salt);
	if (!raw(privateKey).equals(recipient))
		throw new Error('Der Wiederherstellungscode passt nicht zu dieser Sicherung.');
	const decipher = createDecipheriv(
		'aes-256-gcm',
		aesKey(diffieHellman({ privateKey, publicKey: publicKey(ephemeral) }), ephemeral, recipient),
		iv
	);
	decipher.setAuthTag(tag);
	try {
		await pipeline(
			createReadStream(file, { start: HEADER, end: size - TAG - 1 }),
			decipher,
			createWriteStream(out)
		);
	} catch (error) {
		await rm(out, { force: true });
		throw new Error('Die Sicherung ist beschädigt oder unvollständig.', { cause: error });
	}
}
