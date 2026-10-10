import { describe, it, expect, vi } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import BuildingMiniMap from '../routes/buildings/BuildingMiniMap.svelte';
import { byTestId } from './helpers/dom';

describe('BuildingMiniMap', () => {
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
});
