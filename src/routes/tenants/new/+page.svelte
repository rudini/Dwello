<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import TenantForm from '../TenantForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	// Opened from the rental contract wizard, which continues with the new tenant
	const forContract = $derived($page.url.searchParams.get('for') === 'contract');
</script>

<svelte:head>
	<title>Neuer Mieter - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Neuer Mieter"
		purpose="Erfassen Sie Name, Kontaktdaten und Korrespondenzkanal des Mieters.{forContract
			? ' Danach geht es mit dem Mietvertrag weiter.'
			: ''}"
		trail={[{ href: '/tenants', label: 'Mieter' }]}
	/>
	<TenantForm
		errors={form?.errors}
		{forContract}
		cancelHref={forContract ? '/contracts/new' : '/tenants'}
		submitLabel="Mieter erfassen"
		submitIcon="user-add"
	/>
</div>
