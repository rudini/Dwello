import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import screenList from '../a11y/screens.json';

// The axe check (accessibility.feature) visits exactly the screens and states of tests/a11y/screens.json
const coveredElsewhere: string[] = []; // every state runs in the axe check ('empty' and 'first-use' on the empty instance)
const feature = readFileSync('tests/e2e/features/accessibility.feature', 'utf8');
const examples = [...feature.matchAll(/^\s*\| ([\w-]+)\s+\| ([\w-]+)\s+\|$/gm)]
	.map(([, screen, state]) => `${screen} ${state}`)
	.filter((row) => row !== 'Bildschirm Zustand');
const listed = screenList.screens.flatMap((screen) =>
	screen.states.filter((state) => !coveredElsewhere.includes(state)).map((state) => `${screen.name} ${state}`)
);

describe('Bildschirmliste der Barrierefreiheitsprüfung', () => {
	it('stimmt mit den Beispielen der Prüfung überein', () => {
		expect([...examples].sort()).toEqual([...listed].sort());
	});

	it('nennt nur Zustände mit festgelegter Bedeutung', () => {
		const states = screenList.screens.flatMap((screen) => screen.states);
		expect(states.filter((state) => !(state in screenList.stateMeanings))).toEqual([]);
	});

	it('beginnt jeden Bildschirm mit seinem Grundzustand', () => {
		expect(screenList.screens.filter((screen) => screen.states[0] !== 'default')).toEqual([]);
	});

	it('prüft jeden Zustand hell und dunkel', () => {
		expect(screenList.colorSchemes).toEqual(['light', 'dark']);
	});
});
