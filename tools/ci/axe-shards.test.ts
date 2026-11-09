import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ci = readFileSync(fileURLToPath(new URL('../../.github/workflows/ci.yml', import.meta.url)), 'utf8');

/** The lines of the job `changes` that write the outputs `shards` and `matrix`, without the redirect to $GITHUB_OUTPUT */
function selection(): string {
	const start = ci.indexOf('echo "shards=');
	const end = ci.indexOf('>> "$GITHUB_OUTPUT"', ci.indexOf('echo "matrix=')) + '>> "$GITHUB_OUTPUT"'.length;
	expect(start, 'the shards output of the job changes').toBeGreaterThan(-1);
	return ci.slice(start, end).replaceAll('>> "$GITHUB_OUTPUT"', '');
}

/** The shards and matrix entries the job `changes` selects for a run with these E2E shards and UI flag (#1252) */
function select(e2e: number, ui: boolean) {
	const out = spawnSync('bash', ['-c', `e2e=${e2e} filter= ui=${ui}\n${selection()}`], { encoding: 'utf8' });
	expect(out.stderr).toBe('');
	const [shards, matrix] = out.stdout.trim().split('\n');
	return {
		axeShards: JSON.parse(shards.replace('shards=', ''))['Accessibility (axe)'],
		axeEntries: JSON.parse(matrix.replace('matrix=', '')).filter(
			(m: { name: string }) => m.name === 'Accessibility (axe)'
		).length
	};
}

/** The exit code of the job `e2e-results` for one check, when an E2E shard failed and the API lists no axe shard (#1252) */
function result(check: string, shards: number): number | null {
	const job = ci.slice(ci.indexOf('  e2e-results:'));
	const script = job
		.slice(job.indexOf('run: |') + 'run: |'.length, job.indexOf('\n\n'))
		.replace(/\$\{\{ needs\.changes\.result \}\}/g, 'success')
		.replace(/\$\{\{ needs\.changes\.outputs\.app \}\}/g, 'true')
		.replace(/\$\{\{ needs\.e2e-tests\.result \}\}/g, 'failure')
		.replace(/\$\{\{ [^}]+ \}\}/g, check);
	const bin = mkdtempSync(join(tmpdir(), 'axe-shards-'));
	for (const [name, body] of [
		['gh', 'echo 0'],
		['sleep', 'true']
	]) {
		writeFileSync(join(bin, name), `#!/bin/sh\n${body}\n`);
		chmodSync(join(bin, name), 0o755);
	}
	return spawnSync('bash', ['-c', script], {
		env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, SHARDS: String(shards) }
	}).status;
}

describe('Accessibility-Shards nach UI-Änderung (#1252)', () => {
	it('startet ohne UI-Änderung keinen axe-Shard und erwartet keinen', () => {
		expect(select(5, false)).toEqual({ axeShards: 0, axeEntries: 0 });
	});

	it.each([
		[5, 'Pull Request mit UI-Änderung'],
		[12, 'main und nächtlicher Lauf']
	])('startet bei %i E2E-Shards (%s) alle vier axe-Shards', (e2e) => {
		expect(select(e2e, true)).toEqual({ axeShards: 4, axeEntries: 4 });
	});

	it('meldet «Accessibility (axe)» ohne UI-Änderung als bestanden, auch wenn ein E2E-Shard fehlschlug', () => {
		expect(result('Accessibility (axe)', select(5, false).axeShards)).toBe(0);
	});
});
