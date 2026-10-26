import { describe, expect, it } from 'vitest';
import { analyzeSource } from '../src/analyze.ts';

const rules = (code: string) => analyzeSource('x.test.ts', code).map((f) => `${f.rule} ${f.test}`);

describe('findings', () => {
	it('point at the line and code of the offending assertion', () => {
		const [finding] = analyzeSource('x.test.ts', `it('a', () => {\n\tconst x = f();\n\texpect(x).toBeTruthy;\n});`);
		expect(finding).toMatchObject({ file: 'x.test.ts', line: 3, test: 'a', rule: 'dangling-expect', code: 'expect(x).toBeTruthy' });
	});
});

describe('no-assertion', () => {
	it('flags a test without any assertion', () => {
		expect(rules(`describe('sum', () => { it('adds', () => { sum(1, 2); }); });`)).toEqual(['no-assertion sum > adds']);
	});

	it('accepts a test whose title only claims that nothing throws or that the types check', () => {
		const code = [
			`it('should not throw with 0 middleware', () => { compose([]); });`,
			`it('wirft nicht bei leerer Liste', () => { f([]); });`,
			`it('infers the output type', () => { const x: Out = schema.parse(1); });`,
			`it('works with 0 middleware', () => { compose([]); });`
		].join('\n');
		expect(rules(code)).toEqual(['no-assertion works with 0 middleware']);
	});

	it('counts type-level assertions and @ts-expect-error as assertions', () => {
		const code = [
			`it('a', () => { type T = Expect<Equal<A, B>>; });`,
			`it('b', () => { util.assertEqual<A, B>(true); });`,
			`it('c', () => { expectTypeOf(f).toBeFunction(); });`,
			`it('d', () => {\n\t// @ts-expect-error wrong type\n\tf(1);\n});`
		].join('\n');
		expect(rules(code)).toEqual([]);
	});

	it('counts an assertion in a helper of the same file, also through another helper', () => {
		const code = `const inner = (x) => expect(x).toBe(1);\nfunction outer(x) { inner(x); }\nit('a', () => { outer(1); });`;
		expect(rules(code)).toEqual([]);
	});

	it('counts Testing Library queries that throw when nothing matches', () => {
		expect(rules(`it('a', () => { render(C); screen.getByRole('button'); });`)).toEqual([]);
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
			`it('ok', () => { expect.assertions(1); try { f(); } catch (e) { expect(e.message).toBe('x'); } });`,
			`it('ok2', () => { try { f(); expect.fail('no throw'); } catch (e) { expect(e.message).toBe('x'); } });`
		].join('\n');
		expect(rules(code)).toEqual(['catch-only-assertion a']);
	});

	it('flags an assertion in a try block whose catch swallows the assertion error', () => {
		const code = [
			`it('a', () => { try { expect(f()).toBe(1); } catch { /* ignore */ } });`,
			`it('ok', () => { try { expect(f()).toBe(1); } catch (e) { cleanup(); throw e; } });`,
			`it('ok2', () => { try { expect(f()).toBe(1); } finally { cleanup(); } });`
		].join('\n');
		expect(rules(code)).toEqual(['swallowed-assertion a']);
	});

	it('flags assertions that run only under a condition, but not when both branches assert or a guard throws', () => {
		const code = [
			`it('a', () => { const r = f(); if (r.ok) { expect(r.value).toBe(1); } });`,
			`it('b', () => { const r = f(); r.ok && expect(r.value).toBe(1); });`,
			`it('ok', () => { const r = f(); if (r.ok) expect(r.value).toBe(1); else expect(r.error).toBe('x'); });`,
			`it('ok2', () => { const r = f(); if (!r.ok) throw new Error('failed'); });`,
			`it('ok3', () => { switch (mode) { case 'a': expect(f()).toBe(1); break; default: expect(f()).toBe(2); } });`
		].join('\n');
		expect(rules(code)).toEqual(['conditional-assertion a', 'conditional-assertion b']);
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
			`it('ok3', (done) => { setTimeout(() => { expect(g()).toBe(1); done(); }); });`
		].join('\n');
		expect(rules(code)).toEqual(['callback-only-assertion a', 'callback-only-assertion b']);
	});
});
