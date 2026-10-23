import { describe, expect, it } from 'vitest';
import { advise, judge, loosened, tighten, type Measured, type Ratchet } from './fitness';

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
});
