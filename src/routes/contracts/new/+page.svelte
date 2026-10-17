<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import ContractWizard from './ContractWizard.svelte';

	interface PageData {
		tenants: { id: string; name: string; place?: string }[];
		apartments: { id: string; unit: string; building: string; status: string }[];
		categories: { id: string; name: string }[];
	}
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{m.contracts_new_title()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title={m.contracts_new_title()}
		purpose={m.contracts_new_purpose()}
		trail={[{ href: '/contracts', label: m.nav_contracts() }]}
	/>
	<ContractWizard tenants={data.tenants} apartments={data.apartments} categories={data.categories} />
</div>
