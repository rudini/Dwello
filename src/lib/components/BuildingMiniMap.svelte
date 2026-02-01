<script lang="ts">
	import { onMount } from 'svelte';
	import type { Map, Marker } from 'leaflet';

	interface Props {
		latitude: number;
		longitude: number;
		address?: string;
	}

	let { latitude, longitude, address = '' }: Props = $props();

	let mapContainer: HTMLDivElement;
	let map: Map | null = null;
	let marker: Marker | null = null;

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
			touchZoom: false,
			tap: false
		}).setView([latitude, longitude], 16);

		L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
			maxZoom: 19,
			subdomains: 'abcd'
		}).addTo(map);

		// Inline styled marker for reliability
		const markerHtml = `
			<div style="
				position: relative;
				width: 32px;
				height: 42px;
			">
				<div style="
					position: absolute;
					top: 0;
					left: 1px;
					width: 28px;
					height: 28px;
					background-color: #135bec;
					border: 3px solid white;
					border-radius: 50% 50% 50% 0;
					transform: rotate(-45deg);
					box-shadow: 0 3px 8px rgba(0,0,0,0.4);
				"></div>
				<div style="
					position: absolute;
					top: 9px;
					left: 11px;
					width: 10px;
					height: 10px;
					background-color: white;
					border-radius: 50%;
				"></div>
			</div>
		`;

		const customIcon = L.divIcon({
			className: 'leaflet-marker-custom',
			html: markerHtml,
			iconSize: [32, 42],
			iconAnchor: [16, 42]
		});

		marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

		if (address) {
			marker.bindPopup(address, {
				closeButton: false,
				offset: [0, -32]
			});
		}

		map.invalidateSize();

		return () => {
			if (map) {
				map.remove();
				map = null;
			}
		};
	});
</script>

<div
	bind:this={mapContainer}
	class="map-container"
	data-testid="building-mini-map"
></div>

<style>
	.map-container {
		width: 100%;
		height: 140px;
		border-radius: 8px;
		overflow: hidden;
		background-color: #e8eef5;
		border: 1px solid #e2e8f0;
	}

	:global(.leaflet-container) {
		font-family: inherit;
		background-color: #e8eef5;
	}

	:global(.leaflet-marker-custom) {
		background: none !important;
		border: none !important;
	}

	:global(.leaflet-popup-content-wrapper) {
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	:global(.leaflet-popup-content) {
		margin: 10px 14px;
		font-size: 13px;
		color: #374151;
	}
</style>
