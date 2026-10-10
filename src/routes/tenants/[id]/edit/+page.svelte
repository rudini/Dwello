<script lang="ts">
	import type { Tenant } from '$lib/types';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import TenantForm from '../../TenantForm.svelte';
	import type { ActionData } from './$types';

	let { data, form }: { data: { tenant: Tenant }; form: ActionData } = $props();

	const name = $derived(`${data.tenant.firstName} ${data.tenant.lastName}`);
</script>

<svelte:head>
	<title>{name} bearbeiten - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8">
	<PageHeader
		title="Mieter bearbeiten"
		purpose="Kontaktdaten, Korrespondenzkanal und Sprache von {name}."
		trail={[
			{ href: '/tenants', label: 'Mieter' },
			{ href: `/tenants/${data.tenant.id}`, label: name }
		]}
	/>
	<TenantForm
		tenant={data.tenant}
		errors={form?.errors}
		cancelHref="/tenants/{data.tenant.id}"
		submitLabel="Änderungen speichern"
		submitIcon="save"
	/>
</div>
