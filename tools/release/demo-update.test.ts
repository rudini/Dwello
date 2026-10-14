import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), '../../deploy/demo/update.sh');

/** The demo's clone of a remote main, with update.sh in place and `docker` as a stand-in that logs the version it builds;
 * `dev` changes the remote (commits, tags) as merges and release runs do */
function demo() {
	const dir = mkdtempSync(join(tmpdir(), 'demo-update-'));
	const at = (name: string) => (...args: string[]) =>
		execFileSync('git', args, { cwd: join(dir, name), encoding: 'utf8' }).trim();
	execFileSync('git', ['init', '-q', '--bare', '-b', 'main', join(dir, 'remote.git')]);
	for (const name of ['dev', 'demo']) {
		execFileSync('git', ['clone', '-q', join(dir, 'remote.git'), join(dir, name)], { stdio: 'ignore' });
		at(name)('config', 'user.email', 'test@example.com');
		at(name)('config', 'user.name', 'Test');
	}
	const dev = at('dev');
	dev('commit', '-q', '--allow-empty', '-m', 'chore(ci): start');
	dev('push', '-q', 'origin', 'HEAD:main');
	at('demo')('pull', '-q', 'origin', 'main');
	mkdirSync(join(dir, 'demo/deploy/demo'), { recursive: true });
	copyFileSync(SCRIPT, join(dir, 'demo/deploy/demo/update.sh'));
	writeFileSync(join(dir, 'docker'), `#!/bin/sh\n[ "$1" = compose ] && echo "$APP_VERSION" >> ${join(dir, 'builds.log')}\nexit 0\n`);
	chmodSync(join(dir, 'docker'), 0o755);
	const update = () =>
		spawnSync('sh', [join(dir, 'demo/deploy/demo/update.sh')], {
			encoding: 'utf8',
			env: { ...process.env, PATH: `${dir}:${process.env.PATH}` }
		});
	const builds = () => {
		try {
			return readFileSync(join(dir, 'builds.log'), 'utf8').trim().split('\n');
		} catch {
			return [];
		}
	};
	return { dev, update, builds };
}

describe('demo update', () => {
	it('baut main erst, wenn es getaggt ist', () => {
		const { dev, update, builds } = demo();
		expect(update().stdout).toContain('not tagged yet');
		expect(builds()).toEqual([]);
		dev('tag', 'v0.1.0');
		dev('push', '-q', 'origin', 'v0.1.0');
		expect(update().status).toBe(0);
		expect(builds()).toEqual(['v0.1.0']);
	});

	it('baut neu, wenn eine Version von Hand die Version von main ersetzt', () => {
		const { dev, update, builds } = demo();
		dev('tag', 'v0.5.0');
		dev('push', '-q', 'origin', 'v0.5.0');
		update();
		dev('push', '-q', 'origin', ':refs/tags/v0.5.0');
		dev('tag', 'v1.0.0');
		dev('push', '-q', 'origin', 'v1.0.0');
		expect(update().status).toBe(0);
		expect(builds()).toEqual(['v0.5.0', 'v1.0.0']);
	});
});
