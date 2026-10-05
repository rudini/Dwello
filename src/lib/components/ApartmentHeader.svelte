<script lang="ts">
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';

	interface Props {
		apartment: { id: string; number: string };
		building: { id: string; name: string; address: string; postalCode: string; city: string };
	}

	let { apartment, building }: Props = $props();
</script>

<div class="space-y-6">
	<nav class="flex items-center text-sm text-gray-500">
		<a
			href="/apartments"
			data-testid="breadcrumb-link"
			class="hover:text-blue-600 transition-colors">Wohnungen</a
		>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a
			href="/buildings/{building.id}"
			data-testid="breadcrumb-link"
			class="hover:text-blue-600 transition-colors">{building.name}</a
		>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Wohnung {apartment.number}</span>
	</nav>

	<div class="flex justify-between items-start">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 mb-1">Wohnung {apartment.number}</h1>
			<p class="text-sm text-text-secondary flex items-center gap-1">
				<Icon name="location_on" size={16} />
				{building.address}, {building.postalCode}
				{building.city}
			</p>
		</div>
		<Button
			variant="secondary"
			href="/apartments/{apartment.id}/edit"
			testid="apartment-edit-button"
		>
			<Icon name="edit" size={16} />Bearbeiten
		</Button>
	</div>
</div>
