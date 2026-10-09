import { afterEach, describe, expect, it } from 'vitest';
import { env } from '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private
import { load } from '../routes/gallery/+page.server';

// The component gallery exists for the accessibility check only, never in a real installation
describe('Bauteil-Galerie', () => {
	afterEach(() => delete env.UI_GALLERY);

	it('gibt es nicht, solange sie nicht eingeschaltet ist', () => {
		expect(() => load()).toThrow(expect.objectContaining({ status: 404 }));
	});

	it('zeigt sich, wenn sie für die Prüfung eingeschaltet ist', () => {
		env.UI_GALLERY = 'on';
		expect(() => load()).not.toThrow();
	});
});
