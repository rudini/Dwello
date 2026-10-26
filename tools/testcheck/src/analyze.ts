import ts from 'typescript';

export interface Finding {
	file: string;
	line: number;
	/** Full title, describe titles joined with " > ". */
	test: string;
	rule: string;
	message: string;
	/** The offending code, first line, at most 80 characters. */
	code: string;
}

interface TestCase {
	title: string;
	line: number;
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
					tests.push({ title: [...path, title].join(' > '), line, fn, body: fn.body, each });
					return;
				}
			}
		}
		ts.forEachChild(node, (n) => visit(n, path));
	};
	visit(sf, []);
	return tests;
}

const ASSERT_CALL = /^(expect|assert|should|verify|check)/i;
const ASSERT_METHOD = /^(expect|assert|should)/i;
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

/** Assertions tsc checks: type-level `Expect<Equal<…>>` and an expected type error. */
function typeAssertions(node: ts.Node): number {
	let n = 0;
	const visit = (x: ts.Node): void => {
		if (ts.isTypeReferenceNode(x) && ts.isIdentifier(x.typeName) && TYPE_ASSERT.test(x.typeName.text)) n++;
		ts.forEachChild(x, visit);
	};
	visit(node);
	return n + (node.getFullText().match(/@ts-expect-error/g)?.length ?? 0);
}

const countAssertions = (node: ts.Node, helpers: Set<string>): number => assertionNodes(node, helpers).length + typeAssertions(node);

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
	if (ts.isCallExpression(n)) return isFixedCall(n, eachParams);
	return ts.isIdentifier(n) && isFixedName(n, eachParams);
}

function isFixedCall(n: ts.CallExpression, eachParams: Set<string>): boolean {
	const name = calleeName(n) ?? '';
	const receiver = ts.isPropertyAccessExpression(n.expression) ? n.expression.expression : undefined;
	if (name === 'split') return true;
	if (!receiver) return false;
	if (ts.isIdentifier(receiver) && (receiver.text === 'Object' || receiver.text === 'Array')) return !!n.arguments[0] && isFixedData(n.arguments[0], eachParams);
	return PASS_THROUGH_METHODS.has(name) && isFixedData(receiver, eachParams);
}

// ponytail: a name resolves to the first declaration in the file, not by scope; scope analysis if shadowing misleads it
function isFixedName(n: ts.Identifier, eachParams: Set<string>): boolean {
	if (eachParams.has(n.text)) return true;
	const decl = declarationOf(n);
	if (!decl) return false;
	if (!ts.isVariableDeclaration(decl) || ts.isSourceFile(decl.parent.parent.parent)) return true;
	return !!decl.initializer && isFixedData(decl.initializer, eachParams);
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

const isChainLink = (p: ts.Node) => ts.isPropertyAccessExpression(p) || ts.isCallExpression(p) || ts.isParenthesizedExpression(p);
const returns = (p: ts.Node, n: ts.Node) => ts.isAwaitExpression(p) || ts.isReturnStatement(p) || (ts.isArrowFunction(p) && p.body === n);

/** Whether a call's promise is awaited, returned or the body of a concise arrow before reaching the test body. */
function isWaitedFor(call: ts.Node, root: ts.Node): boolean {
	for (let n = call; ; n = n.parent) {
		if (n === root) return ts.isArrowFunction(n.parent) && n.parent.body === n;
		if (returns(n.parent, n)) return true;
		if (!isChainLink(n.parent)) return false;
	}
}

type Guard = 'swallowed-assertion' | 'catch-only-assertion' | 'conditional-assertion' | 'loop-only-assertion' | 'callback-only-assertion';

interface Scope {
	root: ts.Node;
	helpers: Set<string>;
	eachParams: Set<string>;
}

const asserts = (n: ts.Node | undefined, scope: Scope) => !!n && assertionNodes(n, scope.helpers).length > 0;
const SHORT_CIRCUIT = [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken];

function tryGuard(n: ts.Node, p: ts.Node, scope: Scope): Guard | undefined {
	if (ts.isCatchClause(p)) return 'catch-only-assertion';
	if (ts.isTryStatement(p) && n === p.tryBlock && p.catchClause && !asserts(p.catchClause.block, scope)) return 'swallowed-assertion';
	return undefined;
}

/** A branch counts as guarded unless every other branch asserts too. */
function branchGuard(n: ts.Node, p: ts.Node, scope: Scope): Guard | undefined {
	if (ts.isIfStatement(p) && n !== p.expression && !asserts(n === p.thenStatement ? p.elseStatement : p.thenStatement, scope)) return 'conditional-assertion';
	if (ts.isConditionalExpression(p) && n !== p.condition) return 'conditional-assertion';
	if (ts.isBinaryExpression(p) && n === p.right && SHORT_CIRCUIT.includes(p.operatorToken.kind)) return 'conditional-assertion';
	if ((ts.isCaseClause(p) || ts.isDefaultClause(p)) && p.parent.clauses.some((c) => c.statements.length > 0 && !asserts(c, scope))) return 'conditional-assertion';
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
		const guard = tryGuard(n, n.parent, scope) ?? branchGuard(n, n.parent, scope) ?? loopGuard(n, n.parent, scope) ?? callbackGuard(n, n.parent, scope);
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
	'conditional-assertion': 'every assertion runs only under a condition: when it is false, the test passes without checking; assert the condition itself',
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

const isLiteral = (n: ts.Node): boolean =>
	ts.isStringLiteralLike(n) ||
	ts.isNumericLiteral(n) ||
	n.kind === ts.SyntaxKind.TrueKeyword ||
	n.kind === ts.SyntaxKind.FalseKeyword ||
	n.kind === ts.SyntaxKind.NullKeyword ||
	(ts.isIdentifier(n) && n.text === 'undefined') ||
	(ts.isPrefixUnaryExpression(n) && ts.isNumericLiteral(n.operand));

/** An assertion that holds whatever the code under test does. */
function isTautology(c: ExpectChain): boolean {
	const actual = c.expect.arguments[0];
	if (!actual || !c.matcher) return false;
	const expected = c.matcher.arguments;
	const name = calleeName(c.matcher);
	if (isLiteral(actual) && expected.every(isLiteral)) return true;
	// toBe(x) of an expression with itself checks identity, e.g. that a getter returns the same object each time
	const same = expected.length === 1 && expected[0].getText() === actual.getText() && (ts.isIdentifier(actual) || name !== 'toBe');
	if (!c.mods.includes('not') && same) return true;
	const asyncFn = (ts.isArrowFunction(actual) || ts.isFunctionExpression(actual)) && actual.modifiers?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword);
	return !!asyncFn && c.mods.includes('not') && (name === 'toThrow' || name === 'toThrowError');
}

/** Titles that claim only that nothing throws or that the types check, which a test without assertion shows. */
const NO_THROW_TITLE = /\b(not?|n't|never|without)\b.*\b(throw|crash|error|fail)|\btyp(e|es|ed|ing)\b|\binfer|wirft nicht|ohne Fehler|kein(en)? Fehler/i;

export function analyzeSource(file: string, text: string): Finding[] {
	const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
	const helpers = assertingHelpers(sf);
	const findings: Finding[] = [];
	for (const t of collectTests(sf)) {
		const add = (rule: string, message: string, node?: ts.Node) => {
			const line = node ? sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1 : t.line;
			const code = (node ? node.getText(sf) : '').replace(/\s+/g, ' ').slice(0, 80);
			findings.push({ file, line, test: t.title, rule, message, code });
		};
		if (countAssertions(t.body, helpers) === 0 && !NO_THROW_TITLE.test(t.title)) add('no-assertion', 'the test asserts nothing, so it passes whatever the code does');
		const chains = expectChains(t.body);
		const dangling = chains.find((c) => !c.matcher);
		if (dangling) add('dangling-expect', 'expect(...) without a called matcher checks nothing: add the matcher call, e.g. .toBe(...)', dangling.outer);
		const unawaited = chains.find(isUnawaited);
		if (unawaited) add('unawaited-assertion', 'a resolves/rejects/poll assertion that is not awaited or returned settles after the test passed: await it', unawaited.outer);
		const guard = guardFinding(t, helpers);
		if (guard) add(guard.guard, GUARD_MESSAGES[guard.guard], guard.node);
		const tautology = chains.find(isTautology);
		if (tautology) add('tautology', 'the assertion holds whatever the code does (a literal, the value compared with itself, or not.toThrow on an async function)', tautology.outer);
	}
	return findings;
}
