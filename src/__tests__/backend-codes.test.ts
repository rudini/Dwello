import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import de from '../../messages/de.json';

/** Every code the backend refuses with is shown in the UI language: messages/*.json hold `backend_<code>`; a
 * subclass of CodedError (`new ReminderError('…')`) throws one too (#716) */
const codesIn = (source: string) =>
	[
		...source.matchAll(
			/(?:\bnew \w+|CodedError|refusal)\(\s*'([A-Z][A-Z0-9_]+)'|\bcode: '([A-Z][A-Z0-9_]+)'/g
		)
	].map((match) => match[1] ?? match[2]);

const sources = (readdirSync('backend/src', { recursive: true }) as string[])
	.filter((path) => path.endsWith('.ts') && !path.includes('__tests__'))
	.map((path) => readFileSync(`backend/src/${path}`, 'utf8'));

describe('Fehlercodes des Backends', () => {
	// #716: also a code thrown through a subclass of CodedError (ReminderError, Conflict)
	it('findet Codes in CodedError, seinen Unterklassen, refusal und code-Feldern', () => {
		expect(
			codesIn(
				`throw new CodedError(\n 'A_B', 'x'); refusal('C_D', 'y'); ({ code: 'D_1' }); throw new ReminderError('E_F', 'z')`
			)
		).toEqual(['A_B', 'C_D', 'D_1', 'E_F']);
	});

	it('hat für jeden Code eine Meldung in der Oberfläche', () => {
		const codes = [...new Set(sources.flatMap(codesIn))];
		expect(codes.length).toBeGreaterThan(0);
		expect(codes.filter((code) => !(`backend_${code.toLowerCase()}` in de))).toEqual([]);
	});
});
