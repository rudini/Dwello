import { describe, expect, it } from 'vitest';
import { analyze } from '../src/analyze.ts';
import { writeProject } from './helpers.ts';

/**
 * Well-known designs from A Philosophy of Software Design: Unix file I/O (deep: five calls hide
 * blocks, caching and descriptors), Java-style stream wrappers (shallow: each class adds one thin
 * layer), a pass-through text document (ch. 7) and classitis (many tiny classes).
 */
const UNIX_IO = `
const BLOCK = 512;
interface Inode { blocks: number[]; size: number }
const disk = new Map<number, Uint8Array>();
const inodes = new Map<string, Inode>();
const descriptors = new Map<number, { inode: Inode; offset: number }>();
const cache = new Map<number, Uint8Array>();
let nextBlock = 1;
let nextFd = 3;

function readBlock(n: number): Uint8Array {
	const cached = cache.get(n);
	if (cached) return cached;
	const block = disk.get(n) ?? new Uint8Array(BLOCK);
	if (cache.size > 64) cache.delete(cache.keys().next().value!);
	cache.set(n, block);
	return block;
}

function blockFor(inode: Inode, index: number): number {
	while (inode.blocks.length <= index) {
		const n = nextBlock++;
		disk.set(n, new Uint8Array(BLOCK));
		inode.blocks.push(n);
	}
	return inode.blocks[index];
}

function descriptor(fd: number) {
	const d = descriptors.get(fd);
	if (!d) throw new Error('EBADF');
	return d;
}

export function open(path: string, create = false): number {
	let inode = inodes.get(path);
	if (!inode) {
		if (!create) throw new Error('ENOENT');
		inode = { blocks: [], size: 0 };
		inodes.set(path, inode);
	}
	const fd = nextFd++;
	descriptors.set(fd, { inode, offset: 0 });
	return fd;
}

export function read(fd: number, length: number): Uint8Array {
	const d = descriptor(fd);
	const end = Math.min(d.inode.size, d.offset + length);
	const out = new Uint8Array(Math.max(0, end - d.offset));
	for (let i = 0; i < out.length; i++) {
		const pos = d.offset + i;
		out[i] = readBlock(d.inode.blocks[Math.floor(pos / BLOCK)])[pos % BLOCK];
	}
	d.offset = end;
	return out;
}

export function write(fd: number, data: Uint8Array): number {
	const d = descriptor(fd);
	for (let i = 0; i < data.length; i++) {
		const pos = d.offset + i;
		const block = readBlock(blockFor(d.inode, Math.floor(pos / BLOCK)));
		block[pos % BLOCK] = data[i];
	}
	d.offset += data.length;
	d.inode.size = Math.max(d.inode.size, d.offset);
	return data.length;
}

export function seek(fd: number, offset: number): void {
	const d = descriptor(fd);
	if (offset < 0) throw new Error('EINVAL');
	d.offset = offset;
}

export function close(fd: number): void {
	if (!descriptors.delete(fd)) throw new Error('EBADF');
}
`;

const JAVA_STREAMS = `
import { read, open } from './unix-io';

export class FileInputStream {
	private fd: number;
	constructor(path: string) {
		this.fd = open(path);
	}
	read(length: number) {
		return read(this.fd, length);
	}
}

export class BufferedInputStream {
	constructor(private inner: FileInputStream) {}
	read(length: number) {
		return this.inner.read(length);
	}
}

export class ObjectInputStream {
	constructor(private inner: BufferedInputStream) {}
	read(length: number) {
		return this.inner.read(length);
	}
	readObject(length: number) {
		return this.inner.read(length);
	}
}
`;

const TEXT_DOCUMENT = `
import { TextArea } from './text-area';

export class TextDocument {
	constructor(private area: TextArea) {}
	getLastTypedCharacter() {
		return this.area.getLastTypedCharacter();
	}
	getCursorOffset() {
		return this.area.getCursorOffset();
	}
	insertString(text: string, offset: number) {
		return this.area.insertString(text, offset);
	}
	willInsertString(text: string, offset: number) {
		return this.area.willInsertString(text, offset);
	}
}
`;

const TEXT_AREA = `
export class TextArea {
	private text = '';
	private last = '';
	private cursor = 0;
	getLastTypedCharacter() {
		return this.last;
	}
	getCursorOffset() {
		return this.cursor;
	}
	willInsertString(text: string, offset: number) {
		return offset >= 0 && offset <= this.text.length && text.length > 0;
	}
	insertString(text: string, offset: number) {
		if (!this.willInsertString(text, offset)) return false;
		this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
		this.last = text.at(-1)!;
		this.cursor = offset + text.length;
		return true;
	}
}
`;

const CLASSITIS = Object.fromEntries(
	['Name', 'Street', 'Zip', 'Town', 'Country', 'Phone'].map((n) => [`src/address/${n.toLowerCase()}.ts`, `export const format${n} = (v: string) => v.trim();\n`])
);

const report = analyze({
	root: writeProject({
		'src/unix-io.ts': UNIX_IO,
		'src/java-streams.ts': JAVA_STREAMS,
		'src/text-document.ts': TEXT_DOCUMENT,
		'src/text-area.ts': TEXT_AREA,
		...CLASSITIS
	}),
	fallow: 'off'
});
const scoreOf = (path: string) => report.modules.find((m) => m.path === path)!.score;

describe('reference designs', () => {
	it('ranks Unix-style file I/O deeper than Java-style stream wrappers and a pass-through document', () => {
		expect(scoreOf('src/unix-io.ts')).toBeLessThan(scoreOf('src/java-streams.ts'));
		expect(scoreOf('src/unix-io.ts')).toBeLessThan(scoreOf('src/text-document.ts'));
	});

	it('ranks the pass-through document shallower than the text area it forwards to', () => {
		expect(scoreOf('src/text-area.ts')).toBeLessThan(scoreOf('src/text-document.ts'));
	});

	it('flags the shallow designs and leaves the deep one alone', () => {
		const flagged = report.modules.filter((m) => m.flagged).map((m) => m.path);
		expect(flagged).toEqual(expect.arrayContaining(['src/java-streams.ts', 'src/text-document.ts']));
		expect(flagged).not.toContain('src/unix-io.ts');
	});

	it('marks classitis in a directory of tiny single-function files', () => {
		const address = report.modules.filter((m) => m.path.startsWith('src/address/'));
		expect(address.every((m) => m.metrics.classitis && m.eligible)).toBe(true);
	});
});
