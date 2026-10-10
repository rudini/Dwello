<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
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

	onMount(async () => {
		const L = await import('leaflet');

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

		L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
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
	onDestroy(() => map?.remove());
</script>

<div
	bind:this={mapContainer}
	role="img"
	aria-label={address ? `Karte: ${address}` : 'Karte'}
	class="h-36 w-full overflow-hidden rounded-control border border-line bg-sunken"
	data-testid="building-mini-map"
></div>
