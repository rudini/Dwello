<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import { apartmentName } from '$lib/contract-form';

	// Contracts of the chosen tenant without a Vertragsende: one not ended before a move (#156); only a hint, a
	// tenant may rent two apartments; each names the tenant, the one chosen
	let {
		contracts
	}: {
		contracts: { id: string; tenant: string; apartment: { unit: string; building: string } }[];
	} = $props();
</script>

<!-- always present: the hint may appear once the contracts are loaded, and is read out then (review W10 C-2) -->
<div role="status" class="flex flex-col gap-4">
	{#each contracts as open (open.id)}
		<!-- the apartment and the contract named like the hint on a cleared apartment (#1288) -->
		{@const names = {
			name: open.tenant,
			apartment: apartmentName(open.apartment.unit, open.apartment.building)
		}}
		<Alert
			tone="info"
			title={m.contracts_open_contract_title({ name: open.tenant })}
			testid="tenant-running-contract"
		>
			<p>{m.contracts_open_contract_text(names)}</p>
			<a
				href="/contracts/{open.id}"
				class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4 hover:text-accent-strong"
				>{m.contracts_overlap_link({ tenant: open.tenant, apartment: names.apartment })}</a
			>
		</Alert>
	{/each}
</div>
