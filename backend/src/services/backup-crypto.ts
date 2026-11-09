/**
 * Encryption of a Sicherung (#718): the Wiederherstellungscode derives an X25519 key pair; the server keeps only the
 * public key, so neither it nor a copy of its database can read a Sicherung without the code (R1, A7).
 * File: magic | salt | public key of the code | ephemeral public key | iv | AES-256-GCM ciphertext | tag | signature
 * The signature (#1373, from DWELLO-BACKUP-2 on) is an HMAC-SHA256 over all before it, under a key the code derives and the
 * server keeps from the confirmation on: salt and public key stand in clear, so without it anyone could make a Sicherung.
 */

import {
	createCipheriv,
	createHmac,
	createDecipheriv,
	createPrivateKey,
	createPublicKey,
	diffieHellman,
	generateKeyPairSync,
	hkdfSync,
	randomBytes,
	randomInt,
	scryptSync,
	timingSafeEqual,
	type KeyObject
} from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { appendFile, open, rm } from 'fs/promises';
import type { Readable } from 'stream';
import { pipeline } from 'stream/promises';

const MAGIC = Buffer.from('DWELLO-BACKUP-1\n');
const SIGNED = Buffer.from('DWELLO-BACKUP-2\n');
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 32 characters without 0, O, 1, I: 24 of them carry 120 bits
const PKCS8_X25519 = Buffer.from('302e020100300506032b656e04220420', 'hex');
const HEADER = MAGIC.length + 16 + 32 + 32 + 12;
const TAG = 16;
const SIGNATURE = 32;

/** macKey: none for a code confirmed before #1373, whose Sicherungen stay unsigned */
export type Recipient = { publicKey: Buffer; salt: Buffer; macKey?: Buffer };

export const generateCode = () =>
	Array.from({ length: 6 }, () =>
		Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
	).join('-');

/** The code as the landlord may type it: lower case, with spaces or without hyphens */
export const normalizedCode = (code: string) => code.toUpperCase().replace(/[^0-9A-Z]/g, '');

const keysOf = (code: string, salt: Buffer) => {
	const seed = scryptSync(normalizedCode(code), salt, 32, {
		N: 2 ** 15,
		r: 8,
		p: 1,
		maxmem: 64 * 1024 * 1024
	});
	return {
		privateKey: createPrivateKey({
			key: Buffer.concat([PKCS8_X25519, seed]),
			format: 'der',
			type: 'pkcs8'
		}),
		macKey: Buffer.from(hkdfSync('sha256', seed, salt, 'dwello-backup-mac-1', 32))
	};
};

const signatureOf = async (file: string, macKey: Buffer, end?: number) => {
	const hmac = createHmac('sha256', macKey);
	await pipeline(createReadStream(file, { end }), hmac);
	return hmac.read() as Buffer;
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
export async function recipientOf(
	code: string,
	salt = randomBytes(16)
): Promise<Required<Recipient>> {
	const { privateKey, macKey } = keysOf(code, salt);
	return { publicKey: raw(privateKey), salt, macKey };
}

/** Writes the encrypted stream to out */
export async function encryptStream(
	source: Readable,
	out: string,
	{ publicKey: recipient, salt, macKey }: Recipient
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
	file.write(Buffer.concat([macKey ? SIGNED : MAGIC, salt, recipient, ephemeralRaw, iv]));
	await pipeline(source, cipher, file, { end: false });
	await new Promise<void>((resolve, reject) =>
		file.end(cipher.getAuthTag(), () => resolve()).on('error', reject)
	);
	if (macKey) await appendFile(out, await signatureOf(out, macKey));
}

const FORGED =
	'Die Sicherung ist beschädigt, unvollständig oder nicht von Ihrer Dwello-Installation erstellt.';
const REFUSED = 'Die Sicherung ist nicht signiert und wurde nicht wiederhergestellt.';
const UNSIGNED =
	'Diese Sicherung ist nicht signiert; Dwello kann nicht prüfen, wer sie erstellt hat. Stellen Sie sie nur wieder her, wenn sie aus Ihrem eigenen Sicherungsordner stammt.';

/** The parts of a Sicherung; end: where the signature starts (the file's end for an unsigned one) */
async function partsOf(file: string) {
	const handle = await open(file);
	const { size } = await handle.stat();
	const head = Buffer.alloc(HEADER);
	const tail = Buffer.alloc(TAG + SIGNATURE); // tag and signature, or the last bytes and the tag
	await handle.read(head, 0, HEADER, 0);
	await handle.read(tail, 0, tail.length, Math.max(0, size - tail.length));
	await handle.close();
	const format = [MAGIC, SIGNED].map(String).indexOf(head.subarray(0, MAGIC.length).toString());
	const end = size - format * SIGNATURE;
	if (format < 0 || end < HEADER + TAG) throw new Error('Die Datei ist keine Sicherung von Dwello.');
	let at = MAGIC.length;
	const [salt, recipient, ephemeral, iv] = [16, 32, 32, 12].map((length) =>
		head.subarray(at, (at += length))
	);
	const tag = tail.subarray(end - size + SIGNATURE, end - size + SIGNATURE + TAG);
	return { format, end, salt, recipient, ephemeral, iv, tag, signature: tail.subarray(TAG) };
}

/** Writes the content of a Sicherung to out; refuses another code, a changed file, and an unsigned one the operator does
 * not confirm after the warning (Decided (product owner) #1373: a code confirmed before #1373 writes unsigned ones) */
export async function decryptFile(
	file: string,
	code: string,
	out: string,
	confirmUnsigned: (warning: string) => boolean = () => false
) {
	const { format, end, salt, recipient, ephemeral, iv, tag, signature } = await partsOf(file);
	const { privateKey, macKey } = keysOf(code, salt);
	if (!raw(privateKey).equals(recipient))
		throw new Error('Der Wiederherstellungscode passt nicht zu dieser Sicherung.');
	// before a single byte is decrypted: the restore drops the database only after this
	const authentic = format
		? timingSafeEqual(await signatureOf(file, macKey, end - 1), signature)
		: confirmUnsigned(UNSIGNED);
	if (!authentic) throw new Error([REFUSED, FORGED][format]);
	const decipher = createDecipheriv(
		'aes-256-gcm',
		aesKey(diffieHellman({ privateKey, publicKey: publicKey(ephemeral) }), ephemeral, recipient),
		iv
	);
	decipher.setAuthTag(tag);
	try {
		await pipeline(
			createReadStream(file, { start: HEADER, end: end - TAG - 1 }),
			decipher,
			createWriteStream(out)
		);
	} catch (error) {
		await rm(out, { force: true });
		throw new Error('Die Sicherung ist beschädigt oder unvollständig.', { cause: error });
	}
}
