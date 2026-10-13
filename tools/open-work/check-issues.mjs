// Fails when a `TODO(fachlich prüfen, #n)` marker names an issue that is closed, missing or a pull request, when a
// pull request closes an issue (`Fixes #n`) that a marker still names (CLAUDE.md, "Open work"), and when it closes an
// issue and changes what the app does without changing a scenario (CLAUDE.md, "Workflow" step 1).
// CI runs it with GITHUB_TOKEN, GITHUB_REPOSITORY, PR_BODY and BASE_REF; locally: GITHUB_TOKEN=… node tools/open-work/check-issues.mjs
import { execFileSync } from 'node:child_process';

const repo = process.env.GITHUB_REPOSITORY ?? 'rudini/Dwello';
const dirs = ['src', 'backend/src', 'backend/migrations', 'backend/demo', 'tests'];

const grep = () => {
	try {
		return execFileSync('git', ['grep', '-n', '-E', 'TODO\\(fachlich prüfen, #[0-9]+', '--', ...dirs], { encoding: 'utf8' });
	} catch (error) {
		if (error.status === 1) return ''; // no marker names an issue
		throw error;
	}
};

const refs = new Map();
for (const line of grep().split('\n').filter(Boolean)) {
	const place = line.split(':').slice(0, 2).join(':');
	for (const [, list] of line.matchAll(/TODO\(fachlich prüfen((?:, #\d+)+)\)/g)) {
		for (const [, n] of list.matchAll(/#(\d+)/g)) refs.set(n, [...(refs.get(n) ?? []), place]);
	}
}

const failures = [];
const closing = [...(process.env.PR_BODY ?? '').matchAll(/\b(?:fix(?:es|ed)?|close[sd]?|resolve[sd]?)\s+#(\d+)/gi)];
for (const [, n] of closing) {
	if (refs.has(n)) failures.push(`This pull request closes #${n}, but markers still name it: ${refs.get(n).join(', ')}`);
}

// `No scenario: <reason>` in the pull request text where none applies, e.g. a refactoring without new behaviour
const base = process.env.BASE_REF;
if (base && closing.length && !/\bno scenario:/i.test(process.env.PR_BODY ?? '')) {
	const changed = execFileSync('git', ['diff', '--name-only', `origin/${base}...HEAD`], { encoding: 'utf8' }).split('\n');
	const app = changed.some((file) => /^(src\/(routes|lib)|backend\/src)\//.test(file) && !/__tests__|\.test\.ts$/.test(file));
	if (app && !changed.some((file) => /^tests\/e2e\/features\/.+\.feature$/.test(file)))
		failures.push(
			`This pull request closes ${closing.map(([, n]) => `#${n}`).join(', ')} and changes the app, but no scenario in tests/e2e/features; add one, or say "No scenario: <reason>" in its text`
		);
}

if (!process.env.GITHUB_TOKEN) {
	console.log(`Skipped the issue lookup: GITHUB_TOKEN is not set (CI sets it); ${refs.size} issues named by markers`);
} else {
	for (const [n, places] of refs) {
		const response = await fetch(`https://api.github.com/repos/${repo}/issues/${n}`, {
			headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, accept: 'application/vnd.github+json' }
		});
		if (response.status === 401 || response.status === 403) {
			console.error(`Cannot read issues of ${repo} (HTTP ${response.status}): check GITHUB_TOKEN`);
			process.exit(1);
		}
		const issue = response.ok ? await response.json() : null;
		const state = !issue ? `missing (HTTP ${response.status})` : issue.pull_request ? 'a pull request' : issue.state;
		if (state !== 'open') failures.push(`#${n} is ${state}; remove or repoint these markers: ${places.join(', ')}`);
	}
}

if (failures.length) {
	console.error(failures.join('\n'));
	process.exit(1);
}
console.log(`${refs.size} issues named by markers${process.env.GITHUB_TOKEN ? ', all open' : ''}`);
