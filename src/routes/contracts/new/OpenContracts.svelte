<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';

	// Contracts of the chosen tenant without a Vertragsende: one not ended before a move (#156); only a hint, a
	// tenant may rent two apartments
	let {
		name,
		contracts
	}: { name: string; contracts: { id: string; apartment: { unit: string; building: string } }[] } =
		$props();
</script>

{#each contracts as open (open.id)}
	<Alert
		tone="info"
		title={m.contracts_open_contract_title({ name })}
		testid="tenant-running-contract"
	>
		<p>
			{m.contracts_open_contract_text({
				name,
				apartment: open.apartment.unit,
				building: open.apartment.building
			})}
		</p>
		<a
			href="/contracts/{open.id}"
			class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4 hover:text-accent-strong"
			>{m.contracts_open_contract_link({ apartment: open.apartment.unit })}</a
		>
	</Alert>
{/each}
