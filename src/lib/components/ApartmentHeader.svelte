<script lang="ts">
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import type { Apartment, Building } from '../types';

	interface Props {
		apartment: Apartment;
		building: Building;
	}

	let { apartment, building }: Props = $props();
</script>

<div class="mb-8">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500 mb-4">
		<a href="/apartments" class="hover:text-blue-600 transition-colors">Wohnungen</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">{apartment.address_unit}</span>
	</nav>

	<div class="flex justify-between items-start">
		<div>
			<h1 class="text-4xl font-bold text-text-dark mb-2">Wohnung {apartment.address_unit}</h1>
			{#if building.address || building.city}
			<p class="text-sm text-text-secondary flex items-center gap-1">
				<Icon name="location_on" size={16} />
				{[building.address, [building.postalCode, building.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}
			</p>
		{/if}
		</div>
		<div class="flex gap-3">
			<Button variant="secondary" href="/apartments/{apartment.id}/edit"><Icon name="edit" size={16} />Bearbeiten</Button>
			<Button variant="secondary"><Icon name="file_download" size={16} />Export</Button>
		</div>
	</div>
</div>
