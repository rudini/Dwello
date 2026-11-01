#!/usr/bin/env node
// Asks before a `git push` whose resolved target is main (#713), which the ask rules in settings.json cannot see from the
// command text: a bare `git push` with main checked out (@{push}; push.default matching or a mirror remote), HEAD/@,
// `HEAD:main`, `heads/main`, `:main`, `:` and wildcard refspecs, `--all`/`--mirror`, in the directory a `cd`, `-C` or
// `--git-dir` gives, also behind `env`, variables, `command` or `timeout`. A refspec to another branch (main-fix) and text
// that only mentions a push (in quotes) pass. Not followed: `bash -c '…'` and other shells; the ask rules for force and
// delete in settings.json stay as they are. A `cd` or `pushd` it cannot resolve ($VAR, ~, `cd -`) makes a push ask. A push inside backticks (echo `git push`) is
// not seen, as `$(…)` is.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8'));
const command = input.tool_input?.command ?? '';

/**
 * The shell commands of a line, each as its words; quotes are kept together and dropped, so text in them is no command,
 * except a `$(…)` in double quotes (checked before its command) or in an unquoted heredoc (before the rest of its
 * line); heredoc bodies are dropped; `(` and `)` stand alone, so a subshell's cd ends with it
 */
const substitutions = (text) => [...text.matchAll(/\$\(([^)]*)\)?/g)].map(([, inner]) => `(${inner})`);
function commands(line) {
	const s = line
		.replace(/\\\n/g, ' ')
		.replace(/<<-?\s*(['"]?)(\w+)\1([^\n]*)\n((?:[\s\S]*?\n)?)\s*\2(?=\n|$)/g, (_, quote, _end, rest, body) =>
			[...(quote ? [] : substitutions(body)), rest].join(';')
		);
	const all = [[]];
	let word = null;
	const end = () => (word !== null && all.at(-1).push(word), (word = null));
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		if (c === '"' || c === "'") {
			const close = s.indexOf(c, i + 1);
			const quoted = s.slice(i + 1, close < 0 ? undefined : close);
			if (c === '"') all.splice(-1, 0, ...substitutions(quoted).flatMap(commands));
			word = (word ?? '') + quoted;
			i = close < 0 ? s.length : close;
		} else if (/[;&|\n()]/.test(c)) {
			end();
			if (all.at(-1).length) all.push([]);
			if (c === '(' || c === ')') all.push([c], []);
		} else if (/\s/.test(c)) end();
		else word = (word ?? '') + c;
	}
	end();
	return all.filter((words) => words.length);
}

/** The words without redirections (`> log`, `2>/dev/null`, `< in`) */
const withoutRedirections = (words) =>
	words.filter((word, i) => !/^\d*[<>]/.test(word) && !/^\d*[<>]+&?$/.test(words[i - 1] ?? ''));

// what may stand before git and still run it (review 713-1, C-3)
const prefix = /^(env|command|exec|nohup|time|sudo)$/;
function withoutPrefixes(words) {
	let i = 0;
	while (i < words.length && words[i] !== 'git') {
		if (words[i] === 'timeout') i += 2;
		else if (prefix.test(words[i]) || /^[A-Za-z_]\w*=/.test(words[i]) || words[i].startsWith('-')) i++;
		else return [];
	}
	return words.slice(i);
}

const branchOf = (ref) => ref.replace(/^\+/, '').replace(/^(refs\/)?heads\//, '');

const unresolvable = /[$`~]/;

/** Why this push reaches main, or nothing; dir is where the command runs, env the GIT_ variables set before git */
function toMain(words, dir, env) {
	const git = []; // the options before push, so the questions below see the same repository and config
	let i = 1;
	for (; i < words.length && words[i] !== 'push'; i++) {
		const option = words[i].match(/^(-C|--git-dir|--work-tree)(=(.*))?$/);
		if (option && unresolvable.test(option[2] ? option[3] : (words[i + 1] ?? '')))
			return 'runs in a repository the hook cannot resolve';
		if (words[i] === '-C') dir = resolve(dir, words[++i] ?? '.');
		else if (/^(-c|--git-dir|--work-tree|--namespace)$/.test(words[i])) git.push(words[i], words[++i] ?? '');
		else if (words[i].startsWith('-')) git.push(words[i]);
		else return; // another git command
	}
	if (words[i] !== 'push') return;
	if (Object.values(env).some((value) => unresolvable.test(value))) return 'runs in a repository the hook cannot resolve';
	const ask = (...args) =>
		spawnSync('git', [...git, ...args], { cwd: dir, encoding: 'utf8', env: { ...process.env, ...env } }).stdout?.trim() ?? '';
	const args = words.slice(i + 1);
	if (args.some((arg) => /^--(all|mirror|branches)$/.test(arg))) return 'pushes every branch';
	const positional = [];
	for (let k = 0; k < args.length; k++) {
		if (/^(--repo|--push-option|-o|--receive-pack|--exec)$/.test(args[k])) k++;
		else if (!args[k].startsWith('-')) positional.push(args[k]);
	}
	const current = ask('rev-parse', '--abbrev-ref', 'HEAD');
	// no refspec: what the remote's push refspecs, else push.default send (@{push}, else the current branch; matching and
	// mirror take main)
	let specs = positional.slice(1);
	if (!specs.length) {
		const remote = positional[0] ?? 'origin';
		if (ask('config', 'push.default') === 'matching' || ask('config', '--bool', `remote.${remote}.mirror`) === 'true')
			return 'pushes every matching branch';
		specs = ask('config', '--get-all', `remote.${remote}.push`).split('\n').filter(Boolean);
		if (!specs.length) {
			const target = ask('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{push}').replace(/^[^/]+\//, '');
			return (target || current) === 'main' ? `pushes ${current} to main` : undefined;
		}
	}
	for (const spec of specs) {
		if (spec === ':' || spec === '+:') return 'pushes every matching branch';
		if (spec.includes('*')) return `pushes the pattern ${spec}`;
		const [source, target = source] = spec.split(':');
		const head = (ref) => (/^\+?(HEAD|@)$/.test(ref) ? current : ref);
		if (branchOf(head(target)) === 'main') return `pushes ${source || 'a deletion'} to main`;
	}
}

let dir = resolve(input.cwd ?? process.cwd());
let reason;
const outer = []; // the directories outside the open subshells
for (const words of commands(command).map(withoutRedirections)) {
	if (words.length === 1 && words[0] === '(') outer.push(dir);
	if (words.length === 1 && words[0] === ')' && outer.length) dir = outer.pop();
	// a cd before the push moves it (review 713-1, C-1); one the hook cannot resolve ($VAR, cd -) makes any push ask (C-8)
	if (words[0] === 'cd' || words[0] === 'pushd') {
		const to = words[1] ?? '~';
		// unknown stays unknown, also for a relative cd after it (review 713-3, C-9)
		dir = /[$`~]|^-$/.test(to) || (!dir && !to.startsWith('/')) ? undefined : resolve(dir ?? '/', to);
	}
	const git = withoutPrefixes(words);
	if (!dir && git[0] === 'git' && git.includes('push')) reason ??= 'runs in a directory the hook cannot resolve';
	else if (dir) {
		const assignments = words
			.slice(0, words.length - git.length)
			.filter((word) => /^GIT_(DIR|WORK_TREE|COMMON_DIR|NAMESPACE|CONFIG\w*)=/.test(word));
		reason ??= toMain(git, dir, Object.fromEntries(assignments.map((word) => word.split(/=(.*)/s, 2))));
	}
}
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
