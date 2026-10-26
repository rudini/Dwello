// Recall of testcheck on planted defects: for each real test without a finding, plant one defect of each kind
// (a mutation of the test's own code; the first three such tests of each file) and count how often the rule meant for it reports that test. Usage:
//   node tools/testcheck/eval/seed.ts <dir>...
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { analyzeSource, testSpans } from '../src/analyze.ts';
import { testFiles } from '../src/cli.ts';

type Span = ReturnType<typeof testSpans>[number];
interface Plant {
	rule: string;
	/** The mutated file text, or undefined when the defect does not apply to this test. */
	apply: (text: string, t: Span, next: Span | undefined) => string | undefined;
}

const replace = (text: string, [from, to]: readonly [number, number], by: string) => text.slice(0, from) + by + text.slice(to);
const inner = (text: string, t: Span) => text.slice(t.bodySpan[0] + 1, t.bodySpan[1] - 1);
/**
 * Wrapping planted only into tests with a runtime `expect` and none of what the rules deliberately accept as
 * unguarded or counted: a throw, `expect.assertions`, a type assertion, a `done`-style parameter.
 */
const wrappable = (text: string, t: Span) =>
	t.block && /\bexpect\(/.test(inner(text, t)) && !/\bthrow\b|expect\.(assertions|hasAssertions|fail|unreachable)|expectTypeOf|assertType|@ts-expect-error|Expect</.test(inner(text, t)) && !t.param;
const wrap = (before: string, after: string) => (text: string, t: Span) => (wrappable(text, t) ? replace(text, t.bodySpan, `{ ${before}${inner(text, t)}${after} }`) : undefined);

/** `expect(actual).matcher(...)`: the call of `expect` and the matcher call, or undefined. */
const isExpect = (n: ts.Node): n is ts.CallExpression => ts.isCallExpression(n) && n.expression.getText() === 'expect' && n.arguments.length > 0;

function expectAt(n: ts.Node): { actual: ts.Expression; matcher: ts.CallExpression } | undefined {
	const call = isExpect(n) ? n.parent.parent : undefined;
	return call && ts.isCallExpression(call) && call.expression === n.parent ? { actual: (n as ts.CallExpression).arguments[0], matcher: call } : undefined;
}

/** The first `expect(actual).matcher(expected)` of the body, as positions in the file. */
function firstExpect(text: string, t: Span) {
	const sf = ts.createSourceFile('x.ts', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
	let found: ReturnType<typeof expectAt>;
	const visit = (n: ts.Node): void => {
		if (found || n.end <= t.bodySpan[0] || n.pos >= t.bodySpan[1]) return;
		found = expectAt(n);
		ts.forEachChild(n, visit);
	};
	visit(sf);
	return found;
}

const PLANTS: Plant[] = [
	{ rule: 'swallowed-assertion', apply: wrap('try { ', ' } catch { /* ignore */ }') },
	{ rule: 'catch-only-assertion', apply: wrap('try { void subject(); } catch (error) { ', ' }') },
	{ rule: 'loop-only-assertion', apply: wrap('for (const row of subject()) { ', ' }') },
	{ rule: 'callback-only-assertion', apply: wrap('void subject().then(async () => { ', ' });') },
	{
		rule: 'dangling-expect',
		apply: (text, t) => {
			const e = firstExpect(text, t);
			return e && replace(text, [e.matcher.arguments.pos - 1, e.matcher.end], '');
		}
	},
	{
		rule: 'tautology',
		apply: (text, t) => {
			const e = firstExpect(text, t);
			const expected = e?.matcher.arguments[0];
			// an expected value with a call would compare two results, which the rule accepts on purpose
			return e && expected && !ts.isFunctionLike(expected) && !expected.getText().includes('(') ? replace(text, [e.actual.getStart(), e.actual.end], expected.getText()) : undefined;
		}
	},
	{
		rule: 'unawaited-assertion',
		apply: (text, t) => {
			const at = text.slice(t.bodySpan[0], t.bodySpan[1]).search(/await expect\([^;]*\.(resolves|rejects)\./);
			return at < 0 ? undefined : replace(text, [t.bodySpan[0] + at, t.bodySpan[0] + at + 6], '');
		}
	},
	{
		rule: 'duplicate-body',
		apply: (text, t, next) => (next && next.path === t.path && !t.each && !next.each ? replace(text, t.bodySpan, text.slice(...next.bodySpan)) : undefined)
	},
	{
		rule: 'duplicate-title',
		apply: (text, t, next) => (next && next.path === t.path && !t.each && !next.each ? replace(text, t.titleSpan, text.slice(...next.titleSpan)) : undefined)
	}
];

const PER_FILE = 3;
const tally = new Map(PLANTS.map((p) => [p.rule, { planted: 0, found: 0, other: new Map<string, number>() }]));

/** The rules reported for the planted test; a duplicate is reported on the later of the two tests, the next one. */
const reported = (file: string, mutated: string, title: string) =>
	analyzeSource(file, mutated)
		.filter((f) => f.test === title)
		.map((f) => f.rule);

function record(rule: string, rules: string[]): void {
	const tl = tally.get(rule)!;
	tl.planted++;
	if (rules.includes(rule)) return void tl.found++;
	const why = rules.join('+') || 'none';
	tl.other.set(why, (tl.other.get(why) ?? 0) + 1);
}

/** Plants every defect into one test and tallies whether its rule reports it. */
function plantAll(file: string, text: string, t: Span, next: Span | undefined): void {
	for (const plant of PLANTS) {
		const mutated = plant.apply(text, t, next);
		const title = plant.rule.startsWith('duplicate-') ? next?.title : t.title;
		if (mutated !== undefined) record(plant.rule, reported(file, mutated, title!));
	}
}

for (const file of process.argv.slice(2).flatMap(testFiles)) {
	const text = readFileSync(file, 'utf8');
	const flagged = new Set(analyzeSource(file, text).map((f) => f.test));
	const spans = testSpans(file, text);
	// ponytail: at most PER_FILE tests per file keep the run in minutes; all of them if recall needs a tighter bound
	const chosen = spans.flatMap((t, i) => (flagged.has(t.title) ? [] : [i])).slice(0, PER_FILE);
	for (const i of chosen) plantAll(file, text, spans[i], spans[i + 1]);
}
console.log('| Planted defect | Planted | Found | Recall | Missed, what was reported instead |\n|---|---|---|---|---|');
for (const [rule, t] of tally) {
	const missed = [...t.other].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k} ${v}`).join(', ');
	console.log(`| \`${rule}\` | ${t.planted} | ${t.found} | ${t.planted ? ((100 * t.found) / t.planted).toFixed(1) : '–'} % | ${missed} |`);
}
