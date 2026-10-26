#!/usr/bin/env node
// Blocks a Claude Code `git commit -m` whose subject breaks CLAUDE.md, "Conventions" (Commits): `type(scope): subject`
// with a listed type and scope, at most 50 characters, no period. Types and scopes are read from CLAUDE.md.
// Exit 2 blocks the Bash call and shows stderr to Claude. `-F -` with a heredoc is checked like -m; other commits without
// -m (-F <file>, --no-edit) pass unchecked here; a `git push` checks every commit since origin/main, as CI «Commit
// subjects» does, so those are caught before a push in a later command.
// Commits and pushes in another repository (a scratch repository), found by `git -C` or the cwd, pass; a `cd` in the
// command is not followed, so such a call is checked (use `git -C`). A worktree of this repository is checked wherever
// it lies.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// `node commit-msg-gate.mjs --check "<subject>"` checks a subject before the commit, so a blocked command loses no edits
const [flag, subject] = process.argv.slice(2);
const checking = flag === '--check';
const input = checking ? {} : JSON.parse(readFileSync(0, 'utf8'));
const command = input.tool_input?.command ?? '';
const repositoryOf = (dir) =>
	spawnSync('git', ['-C', dir, 'rev-parse', '--path-format=absolute', '--git-common-dir'], { encoding: 'utf8' }).stdout?.trim();
const project = repositoryOf(fileURLToPath(new URL('../..', import.meta.url)));
const dirOf = (call) => resolve(input.cwd ?? process.cwd(), call[2]?.trim().slice(2).trim() ?? '.');
const inProject = (call) => {
	const repository = repositoryOf(dirOf(call));
	return !repository || repository === project;
};
const gitCalls = (verb) => [...command.matchAll(new RegExp(`(^|[\\s;|&()])git(\\s+-C\\s+\\S+)?\\s+${verb}(?=\\s|$)`, 'g'))].filter(inProject);
const calls = gitCalls('commit');
/** The subjects a push would send: the commits since origin/main, merges left out as in CI */
const pushed = (call) =>
	(spawnSync('git', ['-C', dirOf(call), 'log', '--no-merges', '--format=%s', 'origin/main..HEAD'], { encoding: 'utf8' }).stdout ?? '')
		.split('\n')
		.filter(Boolean);

/** The shell words up to the end of the git call; a `"$(cat <<'EOF' … EOF )"` message is one word */
function* words(s) {
	let i = 0;
	while (i < s.length) {
		while (s[i] === ' ' || s[i] === '\t') i++;
		if (i >= s.length || /[;&|\n]/.test(s[i])) return;
		let word = '';
		while (i < s.length && !/[\s;&|]/.test(s[i])) {
			const heredoc = /^"\$\(cat <<-?'?(\w+)'?\n([\s\S]*?)\n\s*\1\n\s*\)"/.exec(s.slice(i));
			if (heredoc) {
				word += heredoc[2];
				i += heredoc[0].length;
			} else if (s[i] === '"' || s[i] === "'") {
				const end = s.indexOf(s[i], i + 1);
				word += s.slice(i + 1, end < 0 ? undefined : end);
				i = end < 0 ? s.length : end + 1;
			} else word += s[i++];
		}
		yield word;
	}
}

function messageOf(args, rest) {
	for (let i = 0; i < args.length; i++) {
		if (/^(-[a-zA-Z]*m|--message)$/.test(args[i])) return args[i + 1];
		// `-F -` with a heredoc: the message is in the command (a push in the same command runs before this commit)
		if (/^(-[a-zA-Z]*F|--file)$/.test(args[i]) && args[i + 1] === '-') {
			// only a heredoc this git call opens, not one of a later command
			const marker = /<<-?\s*['"]?(\w+)['"]?/.exec(rest.split(/[\n;&|]/)[0])?.[1];
			return marker && new RegExp(`\\n([\\s\\S]*?)\\n\\s*${marker}\\s*(\\n|$)`).exec(rest)?.[1];
		}
		const joined = /^(?:-m|--message=)([\s\S]+)$/.exec(args[i]);
		if (joined) return joined[1];
	}
}

const messages = checking
	? [subject ?? '']
	: [
			...calls.map((call) => {
			const rest = command.slice(call.index + call[0].length);
			return messageOf([...words(rest)], rest);
		}),
			...gitCalls('push').flatMap(pushed)
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
