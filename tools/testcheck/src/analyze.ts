import ts from 'typescript';
import { titleFindings } from './title.ts';

export interface Finding {
	file: string;
	line: number;
	/** Full title, describe titles joined with " > ". */
	test: string;
	/** Where the test starts; a suppression comment goes on the line above. */
	testLine: number;
	rule: string;
	message: string;
	/** The offending code, first line, at most 80 characters. */
	code: string;
}

interface TestCase {
	title: string;
	/** The test's own title, without the describe titles. */
	name: string;
	/** The describe titles, " > " between them. */
	path: string;
	line: number;
	/** The whole `it(...)` call, title included. */
	call: ts.CallExpression;
	fn: Fn;
	body: ts.ConciseBody;
	/** `it.each`/`test.for`: the title is a template, the body runs once per row. */
	each: boolean;
}

type Fn = ts.ArrowFunction | ts.FunctionExpression | ts.FunctionDeclaration;

const TEST_NAMES = new Set(['it', 'test']);
const SUITE_NAMES = new Set(['describe', 'suite']);
const SKIPPED = new Set(['skip', 'todo']);

/** The base name and modifiers of a callee like `it`, `it.only`, `it.each(rows)`, `describe.skipIf(x)`. */
function callee(expr: ts.Expression): { base: string; mods: string[] } | undefined {
	if (ts.isIdentifier(expr)) return { base: expr.text, mods: [] };
	if (ts.isPropertyAccessExpression(expr)) {
		const inner = callee(expr.expression);
		return inner && { base: inner.base, mods: [...inner.mods, expr.name.text] };
	}
	if (ts.isCallExpression(expr)) return callee(expr.expression);
	return undefined;
}

function titleOf(node: ts.Expression | undefined): string | undefined {
	if (!node) return undefined;
	if (ts.isStringLiteralLike(node)) return node.text;
	if (ts.isTemplateExpression(node))
		return node.head.text + node.templateSpans.map((s) => '${' + s.expression.getText() + '}' + s.literal.text).join('');
	return undefined;
}

const isFn = (n: ts.Node | undefined): n is Fn =>
	!!n && (ts.isArrowFunction(n) || ts.isFunctionExpression(n) || ts.isFunctionDeclaration(n));

/** Every runnable test with its describe path; skipped and todo tests are left out. */
function collectTests(sf: ts.SourceFile): TestCase[] {
	const tests: TestCase[] = [];
	const visit = (node: ts.Node, path: string[]): void => {
		if (ts.isCallExpression(node)) {
			const c = callee(node.expression);
			const title = titleOf(node.arguments[0]);
			const fn = node.arguments.find(isFn) as Fn | undefined;
			if (c && (TEST_NAMES.has(c.base) || SUITE_NAMES.has(c.base)) && c.mods.some((m) => SKIPPED.has(m))) return;
			if (c && title !== undefined && fn?.body) {
				const each = c.mods.some((m) => m === 'each' || m === 'for');
				if (SUITE_NAMES.has(c.base)) return ts.forEachChild(fn.body, (n) => visit(n, [...path, title]));
				if (TEST_NAMES.has(c.base)) {
					const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
					tests.push({ title: [...path, title].join(' > '), name: title, path: path.join(' > '), line, call: node, fn, body: fn.body, each });
					return;
				}
			}
		}
		ts.forEachChild(node, (n) => visit(n, path));
	};
	visit(sf, []);
	return tests;
}

// a whole word or the start of a camelCase name: checkTotals, not checkout
const ASSERT_CALL = /^(expect|assert|should|verify|check)(?![a-z])/;
const ASSERT_METHOD = /^(expect|assert|should)(?![a-z])/;
const TYPE_ASSERT = /^(Expect|Equal|IsExact|IsEqual|Assert|AssertTrue|AssertFalse|IsTrue)$/;
const IMPLICIT_ASSERT = /^(get|find)(All)?By[A-Z]/;

/** Names of functions declared in the file whose bodies assert, directly or through another such function. */
function assertingHelpers(sf: ts.SourceFile): Set<string> {
	const fns = new Map<string, ts.Node>();
	const collect = (n: ts.Node): void => {
		if (ts.isFunctionDeclaration(n) && n.name && n.body) fns.set(n.name.text, n.body);
		if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && isFn(n.initializer)) fns.set(n.name.text, n.initializer.body);
		ts.forEachChild(n, collect);
	};
	collect(sf);
	const asserting = new Set<string>();
	for (let grown = true; grown; ) {
		grown = false;
		for (const [name, body] of fns)
			if (!asserting.has(name) && countAssertions(body, asserting) > 0) {
				asserting.add(name);
				grown = true;
			}
	}
	return asserting;
}

/** The identifier a call ends in: `expect` in `expect(x)`, `getByText` in `screen.getByText(...)`. */
function calleeName(call: ts.CallExpression): string | undefined {
	const e = call.expression;
	if (ts.isIdentifier(e)) return e.text;
	if (ts.isPropertyAccessExpression(e)) return e.name.text;
	return undefined;
}

function isAssertionCall(call: ts.CallExpression, helpers: Set<string>): boolean {
	const name = calleeName(call);
	if (!name) return false;
	if (ts.isIdentifier(call.expression)) return ASSERT_CALL.test(name) || helpers.has(name) || IMPLICIT_ASSERT.test(name);
	if (!ts.isPropertyAccessExpression(call.expression)) return false;
	const root = call.expression.expression;
	return IMPLICIT_ASSERT.test(name) || ASSERT_METHOD.test(name) || name === 'fail' || (ts.isIdentifier(root) && ASSERT_CALL.test(root.text));
}

const COUNTERS = new Set(['assertions', 'hasAssertions']);
const FAILS = new Set(['fail', 'unreachable']);

/** Assertion calls and throw statements in a node; `expect.assertions(n)` is a counter, not an assertion. */
function assertionNodes(node: ts.Node, helpers: Set<string>): ts.Node[] {
	const found: ts.Node[] = [];
	const visit = (x: ts.Node): void => {
		if (ts.isCallExpression(x) && isAssertionCall(x, helpers) && !COUNTERS.has(calleeName(x) ?? '')) found.push(x);
		else if (ts.isThrowStatement(x)) found.push(x);
		ts.forEachChild(x, visit);
	};
	visit(node);
	return found;
}

/**
 * Assertions tsc checks: type-level `Expect<Equal<…>>` and an expected type error; with `declarations`, also a value
 * that must fit a declared type, which only shows that a test without other assertions checks types.
 */
function typeAssertions(node: ts.Node, declarations = false): number {
	let n = 0;
	const visit = (x: ts.Node): void => {
		if (ts.isTypeReferenceNode(x) && ts.isIdentifier(x.typeName) && TYPE_ASSERT.test(x.typeName.text)) n++;
		// tsc checks that the value fits the declared type
		else if (declarations && (ts.isSatisfiesExpression(x) || ts.isTypeAliasDeclaration(x) || (ts.isVariableDeclaration(x) && x.type))) n++;
		ts.forEachChild(x, visit);
	};
	visit(node);
	return n + (node.getFullText().match(/@ts-expect-error/g)?.length ?? 0);
}

const countAssertions = (node: ts.Node, helpers: Set<string>): number => assertionNodes(node, helpers).length + typeAssertions(node, true);

const ITERATORS = new Set(['forEach', 'map', 'flatMap', 'filter', 'every', 'some', 'find', 'findIndex', 'reduce']);
const SCHEDULERS = new Set(['then', 'catch', 'finally', 'setTimeout', 'setInterval', 'setImmediate', 'nextTick', 'queueMicrotask', 'on', 'once', 'addEventListener', 'subscribe']);

const PASS_THROUGH_METHODS = new Set(['filter', 'map', 'flatMap', 'slice', 'concat', 'entries', 'keys', 'values', 'sort', 'toSorted', 'reverse', 'flat']);

const unwrap = (n: ts.Expression): ts.Expression =>
	ts.isAsExpression(n) || ts.isSatisfiesExpression(n) || ts.isParenthesizedExpression(n) || ts.isNonNullExpression(n) ? unwrap(n.expression) : n;

/**
 * Data a loop runs over that the test fixes itself, so it is not empty by accident: a non-empty literal, a
 * module constant or import, an `each` row, a `split` result, or a view of one of those.
 */
function isFixedData(expr: ts.Expression, eachParams: Set<string>): boolean {
	const n = unwrap(expr);
	if (ts.isArrayLiteralExpression(n)) return n.elements.length > 0;
	if (ts.isObjectLiteralExpression(n)) return n.properties.length > 0;
	if (ts.isPropertyAccessExpression(n) || ts.isElementAccessExpression(n)) return isFixedData(n.expression, eachParams);
	if (ts.isAwaitExpression(n)) return isFixedData(n.expression, eachParams);
	if (ts.isCallExpression(n)) return isFixedCall(n, eachParams);
	return ts.isIdentifier(n) && isFixedName(n, eachParams);
}

/** Test data the test file builds itself: a call of a function declared in it, or `Promise.all` of a literal list. */
const ARGUMENT_VIEWS = new Set(['Promise', 'Object', 'Array']);

function isFixedCall(n: ts.CallExpression, eachParams: Set<string>): boolean {
	if (calleeName(n) === 'split') return true;
	if (ts.isIdentifier(n.expression)) return isLocalFunction(n.expression);
	if (!ts.isPropertyAccessExpression(n.expression)) return false;
	const receiver = n.expression.expression;
	// Promise.all([...]), Object.entries({...}), Array.from([...]): a view of their argument
	if (ts.isIdentifier(receiver) && ARGUMENT_VIEWS.has(receiver.text)) return !!n.arguments[0] && isFixedData(n.arguments[0], eachParams);
	return PASS_THROUGH_METHODS.has(n.expression.name.text) && isFixedData(receiver, eachParams);
}

// ponytail: a name resolves to the first declaration in the file, not by scope; scope analysis if shadowing misleads it
function isFixedName(n: ts.Identifier, eachParams: Set<string>): boolean {
	if (eachParams.has(n.text)) return true;
	const decl = declarationOf(n);
	if (!decl) return false;
	if (!ts.isVariableDeclaration(decl) || ts.isSourceFile(decl.parent.parent.parent)) return true;
	return !!decl.initializer && isFixedData(decl.initializer, eachParams);
}

function isLocalFunction(id: ts.Identifier): boolean {
	let found = false;
	const visit = (x: ts.Node): void => {
		if (ts.isFunctionDeclaration(x) && x.name?.text === id.text) found = true;
		else if (!found) ts.forEachChild(x, visit);
	};
	visit(id.getSourceFile());
	const decl = declarationOf(id);
	return found || (!!decl && ts.isVariableDeclaration(decl) && isFn(decl.initializer));
}

/** The variable or import that declares a name, the first one in the file. */
function declarationOf(id: ts.Identifier): ts.VariableDeclaration | ts.ImportSpecifier | ts.ImportClause | ts.NamespaceImport | undefined {
	let found: ReturnType<typeof declarationOf>;
	const visit = (x: ts.Node): void => {
		if (found) return;
		if ((ts.isVariableDeclaration(x) || ts.isImportSpecifier(x) || ts.isImportClause(x) || ts.isNamespaceImport(x)) && x.name && ts.isIdentifier(x.name) && x.name.text === id.text) found = x;
		else ts.forEachChild(x, visit);
	};
	visit(id.getSourceFile());
	return found;
}

/** `for (let i = 1; i <= 12; i++)`: a counting loop between literal bounds. */
const isLiteralRange = (p: ts.ForStatement) =>
	!!p.condition && ts.isBinaryExpression(p.condition) && ts.isNumericLiteral(p.condition.right) && !!p.initializer && /=\s*-?\d+\s*$/.test(p.initializer.getText());

const isChainLink = (p: ts.Node) => ts.isPropertyAccessExpression(p) || ts.isCallExpression(p) || ts.isParenthesizedExpression(p) || isPromise(p);
const returns = (p: ts.Node, n: ts.Node) => ts.isAwaitExpression(p) || ts.isReturnStatement(p) || (ts.isArrowFunction(p) && p.body === n);

const COMBINATORS = new Set(['all', 'allSettled', 'race', 'any']);
const isPromise = (n: ts.Node): n is ts.NewExpression => ts.isNewExpression(n) && n.expression.getText() === 'Promise';
/** An element of `Promise.all([...])` and its kin: the combined promise waits for it. */
const inCombinator = (n: ts.Node) => ts.isArrayLiteralExpression(n) && ts.isCallExpression(n.parent) && COMBINATORS.has(calleeName(n.parent) ?? '');

/** The `new Promise(...)` whose executor holds the node, below the test body. */
function enclosingPromise(n: ts.Node, root: ts.Node): ts.NewExpression | undefined {
	for (let p = n.parent; p && p !== root; p = p.parent) if (isFn(p) && isPromise(p.parent)) return p.parent;
	return undefined;
}

/**
 * Whether a call's promise is awaited, returned or the body of a concise arrow before reaching the test body, also
 * through `Promise.all([...])` or as a callback in the executor of a `new Promise` the test waits for.
 */
function isWaitedFor(call: ts.Node, root: ts.Node): boolean {
	for (let n = call; ; n = n.parent) {
		if (n === root) return ts.isArrowFunction(n.parent) && n.parent.body === n;
		if (returns(n.parent, n)) return true;
		if (!isChainLink(n.parent) && !inCombinator(n.parent)) break;
	}
	const promise = enclosingPromise(call, root);
	return !!promise && isWaitedFor(promise, root);
}

type Guard = 'swallowed-assertion' | 'catch-only-assertion' | 'loop-only-assertion' | 'callback-only-assertion';

interface Scope {
	root: ts.Node;
	helpers: Set<string>;
	eachParams: Set<string>;
}

const asserts = (n: ts.Node | undefined, scope: Scope) => !!n && assertionNodes(n, scope.helpers).length > 0;

/** A catch that keeps the error, e.g. to assert on a list of failures later, does not swallow it. */
function usesError(c: ts.CatchClause): boolean {
	const name = c.variableDeclaration?.name;
	return !!name && ts.isIdentifier(name) && new RegExp(`\\b${name.text}\\b`).test(c.block.getText());
}

function tryGuard(n: ts.Node, p: ts.Node, scope: Scope): Guard | undefined {
	if (ts.isCatchClause(p)) return 'catch-only-assertion';
	if (ts.isTryStatement(p) && n === p.tryBlock && p.catchClause && !asserts(p.catchClause.block, scope) && !usesError(p.catchClause)) return 'swallowed-assertion';
	return undefined;
}

function loopGuard(n: ts.Node, p: ts.Node, scope: Scope): Guard | undefined {
	if ((ts.isForOfStatement(p) || ts.isForInStatement(p)) && n === p.statement && !isFixedData(p.expression, scope.eachParams)) return 'loop-only-assertion';
	if ((ts.isWhileStatement(p) || (ts.isForStatement(p) && !isLiteralRange(p))) && n === p.statement) return 'loop-only-assertion';
	return undefined;
}

function callbackGuard(n: ts.Node, p: ts.Node, scope: Scope): Guard | undefined {
	if (!isFn(n) || !ts.isCallExpression(p) || !p.arguments.includes(n as ts.Expression)) return undefined;
	const name = calleeName(p) ?? '';
	const receiver = ts.isPropertyAccessExpression(p.expression) ? p.expression.expression : undefined;
	if (ITERATORS.has(name) && receiver && !isFixedData(receiver, scope.eachParams)) return 'loop-only-assertion';
	if (SCHEDULERS.has(name) && !isWaitedFor(p, scope.root)) return 'callback-only-assertion';
	return undefined;
}

/** The innermost construct that may keep an assertion from running, or undefined when it always runs. */
function guardOf(node: ts.Node, scope: Scope): Guard | undefined {
	for (let n = node; n !== scope.root && n.parent; n = n.parent) {
		const guard = tryGuard(n, n.parent, scope) ?? loopGuard(n, n.parent, scope) ?? callbackGuard(n, n.parent, scope);
		if (guard) return guard;
	}
	return undefined;
}

const TYPE_CHECKS = new Set(['expectTypeOf', 'assertType']);

/** Throws and explicit fails are the assertion of their branch, and tsc checks type assertions wherever they are: never guarded. */
const isUnguarded = (n: ts.Node) =>
	ts.isThrowStatement(n) || (ts.isCallExpression(n) && (FAILS.has(calleeName(n) ?? '') || TYPE_CHECKS.has(calleeName(n) ?? '')));

const GUARD_MESSAGES: Record<Guard, string> = {
	'swallowed-assertion': 'the assertion is in a try block whose catch drops its error, so it can never fail the test: rethrow or remove the try',
	'catch-only-assertion': 'every assertion is in a catch block: when the code stops throwing, the test still passes; add expect.assertions(n) or use .toThrow/.rejects',
	'loop-only-assertion': 'every assertion is in a loop over data that may be empty: assert the length first',
	'callback-only-assertion': 'every assertion is in a callback the test does not wait for: await the promise or event'
};

function guardFinding(t: TestCase, helpers: Set<string>): { guard: Guard; node: ts.Node } | undefined {
	const nodes = assertionNodes(t.body, helpers);
	if (nodes.length === 0 || typeAssertions(t.body) > 0 || nodes.some(isUnguarded)) return undefined;
	const eachParams = new Set(t.each ? t.fn.parameters.flatMap((p) => (ts.isIdentifier(p.name) ? [p.name.text] : [])) : []);
	const guards = nodes.map((n) => guardOf(n, { root: t.body, helpers, eachParams }));
	const swallowed = guards.indexOf('swallowed-assertion');
	if (swallowed >= 0) return { guard: 'swallowed-assertion', node: nodes[swallowed] };
	if (guards.some((g) => g === undefined)) return undefined;
	const counted = t.body.getText().includes('expect.assertions(') || t.body.getText().includes('expect.hasAssertions(');
	const first = t.fn.parameters[0];
	const usesDone = !!first && ts.isIdentifier(first.name);
	const i = guards.findIndex((g) => !(counted && g === 'catch-only-assertion') && !(usesDone && g === 'callback-only-assertion'));
	return i < 0 ? undefined : { guard: guards[i]!, node: nodes[i] };
}

interface ExpectChain {
	expect: ts.CallExpression;
	/** Property names between `expect(...)` and the matcher, e.g. `not`, `resolves`. */
	mods: string[];
	matcher?: ts.CallExpression;
	/** The outermost node of the chain: the matcher call, else the last property access. */
	outer: ts.Expression;
}

const isExpectCall = (n: ts.Node): n is ts.CallExpression =>
	ts.isCallExpression(n) &&
	((ts.isIdentifier(n.expression) && n.expression.text === 'expect') ||
		(ts.isPropertyAccessExpression(n.expression) && ts.isIdentifier(n.expression.expression) && n.expression.expression.text === 'expect' && ['soft', 'poll', 'element'].includes(n.expression.name.text)));

function chainOf(call: ts.CallExpression): ExpectChain {
	const names: string[] = [];
	let node: ts.Expression = call;
	while (ts.isPropertyAccessExpression(node.parent) && node.parent.expression === node) {
		node = node.parent;
		names.push((node as ts.PropertyAccessExpression).name.text);
	}
	if (ts.isCallExpression(node.parent) && node.parent.expression === node && names.length > 0)
		return { expect: call, mods: names.slice(0, -1), matcher: node.parent, outer: node.parent };
	return { expect: call, mods: names, outer: node };
}

function expectChains(node: ts.Node): ExpectChain[] {
	const chains: ExpectChain[] = [];
	const visit = (x: ts.Node): void => {
		if (isExpectCall(x)) chains.push(chainOf(x));
		ts.forEachChild(x, visit);
	};
	visit(node);
	return chains;
}

const ASYNC_MODS = new Set(['resolves', 'rejects']);

function skipParens(n: ts.Node): ts.Node {
	while (ts.isParenthesizedExpression(n.parent)) n = n.parent;
	return n.parent;
}

/** A promise-valued assertion that the test drops: it settles after the test has passed. */
function isUnawaited(c: ExpectChain): boolean {
	const kind = ts.isPropertyAccessExpression(c.expect.expression) ? c.expect.expression.name.text : '';
	const asyncChain = c.mods.some((m) => ASYNC_MODS.has(m)) || kind === 'poll' || kind === 'element';
	if (!asyncChain || !c.matcher) return false;
	const parent = skipParens(c.outer);
	return ts.isExpressionStatement(parent) || ts.isVoidExpression(parent);
}

const NOT_LITERAL = Symbol('not a literal');

/** The value of a literal, or NOT_LITERAL. */
function literalValue(n: ts.Node): unknown {
	if (ts.isStringLiteralLike(n)) return n.text;
	if (ts.isNumericLiteral(n)) return Number(n.text);
	if (ts.isPrefixUnaryExpression(n) && n.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(n.operand)) return -Number(n.operand.text);
	if (n.kind === ts.SyntaxKind.TrueKeyword) return true;
	if (n.kind === ts.SyntaxKind.FalseKeyword) return false;
	if (n.kind === ts.SyntaxKind.NullKeyword) return null;
	if (ts.isIdentifier(n) && n.text === 'undefined') return undefined;
	return NOT_LITERAL;
}

/** Built-in matchers on literals, so the outcome is known without running: a custom matcher may check other state. */
const LITERAL_MATCHERS: Record<string, (actual: unknown, expected: unknown) => boolean> = {
	toBe: Object.is,
	toEqual: Object.is,
	toStrictEqual: Object.is,
	toBeTruthy: (a) => !!a,
	toBeFalsy: (a) => !a,
	toBeDefined: (a) => a !== undefined,
	toBeUndefined: (a) => a === undefined,
	toBeNull: (a) => a === null
};

/** `expect(<literal>).<matcher>(<literal>)` that always holds; one that always fails marks unreachable code. */
function holdsOnLiterals(c: Matched): boolean {
	const matcher = LITERAL_MATCHERS[calleeName(c.matcher) ?? ''];
	const values = [c.expect.arguments[0], ...c.matcher.arguments].map(literalValue);
	return !!matcher && !values.includes(NOT_LITERAL) && matcher(values[0], values[1]) !== c.mods.includes('not');
}

type Matched = ExpectChain & { matcher: ts.CallExpression };

function hasCall(n: ts.Node): boolean {
	return ts.isCallExpression(n) || ts.isNewExpression(n) || !!ts.forEachChild(n, (c) => hasCall(c) || undefined);
}

/** The value compared with itself; toBe of a non-variable checks identity, e.g. a getter returning the same object. */
function comparesWithItself(c: Matched, actual: ts.Expression): boolean {
	const [expected, ...more] = c.matcher.arguments;
	if (!expected || more.length > 0 || c.mods.includes('not') || expected.getText() !== actual.getText()) return false;
	// two calls are two results: equal ones show the code is deterministic
	return ts.isIdentifier(actual) || (calleeName(c.matcher) !== 'toBe' && !hasCall(actual));
}

/** `not.toThrow` on an async function: it returns a promise and never throws synchronously. */
function asyncNeverThrows(c: Matched, actual: ts.Expression): boolean {
	const isAsync = (ts.isArrowFunction(actual) || ts.isFunctionExpression(actual)) && !!actual.modifiers?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword);
	return isAsync && c.mods.includes('not') && /^toThrow(Error)?$/.test(calleeName(c.matcher) ?? '');
}

/** An assertion that holds whatever the code under test does. */
function isTautology(c: ExpectChain): boolean {
	const actual = c.expect.arguments[0];
	if (!actual || !c.matcher) return false;
	const m = { ...c, matcher: c.matcher };
	return holdsOnLiterals(m) || comparesWithItself(m, actual) || asyncNeverThrows(m, actual);
}

const parse = (file: string, text: string) => ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);

function runsCode(node: ts.Node): boolean {
	let found = false;
	const visit = (x: ts.Node): void => {
		if (ts.isCallExpression(x) || ts.isNewExpression(x) || ts.isAwaitExpression(x) || ts.isTaggedTemplateExpression(x)) found = true;
		else if (!found) ts.forEachChild(x, visit);
	};
	visit(node);
	return found;
}

function testFindings(t: TestCase, sf: ts.SourceFile, helpers: Set<string>): Finding[] {
	const findings: Finding[] = [];
	const add = (rule: string, message: string, node?: ts.Node) => {
		const line = node ? sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1 : t.line;
		const code = (node ? node.getText(sf) : '').replace(/\s+/g, ' ').slice(0, 80);
		findings.push({ file: sf.fileName, line, test: t.title, testLine: t.line, rule, message, code });
	};
	const asserts = countAssertions(t.body, helpers) > 0;
	if (!asserts && !runsCode(t.body)) add('empty-test', 'the test neither runs code nor asserts: it always passes');
	const chains = expectChains(t.body);
	// Chai ends in a property: expect(x).to.be.true
	const dangling = chains.find((c) => !c.matcher && !c.mods.includes('to'));
	if (dangling) add('dangling-expect', 'expect(...) without a called matcher checks nothing: add the matcher call, e.g. .toBe(...)', dangling.outer);
	const unawaited = chains.find(isUnawaited);
	if (unawaited) add('unawaited-assertion', 'a resolves/rejects/poll assertion that is not awaited or returned settles after the test passed: await it', unawaited.outer);
	const guard = guardFinding(t, helpers);
	if (guard) add(guard.guard, GUARD_MESSAGES[guard.guard], guard.node);
	const tautology = chains.find(isTautology);
	if (tautology) add('tautology', 'the assertion holds whatever the code does (a literal, the value compared with itself, or not.toThrow on an async function)', tautology.outer);
	return findings;
}

/** Where each test's title and body are in the text, for eval/seed.ts to plant defects into real tests. */
export const testSpans = (file: string, text: string) =>
	collectTests(parse(file, text)).map((t) => ({
		title: t.title,
		path: t.path,
		each: t.each,
		titleSpan: [t.call.arguments[0].getStart(), t.call.arguments[0].end] as const,
		bodySpan: [t.body.getStart(), t.body.end] as const,
		block: ts.isBlock(t.body),
		/** The test takes a parameter, e.g. `done`. */
		param: t.fn.parameters.length > 0
	}));

/** Where the function a test is declared in starts: tests of one function share their setup. */
function enclosingFunction(n: ts.Node): number {
	for (let p = n.parent; p; p = p.parent) if (isFn(p)) return p.pos;
	return 0;
}

/** A test declared in a loop runs once per item, so its title and body stand for several tests. */
function inLoop(n: ts.Node): boolean {
	for (let p = n.parent; p && !isFn(p); p = p.parent) if (ts.isIterationStatement(p, false)) return true;
	return false;
}

const printer = ts.createPrinter({ removeComments: true });

export function analyzeSource(file: string, text: string): Finding[] {
	const sf = parse(file, text);
	const helpers = assertingHelpers(sf);
	const tests = collectTests(sf);
	// the printer gives one layout for the same code, comments left out, strings untouched
	const titled = tests
		.filter((t) => !t.each && !inLoop(t.call))
		.map((t) => ({ ...t, path: `${t.path}@${enclosingFunction(t.call)}`, code: printer.printNode(ts.EmitHint.Unspecified, t.body, sf) }));
	const byTitle = titleFindings(titled).map(({ test, rule, message }) => ({ file, line: test.line, test: test.title, testLine: test.line, rule, message, code: '' }));
	return [...tests.flatMap((t) => testFindings(t, sf, helpers)), ...byTitle].sort((a, b) => a.line - b.line);
}
