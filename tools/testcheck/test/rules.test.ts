import { describe, expect, it } from 'vitest';
import { analyzeSource } from '../src/analyze.ts';

const rules = (code: string) => analyzeSource('x.test.ts', code).map((f) => `${f.rule} ${f.test}`);

describe('findings', () => {
	it('point at the line and code of the offending assertion', () => {
		const [finding] = analyzeSource('x.test.ts', `it('a', () => {\n\tconst x = f();\n\texpect(x).toBeTruthy;\n});`);
		expect(finding).toMatchObject({ file: 'x.test.ts', line: 3, test: 'a', rule: 'dangling-expect', code: 'expect(x).toBeTruthy' });
	});
});

describe('empty-test', () => {
	it('flags a test that neither runs code nor asserts, also when its title claims only no throw', () => {
		const code = [`it('a', () => {});`, `it('does not throw', () => { const a = { b: 1 }; a.c = a; });`, `it('ok', () => { load(); });`].join('\n');
		expect(rules(code)).toEqual(['empty-test a', 'empty-test does not throw']);
	});

	it('accepts a test that only asserts types, which tsc checks', () => {
		const code = [
			`it('a', () => { type T = Expect<Equal<A, B>>; });`,
			`it('d', () => {\n\t// @ts-expect-error wrong type\n\tconst x: number = 'a';\n});`,
			`it('e', () => { const s: Category = c; });`,
			`it('g', () => { type T = z.infer<typeof s>; });`
		].join('\n');
		expect(rules(code)).toEqual([]);
	});
});

describe('assertions', () => {
	it('counts an assertion in a helper of the same file, also through another helper', () => {
		const code = `const inner = (x) => expect(x).toBe(1);\nfunction outer(x) { inner(x); }\nit('a', () => { for (const r of rows()) outer(r); });`;
		expect(rules(code)).toEqual(['loop-only-assertion a']);
	});

	it('counts Testing Library queries that throw when nothing matches', () => {
		expect(rules(`it('a', () => { render(C); for (const name of names()) screen.getByRole('button', { name }); });`)).toEqual(['loop-only-assertion a']);
	});

	it('leaves out skipped and todo tests', () => {
		expect(rules(`it.skip('a', () => {});\ntest.todo('b');\ndescribe.skip('s', () => { it('c', () => {}); });`)).toEqual([]);
	});
});

describe('dangling-expect', () => {
	it('flags an expect without a matcher call, also a matcher that is not called', () => {
		expect(rules(`it('a', () => { expect(f()); });\nit('b', () => { expect(f()).toBeTruthy; });`)).toEqual([
			'dangling-expect a',
			'dangling-expect b'
		]);
	});

	it('accepts a Chai assertion ending in a property', () => {
		expect(rules(`it('a', () => { expect(f()).to.be.true; expect(g()).to.exist; });`)).toEqual([]);
	});

	it('accepts a matcher behind not, resolves or soft', () => {
		expect(rules(`it('a', async () => { expect(f()).not.toBe(1); await expect(g()).resolves.toBe(2); expect.soft(h()).toBe(3); });`)).toEqual([]);
	});
});

describe('unawaited-assertion', () => {
	it('flags resolves, rejects and poll that are neither awaited nor returned', () => {
		const code = [
			`it('a', () => { expect(f()).rejects.toThrow('x'); });`,
			`it('b', () => { expect.poll(() => g()).toBe(1); });`,
			`it('ok', async () => { await expect(f()).rejects.toThrow('x'); });`,
			`it('ok2', () => expect(f()).resolves.toBe(1));`,
			`it('ok3', () => { return expect(f()).resolves.toBe(1); });`,
			`it('ok4', async () => { await Promise.all([expect(f()).resolves.toBe(1)]); });`
		].join('\n');
		expect(rules(code)).toEqual(['unawaited-assertion a', 'unawaited-assertion b']);
	});
});

describe('tautology', () => {
	it('flags an assertion whose actual is a literal or the expected value itself', () => {
		const code = [
			`it('a', () => { expect(true).toBe(true); });`,
			`it('b', () => { const x = f(); expect(x).toEqual(x); });`,
			`it('c', () => { expect('text').toBeTruthy(); });`,
			`it('ok', () => { expect(f()).toBe(true); expect(x).not.toBe(y); });`
		].join('\n');
		expect(rules(code)).toEqual(['tautology a', 'tautology b', 'tautology c']);
	});

	it('flags a literal only where a built-in matcher makes the assertion always hold', () => {
		const code = [
			`it('a', () => { expect(1).not.toBe(2); });`,
			`it('unreachable', () => { expect(true).toBe(false); });`,
			`it('warns', () => { render(); expect('Extraneous children').toHaveBeenWarned(); });`
		].join('\n');
		expect(rules(code)).toEqual(['tautology a']);
	});

	it('accepts two calls compared with each other, which checks that the result is the same each time', () => {
		expect(rules(`it('ok', () => { expect(colors(0.125)).toEqual(colors(0.125)); });`)).toEqual([]);
	});

	it('accepts toBe of an expression with itself, which checks that a getter returns the same object', () => {
		expect(rules(`it('ok', () => { expect(s['~standard']).toBe(s['~standard']); });\nit('a', () => { expect(o.a).toEqual(o.a); });`)).toEqual(['tautology a']);
	});

	it('flags not.toThrow on an async function, which never throws synchronously', () => {
		expect(rules(`it('a', () => { expect(async () => { await f(); }).not.toThrow(); });`)).toEqual(['tautology a']);
	});
});

describe('guarded assertions', () => {
	it('flags assertions that run only in a catch block, unless expect.assertions counts them', () => {
		const code = [
			`it('a', () => { try { f(); } catch (e) { expect(e.message).toBe('x'); } });`,
			`it('typed', () => { try { f(); } catch (e) { const error: Error = e; expect(error.message).toBe('x'); } });`,
			`it('ok', () => { expect.assertions(1); try { f(); } catch (e) { expect(e.message).toBe('x'); } });`,
			`it('ok2', () => { try { f(); expect.fail('no throw'); } catch (e) { expect(e.message).toBe('x'); } });`
		].join('\n');
		expect(rules(code)).toEqual(['catch-only-assertion a', 'catch-only-assertion typed']);
	});

	it('flags an assertion in a try block whose catch swallows the assertion error', () => {
		const code = [
			`it('a', () => { try { expect(f()).toBe(1); } catch { /* ignore */ } });`,
			`it('ok', () => { try { expect(f()).toBe(1); } catch (e) { cleanup(); throw e; } });`,
			`it('ok2', () => { try { expect(f()).toBe(1); } finally { cleanup(); } });`,
			`it('ok5', () => { let found = true; try { screen.getByText('x'); } catch { found = false; } expect(found).toBe(false); });`,
			`it('ok4', async () => { try { await checkout(); checkbox.click(); } catch { /* offline */ } expect(state()).toBe(1); });`,
			`it('ok3', () => { const failures = []; try { expect(f()).toBe(1); } catch (e) { failures.push(e); } expect(failures).toEqual([]); });`
		].join('\n');
		expect(rules(code)).toEqual(['swallowed-assertion a']);
	});

	it('flags assertions that run only in a loop over data that may be empty, not over a literal list', () => {
		const code = [
			`it('a', () => { for (const row of rows()) expect(row.ok).toBe(true); });`,
			`it('b', () => { f().forEach((x) => expect(x).toBeGreaterThan(0)); });`,
			`it('ok', () => { for (const x of [1, 2]) expect(f(x)).toBe(x); });`,
			`const cases = [['a', 1]];\nit('ok2', () => { cases.forEach(([k, v]) => expect(f(k)).toBe(v)); });`
		].join('\n');
		expect(rules(code)).toEqual(['loop-only-assertion a', 'loop-only-assertion b']);
	});

	it('accepts loops over fixed data: module constants, imports, each rows, literal ranges and split', () => {
		const code = [
			`import { NAMES } from './names';\nconst ROWS = load();`,
			`it('ok', () => { for (const n of NAMES.filter((x) => x)) expect(f(n)).toBe(1); });`,
			`it('ok2', () => { for (const [k] of Object.entries(ROWS)) expect(f(k)).toBe(1); });`,
			`it.each([[['a']]])('ok3', (titles) => { titles.forEach((t) => expect(f(t)).toBe(1)); });`,
			`it('ok4', () => { for (let i = 1; i <= 12; i++) expect(f(i)).toBe(1); });`,
			`it('ok5', () => { for (const part of s.split('&&')) expect(f(part)).toBe(1); });`,
			`function modes() { return build(); }\nit('ok6', () => { for (const [m, match] of modes()) expect(match(m)).toBe(1); });`,
			`it('ok7', async () => { const reads = await Promise.all([get(1), get(2)]); for (const r of reads) expect(r).toBe(1); });`,
			`it('a', () => { for (const dl of document.querySelectorAll('dl')) expect(dl.children.length).toBe(2); });`
		].join('\n');
		expect(rules(code)).toEqual(['loop-only-assertion a']);
	});

	it('flags assertions only in a callback the test does not wait for', () => {
		const code = [
			`it('a', () => { f().then((r) => { expect(r).toBe(1); }); });`,
			`it('b', () => { setTimeout(() => expect(g()).toBe(1), 10); });`,
			`it('ok', async () => { await f().then((r) => { expect(r).toBe(1); }); });`,
			`it('ok2', () => f().then((r) => expect(r).toBe(1)));`,
			`it('ok4', () => { app.on('GET', (c) => { expectTypeOf(c.var).toEqualTypeOf<V>(); }); });`,
			`it('ok5', async () => { await new Promise<void>((resolve) => { emitter.on('x', (v) => { expect(v).toBe(1); resolve(); }); }); });`,
			`it('ok6', () => { return new Promise((resolve) => { setTimeout(() => { expect(g()).toBe(1); resolve(); }, 1); }); });`,
			`it('ok7', async () => { await Promise.all([a().then((r) => expect(r).toBe(1))]); });`,
			`it('ok8', async () => { const p = new Promise<void>((resolve) => { em.on('d', (v) => { expect(v).toBe(1); resolve(); }); }); em.emit('d', 1); await p; });`,
			`it('c', async () => { const p = new Promise<void>((resolve) => { em.on('d', (v) => { expect(v).toBe(1); resolve(); }); }); em.emit('d', 1); });`,
			`it('ok3', (done) => { setTimeout(() => { expect(g()).toBe(1); done(); }); });`
		].join('\n');
		expect(rules(code)).toEqual(['callback-only-assertion a', 'callback-only-assertion b', 'callback-only-assertion c']);
	});
});

describe('title rules', () => {
	it('flags a test whose body is the same as another one of its describe block, under another title', () => {
		const code = [
			`describe('trim', () => {`,
			`\tit('trims leading whitespace', () => { expect(trim(' a ')).toBe('a'); });`,
			`\tit('trims trailing whitespace', () => {\n\t\t// same\n\t\texpect(trim(' a '  )).toBe('a');\n\t});`,
			`});`,
			`describe('other', () => { it('trims both', () => { expect(trim(' a ')).toBe('a'); }); });`
		].join('\n');
		expect(rules(code)).toEqual(['duplicate-body trim > trims trailing whitespace']);
	});

	it('tells bodies apart that differ only in the spaces of a string', () => {
		expect(rules(`it('leading', () => { expect(trim('  a')).toBe('a'); });\nit('trailing', () => { expect(trim('a  ')).toBe('a'); });`)).toEqual([]);
	});

	it('compares only tests that share their setup: not across helper blocks or loop iterations', () => {
		const code = [
			`matrix('a', () => { beforeEach(() => setup(1)); it('blocks', () => { expect(get()).toBe(403); }); });`,
			`matrix('b', () => { beforeEach(() => setup(2)); it('blocks', () => { expect(get()).toBe(403); }); });`,
			`for (const tc of rs) it(\`\${tc.alg} signs\`, () => { expect(sign(tc)).toBe(1); });`,
			`for (const tc of ps) it(\`\${tc.alg} signs\`, () => { expect(sign(tc)).toBe(1); });`
		].join('\n');
		expect(rules(code)).toEqual([]);
	});

	it('flags a title used twice in the same describe block, but not the template of an each test', () => {
		const code = [
			`describe('a', () => { it('parses', () => { expect(f(1)).toBe(1); }); it('parses', () => { expect(f(2)).toBe(2); }); });`,
			`it.each([1])('runs %s', (x) => { expect(g(x)).toBe(1); });`,
			`it.each([2])('runs %s', (x) => { expect(g(x)).toBe(2); });`
		].join('\n');
		expect(rules(code)).toEqual(['duplicate-title a > parses']);
	});
});
