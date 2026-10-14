<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { RentalContract } from '$lib/types';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import ContractForm from '../../ContractForm.svelte';

	interface PageData {
		contract: RentalContract;
		tenant: string;
		apartment: string;
	}

	let { data }: { data: PageData } = $props();
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
				label: m.apartments_contract_of({ name: data.tenant })
			}
		]}
	/>
	<ContractForm contract={data.contract} tenant={data.tenant} apartment={data.apartment} />
</div>
