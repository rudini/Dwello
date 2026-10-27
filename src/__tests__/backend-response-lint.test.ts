import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

// Frontend tests take backend responses from tests/contracts (CLAUDE.md, Gotchas: API contracts); eslint.config.js enforces it
const eslint = new ESLint();
const problems = async (filePath: string, code: string) => {
	const [result] = await eslint.lintText(code, { filePath });
	return result.messages.map((message) => message.ruleId);
};

describe('Backend-Antworten in Frontend-Tests', () => {
	it.each([
		['src/__tests__/example.test.ts', "const backend = { '/api/v1/contracts/c1': { id: 'c1' } };"],
		[
			'src/__tests__/example.dom.test.ts',
			"const backend = { 'http://localhost:3001/api/v1/contracts': [{ id: 'c1' }] };"
		],
		['tests/unit/example.test.ts', "backend['/api/v1/contracts/c1'] = { id: 'c1' };"]
	])('lehnt eine erfundene Antwort in %s ab: %s', async (filePath, code) => {
		expect(await problems(filePath, code)).toContain('no-restricted-syntax');
	});

	it('lässt die Antwort aus tests/contracts zu, auch abgewandelt', async () => {
		const code = `import contract from '../../tests/contracts/contract.json';
			const backend = { '/api/v1/contracts/c1': contract, '/api/v1/contracts/c2': { ...contract, id: 'c2' } };
			export default backend;`;
		expect(await problems('src/__tests__/example.test.ts', code)).toEqual([]);
	});
});
