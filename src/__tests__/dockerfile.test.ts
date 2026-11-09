import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const runner = readFileSync('Dockerfile', 'utf8').split(/^FROM .* AS runner$/m)[1];

describe('Dockerfile, Stufe runner', () => {
	it('lässt Node die Adresssuche über HTTPS_PROXY schicken, wenn einer gesetzt ist (#749)', () => {
		expect(runner).toMatch(/^ENV NODE_USE_ENV_PROXY=1$/m);
	});
});
