import { describe, expect, it } from 'vitest';
import { dot } from './graph';

describe('dot', () => {
	it('zeigt nur Produktivmodule, mit der Zahl der Datei-Imports an der Kante', () => {
		const out = dot(
			[
				{ from: 'fe:ui', to: 'fe:lib/utils', file_edges: '3' },
				{ from: 'tests/e2e', to: 'fe:ui', file_edges: '1' }
			],
			[]
		);
		expect(out).toContain('"fe:ui" -> "fe:lib/utils" [label="3"');
		expect(out).not.toContain('tests/e2e');
	});

	it('färbt die Kanten eines Zyklus rot', () => {
		const out = dot(
			[
				{ from: 'be:services/pdf', to: 'be:services/reminder-letter', file_edges: '1' },
				{ from: 'be:services/reminder-letter', to: 'be:services/pdf', file_edges: '1' },
				{ from: 'be:services/pdf', to: 'db:schema', file_edges: '2' }
			],
			[{ modules: 'be:services/pdf be:services/reminder-letter' }]
		);
		expect(out).toMatch(/"be:services\/pdf" -> "be:services\/reminder-letter" \[[^\]]*color=red/);
		expect(out).not.toMatch(/"be:services\/pdf" -> "db:schema" \[[^\]]*color=red/);
	});
});
