import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ci = readFileSync(fileURLToPath(new URL('../../.github/workflows/ci.yml', import.meta.url)), 'utf8');

/** The lines of the job `changes` from the E2E shards to the outputs `shards` and `matrix`, printed instead of written */
function selection(event: string): string {
	const start = ci.indexOf('e2e=$(');
	const end = ci.indexOf('>> "$GITHUB_OUTPUT"', ci.indexOf('echo "matrix=')) + '>> "$GITHUB_OUTPUT"'.length;
	expect(start, 'the E2E shards of the job changes').toBeGreaterThan(-1);
	return ci
		.slice(start, end)
		.replaceAll('${{ github.event_name }}', event)
		.replaceAll('${{ github.base_ref }}', 'main')
		.replaceAll('node tools/', `node ${fileURLToPath(new URL('../../tools/', import.meta.url))}`)
		.replaceAll('>> "$GITHUB_OUTPUT"', '')
		.replace(/^.*GITHUB_OUTPUT.*$/gm, '');
}

/** Directory with stand-ins for commands the step calls: each name runs its shell body */
function stubs(commands: Record<string, string>): string {
	const bin = mkdtempSync(join(tmpdir(), 'axe-shards-'));
	for (const [name, body] of Object.entries(commands)) {
		writeFileSync(join(bin, name), `#!/bin/sh\n${body}\n`);
		chmodSync(join(bin, name), 0o755);
	}
	return bin;
}

/** The axe shards the job `changes` selects for a run of this event that changes these files (#1252) */
function select(event: string, ...files: string[]) {
	const cwd = mkdtempSync(join(tmpdir(), 'axe-shards-run-'));
	const out = spawnSync('bash', ['-c', selection(event)], {
		cwd,
		encoding: 'utf8',
		env: {
			...process.env,
			PATH: `${stubs({ git: `printf '%s\\n' ${files.map((f) => `'${f}'`).join(' ')}` })}:${process.env.PATH}`
		}
	});
	expect(out.stderr).toBe('');
	const lines = out.stdout.split('\n');
	const output = (name: string) => JSON.parse(lines.find((l) => l.startsWith(`${name}=`))!.slice(name.length + 1));
	return {
		axeShards: output('shards')['Accessibility (axe)'],
		axeEntries: output('matrix').filter((m: { name: string }) => m.name === 'Accessibility (axe)').length
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
	const bin = stubs({ gh: 'echo 0', sleep: 'true' });
	return spawnSync('bash', ['-c', script], {
		env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, SHARDS: String(shards) }
	}).status;
}

describe('Accessibility-Shards nach UI-Änderung (#1252)', () => {
	it('startet bei einem Pull Request ohne UI-Änderung keinen axe-Shard und erwartet keinen', () => {
		expect(select('pull_request', 'backend/src/services/statement.service.ts')).toEqual({ axeShards: 0, axeEntries: 0 });
	});

	it.each([
		['pull_request', 'Pull Request mit UI-Änderung'],
		['push', 'main'],
		['schedule', 'nächtlicher Lauf']
	])('startet bei %s (%s) alle vier axe-Shards', (event) => {
		expect(select(event, 'src/routes/buildings/+page.svelte')).toEqual({ axeShards: 4, axeEntries: 4 });
	});

	it('meldet «Accessibility (axe)» ohne UI-Änderung als bestanden, auch wenn ein E2E-Shard fehlschlug', () => {
		const { axeShards } = select('pull_request', 'backend/src/services/statement.service.ts');
		expect(result('Accessibility (axe)', axeShards)).toBe(0);
	});
});
