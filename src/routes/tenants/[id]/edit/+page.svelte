<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Tenant } from '$lib/types';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import TenantForm from '../../TenantForm.svelte';
	import type { ActionData } from './$types';

	let { data, form }: { data: { tenant: Tenant }; form: ActionData } = $props();

	const name = $derived(`${data.tenant.firstName} ${data.tenant.lastName}`);
</script>

<svelte:head>
	<title>{m.tenants_edit_page_title({ name })} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title={m.tenants_edit_title()}
		purpose={m.tenants_edit_purpose({ name })}
		trail={[
			{ href: '/tenants', label: m.nav_tenants() },
			{ href: `/tenants/${data.tenant.id}`, label: name }
		]}
	/>
	<TenantForm
		tenant={data.tenant}
		errors={form?.errors}
		cancelHref="/tenants/{data.tenant.id}"
		submitLabel={m.buildings_save_changes()}
		submitIcon="save"
	/>
</div>
