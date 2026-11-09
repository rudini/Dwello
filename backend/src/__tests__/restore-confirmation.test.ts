import { describe, expect, it } from 'bun:test';
import { typedConfirmation } from '../services/restore-confirmation';

// Decided (product owner) #1373: an unsigned Sicherung only after the warning and the typed confirmation
describe('Bestätigung einer nicht signierten Sicherung', () => {
	const confirm = (answer: string | null) => {
		const shown: string[] = [];
		const asked: string[] = [];
		const result = typedConfirmation(
			(question) => (asked.push(question), answer),
			(text) => shown.push(text)
		)('Warnung');
		return { result, shown, asked };
	};

	it('zeigt die Warnung und nimmt WIEDERHERSTELLEN an, auch mit Leerzeichen', () => {
		expect(confirm(' WIEDERHERSTELLEN ')).toEqual({
			result: true,
			shown: ['Warnung'],
			asked: ['Tippen Sie WIEDERHERSTELLEN, um sie trotzdem wiederherzustellen:']
		});
	});

	it('lehnt eine andere Eingabe und das Ende der Eingabe ab', () => {
		expect(confirm('ja').result).toBe(false);
		expect(confirm('wiederherstellen').result).toBe(false);
		expect(confirm(null).result).toBe(false);
	});
});
