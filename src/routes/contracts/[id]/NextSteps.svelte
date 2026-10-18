<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// What a notice asks for next (A-4): the next tenant until one is recorded, a new contract for a move within
	// the house (#156), always the new address for the final statement, after the end only that while the tenant
	// still has the building's address (A-5, #114)
	let {
		shown,
		apartmentId,
		tenantId,
		name
	}: {
		shown: { successor: boolean; ended: boolean } | null;
		apartmentId: string;
		tenantId: string;
		name: string;
	} = $props();
</script>

{#if shown}
	<Panel title={m.contracts_next_steps()}>
		<div class="flex flex-col gap-4" data-testid="contract-next-steps">
			<p class="text-ink">
				{shown.ended
					? m.contracts_next_steps_address({ name })
					: shown.successor
						? m.contracts_next_steps_text_successor({ name })
						: m.contracts_next_steps_text({ name })}
			</p>
			<div class="flex flex-wrap gap-4">
				{#if !shown.successor && !shown.ended}
					<Button href="/contracts/new?apartment={apartmentId}" icon="contract"
						>{m.contracts_next_successor()}</Button
					>
				{/if}
				{#if !shown.ended}
					<Button href="/contracts/new?tenant={tenantId}" icon="contract"
						>{m.contracts_new_for_tenant({ name })}</Button
					>
				{/if}
				<Button href="/tenants/{tenantId}/edit" icon="edit">{m.contracts_next_address()}</Button>
			</div>
		</div>
	</Panel>
{/if}
