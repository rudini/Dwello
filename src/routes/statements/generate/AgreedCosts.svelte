<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { api } from '$lib/api';
	import Alert from '$lib/ui/Alert.svelte';
	import AgreementsCheck from './AgreementsCheck.svelte';
	import AgreementQuestion from './AgreementQuestion.svelte';

	// Step 3 (#91, Art. 257a Abs. 2 OR): per contract of the run, whether a category with costs in the period and no
	// answer yet is agreed; each answer is stored on the contract at once. Contracts that do not agree some of the
	// period's Nebenkosten are named, each a link to it
	let {
		buildingIds,
		period,
		blocking = $bindable(false),
		loading = $bindable(false),
		noted = $bindable(false),
		error
	}: {
		buildingIds: string[];
		period: { start: string; end: string };
		blocking?: boolean; // «Weiter» waits: questions loading, not loaded or not answered (code review W10c C-1)
		loading?: boolean; // the questions are not loaded yet (#468)
		noted?: boolean; // it asks, names contracts or could not check (#470)
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
	let status = $state<'loading' | 'loaded' | 'failed'>('loading');
	let attempt = $state(0); // «Erneut versuchen» loads again
	let saved = $state<Record<string, boolean>>({}); // per contract and category: the answer is stored
	const key = (contractId: string, categoryId: string) => `${contractId}-${categoryId}`;

	$effect(() => {
		void attempt;
		status = 'loading';
		api
			.get<Contract[]>('/statements/agreements', {
				buildingIds: buildingIds.join(','),
				periodStart: period.start,
				periodEnd: period.end
			})
			.then(({ data }) => {
				contracts = Array.isArray(data) ? data : [];
				status = Array.isArray(data) ? 'loaded' : 'failed';
			});
	});

	const asked = $derived(contracts.filter((contract) => contract.open.length));
	const notAgreed = $derived(contracts.filter((contract) => contract.notAgreed.length));
	$effect(() => {
		noted = status === 'failed' || asked.length > 0 || notAgreed.length > 0;
	});
	$effect(() => {
		loading = status === 'loading';
		return () => (loading = false); // left before the answer came
	});
	$effect(() => {
		blocking =
			status !== 'loaded' ||
			asked.some((contract) =>
				contract.open.some((c) => !saved[key(contract.contractId, c.categoryId)])
			);
	});
</script>

<AgreementsCheck {status} {error} onretry={() => attempt++} />

{#if asked.length}
	<Alert tone="caution" title={m.statements_agreements_title()} testid="agreement-questions">
		<p>{m.statements_agreements_text()}</p>
		{#each asked as contract (contract.contractId)}
			<div class="flex flex-col gap-4" data-testid="agreement-contract-{contract.contractId}">
				{#each contract.open as category (category.categoryId)}
					<AgreementQuestion
						contractId={contract.contractId}
						categoryId={category.categoryId}
						category={category.name}
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
