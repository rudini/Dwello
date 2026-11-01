#!/usr/bin/env node
// The git calls of a Bash command as the shell runs them (#710), shared by the commit gates and the main push guard:
// `-C` (also `-C/x` and quoted paths with spaces), `-c key=val`, `--git-dir`, GIT_ variables that choose the
// repository, wrappers with their options (`env`, `nice -n 10`, `timeout 60`, `xargs`), variables and shell keywords, a
// `cd` or `pushd` before the call (not one in a pipe or in the background; one after `||` leaves the directory unknown)
// and the end of a subshell. Text in quotes or in a heredoc body is no command; a `$(…)` in double quotes or in an
// unquoted heredoc is.
// Not followed: `bash -c '…'`, backticks, and heredocs with `<<\EOF` or a partly quoted delimiter.
// `node git-calls.mjs` reads the PreToolUse JSON on stdin and prints the verb of each git call, one per line, for the
// shell gates.
import { readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const unresolvable = /[$`~]/;
// any delimiter word (END-NOTES too); several heredocs on one line take their bodies in turn (Copilot on #1017)
const heredocs = /<<-?\s*(['"]?)([^\s'"<>;&|()]+)\1([^\n]*)\n((?:[\s\S]*?\n)?)\s*\2(?=\n|$)/g;
const placeholder = /\0(\d+)\0/g;
const substitutions = (text) => [...text.matchAll(/\$\(([^)]*)\)?/g)].map(([, inner]) => `(${inner})`);

/**
 * The shell commands of a command line, each as its words, and the heredoc bodies; a heredoc stands as a placeholder
 * word in its command, a body's `$(…)` (unquoted heredoc) and one in double quotes come before their command, and
 * `(` and `)` stand alone, so a subshell's cd ends with it
 */
function commandsOf(line) {
	const bodies = [];
	let s = line.replace(/\\\n/g, ' ');
	for (let previous; previous !== s; ) {
		previous = s;
		s = s.replace(heredocs, (_, quote, _end, rest, body) => {
			bodies.push({ text: body.replace(/\n$/, ''), quoted: Boolean(quote) });
			return ` \0${bodies.length - 1}\0 ${rest}`;
		});
	}
	const split = (s) => {
		const all = [[]];
		let word = null;
		const before = (text) => all.splice(-1, 0, ...substitutions(text).flatMap(split));
		const end = () => {
			if (word === null) return;
			for (const [, n] of word.matchAll(placeholder)) if (!bodies[n].quoted) before(bodies[n].text);
			all.at(-1).push(word);
			word = null;
		};
		for (let i = 0; i < s.length; i++) {
			const c = s[i];
			if (c === '"' || c === "'") {
				const close = s.indexOf(c, i + 1);
				const quoted = s.slice(i + 1, close < 0 ? undefined : close);
				if (c === '"') before(quoted);
				word = (word ?? '') + quoted;
				i = close < 0 ? s.length : close;
			} else if (/[;&|\n()]/.test(c) && !(c === '&' && /[<>]/.test(s[i - 1]))) {
				end();
				// the operator between two commands, so a cd in a pipe, in the background or after || is known
				const op = c === '&' && s[i + 1] === '&' ? '&&' : c === '|' && s[i + 1] === '|' ? '||' : c;
				if (op.length === 2) i++;
				if (all.at(-1).length) (all.at(-1).next = op), all.push([]);
				all.at(-1).after = op;
				if (c === '(' || c === ')') all.push([c], []);
			} else if (/\s/.test(c)) end();
			else word = (word ?? '') + c;
		}
		end();
		return all.filter((words) => words.length);
	};
	return { commands: split(s), bodies };
}

/** The words without redirections (`> log`, `2>/dev/null`, `< in`) */
const withoutRedirections = (words) =>
	words.filter((word, i) => !/^\d*[<>]/.test(word) && !/^\d*[<>]+&?$/.test(words[i - 1] ?? ''));

// what may stand before git and still run it (review 713-1, C-3), with its options and operands (nice -n 10, timeout
// -k 5s 60s: Copilot on #1017), and the shell keywords and braces that may open a command (review 710-1, C-1)
const wrapper = /^(env|command|exec|nohup|time|sudo|nice|xargs|timeout)$/;
const keyword = /^(if|then|elif|else|do|while|until|!|\{)$/;
const repositoryVariable = /^GIT_(DIR|WORK_TREE|COMMON_DIR|NAMESPACE|CONFIG\w*)=/;

/**
 * The git call of one command, or nothing: its verb and the words after it; options, the git options before the verb;
 * env, the GIT_ variables that choose the repository; dir, where it runs (undefined when the hook cannot resolve the
 * directory or repository); stdin, the body of a heredoc the command reads
 */
function callOf(words, dir, bodies) {
	const env = {};
	let i = 0;
	let wrapped = false;
	for (; i < words.length && words[i] !== 'git'; i++) {
		if (repositoryVariable.test(words[i])) {
			const [name, value] = words[i].split(/=(.*)/s, 2);
			env[name] = value;
			if (unresolvable.test(value)) dir = undefined;
		} else if (wrapped || wrapper.test(words[i])) wrapped = true;
		else if (!keyword.test(words[i]) && !/^[A-Za-z_]\w*=/.test(words[i])) return;
	}
	const options = [];
	for (i++; i < words.length && words[i].startsWith('-'); i++) {
		// -C/x and --git-dir=x carry their value, -C x and -c key=val take the next word
		const joined = /^(-C|--git-dir|--work-tree)=?(.+)$/.exec(words[i]);
		const separate = /^(-C|-c|--git-dir|--work-tree|--namespace)$/.test(words[i]);
		const [option, value] = joined ? joined.slice(1) : separate ? [words[i], words[++i] ?? ''] : [words[i]];
		if (/^(-C|--git-dir|--work-tree)$/.test(option) && unresolvable.test(value)) dir = undefined;
		if (option === '-C') dir = dir && resolve(dir, value);
		else options.push(...(value === undefined ? [option] : [option, value]));
	}
	if (i >= words.length) return;
	let stdin;
	const args = words.slice(i + 1).flatMap((word) => {
		const alone = /^\0(\d+)\0$/.exec(word);
		if (alone) return (stdin = bodies[alone[1]].text), [];
		const cat = /^\$\(cat\s+\0(\d+)\0\s*\)$/.exec(word);
		return [cat ? bodies[cat[1]].text : word.replace(placeholder, (_, n) => bodies[n].text)];
	});
	return { verb: words[i], args, options, env, dir, stdin };
}

/** The git calls of `command` run in `cwd`, in the order the shell runs them */
export function gitCalls(command, cwd) {
	const { commands, bodies } = commandsOf(command);
	const calls = [];
	const outer = []; // the directories outside the open subshells
	let dir = resolve(cwd);
	for (const command of commands) {
		const words = withoutRedirections(command);
		if (words.length === 1 && words[0] === '(') outer.push(dir);
		else if (words.length === 1 && words[0] === ')') dir = outer.length ? outer.pop() : dir;
		// a cd the hook cannot resolve ($VAR, ~, cd -) leaves the directory unknown, also for a relative cd after it
		// a cd in a pipe or in the background moves a child shell only; one after || may not run (Copilot on #1017)
		else if ((words[0] === 'cd' || words[0] === 'pushd') && ![command.after, command.next].includes('|') && command.next !== '&') {
			const to = words[1] ?? '~';
			const unknown = unresolvable.test(to) || to === '-' || command.after === '||' || (!dir && !to.startsWith('/'));
			dir = unknown ? undefined : resolve(dir ?? '/', to);
		} else {
			const call = callOf(words, dir, bodies);
			if (call) calls.push(call);
		}
	}
	return calls;
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const input = JSON.parse(readFileSync(0, 'utf8'));
	for (const call of gitCalls(input.tool_input?.command ?? '', input.cwd ?? process.cwd())) console.log(call.verb);
}
