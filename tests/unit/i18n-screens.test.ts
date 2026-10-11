import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import screenList from '../a11y/screens.json';

// The language check (sprachen-bildschirme.feature) visits every screen and state of tests/a11y/screens.json
const examples = (feature: string) =>
	[...readFileSync(`tests/e2e/features/${feature}`, 'utf8').matchAll(/^\s*\| ([\w-]+)\s+\| ([\w-]+)\s+\|$/gm)]
		.map(([, screen, state]) => `${screen} ${state}`)
		.filter((row) => row !== 'Bildschirm Zustand');

describe('Bildschirmliste der Sprachprüfung', () => {
	it('stimmt mit allen Bildschirmen und Zuständen überein', () => {
		const listed = screenList.screens.flatMap((screen) => screen.states.map((state) => `${screen.name} ${state}`));
		expect(examples('sprachen-bildschirme.feature').sort()).toEqual(listed.sort());
	});
});
