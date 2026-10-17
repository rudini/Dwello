<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { api } from '$lib/api';
	import Alert from '$lib/ui/Alert.svelte';
	import AgreementQuestion from './AgreementQuestion.svelte';

	// Step 3 (#91, Art. 257a Abs. 2 OR): per contract of the run, whether a category with costs in the period and no
	// answer yet is agreed; each answer is stored on the contract at once. Contracts that do not agree some of the
	// period's Nebenkosten are named, each a link to it
	let {
		buildingIds,
		period,
		unanswered = $bindable(0),
		error
	}: {
		buildingIds: string[];
		period: { start: string; end: string };
		unanswered?: number;
		error?: string; // «Weiter» with questions not answered
	} = $props();

	type Category = { categoryId: string; name: string };
	type Contract = {
		contractId: string;
		tenantName: string;
		apartmentNumber: string;
		open: Category[];
		notAgreed: Category[];
	};
	let contracts = $state<Contract[]>([]);
	let saved = $state<Record<string, boolean>>({}); // per contract and category: the answer is stored
	const key = (contractId: string, categoryId: string) => `${contractId}-${categoryId}`;

	$effect(() => {
		api
			.get<Contract[]>('/statements/agreements', {
				buildingIds: buildingIds.join(','),
				periodStart: period.start,
				periodEnd: period.end
			})
			.then(({ data }) => (contracts = data ?? []));
	});

	const asked = $derived(contracts.filter((contract) => contract.open.length));
	const notAgreed = $derived(contracts.filter((contract) => contract.notAgreed.length));
	$effect(() => {
		unanswered = asked
			.flatMap((contract) => contract.open.map((c) => key(contract.contractId, c.categoryId)))
			.filter((k) => !saved[k]).length;
	});
</script>

{#if asked.length}
	<!-- TODO(fachlich prüfen, #369): the term «Vereinbarte Nebenkosten» -->
	<!-- TODO(fachlich prüfen, #368): an agreement from a date (Art. 269d OR), until then the help text -->
	<Alert tone="caution" title={m.statements_agreements_title()} testid="agreement-questions">
		<p>{m.statements_agreements_text()}</p>
		{#each asked as contract (contract.contractId)}
			<div class="flex flex-col gap-4" data-testid="agreement-contract-{contract.contractId}">
				{#each contract.open as category (category.categoryId)}
					<AgreementQuestion
						contractId={contract.contractId}
						categoryId={category.categoryId}
						legend={m.statements_agreement_question({
							category: category.name,
							tenant: contract.tenantName,
							apartment: contract.apartmentNumber
						})}
						{error}
						onsaved={(stored) => (saved[key(contract.contractId, category.categoryId)] = stored)}
					/>
				{/each}
			</div>
		{/each}
	</Alert>
{/if}

{#if notAgreed.length}
	<Alert title={m.statements_not_agreed_title()} testid="not-agreed-costs">
		<p>{m.statements_not_agreed_text()}</p>
		<ul class="flex flex-col gap-2">
			{#each notAgreed as contract (contract.contractId)}
				<li>
					<a
						href="/contracts/{contract.contractId}"
						class="font-semibold text-accent underline underline-offset-4"
						data-testid="not-agreed-costs-link-{contract.contractId}"
						>{m.statements_not_agreed_item({
							tenant: contract.tenantName,
							apartment: contract.apartmentNumber,
							categories: contract.notAgreed.map((category) => category.name).join(', ')
						})}</a
					>
				</li>
			{/each}
		</ul>
	</Alert>
{/if}
