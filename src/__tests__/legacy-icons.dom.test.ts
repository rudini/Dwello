import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import Icon from '$lib/components/Icon.svelte';
import { materialIcons } from '$lib/components/material-icons';
import { icons } from '$lib/ui/icons';
import { show } from './helpers/dom';

// Old screens still name Material Symbols; until they are migrated, the old Icon draws them from the one Lucide set
const sources = readdirSync('src', { recursive: true, encoding: 'utf8' })
	.map((file) => `src/${file}`)
	.filter((file) => file.endsWith('.svelte') || file.endsWith('.ts'))
	.filter((file) => !file.includes('__tests__'));
const usedNames = [
	...new Set(
		sources.flatMap((file) =>
			[
				...readFileSync(file, 'utf8').matchAll(
					/(?:Icon name="|icon: '|icon="|icon: ")([a-z_]+)["']/g
				)
			].map(([, name]) => name)
		)
	)
];

describe('Symbole der alten Bildschirme', () => {
	it('kommen alle aus dem einen Symbolsatz', () => {
		expect(usedNames.filter((name) => !(name in materialIcons) && !(name in icons))).toEqual([]);
	});

	it('zeichnen ein Linien-Symbol statt einer Google-Schrift', () => {
		show(Icon, { name: 'delete', size: 20 });
		const svg = document.querySelector('svg')!;
		expect(svg.getAttribute('aria-hidden')).toBe('true');
		expect(svg.getAttribute('stroke-width')).toBe('1.75');
		expect(document.querySelector('.material-symbols-outlined')).toBeNull();
	});
});
