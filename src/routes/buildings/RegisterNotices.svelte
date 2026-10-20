<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';

	// What the Gebäuderegister said about the search and the chosen building (#479); `registered` marks that its data
	// are in the form. The region is always there, so a screen reader announces each hint as it appears
	let {
		outcome,
		existing,
		registered,
		apartmentCount
	}: {
		outcome: 'hits' | 'none' | 'unreachable';
		existing?: { id: string; name: string };
		registered: boolean;
		apartmentCount: number;
	} = $props();
</script>

<div class="flex flex-col gap-4" aria-live="polite" data-testid="building-register-notice">
	{#if outcome === 'none'}
		<Alert title={m.buildings_register_no_hit()} />
	{:else if outcome === 'unreachable'}
		<Alert tone="caution" title={m.buildings_register_unreachable()} />
	{/if}
	{#if existing}
		<Alert tone="caution" title={m.buildings_register_existing({ name: existing.name })}>
			{#snippet action()}
				<Button href="/buildings/{existing.id}" testid="building-register-existing-link">
					{m.buildings_register_existing_open({ name: existing.name })}
				</Button>
			{/snippet}
		</Alert>
	{/if}
	{#if registered}
		{#if !apartmentCount}<Alert title={m.buildings_register_no_apartments()} />{/if}
		<Alert title={m.buildings_register_only_apartments()} testid="building-register" />
	{/if}
</div>
