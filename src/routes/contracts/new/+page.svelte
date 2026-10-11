<script lang="ts">
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import ContractWizard from './ContractWizard.svelte';

	interface PageData {
		tenants: { id: string; name: string; place?: string }[];
		apartments: { id: string; unit: string; building: string; status: string }[];
	}
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Neuer Mietvertrag - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Neuer Mietvertrag"
		purpose="Erfassen Sie Schritt für Schritt, wer welche Wohnung ab wann zu welcher Miete mietet."
		trail={[{ href: '/contracts', label: 'Mietverträge' }]}
	/>
	<ContractWizard tenants={data.tenants} apartments={data.apartments} />
</div>
