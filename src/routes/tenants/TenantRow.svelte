<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { TenantWithOccupancy } from '$lib/types';
	import Badge from '$lib/ui/Badge.svelte';
	import { formatDate } from '$lib/utils/format';

	// One tenant in the list: the name opens it, the whole row is its link
	let { tenant }: { tenant: TenantWithOccupancy } = $props();

	const contact = $derived([tenant.email, tenant.phone].filter(Boolean).join(' · '));
</script>

<li
	class="relative flex flex-col gap-2 px-6 py-4 hover:bg-sunken md:flex-row md:items-center md:gap-6"
	data-testid="tenant-card-{tenant.id}"
>
	<div class="flex min-w-0 flex-col gap-1 md:w-1/3">
		<a
			href="/tenants/{tenant.id}"
			class="font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0"
			>{tenant.firstName} {tenant.lastName}</a
		>
		{#if contact}<span class="break-words text-ink-muted">{contact}</span>{/if}
	</div>
	<span class="text-ink md:flex-1">
		{tenant.currentApartment && tenant.currentBuilding
			? `${tenant.currentApartment} - ${tenant.currentBuilding}`
			: tenant.nextContractStart
				? m.tenants_contract_from({ date: formatDate(tenant.nextContractStart) })
				: m.tenants_no_rent()}
	</span>
	{#if tenant.isActive}
		<span><Badge tone="positive" label={m.tenants_active()} testid="tenant-status" /></span>
	{:else if tenant.isFuture}
		<span><Badge tone="info" label={m.tenants_future()} testid="tenant-status" /></span>
	{/if}
</li>
