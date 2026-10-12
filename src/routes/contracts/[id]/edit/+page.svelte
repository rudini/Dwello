<script lang="ts">
	import { m } from '$lib/paraglide/messages';
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
	<title>{m.contracts_edit_title()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title={m.contracts_edit_title()}
		purpose={m.contracts_edit_purpose()}
		trail={[
			{ href: '/contracts', label: m.nav_contracts() },
			{
				href: `/contracts/${data.contract.id}`,
				label: tenant ? m.apartments_contract_of({ name: tenant }) : m.contracts_title()
			}
		]}
	/>
	<ContractForm contract={data.contract} tenants={data.tenants} apartments={data.apartments} />
</div>
