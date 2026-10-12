<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// What a notice asks for next (A-4); TODO(fachlich prüfen): «Nachmieter» is not in the glossary
	let {
		terminated,
		apartmentId,
		tenantId
	}: { terminated?: boolean; apartmentId: string; tenantId: string } = $props();
</script>

{#if terminated}
	<Panel title={m.contracts_next_steps()}>
		<div class="flex flex-col gap-4" data-testid="contract-next-steps">
			<p class="text-ink">{m.contracts_next_steps_text()}</p>
			<div class="flex flex-wrap gap-4">
				<Button href="/contracts/new?apartment={apartmentId}" icon="contract"
					>{m.contracts_next_successor()}</Button
				>
				<Button href="/tenants/{tenantId}/edit" icon="edit">{m.contracts_next_address()}</Button>
			</div>
		</div>
	</Panel>
{/if}
