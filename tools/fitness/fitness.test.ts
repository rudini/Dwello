import { describe, expect, it } from 'vitest';
import { addedAllowed, addedTechnical, advise, decides, isFrontendFile, judge, loosened, newFields, tighten, type Measured, type Ratchet } from './fitness';

const ratchet: Ratchet = {
	fieldSpread: { median: 6, p90: 19, max: 60 },
	technical: [],
	exceptions: { bffDecisions: [], literalSets: [], entityMirrors: [], moduleCycles: [] },
	prSizeWarn: { files: 31, modules: 20, layers: 5 },
	coChangeWarn: 28
};
const clean: Measured = {
	fieldSpread: { median: 6, p90: 19, max: 60 },
	bffDecisions: [],
	literalSets: [],
	entityMirrors: [],
	moduleCycles: [],
	boundaryImports: []
};

describe('judge', () => {
	it('passes when every value holds the ratchet', () => {
		expect(judge(clean, ratchet)).toEqual([]);
	});

	it('fails when the field spread gets worse', () => {
		const findings = judge({ ...clean, fieldSpread: { median: 7, p90: 19, max: 60 } }, ratchet);
		expect(findings).toHaveLength(1);
		expect(findings[0].check).toBe('field-spread');
		expect(findings[0].message).toContain('AP1');
	});

	it('fails on a domain decision in the BFF that neither an exception nor the technical list covers', () => {
		const line = "if (contract.status === 'ended') return null;";
		const r: Ratchet = {
			...ratchet,
			technical: [{ path: 'src/routes/x/+page.server.ts', line: 'const day = /^\\d{4}-\\d{2}-\\d{2}$/;', reason: 'query parameter' }],
			exceptions: { ...ratchet.exceptions, bffDecisions: [{ path: 'src/lib/server/a.ts', line, reason: 'legacy', scenario: 'Ä4' }] }
		};
		const decisions = [
			{ path: 'src/lib/server/a.ts', line },
			{ path: 'src/routes/x/+page.server.ts', line: "const day = /^\\d{4}-\\d{2}-\\d{2}$/;" },
			{ path: 'src/lib/server/b.ts', line }
		];
		const findings = judge({ ...clean, bffDecisions: decisions }, r);
		expect(findings.map((f) => f.check)).toEqual(['bff-decision']);
		expect(findings[0].message).toContain('src/lib/server/b.ts');
		expect(findings[0].message).toContain('AP2');
	});

	it('fails on a value list in a new layer pair or in more files than listed', () => {
		const r: Ratchet = {
			...ratchet,
			exceptions: { ...ratchet.exceptions, literalSets: [{ values: 'active|ended|future', files: 4, reason: 'legacy', scenario: 'Ä1' }] }
		};
		const sets = [
			{ values: 'active|ended|future', files: 5 },
			{ values: 'draft|sent', files: 2 }
		];
		const findings = judge({ ...clean, literalSets: sets }, r);
		expect(findings.map((f) => f.check)).toEqual(['literal-set', 'literal-set']);
		expect(findings[0].message).toContain('active|ended|future');
		expect(findings[1].message).toContain('draft|sent');
	});

	it('fails on a new file outside the backend that mirrors a table', () => {
		const r: Ratchet = {
			...ratchet,
			exceptions: { ...ratchet.exceptions, entityMirrors: [{ table: 'tenants', paths: ['src/lib/types.ts'], reason: 'legacy', scenario: 'Ä1' }] }
		};
		const mirrors = [
			{ table: 'tenants', path: 'src/lib/types.ts' },
			{ table: 'tenants', path: 'src/lib/server/tenant-copy.ts' }
		];
		const findings = judge({ ...clean, entityMirrors: mirrors }, r);
		expect(findings.map((f) => f.check)).toEqual(['entity-mirror']);
		expect(findings[0].message).toContain('src/lib/server/tenant-copy.ts');
	});

	it('fails on a new module cycle and on a runtime import across the HTTP boundary', () => {
		const r: Ratchet = {
			...ratchet,
			exceptions: { ...ratchet.exceptions, moduleCycles: [{ modules: 'fe:lib/navigation fe:ui', reason: 'legacy', scenario: 'Ä1' }] }
		};
		const findings = judge(
			{
				...clean,
				moduleCycles: ['fe:lib/navigation fe:ui', 'bff:lib/server fe:lib'],
				boundaryImports: ['src/lib/x.ts -> backend/src/services/y.ts']
			},
			r
		);
		expect(findings.map((f) => f.check)).toEqual(['module-cycle', 'boundary-import']);
		expect(findings[0].message).toContain('bff:lib/server fe:lib');
		expect(findings[1].message).toContain('backend/src/services/y.ts');
	});
});

describe('loosened', () => {
	it('fails when a threshold rises or an exception is added, not when they shrink', () => {
		const base: Ratchet = {
			...ratchet,
			exceptions: { ...ratchet.exceptions, literalSets: [{ values: 'a|b', files: 3, reason: 'legacy', scenario: 'Ä1' }] }
		};
		const tighter: Ratchet = { ...ratchet, fieldSpread: { median: 5, p90: 19, max: 60 } };
		expect(loosened(tighter, base)).toEqual([]);
		const looser: Ratchet = {
			...base,
			fieldSpread: { median: 6, p90: 20, max: 60 },
			exceptions: {
				...base.exceptions,
				literalSets: [{ values: 'a|b', files: 4, reason: 'legacy', scenario: 'Ä1' }],
				moduleCycles: [{ modules: 'x y', reason: 'new', scenario: 'Ä1' }]
			}
		};
		expect(loosened(looser, base).map((f) => f.message)).toEqual([
			expect.stringContaining('fieldSpread.p90'),
			expect.stringContaining('literalSets'),
			expect.stringContaining('moduleCycles')
		]);
	});

	it('lets an exception change its text when the list does not grow (a renamed file, a reformatted line)', () => {
		const base: Ratchet = {
			...ratchet,
			exceptions: { ...ratchet.exceptions, bffDecisions: [{ path: 'a.ts', line: 'x', reason: 'r', scenario: 'Ä4' }] }
		};
		const renamed: Ratchet = {
			...base,
			exceptions: { ...base.exceptions, bffDecisions: [{ path: 'b.ts', line: 'x', reason: 'r', scenario: 'Ä4' }] }
		};
		expect(loosened(renamed, base)).toEqual([]);
	});

	it('lets a change bring a new exception list with the check that needs it, then holds it like the others', () => {
		const entry = { path: 'a.ts', line: 'x < today', reason: '#788', scenario: 'Ä4' };
		const withDates: Ratchet = { ...ratchet, exceptions: { ...ratchet.exceptions, bffDates: [entry] } };
		expect(loosened(withDates, ratchet)).toEqual([]);
		const more: Ratchet = { ...ratchet, exceptions: { ...ratchet.exceptions, bffDates: [entry, entry] } };
		expect(loosened(more, withDates).map((f) => f.message)).toEqual([expect.stringContaining('bffDates')]);
	});

	it('does not let a list go away, so it cannot come back later with entries unseen', () => {
		const withDates: Ratchet = { ...ratchet, exceptions: { ...ratchet.exceptions, bffDates: [] } };
		expect(loosened(ratchet, withDates).map((f) => f.message)).toEqual([expect.stringContaining('bffDates')]);
	});
});

describe('tighten', () => {
	it('writes improved values as the new ratchet and drops exceptions that are gone', () => {
		const r: Ratchet = {
			...ratchet,
			exceptions: {
				bffDecisions: [
					{ path: 'a.ts', line: 'x', reason: 'r', scenario: 'Ä4' },
					{ path: 'b.ts', line: 'y', reason: 'r', scenario: 'Ä4' }
				],
				literalSets: [
					{ values: 'a|b', files: 4, reason: 'r', scenario: 'Ä1' },
					{ values: 'c|d', files: 2, reason: 'r', scenario: 'Ä1' }
				],
				entityMirrors: [{ table: 't', paths: ['p.ts', 'q.ts'], reason: 'r', scenario: 'Ä1' }],
				moduleCycles: [{ modules: 'x y', reason: 'r', scenario: 'Ä1' }]
			}
		};
		const now: Measured = {
			fieldSpread: { median: 5, p90: 20, max: 60 },
			bffDecisions: [{ path: 'b.ts', line: 'y' }],
			literalSets: [{ values: 'a|b', files: 3 }],
			entityMirrors: [{ table: 't', path: 'q.ts' }],
			moduleCycles: [],
			boundaryImports: []
		};
		const t = tighten(now, r);
		expect(t.fieldSpread).toEqual({ median: 5, p90: 19, max: 60 });
		expect(t.exceptions.bffDecisions.map((e) => e.path)).toEqual(['b.ts']);
		expect(t.exceptions.literalSets).toEqual([{ values: 'a|b', files: 3, reason: 'r', scenario: 'Ä1' }]);
		expect(t.exceptions.entityMirrors).toEqual([{ table: 't', paths: ['q.ts'], reason: 'r', scenario: 'Ä1' }]);
		expect(t.exceptions.moduleCycles).toEqual([]);
	});
});

describe('advise', () => {
	it('warns when a pull request changes more production files, modules or layers than 9 of 10 features', () => {
		expect(advise({ prSize: { files: 31, modules: 20, layers: 5 } }, ratchet)).toEqual([]);
		const w = advise({ prSize: { files: 32, modules: 3, layers: 6 } }, ratchet);
		expect(w.map((f) => f.check)).toEqual(['pr-size']);
		expect(w[0].message).toContain('32 files');
		expect(w[0].message).toContain('6 layers');
	});

	it('warns when more production file pairs across layers change together without an import than the ratchet', () => {
		expect(advise({ coChange: 28 }, ratchet)).toEqual([]);
		const w = advise({ coChange: 30 }, ratchet);
		expect(w.map((f) => f.check)).toEqual(['co-change']);
		expect(w[0].message).toContain('30');
	});

	it('warns when the list of technical checks grows, so a review confirms the new entry is not a domain rule', () => {
		const w = advise({ technicalAdded: 1 }, ratchet);
		expect(w.map((f) => f.check)).toEqual(['technical']);
		expect(advise({ technicalAdded: 0 }, ratchet)).toEqual([]);
		expect(advise({ technicalAdded: -1 }, ratchet)).toEqual([]);
	});

	it('warns when a field new since the base is declared by hand in more than 4 production files outside the DB', () => {
		const w = advise(
			{
				newFields: [
					{ field: 'tenants.mailCountry', files: 5 },
					{ field: 'tenants.mailZip', files: 4 }
				]
			},
			ratchet
		);
		expect(w.map((f) => f.check)).toEqual(['new-field']);
		expect(w[0].message).toContain('tenants.mailCountry');
		expect(w[0].message).not.toContain('mailZip');
	});
});

describe('addedTechnical', () => {
	it('counts technical entries the base does not list, also when one replaces another', () => {
		const entry = (line: string) => ({ path: 'a.ts', line, reason: 'r' });
		const base: Ratchet = { ...ratchet, technical: [entry('x'), entry('y')] };
		expect(addedTechnical({ ...ratchet, technical: [entry('x')] }, base)).toBe(0);
		expect(addedTechnical({ ...ratchet, technical: [entry('x'), entry('z')] }, base)).toBe(1);
	});
});

describe('newFields', () => {
	it('lists the fields of the spread that the base schema does not have', () => {
		const baseSchema = "export const tenants = pgTable('tenants', {\n\tfirstName: varchar('first_name'),\n});\n";
		const spread = [
			{ table: 'tenants', field: 'firstName', prod_files: '18' },
			{ table: 'tenants', field: 'mailCountry', prod_files: '5' }
		];
		expect(newFields(spread, baseSchema)).toEqual([{ field: 'tenants.mailCountry', files: 5 }]);
	});
});

describe('decides', () => {
	it('finds a domain decision in a BFF line: a status, an anchored regex, a date against today', () => {
		expect(decides("if (s.status === 'paid') return;")).toBe(true);
		expect(decides('const day = /^\\d{4}-\\d{2}-\\d{2}$/;')).toBe(true);
		expect(decides('if (String(startDate).slice(0, 10) <= localToday() && !confirmed)')).toBe(true);
		expect(decides('String(c.endDate) < today &&')).toBe(true);
		expect(decides("contractEndError(endDate, String(contract.startDate ?? ''), localToday()) ??")).toBe(true);
		expect(decides('expiredContracts: expired(allContracts, today),')).toBe(true);
		expect(decides('\t\t\tlocalToday(),')).toBe(true); // an argument Prettier put on its own line
		// #815: today read from the page data is still today
		expect(decides('const pastEnd = $derived(pastEndConfirmation(endDate, data.today) !== null);')).toBe(true);
		// #815 part D: equal to today is a date against today too
		expect(decides('endDate === data.today')).toBe(true);
		expect(decides('if (localToday() !== day) return;')).toBe(true);
	});

	it('leaves lines that only pass today on or use arrows alone', () => {
		expect(decides('today: localToday(), // the server\'s day, for the Vertragsstatus')).toBe(false);
		expect(decides('const today = localToday();')).toBe(false);
		expect(decides('rows.map((r) => today)')).toBe(false);
		expect(decides("return { name: 'x' };")).toBe(false);
	});
});

describe('judge with date exceptions', () => {
	it('accepts a listed date derivation and refuses an unlisted one', () => {
		const line = 'String(c.endDate) < today &&';
		const r: Ratchet = {
			...ratchet,
			exceptions: { ...ratchet.exceptions, bffDates: [{ path: 'src/a.ts', line, reason: '#788', scenario: 'Ä4' }] }
		};
		const found = [
			{ path: 'src/a.ts', line },
			{ path: 'src/b.ts', line }
		];
		expect(judge({ ...clean, bffDecisions: found }, r).map((f) => f.message)).toEqual([expect.stringContaining('src/b.ts')]);
	});

	it('drops a date exception once the code no longer has it', () => {
		const kept = { path: 'src/a.ts', line: 'x < today', reason: '#788', scenario: 'Ä4' };
		const gone = { path: 'src/b.ts', line: 'y < today', reason: '#788', scenario: 'Ä4' };
		const r: Ratchet = { ...ratchet, exceptions: { ...ratchet.exceptions, bffDates: [kept, gone] } };
		const t = tighten({ ...clean, bffDecisions: [{ path: 'src/a.ts', line: 'x < today' }] }, r);
		expect(t.exceptions.bffDates).toEqual([kept]);
	});
});


// #815: the same check over the frontend; a display or format check and a proven pre-check are allowed, the rest is an
// exception that only shrinks
describe('judge in the frontend', () => {
	const line = 'if (billedUntil > today) return m.backend_billed_until_future();';
	const test = 'backend/src/__tests__/billed-until.pg.test.ts';
	const read = (path: string) => (path === test ? "expect(body).toMatchObject({ code: 'BILLED_UNTIL_FUTURE' })" : undefined);

	it('fails on a frontend derivation that no list covers, and names AP2 and the way out', () => {
		const findings = judge({ ...clean, frontendDecisions: [{ path: 'src/lib/a.ts', line }] }, ratchet, read);
		expect(findings.map((f) => f.check)).toEqual(['frontend-decision']);
		expect(findings[0].message).toContain('src/lib/a.ts');
		expect(findings[0].message).toContain('AP2');
	});

	it('accepts a listed display check, a listed exception and a pre-check its backend test proves', () => {
		const r: Ratchet = {
			...ratchet,
			display: [{ path: 'src/lib/b.svelte', line: "{#if status === 'draft'}", reason: 'status label' }],
			preChecks: [{ path: 'src/lib/a.ts', line, code: 'BILLED_UNTIL_FUTURE', test }],
			exceptions: { ...ratchet.exceptions, frontendDecisions: [{ path: 'src/lib/c.ts', line: 'x < today', reason: '#815', scenario: 'Ä4' }] }
		};
		const found = [
			{ path: 'src/lib/a.ts', line },
			{ path: 'src/lib/b.svelte', line: "{#if status === 'draft'}" },
			{ path: 'src/lib/c.ts', line: 'x < today' }
		];
		expect(judge({ ...clean, frontendDecisions: found }, r, read)).toEqual([]);
	});

	it('fails on a pre-check whose backend test does not refuse with its code', () => {
		const r: Ratchet = { ...ratchet, preChecks: [{ path: 'src/lib/a.ts', line, code: 'BILLED_UNTIL_PAST', test }] };
		const findings = judge({ ...clean, frontendDecisions: [{ path: 'src/lib/a.ts', line }] }, r, read);
		expect(findings.map((f) => f.check)).toEqual(['pre-check']);
		expect(findings[0].message).toContain('BILLED_UNTIL_PAST');
	});

	it('holds the frontend exceptions like the others and drops them once the code no longer has them', () => {
		const kept = { path: 'src/lib/c.ts', line: 'x < today', reason: '#815', scenario: 'Ä4' };
		const gone = { path: 'src/lib/d.ts', line: 'y < today', reason: '#815', scenario: 'Ä4' };
		const base: Ratchet = { ...ratchet, exceptions: { ...ratchet.exceptions, frontendDecisions: [kept] } };
		const more: Ratchet = { ...ratchet, exceptions: { ...ratchet.exceptions, frontendDecisions: [kept, gone] } };
		expect(loosened(more, base).map((f) => f.message)).toEqual([expect.stringContaining('frontendDecisions')]);
		const t = tighten({ ...clean, frontendDecisions: [{ path: 'src/lib/c.ts', line: 'x < today' }] }, more);
		expect(t.exceptions.frontendDecisions).toEqual([kept]);
	});

	it('warns when the display or pre-check list grows, so a review confirms the entry', () => {
		const base: Ratchet = { ...ratchet, display: [] };
		const working: Ratchet = { ...ratchet, display: [{ path: 'a.svelte', line: 'x', reason: 'format' }] };
		expect(addedAllowed(working, base)).toBe(1);
		expect(advise({ allowedAdded: 1 }, ratchet).map((f) => f.check)).toEqual(['frontend-allowed']);
	});
});

// review i815a C-3: the frontend is every non-server file under src/, not only src/lib and components
describe('isFrontendFile', () => {
	it('takes components, src/lib outside server/, universal loads and client hooks', () => {
		for (const p of ['src/lib/a.ts', 'src/routes/x/Y.svelte', 'src/routes/x/+page.ts', 'src/routes/config/help.ts', 'src/hooks.client.ts'])
			expect(isFrontendFile(p)).toBe(true);
	});

	it('leaves BFF files, tests and Paraglide', () => {
		for (const p of ['src/lib/server/a.ts', 'src/routes/x/+page.server.ts', 'src/routes/x/+server.ts', 'src/hooks.server.ts', 'src/__tests__/a.test.ts', 'src/lib/paraglide/messages.js', 'src/app.d.ts'])
			expect(isFrontendFile(p)).toBe(false);
	});
});
