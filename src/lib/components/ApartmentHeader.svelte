<script lang="ts">
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import type { Apartment, Building } from '../types';

	interface Props {
		apartment: Apartment;
		building: Building;
	}

	let { apartment, building }: Props = $props();

	const breadcrumbs = $derived([
		{ label: building.address, href: '#' },
		{ label: apartment.floor, href: '#' },
		{ label: `Wohnung ${apartment.address_unit}`, href: '#' }
	]);
</script>

<div class="mb-8">
	<nav class="flex items-center gap-2 mb-4 text-sm text-slate-600">
		{#each breadcrumbs as crumb, idx}
			<a href={crumb.href} class="hover:text-primary transition-colors">{crumb.label}</a>
			{#if idx < breadcrumbs.length - 1}
				<span class="text-slate-400">/</span>
			{/if}
		{/each}
	</nav>

	<div class="flex justify-between items-start">
		<div>
			<h1 class="text-4xl font-bold text-text-dark mb-2">Wohnung {apartment.address_unit}</h1>
			<p class="text-sm text-text-secondary flex items-center gap-1">
				<Icon name="location_on" size={16} />
				{building.address}, {building.postal_code} {building.city}
			</p>
		</div>
		<div class="flex gap-3">
			<Button variant="secondary" icon="edit">Bearbeiten</Button>
			<Button variant="secondary" icon="file_download">Export</Button>
		</div>
	</div>
</div>
