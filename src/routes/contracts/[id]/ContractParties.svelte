<script lang="ts">
	import type { Apartment, Building, Tenant } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';
	import { normalizeDecimal } from '$lib/utils/format';

	// Who rents and what: each named by a link to its own page
	let {
		tenant,
		apartment,
		building
	}: { tenant: Tenant; apartment: Apartment; building: Building } = $props();

	const link = 'font-semibold text-accent underline underline-offset-4 hover:text-accent-strong';
</script>

<Panel title="Mieter">
	<dl class="flex flex-col gap-4">
		<div>
			<dt class="text-ink-muted">Name</dt>
			<dd>
				<a href="/tenants/{tenant.id}" class={link} data-testid="contract-tenant-link"
					>{tenant.firstName} {tenant.lastName}</a
				>
			</dd>
		</div>
		<div>
			<dt class="text-ink-muted">E-Mail</dt>
			<dd class="text-ink">
				{#if tenant.email}
					<a href="mailto:{tenant.email}" class={link} data-testid="tenant-email-link"
						>{tenant.email}</a
					>
				{:else}
					Keine E-Mail-Adresse erfasst
				{/if}
			</dd>
		</div>
		{#if tenant.phone}
			<div>
				<dt class="text-ink-muted">Telefon</dt>
				<dd>
					<a href="tel:{tenant.phone}" class={link} data-testid="tenant-phone-link"
						>{tenant.phone}</a
					>
				</dd>
			</div>
		{/if}
	</dl>
</Panel>

<Panel title="Wohnung">
	<dl class="flex flex-col gap-4">
		<div>
			<dt class="text-ink-muted">Wohnung</dt>
			<dd data-testid="contract-apartment">
				<a href="/apartments/{apartment.id}" class={link} data-testid="contract-apartment-link"
					>Wohnung {apartment.number}</a
				>
				<span class="text-ink"
					>· {normalizeDecimal(String(apartment.rooms))} Zimmer · {normalizeDecimal(
						String(apartment.area)
					)} m²</span
				>
			</dd>
		</div>
		<div>
			<dt class="text-ink-muted">Gebäude</dt>
			<dd class="text-ink">
				{building.name || building.address}<br />
				<span class="text-ink-muted">{building.address}, {building.postalCode} {building.city}</span
				>
			</dd>
		</div>
	</dl>
</Panel>
