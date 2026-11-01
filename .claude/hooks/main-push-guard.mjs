#!/usr/bin/env node
// Asks before a `git push` whose resolved target is main (#713), which the ask rules in settings.json cannot see from the
// command text: a bare `git push` or `git push origin HEAD` with main checked out, `git -C <checkout of main> push`,
// `HEAD:main`, `--all`/`--mirror`. A refspec to another branch (main-fix) and text that only mentions a push pass.
// The rules for force and delete in settings.json stay as they are.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8'));
const command = input.tool_input?.command ?? '';

/** The shell commands of a line, each as its words; quotes are kept together and dropped, so text in them is no command */
function commands(s) {
	const all = [[]];
	let word = null;
	const end = () => (word !== null && all.at(-1).push(word), (word = null));
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		if (c === '"' || c === "'") {
			const close = s.indexOf(c, i + 1);
			word = (word ?? '') + s.slice(i + 1, close < 0 ? undefined : close);
			i = close < 0 ? s.length : close;
		} else if (/[;&|\n()]/.test(c)) {
			end();
			if (all.at(-1).length) all.push([]);
		} else if (/\s/.test(c)) end();
		else word = (word ?? '') + c;
	}
	end();
	return all.filter((words) => words.length);
}

const gitIn = (dir, ...args) => spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).stdout?.trim() ?? '';
const branchOf = (ref) => ref.replace(/^\+/, '').replace(/^refs\/heads\//, '');

/** Why this push reaches main, or nothing */
function toMain(words) {
	let dir = resolve(input.cwd ?? process.cwd());
	let i = 1;
	for (; i < words.length && words[i] !== 'push'; i++) {
		if (words[i] === '-C') dir = resolve(dir, words[++i] ?? '.');
		else if (words[i] === '-c') i++;
		else if (!words[i].startsWith('-')) return; // another git command
	}
	if (words[i] !== 'push') return;
	const args = words.slice(i + 1).filter((word) => !/^\d?>/.test(word));
	if (args.some((arg) => arg === '--all' || arg === '--mirror' || arg === '--branches')) return 'pushes every branch';
	const positional = [];
	for (let k = 0; k < args.length; k++) {
		if (/^(--repo|--push-option|-o|--receive-pack|--exec)$/.test(args[k])) k++;
		else if (!args[k].startsWith('-')) positional.push(args[k]);
	}
	const current = gitIn(dir, 'rev-parse', '--abbrev-ref', 'HEAD');
	// no refspec: the branch push.default sends, @{push}, else the current one
	if (positional.length < 2) {
		const target = gitIn(dir, 'rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{push}').replace(/^[^/]+\//, '');
		return (target || current) === 'main' ? `pushes ${current} to main` : undefined;
	}
	for (const spec of positional.slice(1)) {
		const [source, target = source] = spec.split(':');
		const branch = branchOf(target === 'HEAD' || (!spec.includes(':') && branchOf(source) === 'HEAD') ? current : target);
		if (branch === 'main') return `pushes ${source} to main`;
	}
}

const reason = commands(command)
	.filter((words) => words[0] === 'git')
	.map(toMain)
	.find(Boolean);
if (reason)
	console.log(
		JSON.stringify({
			hookSpecificOutput: {
				hookEventName: 'PreToolUse',
				permissionDecision: 'ask',
				permissionDecisionReason: `This git push ${reason}; pushes to main need the product owner (CLAUDE.md, When to ask).`
			}
		})
	);
