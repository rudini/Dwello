import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'release.sh');

/** A clone of a bare remote with one commit per message, tagged as given; `gh` is a stand-in that logs its calls
 * and creates the tag on the remote, as `gh release create` does */
function repo(commits: [message: string, tag?: string][]) {
	const dir = mkdtempSync(join(tmpdir(), 'release-'));
	const git = (...args: string[]) => execFileSync('git', args, { cwd: join(dir, 'work'), encoding: 'utf8' }).trim();
	execFileSync('git', ['init', '-q', '--bare', join(dir, 'remote.git')]);
	execFileSync('git', ['clone', '-q', join(dir, 'remote.git'), join(dir, 'work')], { stdio: 'ignore' });
	git('config', 'user.email', 'test@example.com');
	git('config', 'user.name', 'Test');
	for (const [message, tag] of commits) {
		git('commit', '-q', '--allow-empty', '-m', message);
		if (tag) git('tag', tag);
	}
	git('push', '-q', 'origin', 'HEAD:main', '--tags');
	writeFileSync(
		join(dir, 'gh'),
		`#!/bin/sh\necho "$*" >> ${join(dir, 'gh.log')}\n[ "$2" = create ] && git tag "$3" "$5" && git push -q origin "$3"\nexit 0\n`
	);
	chmodSync(join(dir, 'gh'), 0o755);
	const run = (version = '') =>
		spawnSync('bash', [SCRIPT], {
			cwd: join(dir, 'work'),
			encoding: 'utf8',
			env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, VERSION: version, GITHUB_SHA: git('rev-parse', 'HEAD') }
		});
	const ghCalls = () => {
		try {
			return readFileSync(join(dir, 'gh.log'), 'utf8').trim().split('\n');
		} catch {
			return [];
		}
	};
	const remoteTags = () =>
		execFileSync('git', ['ls-remote', '--tags', join(dir, 'remote.git')], { encoding: 'utf8' })
			.trim()
			.split('\n')
			.filter(Boolean)
			.map((line) => line.split('refs/tags/')[1]);
	return { run, ghCalls, remoteTags };
}

describe('release', () => {
	it('gibt einem Merge die nächste Version aus seinen Commits', () => {
		const { run, ghCalls } = repo([['chore(ci): start', 'v0.1.0'], ['feat(tenants): add a phone number']]);
		expect(run().status).toBe(0);
		expect(ghCalls()).toEqual([expect.stringMatching(/^release create v0\.2\.0 --target \w+ --title v0\.2\.0 --generate-notes$/)]);
	});

	it('lässt einen schon getaggten Merge wie er ist', () => {
		const { run, ghCalls } = repo([['chore(ci): start', 'v0.1.0'], ['feat(tenants): add a phone number', 'v0.2.0']]);
		expect(run().status).toBe(0);
		expect(ghCalls()).toEqual([]);
	});

	it('ersetzt bei einer Version von Hand die Version des Merges', () => {
		const { run, remoteTags } = repo([['chore(ci): start', 'v0.1.0'], ['feat(tenants): add a phone number', 'v0.2.0']]);
		expect(run('1.0.0').status).toBe(0);
		expect(remoteTags()).toEqual(['v0.1.0', 'v1.0.0']);
	});

	it('lehnt eine Version von Hand in falscher Form ab', () => {
		const { run, ghCalls } = repo([['chore(ci): start', 'v0.1.0']]);
		expect(run('1.0').status).not.toBe(0);
		expect(ghCalls()).toEqual([]);
	});

	it('lehnt eine Version von Hand ab, die es schon gibt, und lässt den Merge getaggt', () => {
		const { run, remoteTags } = repo([['chore(ci): start', 'v0.1.0'], ['feat(tenants): add a phone number', 'v0.2.0']]);
		expect(run('0.1.0').status).not.toBe(0);
		expect(remoteTags()).toEqual(['v0.1.0', 'v0.2.0']);
	});
});
