import { describe, expect, it } from 'vitest';
import { classify } from './lib';

describe('classify', () => {
	it('ordnet einen Endpunkt +server.ts unter src/routes einem BFF-Modul zu', () => {
		expect(classify('src/routes/statements/[id]/pdf/+server.ts')).toMatchObject({
			layer: 'BFF',
			module: 'bff:endpoint/statements'
		});
	});

	it('zählt die Demo-Daten zum Tooling, nicht zur Datenbank-Schicht', () => {
		expect(classify('backend/src/db/demo-data.ts')).toMatchObject({ layer: 'Tooling', kind: 'other' });
	});
});
