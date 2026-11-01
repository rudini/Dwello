#!/usr/bin/env node
// Asks before a `git push` whose resolved target is main (#713), which the ask rules in settings.json cannot see from the
// command text: a bare `git push` with main checked out (remote push refspecs, @{push}; push.default matching or a
// mirror remote), HEAD/@, `HEAD:main`, `heads/main`, `:main`, `:` and wildcard refspecs, `--all`/`--mirror`. Which
// calls are pushes and where they run comes from git-calls.mjs (#710), whose header names what it does not follow; a
// directory or repository it cannot resolve makes a push ask. A refspec to another branch (main-fix) passes. The ask
// rules for force and delete in settings.json stay as they are.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { gitCalls } from './git-calls.mjs';

const input = JSON.parse(readFileSync(0, 'utf8'));

const branchOf = (ref) => ref.replace(/^\+/, '').replace(/^(refs\/)?heads\//, '');

/** Why this push reaches main, or nothing */
function toMain({ args, options, env, dir }) {
	// the same repository and config as the push
	const ask = (...query) =>
		spawnSync('git', [...options, ...query], { cwd: dir, encoding: 'utf8', env: { ...process.env, ...env } }).stdout?.trim() ??
		'';
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

let reason;
for (const call of gitCalls(input.tool_input?.command ?? '', input.cwd ?? process.cwd()))
	if (call.verb === 'push') reason ??= call.dir ? toMain(call) : 'runs in a directory or repository the hook cannot resolve';
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
