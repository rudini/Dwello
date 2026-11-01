#!/usr/bin/env node
// Blocks a Claude Code `git commit -m` whose subject breaks CLAUDE.md, "Conventions" (Commits): `type(scope): subject`
// with a listed type and scope, at most 50 characters, no period. Types and scopes are read from CLAUDE.md.
// Exit 2 blocks the Bash call and shows stderr to Claude. `-F -` with a heredoc is checked like -m; other commits without
// -m (-F <file>, --no-edit) pass unchecked here; a `git push` checks every commit since origin/main, as CI «Commit
// subjects» does, so those are caught before a push in a later command.
// Which calls are commits and pushes and where they run comes from git-calls.mjs (#710). Those in another repository
// (a scratch repository) pass; one in a directory the hook cannot resolve or that is no repository is checked. A
// worktree of this repository is checked wherever it lies.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gitCalls } from './git-calls.mjs';

// `node commit-msg-gate.mjs --check "<subject>"` checks a subject before the commit, so a blocked command loses no edits
const [flag, subject] = process.argv.slice(2);
const checking = flag === '--check';
const input = checking ? {} : JSON.parse(readFileSync(0, 'utf8'));
const cwd = input.cwd ?? process.cwd();
const repositoryOf = (dir) =>
	spawnSync('git', ['-C', dir, 'rev-parse', '--path-format=absolute', '--git-common-dir'], { encoding: 'utf8' }).stdout?.trim();
const project = repositoryOf(fileURLToPath(new URL('../..', import.meta.url)));
const calls = gitCalls(input.tool_input?.command ?? '', cwd).filter((call) => {
	const repository = call.dir && repositoryOf(call.dir);
	return !repository || repository === project;
});
/** The subjects a push would send: the commits since origin/main, merges left out as in CI */
const pushed = (call) =>
	(spawnSync('git', ['-C', call.dir ?? cwd, 'log', '--no-merges', '--format=%s', 'origin/main..HEAD'], { encoding: 'utf8' }).stdout ?? '')
		.split('\n')
		.filter(Boolean);

/** The message of a commit: -m, --message=, -m<text>, or `-F -` with the heredoc the commit reads */
function messageOf({ args, stdin }) {
	for (let i = 0; i < args.length; i++) {
		if (/^(-[a-zA-Z]*m|--message)$/.test(args[i])) return args[i + 1];
		if (/^(-[a-zA-Z]*F|--file)$/.test(args[i]) && args[i + 1] === '-') return stdin;
		const joined = /^(?:-m|--message=)([\s\S]+)$/.exec(args[i]);
		if (joined) return joined[1];
	}
}

const messages = checking
	? [subject ?? '']
	: [
			...calls.filter((call) => call.verb === 'commit').map(messageOf),
			...calls.filter((call) => call.verb === 'push').flatMap(pushed)
		];
if (messages.every((message) => message === undefined)) process.exit(0);

const rules = readFileSync(new URL('../../CLAUDE.md', import.meta.url), 'utf8');
const listed = (name) => [...(new RegExp(`${name}: (.+?)\\.`).exec(rules)?.[1] ?? '').matchAll(/`([\w-]+)`/g)].map((m) => m[1]);
const types = listed('Types');
const scopes = listed('Scopes');

/** What breaks the rules in the subject (first line) of `message` */
function problemsOf(message) {
	const subject = message.trim().split('\n')[0].trim();
	const form = /^(\w+)\(([\w-]+)\): \S/.exec(subject);
	const problems = [];
	if (!form || !types.includes(form[1])) problems.push(`write type(scope): subject, with type one of ${types.join(', ')}`);
	else if (!scopes.includes(form[2])) problems.push(`scope «${form[2]}» is not one of ${scopes.join(', ')}`);
	if (subject.length > 50) problems.push(`${subject.length} characters, at most 50`);
	if (subject.endsWith('.')) problems.push('ends with a period');
	return problems.length ? [`«${subject}»: ${problems.join('; ')}`] : [];
}

const found = messages.flatMap((message) => (message === undefined ? [] : problemsOf(message)));
if (found.length) {
	console.error(`commit-msg-gate: blocked: ${found.join(' | ')} (CLAUDE.md, Conventions: Commits).`);
	if (!checking) console.error('commit-msg-gate: nothing in this command ran, edits and git add before the git call included.');
	process.exit(2);
}
