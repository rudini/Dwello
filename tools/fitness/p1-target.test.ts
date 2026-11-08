import { describe, expect, it } from 'vitest';
import { missesTarget } from './p1-target';

describe('P1: Abrechnungslauf für 50 Wohnungen samt PDFs', () => {
	it('verfehlt das Ziel, wenn Lauf und PDFs zusammen über 30 s brauchen', () => {
		expect(missesTarget(20_000, 10_001)).toBe(true);
	});

	it('hält das Ziel mit genau 30 s', () => {
		expect(missesTarget(20_000, 10_000)).toBe(false);
	});
});
