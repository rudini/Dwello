<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Apartment, Building, Tenant } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';
	import { roomsLabel } from '$lib/apartment';
	import { normalizeDecimal } from '$lib/utils/format';

	// Who rents and what: each named by a link to its own page
	let {
		tenant,
		apartment,
		building
	}: { tenant: Tenant; apartment: Apartment; building: Building } = $props();

	const link = 'font-semibold text-accent underline underline-offset-4 hover:text-accent-strong';
</script>

<Panel title={m.contracts_tenant()}>
	<dl class="flex flex-col gap-4">
		<div>
			<dt class="text-ink-muted">{m.contracts_name()}</dt>
			<dd>
				<a href="/tenants/{tenant.id}" class={link} data-testid="contract-tenant-link"
					>{tenant.firstName} {tenant.lastName}</a
				>
			</dd>
		</div>
		<div>
			<dt class="text-ink-muted">{m.tenants_email()}</dt>
			<dd class="text-ink">
				{#if tenant.email}
					<a href="mailto:{tenant.email}" class={link} data-testid="tenant-email-link"
						>{tenant.email}</a
					>
				{:else}
					{m.tenants_no_email()}
				{/if}
			</dd>
		</div>
		{#if tenant.phone}
			<div>
				<dt class="text-ink-muted">{m.tenants_phone()}</dt>
				<dd>
					<a href="tel:{tenant.phone}" class={link} data-testid="tenant-phone-link"
						>{tenant.phone}</a
					>
				</dd>
			</div>
		{/if}
	</dl>
</Panel>

<Panel title={m.tenants_apartment()}>
	<dl class="flex flex-col gap-4">
		<div>
			<dt class="text-ink-muted">{m.tenants_apartment()}</dt>
			<dd data-testid="contract-apartment">
				<a href="/apartments/{apartment.id}" class={link} data-testid="contract-apartment-link"
					>{m.buildings_apartment_number({ number: apartment.number })}</a
				>
				<span class="text-ink"
					>· {roomsLabel(normalizeDecimal(String(apartment.rooms)))} · {normalizeDecimal(
						String(apartment.area)
					)} m²</span
				>
			</dd>
		</div>
		<div>
			<dt class="text-ink-muted">{m.apartments_building()}</dt>
			<dd class="text-ink">
				{building.name || building.address}<br />
				<span class="text-ink-muted">{building.address}, {building.postalCode} {building.city}</span
				>
			</dd>
		</div>
	</dl>
</Panel>
