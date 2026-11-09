// Fails when a `TODO(fachlich prüfen, #n)` marker names an issue that is closed, missing or a pull request, when a
// pull request closes an issue (`Fixes #n`) that a marker still names (CLAUDE.md, "Open work"), and when it closes an
// issue and changes what the app does without changing a scenario (CLAUDE.md, "Workflow" step 1), and when an open issue
// waits for a decision («Proposed (confirm before starting)») without the label `needs-decision` (skill `issue-work`), and when
// it changes a scenario that is not @wip on the base branch, or a step definition such a scenario uses (#1270), without
// `Spec change approved: #n` (CLAUDE.md, Workflow 1).
// It also fails when it changes a gate file (a check, its config or the rules) without `Gate change approved: #n`, and
// when it lowers a coverage floor, approved or not (#1269). CI runs the target branch's copy, so a pull request cannot switch it off.
// CI runs it with GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, PR_BODY and BASE_REF; locally: GITHUB_TOKEN=… node tools/open-work/check-issues.mjs
// With PR_NUMBER and a token the text comes from the API: the event's PR_BODY is the text from when the run started.
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const repo = process.env.GITHUB_REPOSITORY ?? 'rudini/Dwello';
const api = process.env.GITHUB_API_URL ?? 'https://api.github.com';
const scenarioLine = /^\s*(?:Szenario|Szenariogrundriss|Beispiel):\s*(.*)/;
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

const get = async (path) => {
	const response = await fetch(`${api}/repos/${repo}/${path}`, {
		headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, accept: 'application/vnd.github+json' }
	});
	if (response.status === 401 || response.status === 403) {
		console.error(`Cannot read issues of ${repo} (HTTP ${response.status}): check GITHUB_TOKEN`);
		process.exit(1);
	}
	return response;
};
/** The pull request's text as it is now; an unreadable one stops the run, as it would switch its checks off */
async function textOf(number) {
	const response = await get(`pulls/${number}`);
	if (!response.ok) {
		console.error(`Cannot read pull request #${number} (HTTP ${response.status})`);
		process.exit(1);
	}
	return (await response.json()).body ?? '';
}
const prBody =
	process.env.PR_NUMBER && process.env.GITHUB_TOKEN ? await textOf(process.env.PR_NUMBER) : (process.env.PR_BODY ?? '');

const failures = [];
const closing = [...prBody.matchAll(/\b(?:fix(?:es|ed)?|close[sd]?|resolve[sd]?)\s+#(\d+)/gi)];
for (const [, n] of closing) {
	if (refs.has(n)) failures.push(`This pull request closes #${n}, but markers still name it: ${refs.get(n).join(', ')}`);
}

// `No scenario: <reason>` in the pull request text where none applies, e.g. a refactoring without new behaviour
const base = process.env.BASE_REF;
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
const from = base && git('merge-base', `origin/${base}`, 'HEAD').trim();
const show = (rev, file) => (git('ls-tree', '--name-only', rev, file).trim() ? git('show', `${rev}:${file}`) : '');
if (base && closing.length && !/\bno scenario:/i.test(prBody)) {
	const changed = execFileSync('git', ['diff', '--name-only', `origin/${base}...HEAD`], { encoding: 'utf8' }).split('\n');
	const app = changed.some((file) => /^(src\/(routes|lib)|backend\/src)\//.test(file) && !/__tests__|\.test\.ts$/.test(file));
	if (app && !changed.some((file) => /^tests\/e2e\/features\/.+\.feature$/.test(file)))
		failures.push(
			`This pull request closes ${closing.map(([, n]) => `#${n}`).join(', ')} and changes the app, but no scenario in tests/e2e/features; add one, or say "No scenario: <reason>" in its text`
		);
}

// A scenario without @wip on the base branch is the specification: a pull request that changes or removes one of its
// lines, or tags it @wip, needs the product owner's approval, `Spec change approved: #n` (CLAUDE.md, Workflow 1)
const approvals = [...prBody.matchAll(/\bspec change approved:\s*#(\d+)/gi)].map(([, n]) => n);
const specChanges = [];
if (base) {
	for (const file of git('diff', '--name-only', '--no-renames', from, 'HEAD', '--', 'tests/e2e/features/').split('\n')) {
		if (!file.endsWith('.feature')) continue;
		const [before, after] = [show(from, file), show('HEAD', file)];
		const spec = scenarios(before);
		const changed = new Set();
		const hunks = git('diff', '-U0', from, 'HEAD', '--', file).matchAll(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? /gm);
		for (const [, start, count = '1', at, added = '1'] of hunks) {
			for (let line = +start; line < +start + +count; line++) changed.add(spec[line]);
			if (count === '0') changed.add(insertedInto(spec, before, +start, after.split('\n').slice(+at - 1, +at - 1 + +added)));
		}
		for (const { name, wip } of scenarios(show('HEAD', file)).filter(Boolean))
			if (wip) changed.add(spec.find((scenario) => scenario?.name === name));
		for (const scenario of changed) if (scenario && !scenario.wip) specChanges.push(`${file}:${scenario.line} «${scenario.name}»`);
	}
}
// a changed or removed step definition that a scenario without @wip on the base uses changes that scenario (#1270)
if (base)
	for (const file of git('diff', '--name-only', '--no-renames', from, 'HEAD', '--', 'tests/e2e/steps/').split('\n')) {
		if (!file.endsWith('.ts')) continue;
		for (const step of changedSteps(file)) {
			const users = specSteps().filter(({ texts }) => texts.some(step.matches));
			const named = [...new Set(users.map(({ file, scenario }) => `${file}:${scenario.line} «${scenario.name}»`))];
			if (named.length) specChanges.push(`${file}:${step.line} step «${step.pattern}», used by ${named.join(', ')},`);
		}
	}
if (!approvals.length)
	for (const place of specChanges)
		failures.push(
			`${place} changes the specification; fix the code, or ask the product owner and say "Spec change approved: #<issue>" in the pull request text`
		);

// A pull request may not loosen the checks that judge it: a changed gate file needs `Gate change approved: #n` (#1269)
const gateApprovals = [...prBody.matchAll(/\bgate change approved:\s*#(\d+)/gi)].map(([, n]) => n);
const gateFile =
	/^(\.github\/workflows\/|tools\/|\.claude\/(hooks|skills)\/)|(^|\/)CLAUDE\.md$|^(\.fallowrc\.json|deepcheck\.config\.json|\.(deepcheck|testcheck)-baseline\.json|vitest\.config\.ts|backend\/scripts\/coverage-check\.ts)$/;
const gateChanges = base
	? git('diff', '--name-only', '--no-renames', from, 'HEAD')
			.split('\n')
			.filter((file) => gateFile.test(file))
	: [];
// a lowered coverage floor stays red with approval too: a ratchet against the merge base, as tools/fitness/ratchet.json
const floorsOf = (rev, file) => {
	const text = show(rev, file);
	const [, list = ''] = /(?:thresholds:|MINIMUM =)\s*\{([^}]*)\}/.exec(text) ?? [];
	return Object.fromEntries(list.split(',').map((entry) => entry.split(':').map((part) => part.trim())));
};
// only a plain number counts, so a floor written as an expression (`60 - 1`, `60e-1`) fails closed
const number = (text) => (/^\d+(\.\d+)?$/.test(text ?? '') ? +text : NaN);
for (const file of gateChanges.filter((file) => /^(vitest\.config|backend\/scripts\/coverage-check)\.ts$/.test(file))) {
	const after = floorsOf('HEAD', file);
	for (const [key, value] of Object.entries(floorsOf(from, file)))
		if (key && !(number(after[key]) >= number(value)))
			failures.push(`${file} lowers the coverage floor ${key} from ${value} to ${after[key] ?? 'none'}`);
}
if (!gateApprovals.length)
	for (const file of gateChanges)
		failures.push(`${file} changes a check; ask the product owner and say "Gate change approved: #<issue>" in the pull request text`);

if (!process.env.GITHUB_TOKEN) {
	console.log(`Skipped the issue lookup: GITHUB_TOKEN is not set (CI sets it); ${refs.size} issues named by markers`);
} else {
	for (const [n, places] of refs) {
		const response = await get(`issues/${n}`);
		const issue = response.ok ? await response.json() : null;
		const state = !issue ? `missing (HTTP ${response.status})` : issue.pull_request ? 'a pull request' : issue.state;
		if (state !== 'open') failures.push(`#${n} is ${state}; remove or repoint these markers: ${places.join(', ')}`);
	}
	// an approval is an issue whose «Decided (product owner)» holds the change (skill `issue-work`)
	const asked = [
		...(specChanges.length ? approvals : []).map((n) => [n, 'specification']),
		...(gateChanges.length ? gateApprovals : []).map((n) => [n, 'gate'])
	];
	for (const [n, kind] of asked) {
		const response = await get(`issues/${n}`);
		const issue = response.ok ? await response.json() : null;
		const why = !issue
			? `it is missing (HTTP ${response.status})`
			: issue.pull_request
				? 'it is a pull request'
				: issue.state_reason === 'not_planned'
					? 'it is closed as not planned'
					: issue.labels?.some((label) => label.name === 'needs-decision')
						? 'it is still labelled needs-decision'
						: '';
		if (why) failures.push(`#${n} does not approve a ${kind} change: ${why}`);
	}
	for (let page = 1; ; page++) {
		const response = await get(`issues?state=open&per_page=100&page=${page}`);
		if (!response.ok) {
			failures.push(`Cannot list open issues (HTTP ${response.status})`);
			break;
		}
		const issues = await response.json();
		if (!issues.length) break;
		for (const issue of issues) {
			const deciding = issue.labels.some((label) => label.name === 'needs-decision');
			if (!issue.pull_request && !deciding && /^#+ *Proposed \(confirm before starting\)/m.test(issue.body ?? ''))
				failures.push(`#${issue.number} has "Proposed (confirm before starting)" but not the label needs-decision`);
		}
	}
}

/**
 * The scenario that lines inserted after line `after` of the base text change: the lines before a new scenario belong
 * to the one above (rows under «Beispiele:» and a new «Beispiele:» block are free), tag lines at the end to the one below
 */
function insertedInto(spec, text, after, inserted) {
	const first = inserted.findIndex((line) => scenarioLine.test(line));
	const lead = first < 0 ? inserted : inserted.slice(0, first);
	const content = (line) => !/^\s*(?:#.*|@.*)?$/.test(line);
	const body = lead.filter(content);
	if (body.length && !examplesOnly(['', ...text.split('\n')], after, body)) return spec[after];
	const tail = lead.slice(lead.findLastIndex(content) + 1);
	if (first < 0 && tail.some((line) => /^\s*@/.test(line))) return spec[after + 1];
}

/** Whether `body`, inserted after line `after`, is only rows of a «Beispiele:» table, or a new such table */
function examplesOnly(lines, after, body) {
	let row = after;
	while (/^\s*\|/.test(lines[row])) row--;
	const [heading, ...rows] = /^\s*Beispiele:/.test(body[0]) ? body : [lines[row], ...body];
	return /^\s*Beispiele:/.test(heading) && rows.every((line) => /^\s*\|/.test(line));
}

/** The step definitions of a step file on the base that the pull request changes or removes, each with its matcher */
function changedSteps(file) {
	const lines = ['', ...show(from, file).split('\n')];
	const defs = [];
	lines.forEach((line, i) => {
		const [, indent] = /^(\s*)(?:Given|When|Then)\(/.exec(line) ?? [];
		if (indent === undefined) return;
		// an indented one is the body of a loop over its patterns: the definition starts at the loop, as far back as the
		// statement before it
		let start = i;
		while (indent && start > 1 && !/^for\b/.test(lines[start]) && !/^\S.*;\s*$/.test(lines[start - 1])) start--;
		defs.push({ line: start, call: i, end: endOf(lines, i, indent) });
	});
	const touched = new Set();
	for (const [, start, count = '1'] of git('diff', '-U0', from, 'HEAD', '--', file).matchAll(/^@@ -(\d+)(?:,(\d+))? /gm)) {
		// an insertion lies after line `start`: it changes the definition it falls inside of
		const [first, last] = count === '0' ? [+start + 0.5, +start + 0.5] : [+start, +start + +count - 1];
		for (const def of defs) if (def.line <= last && first <= def.end) touched.add(def);
	}
	return [...touched].map((def) => ({
		...def,
		...matcher(lines.slice(def.line, def.call).join('\n'), lines.slice(def.call, def.end + 1).join('\n'))
	}));
}

/** The last line of the step definition called at line `start`: its own line for a one-liner, else the closing one */
function endOf(lines, start, indent) {
	if (/\);\s*$/.test(lines[start])) return start;
	let end = start + 1;
	while (end < lines.length - 1 && !lines[end].startsWith(`${indent})`) && !lines[end].startsWith(`${indent}}`)) end++;
	return end;
}

/**
 * The patterns of a step definition, Cucumber or regular expressions, and whether a step text matches one: the literal it
 * is called with, else the strings of the loop around it; a pattern it cannot read matches every step (fails closed)
 */
function matcher(loop, call) {
	const literal = /^\s*(?:Given|When|Then)\(\s*('(?:[^'\\]|\\.)*'|\/(?:[^/\\\n]|\\.)+\/[a-z]*)/.exec(call)?.[1];
	const literals = literal ? [literal] : (loop.match(/'(?:[^'\\]|\\.)*'/g) ?? []);
	const tests = literals.map(test);
	return {
		pattern: literals.map((text) => (text.startsWith('/') ? text : text.slice(1, -1))).join(' | ') || call.split('\n')[0].trim(),
		matches: (text) => !tests.length || tests.some((matches) => matches(text))
	};
}

/** Whether a step text matches one pattern literal */
function test(literal) {
	if (literal.startsWith('/')) {
		const regex = new RegExp(literal.slice(1, literal.lastIndexOf('/')), literal.slice(literal.lastIndexOf('/') + 1));
		return (text) => regex.test(text);
	}
	const { CucumberExpression, ParameterTypeRegistry } = cucumber();
	try {
		const expression = new CucumberExpression(literal.slice(1, -1).replace(/\\(.)/g, '$1'), new ParameterTypeRegistry());
		return (text) => expression.match(text) !== null;
	} catch {
		return () => true; // a parameter type this check does not know: fails closed
	}
}

/** The Cucumber expressions of the repository: CI runs this script from outside it, so it is looked up from both places */
function cucumber() {
	for (const from of [import.meta.url, `${process.cwd()}/`]) {
		try {
			return createRequire(from)('@cucumber/cucumber-expressions');
		} catch {
			// not installed next to this copy of the script
		}
	}
	throw new Error('Cannot load @cucumber/cucumber-expressions: run bun install');
}

/** Every step of a scenario without @wip on the base, with its feature file and scenario (read once) */
function specSteps() {
	specSteps.all ??= git('ls-tree', '-r', '--name-only', from, 'tests/e2e/features/')
		.split('\n')
		.filter((file) => file.endsWith('.feature'))
		.flatMap((file) => {
			const lines = show(from, file).split('\n');
			const owner = scenarios(lines.join('\n'));
			const rows = examples(lines, owner);
			return lines.flatMap((line, i) => {
				const [, step] = /^\s*(?:Angenommen|Gegeben seien?|Wenn|Dann|Und|Aber|\*)\s+(.*?)\s*$/.exec(line) ?? [];
				const scenario = owner[i + 1];
				if (!step || scenario.wip) return [];
				// an outline's step reads as it runs, once per row of its «Beispiele:»
				const texts = (rows.get(scenario) ?? [{}]).map((row) => step.replace(/<([^>]+)>/g, (all, name) => row[name] ?? all));
				return [{ file, texts, scenario }];
			});
		});
	return specSteps.all;
}

/** The rows of each outline's «Beispiele:» tables, as objects keyed by the header of their table */
function examples(lines, owner) {
	const rows = new Map();
	let header = null; // null outside a table, [] right after «Beispiele:»
	lines.forEach((line, i) => {
		const cells = /^\s*\|(.*)\|\s*$/.exec(line)?.[1].split('|').map((cell) => cell.trim());
		if (/^\s*Beispiele:/.test(line)) header = [];
		else if (!cells) header = /^\s*(#.*)?$/.test(line) ? header : null;
		else if (header?.length === 0) header = cells;
		else if (header) {
			const scenario = owner[i + 1];
			rows.set(scenario, [...(rows.get(scenario) ?? []), Object.fromEntries(header.map((name, n) => [name, cells[n]]))]);
		}
	});
	return rows;
}

/** The scenario each line of a feature file belongs to (index = line number); the header and Background count for all */
function scenarios(text) {
	const lines = ['', ...text.split('\n')];
	const fileWip = /@wip\b/.test(text.split(/^\s*Funktionalität:/m)[0]);
	const header = { line: 1, name: 'Funktionalität und Grundlage', wip: fileWip };
	const owner = [];
	let current = header;
	lines.forEach((line, i) => {
		const keyword = scenarioLine.exec(line);
		if (keyword) {
			let first = i;
			while (/^\s*@/.test(lines[first - 1] ?? '')) first--;
			current = { line: i, name: keyword[1].trim(), wip: fileWip || /@wip\b/.test(lines.slice(first, i).join(' ')) };
			owner.fill(current, first, i);
		}
		owner[i] = current;
	});
	header.wip = owner.every((scenario) => scenario.wip || scenario === header);
	return owner;
}

if (failures.length) {
	console.error(failures.join('\n'));
	process.exit(1);
}
console.log(`${refs.size} issues named by markers${process.env.GITHUB_TOKEN ? ', all open' : ''}`);
