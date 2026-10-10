<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import type { Map } from 'leaflet';
	import 'leaflet/dist/leaflet.css';

	// Small, still map of where the building stands; the address next to it says the same in words
	interface Props {
		latitude: number;
		longitude: number;
		address?: string;
	}

	let { latitude, longitude, address = '' }: Props = $props();

	let mapContainer: HTMLDivElement;
	let map: Map | null = null;
	let destroyed = false;

	onMount(async () => {
		const L = await import('leaflet');
		if (destroyed) return; // the page was left while Leaflet loaded

		map = L.map(mapContainer, {
			zoomControl: false,
			attributionControl: false,
			dragging: false,
			scrollWheelZoom: false,
			doubleClickZoom: false,
			boxZoom: false,
			keyboard: false,
			touchZoom: false
		}).setView([latitude, longitude], 16);

		// The map follows the colour scheme like the rest of the page
		const style = window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark_all'
			: 'light_all';
		// CARTO serves tiles to browsers only with a key; it is public by nature, as it travels in the tile URL
		const key = env.PUBLIC_CARTO_API_KEY;
		L.tileLayer(`https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png?key=${key}`, {
			maxZoom: 19,
			subdomains: 'abcd'
		}).addTo(map);

		const pin = L.divIcon({
			className: '',
			html: '<span class="block size-6 rounded-control border-2 border-surface bg-accent shadow-raised"></span>',
			iconSize: [24, 24],
			iconAnchor: [12, 12]
		});
		// Not focusable and without popup: the map only shows, it is not operated
		L.marker([latitude, longitude], { icon: pin, interactive: false, keyboard: false }).addTo(map);

		map.invalidateSize();
	});

	// An async onMount cannot return its cleanup, so the map is removed here
	onDestroy(() => {
		destroyed = true;
		map?.remove();
	});
</script>

<!-- isolate: Leaflet's panes (z-index 400–600) stay below the sticky header and dialogs -->
<div
	bind:this={mapContainer}
	role="img"
	aria-label={address ? `Karte: ${address}` : 'Karte'}
	class="isolate h-36 w-full overflow-hidden rounded-control border border-line bg-sunken"
	data-testid="building-mini-map"
></div>
