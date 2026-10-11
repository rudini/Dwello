import { afterEach, describe, it, expect } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import Button from '$lib/ui/Button.svelte';
import { byTestId, show } from './helpers/dom';
import { createRawSnippet } from 'svelte';

afterEach(() => overwriteGetLocale(() => baseLocale));

describe('Bausteine in der gewählten Sprache', () => {
	it('sagt auf Französisch, dass ein Link in einem neuen Tab aufgeht', () => {
		overwriteGetLocale(() => 'fr');
		const children = createRawSnippet(() => ({ render: () => '<span>Itinéraire</span>' }));
		show(Button, { href: '/x', target: '_blank', testid: 'link', children } as never);
		expect(byTestId('link')!.textContent).toContain('(s’ouvre dans un nouvel onglet)');
	});
});
