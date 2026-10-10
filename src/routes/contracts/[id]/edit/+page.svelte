<script lang="ts">
	import type { RentalContract } from '$lib/types';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import ContractForm from '../../ContractForm.svelte';

	interface PageData {
		contract: RentalContract;
		tenants: { id: string; name: string }[];
		apartments: { id: string; unit: string; building: string; status: string }[];
	}

	let { data }: { data: PageData } = $props();

	const tenant = $derived(data.tenants.find((t) => t.id === data.contract.tenantId)?.name);
</script>

<svelte:head>
	<title>Mietvertrag bearbeiten - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Mietvertrag bearbeiten"
		purpose="Ändern Sie Mieter, Wohnung, Vertragsdauer oder Miete dieses Mietvertrags."
		trail={[
			{ href: '/contracts', label: 'Mietverträge' },
			{
				href: `/contracts/${data.contract.id}`,
				label: tenant ? `Mietvertrag von ${tenant}` : 'Mietvertrag'
			}
		]}
	/>
	<ContractForm contract={data.contract} tenants={data.tenants} apartments={data.apartments} />
</div>
