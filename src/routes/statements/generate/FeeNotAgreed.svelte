<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { api } from '$lib/api';
	import Alert from '$lib/ui/Alert.svelte';

	// Step 3: the run's contracts without an agreed Verwaltungspauschale get none (#89, Art. 257a Abs. 2 OR); each
	// leads to its contract, where the landlord records what the signed contract says
	let { buildingIds, period }: { buildingIds: string[]; period: { start: string; end: string } } =
		$props();

	type Contract = { id: string; tenantName: string; apartmentNumber: string };
	let contracts = $state<Contract[]>([]);
	$effect(() => {
		api
			.get<{ withoutFee: Contract[] }[]>('/statements/billed', {
				buildingIds: buildingIds.join(','),
				periodStart: period.start,
				periodEnd: period.end
			})
			.then(({ data }) => (contracts = data?.flatMap((row) => row.withoutFee) ?? []));
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
