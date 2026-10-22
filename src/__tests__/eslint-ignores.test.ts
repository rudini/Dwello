import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

// Since O-47 a failed local E2E run keeps its trace, and the HTML report brings the trace viewer's scripts: generated
// code, not ours, so bun run lint leaves it alone
describe('ESLint', () => {
	it('prüft den Bericht der Akzeptanztests nicht', async () => {
		expect(
			await new ESLint().isPathIgnored('playwright-report/trace/assets/codeMirrorModule.js')
		).toBe(true);
	});
});
