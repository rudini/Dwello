<script lang="ts">
	import { periodQuery } from '$lib/accounting-period';
	import { m } from '$lib/paraglide/messages';
	import { api } from '$lib/api';
	import Alert from '$lib/ui/Alert.svelte';

	// Step 3: the run's contracts without an agreed Verwaltungspauschale get none (#89, Art. 257a Abs. 2 OR); each
	// leads to its contract, where the landlord records what the signed contract says
	let {
		buildingIds,
		period,
		loading = $bindable(false),
		noted = $bindable(false)
	}: {
		buildingIds: string[];
		period: { start: string; end: string };
		loading?: boolean; // until the contracts are known (#468)
		noted?: boolean; // it names contracts (#470)
	} = $props();

	type Contract = { id: string; tenantName: string; apartmentNumber: string };
	let contracts = $state<Contract[]>([]);
	$effect(() => {
		loading = true;
		let left = false; // an answer to a step left meanwhile must not unlock the one opened anew
		api
			.get<{ withoutFee: Contract[] }[]>('/statements/billed', {
				buildingIds: buildingIds.join(','),
				...periodQuery(period)
			})
			.then(({ data }) => {
				if (left) return;
				contracts = data?.flatMap((row) => row.withoutFee) ?? [];
				noted = contracts.length > 0;
				loading = false;
			});
		return () => {
			left = true;
			loading = false; // left before the answer came
		};
	});
</script>

{#if contracts.length}
	<Alert title={m.statements_fee_not_agreed_title()} testid="management-fee-not-agreed">
		<p>{m.statements_fee_not_agreed_text()}</p>
		<ul class="flex flex-col gap-2">
			{#each contracts as contract (contract.id)}
				<li>
					<a
						href="/contracts/{contract.id}"
						class="font-semibold text-accent underline underline-offset-4"
						data-testid="management-fee-not-agreed-link-{contract.id}"
						>{m.statements_fee_not_agreed_item({
							tenant: contract.tenantName,
							apartment: contract.apartmentNumber
						})}</a
					>
				</li>
			{/each}
		</ul>
	</Alert>
{/if}
