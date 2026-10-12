<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import TenantForm from '../TenantForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	// Opened from the rental contract wizard, which continues with the new tenant
	const forContract = $derived($page.url.searchParams.get('for') === 'contract');
</script>

<svelte:head>
	<title>{m.tenants_new_title()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title={m.tenants_new_title()}
		purpose={m.tenants_new_purpose() + (forContract ? ` ${m.tenants_new_purpose_contract()}` : '')}
		trail={[{ href: '/tenants', label: m.nav_tenants() }]}
	/>
	<TenantForm
		errors={form?.errors}
		{forContract}
		cancelHref={forContract ? '/contracts/new' : '/tenants'}
		submitLabel={m.dashboard_add_tenant()}
		submitIcon="user-add"
	/>
</div>
