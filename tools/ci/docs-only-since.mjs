// Whether a pull request push changed only documentation since its branch last passed CI:
// `node tools/ci/docs-only-since.mjs <head> [<green commit>...]` exits 0 when a green commit that is an ancestor of
// <head> differs from it only in documentation (the paths ci.yml's job "changes" counts as not changing the app),
// else 1. CI then skips the tests that green run already passed.
import { execFileSync, spawnSync } from 'node:child_process';

const DOCS = /^(docs\/|screens\/|\.claude\/)|\.md$/;
const [head, ...green] = process.argv.slice(2);

const docsOnlySince = (commit) => {
	if (commit === head || spawnSync('git', ['merge-base', '--is-ancestor', commit, head]).status !== 0) return false;
	const changed = execFileSync('git', ['diff', '--name-only', '--no-renames', commit, head], { encoding: 'utf8' });
	return changed.split('\n').filter(Boolean).every((path) => DOCS.test(path));
};

process.exit(green.some(docsOnlySince) ? 0 : 1);
