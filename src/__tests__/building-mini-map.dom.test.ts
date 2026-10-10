import { beforeEach, describe, it, expect, vi } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import BuildingMiniMap from '../routes/buildings/BuildingMiniMap.svelte';
import { byTestId } from './helpers/dom';
import { env } from '../../tests/mocks/env'; // what vitest provides as $env/dynamic/public

describe('BuildingMiniMap', () => {
	// jsdom has no matchMedia; browsers do. Light unless a test says otherwise
	beforeEach(() => {
		window.matchMedia = vi.fn(() => ({ matches: false })) as unknown as typeof window.matchMedia;
		delete env.PUBLIC_CARTO_API_KEY;
	});

	it('entfernt die Karte wieder, wenn die Komponente verschwindet', async () => {
		const map = mount(BuildingMiniMap, {
			target: document.body,
			props: { latitude: 47.5, longitude: 8.72 }
		});
		flushSync();
		const container = byTestId('building-mini-map')!;
		// Leaflet is loaded asynchronously
		await vi.waitFor(() => expect(container.querySelector('.leaflet-pane')).not.toBeNull());

		unmount(map);

		expect(container.querySelector('.leaflet-pane')).toBeNull();
	});

	it('bleibt unter Kopfzeile und Dialogen, weil die Karte ihre Ebenen für sich ordnet', () => {
		const map = mount(BuildingMiniMap, {
			target: document.body,
			props: { latitude: 47.5, longitude: 8.72 }
		});
		flushSync();

		expect(byTestId('building-mini-map')!.classList).toContain('isolate');
		unmount(map);
	});

	it('zeigt im Dunkelmodus dunkle Kartenkacheln', async () => {
		window.matchMedia = vi.fn((query: string) => ({
			matches: query === '(prefers-color-scheme: dark)'
		})) as unknown as typeof window.matchMedia;
		const map = mount(BuildingMiniMap, {
			target: document.body,
			props: { latitude: 47.5, longitude: 8.72 }
		});
		flushSync();
		const container = byTestId('building-mini-map')!;

		await vi.waitFor(() => expect(container.querySelector('img.leaflet-tile')).not.toBeNull());
		expect(container.querySelector('img.leaflet-tile')!.getAttribute('src')).toContain('dark_all');
		unmount(map);
	});

	it('fordert die Kartenkacheln mit dem CARTO-Schlüssel an', async () => {
		env.PUBLIC_CARTO_API_KEY = 'test-key';
		const map = mount(BuildingMiniMap, {
			target: document.body,
			props: { latitude: 47.5, longitude: 8.72 }
		});
		flushSync();
		const container = byTestId('building-mini-map')!;

		await vi.waitFor(() => expect(container.querySelector('img.leaflet-tile')).not.toBeNull());
		expect(container.querySelector('img.leaflet-tile')!.getAttribute('src')).toMatch(
			/\.png\?key=test-key$/
		);
		unmount(map);
	});

	it('lädt die Karte nicht mehr, wenn die Seite schon verlassen wurde', async () => {
		const errors: unknown[] = [];
		const onError = (event: PromiseRejectionEvent | ErrorEvent) => errors.push(event);
		window.addEventListener('unhandledrejection', onError);
		const map = mount(BuildingMiniMap, {
			target: document.body,
			props: { latitude: 47.5, longitude: 8.72 }
		});
		flushSync();
		unmount(map);

		await import('leaflet');
		await new Promise((resolve) => setTimeout(resolve, 50));
		window.removeEventListener('unhandledrejection', onError);

		expect(errors).toEqual([]);
	});
});
