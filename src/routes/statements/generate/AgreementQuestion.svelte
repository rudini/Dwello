<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { api } from '$lib/api';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';

	// One question of step 3 (#91): does the contract agree this category? The answer is stored on the contract at once
	let {
		contractId,
		categoryId,
		legend,
		error,
		onsaved
	}: {
		contractId: string;
		categoryId: string;
		legend: string;
		error?: string; // «Weiter» without an answer
		onsaved: (saved: boolean) => void;
	} = $props();

	let answer = $state('');
	let saved = $state(false);
	let failed = $state(false);
	const shownError = $derived(
		failed ? m.statements_agreement_save_failed() : answer ? undefined : error
	);
	const key = $derived(`${contractId}-${categoryId}`);

	async function choose(value: string) {
		answer = value;
		saved = failed = false;
		onsaved(false);
		const stored = await api.put(`/contracts/${contractId}/agreements`, {
			categoryId,
			agreed: value === 'yes'
		});
		if (stored.error) answer = '';
		saved = !stored.error;
		failed = !!stored.error;
		onsaved(saved);
	}

	const options = [
		{ value: 'yes', label: m.statements_agreement_yes() },
		{ value: 'no', label: m.statements_agreement_no() }
	];
</script>

<RadioGroup
	name="agreement-{key}"
	{legend}
	{options}
	bind:value={() => answer, choose}
	error={shownError}
	testid="agreement-{key}"
/>
<p role="status" class="text-ink-muted" data-testid="agreement-saved-{key}">
	{saved ? m.statements_agreement_saved() : ''}
</p>
