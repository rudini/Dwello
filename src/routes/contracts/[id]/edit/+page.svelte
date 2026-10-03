<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { RentalContract } from '$lib/types';
	import ContractForm from '../../ContractForm.svelte';

	interface PageData {
		contract: RentalContract;
		tenants: { id: string; name: string }[];
		apartments: { id: string; unit: string; building: string; status: string }[];
	}

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Mietvertrag bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/contracts" data-testid="breadcrumb-link" class="hover:text-primary transition-colors">Mietverträge</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/contracts/{data.contract.id}" data-testid="breadcrumb-link" class="hover:text-primary transition-colors">
			Vertrag
		</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Bearbeiten</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Mietvertrag bearbeiten</h1>
		<p class="text-gray-500 mt-1">Ändern Sie die Vertragsdaten.</p>
	</div>

	<ContractForm contract={data.contract} tenants={data.tenants} apartments={data.apartments} />
</div>
