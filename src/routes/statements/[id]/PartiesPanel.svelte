<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';

	// Whose statement for which apartment, each a way to its own page
	let { statement }: { statement: StatementWithDetails } = $props();

	const link =
		'inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4';
</script>

<Panel title={m.contracts_tenant_and_apartment()}>
	<dl class="flex flex-col gap-4">
		<div class="flex flex-col">
			<dt class="text-ink-muted">{m.contracts_tenant()}</dt>
			<dd>
				<a href="/tenants/{statement.tenantId}" class={link} data-testid="statement-tenant-link"
					>{statement.tenantName}</a
				>
				{#if statement.tenantEmail}<p class="min-w-0 break-all text-ink-muted">
						{statement.tenantEmail}
					</p>{/if}
			</dd>
		</div>
		<div class="flex flex-col">
			<dt class="text-ink-muted">{m.tenants_apartment()}</dt>
			<dd>
				<a
					href="/apartments/{statement.apartmentId}"
					class={link}
					data-testid="statement-apartment-link"
					>{m.buildings_apartment_number({ number: statement.apartmentUnit })}</a
				>
				<p class="text-ink">{statement.buildingName}</p>
				<p class="text-ink-muted">{statement.buildingAddress}</p>
			</dd>
		</div>
		<div class="flex flex-col">
			<dt class="text-ink-muted">{m.statements_rental_days_label()}</dt>
			<dd class="text-ink">{m.statements_rental_days({ days: statement.rentalDays })}</dd>
		</div>
	</dl>
</Panel>
