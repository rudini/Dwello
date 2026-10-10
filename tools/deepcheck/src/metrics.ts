import {
	Node,
	SyntaxKind,
	type ClassDeclaration,
	type SourceFile,
	type Statement
} from 'ts-morph';
import type { ClassReport, LeakyExport, Location } from './types.ts';

/** Metrics computed from one file alone (no import graph, no Fallow). */
export interface FileMetrics {
	interfaceSize: number;
	exportCount: number;
	implementationSize: number;
	operations: number;
	passThroughs: Location[];
	/** Named functions and methods, the candidates for pass-through detection. */
	functionCount: number;
	leakyExports: LeakyExport[];
	dataOnlyClasses: string[];
	classes: ClassReport[];
	complexity: number;
}

const STATEMENT_KINDS = new Set([
	SyntaxKind.VariableStatement,
	SyntaxKind.ExpressionStatement,
	SyntaxKind.IfStatement,
	SyntaxKind.DoStatement,
	SyntaxKind.WhileStatement,
	SyntaxKind.ForStatement,
	SyntaxKind.ForInStatement,
	SyntaxKind.ForOfStatement,
	SyntaxKind.ContinueStatement,
	SyntaxKind.BreakStatement,
	SyntaxKind.ReturnStatement,
	SyntaxKind.SwitchStatement,
	SyntaxKind.LabeledStatement,
	SyntaxKind.ThrowStatement,
	SyntaxKind.TryStatement,
	SyntaxKind.FunctionDeclaration,
	SyntaxKind.ClassDeclaration,
	SyntaxKind.EnumDeclaration,
	SyntaxKind.ExportAssignment,
	SyntaxKind.MethodDeclaration,
	SyntaxKind.PropertyDeclaration,
	SyntaxKind.Constructor,
	SyntaxKind.GetAccessor,
	SyntaxKind.SetAccessor
]);

const DECISION_KINDS = new Set([
	SyntaxKind.IfStatement,
	SyntaxKind.ConditionalExpression,
	SyntaxKind.CaseClause,
	SyntaxKind.ForStatement,
	SyntaxKind.ForInStatement,
	SyntaxKind.ForOfStatement,
	SyntaxKind.WhileStatement,
	SyntaxKind.DoStatement,
	SyntaxKind.CatchClause
]);

const LOGICAL_OPERATORS = new Set([
	SyntaxKind.AmpersandAmpersandToken,
	SyntaxKind.BarBarToken,
	SyntaxKind.QuestionQuestionToken,
	SyntaxKind.AmpersandAmpersandEqualsToken,
	SyntaxKind.BarBarEqualsToken,
	SyntaxKind.QuestionQuestionEqualsToken
]);

/** Function declarations, methods, accessors, constructors, arrows and function expressions. */
const isFunction = (node: Node | undefined) => Node.isFunctionLikeDeclaration(node) || Node.isFunctionExpression(node);

const hasExportKeyword = (node: Node) =>
	Node.isModifierable(node) && node.hasModifier(SyntaxKind.ExportKeyword);

const isAmbient = (node: Node) =>
	node.getAncestors().some((a) => Node.isModifierable(a) && a.hasModifier(SyntaxKind.DeclareKeyword));

/** The expression a declaration holds, without parentheses and type assertions. */
function valueOf(node: Node | undefined): Node | undefined {
	if (Node.isVariableDeclaration(node) || Node.isPropertyDeclaration(node) || Node.isPropertyAssignment(node))
		return valueOf(node.getInitializer());
	if (Node.isParenthesizedExpression(node) || Node.isAsExpression(node) || Node.isSatisfiesExpression(node))
		return valueOf(node.getExpression());
	return node;
}

/**
 * Interface units behind an exported value besides its name: the parameters of a function, or for an
 * object literal 1 + parameters per function member (data keys of lookup tables are not counted).
 */
function paramCount(node: Node | undefined): number {
	node = valueOf(node);
	if (Node.isObjectLiteralExpression(node))
		return node.getProperties().reduce((sum, p) => sum + (isFunctionMember(p) ? 1 + paramCount(p) : 0), 0);
	return isFunction(node) ? node.getParameters().length : 0;
}

function isFunctionMember(p: Node): boolean {
	if (Node.isMethodDeclaration(p)) return true;
	const init = Node.isPropertyAssignment(p) ? p.getInitializer() : undefined;
	return Node.isArrowFunction(init) || Node.isFunctionExpression(init);
}

const isPublicMember = (member: Node) =>
	!(Node.isModifierable(member) &&
		(member.hasModifier(SyntaxKind.PrivateKeyword) || member.hasModifier(SyntaxKind.ProtectedKeyword))) &&
	!(Node.isPropertyNamed(member) && Node.isPrivateIdentifier(member.getNameNode()));

const isOverload = (node: Node) =>
	(Node.isMethodDeclaration(node) || Node.isConstructorDeclaration(node) || Node.isFunctionDeclaration(node)) &&
	node.isOverload();

/** Public members of a class plus their parameters (constructor: parameters only). */
function classInterfaceSize(cls: ClassDeclaration): number {
	let size = 0;
	for (const member of cls.getMembers()) {
		if (isOverload(member) || !isPublicMember(member)) continue;
		if (Node.isConstructorDeclaration(member)) size += member.getParameters().length;
		else size += 1 + paramCount(member);
	}
	return size;
}

function localDeclarationSize(sf: SourceFile, name: string): number {
	const cls = sf.getClass(name);
	if (cls) return 1 + classInterfaceSize(cls);
	return 1 + paramCount(sf.getFunction(name) ?? sf.getVariableDeclaration(name));
}

function exportedStatementSize(sf: SourceFile, stmt: Statement): number {
	if (Node.isExportDeclaration(stmt)) {
		// Re-exports are the interface of the module they come from and are measured there (Phase 4).
		if (stmt.hasModuleSpecifier()) return 0;
		return stmt
			.getNamedExports()
			.reduce((sum, spec) => sum + localDeclarationSize(sf, spec.getNameNode().getText()), 0);
	}
	if (Node.isExportAssignment(stmt)) return 1 + paramCount(stmt.getExpression());
	if (!hasExportKeyword(stmt) || isOverload(stmt)) return 0;
	if (Node.isVariableStatement(stmt))
		return stmt.getDeclarations().reduce((sum, d) => sum + 1 + paramCount(d), 0);
	if (Node.isClassDeclaration(stmt)) return 1 + classInterfaceSize(stmt);
	return 1 + paramCount(stmt);
}

function exportedNames(sf: SourceFile): Set<string> {
	const names = new Set<string>();
	for (const stmt of sf.getStatements()) {
		if (Node.isExportDeclaration(stmt) && !stmt.hasModuleSpecifier())
			stmt.getNamedExports().forEach((spec) => names.add(spec.getNameNode().getText()));
		else if (hasExportKeyword(stmt) && Node.isVariableStatement(stmt))
			stmt.getDeclarations().forEach((d) => names.add(d.getName()));
		else if (hasExportKeyword(stmt) && Node.hasName(stmt)) names.add(stmt.getName());
	}
	return names;
}

/** The identifiers a top-level statement declares, including names bound by destructuring. */
function declaredNameNodes(s: Statement): Node[] {
	if (Node.isVariableStatement(s))
		return s.getDeclarations().flatMap((d) => {
			const name = d.getNameNode();
			return Node.isIdentifier(name) ? [name] : name.getDescendantsOfKind(SyntaxKind.BindingElement).map((b) => b.getNameNode());
		});
	const name = (Node.isFunctionDeclaration(s) || Node.isClassDeclaration(s)) && s.getNameNode();
	return name ? [name] : [];
}

const topLevel = (node: Node): Node => (node.getParent() === node.getSourceFile() || !node.getParent() ? node : topLevel(node.getParent()!));

/**
 * Non-exported top-level declarations nothing else in the file refers to, also through other dead ones (Phase 4:
 * padding a shallow module with unused internals must not make it look deeper). Uses are resolved by symbol, so a
 * parameter, local or property with the same name does not keep a dead declaration alive.
 */
function deadDeclarations(sf: SourceFile): Set<Node> {
	const candidates = sf.getStatements().filter((s) => !hasExportKeyword(s) && declaredNameNodes(s).length > 0);
	const declared = new Map(candidates.map((s) => [s, new Set(declaredNameNodes(s).map((n) => n.getSymbol()).filter(Boolean))]));
	const names = new Set(candidates.flatMap((s) => declaredNameNodes(s).map((n) => n.getText())));
	const uses = sf
		.getDescendantsOfKind(SyntaxKind.Identifier)
		.filter((id) => names.has(id.getText()))
		.map((id) => ({ id, owner: topLevel(id) }));
	const dead = new Set<Node>();
	// Symbols are resolved only for uses in other live statements, and only until the first real use is found.
	const usedBy = (s: Node, symbols: Set<unknown>) =>
		uses.some((u) => u.owner !== s && !dead.has(u.owner) && symbols.has(u.id.getSymbol()));
	for (let changed = true; changed; ) {
		changed = false;
		for (const s of candidates.filter((c) => !dead.has(c))) {
			if (usedBy(s, declared.get(s)!)) continue;
			dead.add(s);
			changed = true;
		}
	}
	return dead;
}

const deadCache = new WeakMap<SourceFile, Set<Node>>();

/** Visits every descendant outside dead declarations. */
function forEachLive(sf: SourceFile, visit: (node: Node) => void): void {
	if (!deadCache.has(sf)) deadCache.set(sf, deadDeclarations(sf));
	const dead = deadCache.get(sf)!;
	sf.forEachDescendant((node, traversal) => {
		if (dead.has(node)) traversal.skip();
		else visit(node);
	});
}

function implementationSize(sf: SourceFile): number {
	let size = 0;
	forEachLive(sf, (node) => {
		if (STATEMENT_KINDS.has(node.getKind()) && !isOverload(node) && !isAmbient(node)) size++;
		else if (Node.isArrowFunction(node) && !Node.isBlock(node.getBody())) size++;
	});
	return size;
}

/** Calls, constructions, binary and conditional expressions and template strings: work done inside statements. */
function operations(sf: SourceFile): number {
	let total = 0;
	forEachLive(sf, (node) => {
		if (OPERATION_KINDS.has(node.getKind()) && !isAmbient(node)) total++;
	});
	return total;
}

const OPERATION_KINDS = new Set([
	SyntaxKind.CallExpression,
	SyntaxKind.NewExpression,
	SyntaxKind.BinaryExpression,
	SyntaxKind.ConditionalExpression,
	SyntaxKind.TemplateExpression
]);

function complexity(sf: SourceFile): number {
	let total = 0;
	forEachLive(sf, (node) => {
		if (DECISION_KINDS.has(node.getKind()) || isFunction(node)) total++;
		else if (Node.isBinaryExpression(node) && LOGICAL_OPERATORS.has(node.getOperatorToken().getKind())) total++;
	});
	return total;
}

/** An object literal that is a module's value (variable or default export), not an argument or nested value. */
function isModuleLevelObject(node: Node | undefined): boolean {
	let parent = node?.getParent();
	while (Node.isAsExpression(parent) || Node.isSatisfiesExpression(parent) || Node.isParenthesizedExpression(parent))
		parent = parent.getParent();
	return Node.isVariableDeclaration(parent) || Node.isExportAssignment(parent);
}

/** The name a function-like node is declared or assigned under; undefined for anonymous callbacks. */
function functionName(node: Node): string | undefined {
	if (Node.isFunctionDeclaration(node) || Node.isMethodDeclaration(node)) return node.getName();
	const parent = node.getParent();
	if (Node.isVariableDeclaration(parent) || Node.isPropertyDeclaration(parent)) return parent.getName();
	if (Node.isPropertyAssignment(parent) && isModuleLevelObject(parent.getParent())) return parent.getName();
	return undefined;
}

function unwrap(node: Node | undefined): Node | undefined {
	while (Node.isAwaitExpression(node) || Node.isParenthesizedExpression(node)) node = node.getExpression();
	return node;
}

/** The single expression a function body evaluates, if the body is just `return x`, `x;` or `=> x`. */
function soleExpression(body: Node | undefined): Node | undefined {
	if (!Node.isBlock(body)) return unwrap(body);
	const statements = body.getStatements();
	if (statements.length !== 1) return undefined;
	const [only] = statements;
	if (Node.isReturnStatement(only) || Node.isExpressionStatement(only)) return unwrap(only.getExpression());
	return undefined;
}

function argumentMatchesParameter(arg: Node, param: string): boolean {
	const target = Node.isSpreadElement(arg) ? arg.getExpression() : arg;
	return Node.isIdentifier(target) && target.getText() === param;
}

/** The call a function body consists of, if that is all it does. */
function soleCall(node: Node) {
	const body = Node.isBodyable(node) || Node.isBodied(node) ? node.getBody() : undefined;
	const call = soleExpression(body);
	return Node.isCallExpression(call) ? call : undefined;
}

/** A function that only forwards all its parameters, in order, to another call. */
function isPassThrough(node: Node, name: string): boolean {
	const params = isFunction(node) ? node.getParameters() : [];
	const call = soleCall(node);
	if (!call || params.length === 0) return false;
	const args = call.getArguments();
	const callee = call.getExpression().getText();
	const forwardsAll =
		args.length === params.length && args.every((arg, i) => argumentMatchesParameter(arg, params[i].getNameNode().getText()));
	return forwardsAll && callee !== name && callee !== `this.${name}`;
}

function namedFunctions(sf: SourceFile): { node: Node; name: string }[] {
	const found: { node: Node; name: string }[] = [];
	forEachLive(sf, (node) => {
		const name = isFunction(node) && !isOverload(node) ? functionName(node) : undefined;
		if (name) found.push({ node, name });
	});
	return found;
}

/** Type nodes in the part of an exported declaration that callers see. */
function signatureTypeNodes(stmt: Statement): Node[] {
	if (Node.isClassDeclaration(stmt))
		return stmt
			.getMembers()
			.filter(isPublicMember)
			.flatMap((m) => [m, ...m.getChildrenOfKind(SyntaxKind.Parameter)])
			.flatMap((m) => (Node.isTyped(m) || Node.isReturnTyped(m) ? [m] : []))
			.flatMap(typeNodesOf);
	if (Node.isVariableStatement(stmt)) return stmt.getDeclarations().flatMap(typeNodesOf);
	if (Node.isInterfaceDeclaration(stmt) || Node.isTypeAliasDeclaration(stmt)) return [stmt];
	return typeNodesOf(stmt);
}

function typeNodesOf(node: Node): Node[] {
	const nodes: Node[] = [];
	if (Node.isTyped(node) && node.getTypeNode()) nodes.push(node.getTypeNode()!);
	if (Node.isReturnTyped(node) && node.getReturnTypeNode()) nodes.push(node.getReturnTypeNode()!);
	if (Node.isParametered(node)) node.getParameters().forEach((p) => nodes.push(...typeNodesOf(p)));
	if (Node.isVariableDeclaration(node)) {
		const init = node.getInitializer();
		if (init && isFunction(init)) nodes.push(...typeNodesOf(init));
	}
	return nodes;
}

function exportedStatementName(stmt: Statement): string | undefined {
	if (!hasExportKeyword(stmt)) return undefined;
	if (Node.isVariableStatement(stmt)) return stmt.getDeclarations()[0].getName();
	if (Node.hasName(stmt)) return stmt.getName();
	return Node.isModifierable(stmt) && stmt.hasModifier(SyntaxKind.DefaultKeyword) ? 'default' : undefined;
}

/** The top-level statement declaring a local name (for `export { name }`). */
function localStatement(sf: SourceFile, name: string): Statement | undefined {
	return sf.getStatements().find((s) =>
		Node.isVariableStatement(s) ? s.getDeclarations().some((d) => d.getName() === name) : Node.hasName(s) && s.getName() === name
	);
}

/** Every exported declaration with the name callers see and the line of its export. */
function exportedDeclarations(sf: SourceFile): { name: string; line: number; stmt: Statement }[] {
	return sf.getStatements().flatMap((stmt) => {
		const name = exportedStatementName(stmt);
		if (name) return [{ name, line: stmt.getStartLineNumber(), stmt }];
		if (!Node.isExportDeclaration(stmt) || stmt.hasModuleSpecifier()) return [];
		return stmt.getNamedExports().flatMap((spec) => {
			const local = localStatement(sf, spec.getNameNode().getText());
			return local ? [{ name: spec.getAliasNode()?.getText() ?? spec.getName(), line: stmt.getStartLineNumber(), stmt: local }] : [];
		});
	});
}

/** Internal type names referenced by one exported declaration's signature, deduplicated. */
function internalTypesOf(sf: SourceFile, stmt: Statement, exported: Set<string>): string[] {
	const refs = signatureTypeNodes(stmt)
		.flatMap((t) => [t, ...t.getDescendants()])
		.filter((ref) => Node.isTypeReference(ref));
	return [...new Set(refs.map((ref) => internalTypeName(sf, ref.getTypeName(), exported)))].filter(
		(t): t is string => t !== undefined
	);
}

/** Exported signatures that reference a type declared in this module but not exported (resolved by symbol). */
function leakyExports(sf: SourceFile): LeakyExport[] {
	const exported = exportedNames(sf);
	return exportedDeclarations(sf).flatMap(({ name, line, stmt }) =>
		internalTypesOf(sf, stmt, exported).map((type) => ({ name, line, type }))
	);
}

/** Interfaces, classes, enums and object-literal type aliases; an alias of another type is nameable by callers. */
const definesOwnShape = (d: Node) =>
	Node.isInterfaceDeclaration(d) ||
	Node.isClassDeclaration(d) ||
	Node.isEnumDeclaration(d) ||
	(Node.isTypeAliasDeclaration(d) && Node.isTypeLiteral(d.getTypeNode()));

function internalTypeName(sf: SourceFile, typeName: Node, exported: Set<string>): string | undefined {
	const left = Node.isQualifiedName(typeName) ? typeName.getLeft() : typeName;
	const declarations = left.getSymbol()?.getDeclarations() ?? [];
	const internal = declarations.some(
		(d) => d.getSourceFile() === sf && d.getParent() === sf && !hasExportKeyword(d) && definesOwnShape(d)
	);
	const text = left.getText();
	return internal && !exported.has(text) ? text : undefined;
}

function isSimpleAccessor(member: Node): boolean {
	if (!Node.isGetAccessorDeclaration(member) && !Node.isSetAccessorDeclaration(member)) return false;
	const body = member.getBody();
	return !Node.isBlock(body) || body.getStatements().length <= 1;
}

function isDataOnly(cls: ClassDeclaration): boolean {
	const members = cls.getMembers();
	return (
		!cls.getExtends() &&
		members.length > 0 &&
		members.every((m) => Node.isPropertyDeclaration(m) || isSimpleAccessor(m) || isAssignOnlyConstructor(m))
	);
}

function isAssignOnlyConstructor(member: Node): boolean {
	if (!Node.isConstructorDeclaration(member)) return false;
	return member.getStatements().every((s) => {
		const expr = Node.isExpressionStatement(s) ? s.getExpression() : undefined;
		return Node.isBinaryExpression(expr) && expr.getLeft().getText().startsWith('this.');
	});
}

function classReports(sf: SourceFile): ClassReport[] {
	return sf.getClasses().filter(hasExportKeyword).map((cls) => {
		const interfaceSize = 1 + classInterfaceSize(cls);
		let implementationSize = 0;
		cls.forEachDescendant((n) => {
			if (STATEMENT_KINDS.has(n.getKind()) && !isOverload(n)) implementationSize++;
		});
		return {
			name: cls.getName() ?? 'default',
			line: cls.getStartLineNumber(),
			interfaceSize,
			implementationSize,
			depthRatio: implementationSize / interfaceSize,
			dataOnly: isDataOnly(cls)
		};
	});
}

export function fileMetrics(sf: SourceFile): FileMetrics {
	const statements = sf.getStatements();
	const classes = classReports(sf);
	const functions = namedFunctions(sf);
	return {
		interfaceSize: statements.reduce((sum, s) => sum + exportedStatementSize(sf, s), 0),
		exportCount: exportedNames(sf).size,
		implementationSize: implementationSize(sf),
		operations: operations(sf),
		passThroughs: functions
			.filter((f) => isPassThrough(f.node, f.name))
			.map((f) => ({ name: f.name, line: f.node.getStartLineNumber() })),
		functionCount: functions.length,
		leakyExports: leakyExports(sf),
		dataOnlyClasses: classes.filter((c) => c.dataOnly).map((c) => c.name),
		classes,
		complexity: complexity(sf)
	};
}

const TYPE_ONLY_KINDS = new Set([
	SyntaxKind.InterfaceDeclaration,
	SyntaxKind.TypeAliasDeclaration,
	SyntaxKind.ImportDeclaration
]);

/** Runtime statements a mostly-types module may still have (a sentinel, a tiny helper). */
const TOKEN_RUNTIME = 5;

/** Declared type exports and all own exported names (incl. default). */
function exportShares(sf: SourceFile) {
	const statements = sf.getStatements();
	const types = statements.filter((s) => (Node.isInterfaceDeclaration(s) || Node.isTypeAliasDeclaration(s)) && hasExportKeyword(s)).length;
	const total = exportedNames(sf).size + (statements.some(Node.isExportAssignment) ? 1 : 0);
	return { types, total: Math.max(1, total) };
}

/**
 * 'type-only' for files declaring only types, or (Phase 4) at least 80 % of their exports as types with only a
 * token of runtime code; 'barrel' for files that only re-export.
 */
export function contentExclusion(sf: SourceFile): 'type-only' | 'barrel' | null {
	const statements = sf.getStatements();
	const isTypeOnly = (s: Statement) =>
		TYPE_ONLY_KINDS.has(s.getKind()) || (Node.isExportDeclaration(s) && s.isTypeOnly()) || isAmbient(s) ||
		(Node.isModifierable(s) && s.hasModifier(SyntaxKind.DeclareKeyword));
	const declaresTypes = statements.some((s) => !Node.isImportDeclaration(s));
	if (declaresTypes && statements.every(isTypeOnly)) return 'type-only';
	const isReExport = (s: Statement) => Node.isExportDeclaration(s) || Node.isImportDeclaration(s);
	if (statements.some(Node.isExportDeclaration) && statements.every(isReExport)) return 'barrel';
	if (implementationSize(sf) > TOKEN_RUNTIME) return null;
	const { types, total } = exportShares(sf);
	return types / total >= 0.8 ? 'type-only' : null;
}
