#!/usr/bin/env node
// Blocks a Claude Code `git commit -m` whose subject breaks CLAUDE.md, "Conventions" (Commits): `type(scope): subject`
// with a listed type and scope, at most 50 characters, no period. Types and scopes are read from CLAUDE.md.
// Exit 2 blocks the Bash call and shows stderr to Claude. Commits without -m (-F, --no-edit) pass unchecked.
import { readFileSync } from 'node:fs';

const command = JSON.parse(readFileSync(0, 'utf8')).tool_input?.command ?? '';
const call = /(^|[\s;|&()])git\s+commit(?=\s|$)/.exec(command);
if (!call) process.exit(0);

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

function messageOf(args) {
	for (let i = 0; i < args.length; i++) {
		if (/^(-[a-zA-Z]*m|--message)$/.test(args[i])) return args[i + 1];
		const joined = /^(?:-m|--message=)([\s\S]+)$/.exec(args[i]);
		if (joined) return joined[1];
	}
}

const message = messageOf([...words(command.slice(call.index + call[0].length))]);
if (message === undefined) process.exit(0);

const rules = readFileSync(new URL('../../CLAUDE.md', import.meta.url), 'utf8');
const listed = (name) => [...(new RegExp(`${name}: (.+?)\\.`).exec(rules)?.[1] ?? '').matchAll(/`([\w-]+)`/g)].map((m) => m[1]);
const types = listed('Types');
const scopes = listed('Scopes');

const subject = message.trim().split('\n')[0].trim();
const form = /^(\w+)\(([\w-]+)\): \S/.exec(subject);
const problems = [];
if (!form || !types.includes(form[1])) problems.push(`write type(scope): subject, with type one of ${types.join(', ')}`);
else if (!scopes.includes(form[2])) problems.push(`scope «${form[2]}» is not one of ${scopes.join(', ')}`);
if (subject.length > 50) problems.push(`${subject.length} characters, at most 50`);
if (subject.endsWith('.')) problems.push('ends with a period');

if (problems.length) {
	console.error(`commit-msg-gate: blocked: «${subject}»: ${problems.join('; ')} (CLAUDE.md, Conventions: Commits).`);
	process.exit(2);
}
