<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { api } from '$lib/api';
	import { backendMessage } from '$lib/backend-error';
	import DateInput from '$lib/ui/DateInput.svelte';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';

	// One question of step 3 (#91): does the contract agree this category? The answer is stored on the contract at once
	let {
		contractId,
		categoryId,
		category,
		legend,
		error,
		onsaved
	}: {
		contractId: string;
		categoryId: string;
		category: string;
		legend: string;
		error?: string; // «Weiter» without an answer
		onsaved: (saved: boolean) => void;
	} = $props();

	let answer = $state('');
	let day = $state(''); // #368: «Vereinbart ab», only an answer with the day (Fachreview 368-B V-2)
	let saved = $state(false);
	let failed = $state<string>();
	const noDay = $derived(answer === 'from' && !day);
	const shownError = $derived(
		failed ?? (!answer ? error : noDay && error ? m.statements_agreement_from_error() : undefined)
	);
	const key = $derived(`${contractId}-${categoryId}`);

	async function choose(value: string) {
		answer = value;
		saved = false;
		failed = undefined;
		onsaved(false);
		if (noDay) return;
		const stored = await api.put(`/contracts/${contractId}/agreements`, {
			categoryId,
			agreed: value !== 'no',
			...(value === 'from' && { from: day })
		});
		if (stored.error && value !== 'from') answer = '';
		saved = !stored.error;
		// a refused day says why (#368); any other failure only that it was not saved
		failed = stored.error?.code?.startsWith('AGREED_FROM_')
			? backendMessage({ code: stored.error.code, params: stored.error.params }, '')
			: stored.error && m.statements_agreement_save_failed();
		onsaved(saved);
	}

	function setDay(value: string) {
		if (value === day) return;
		day = value;
		choose('from');
	}

	const options = [
		{ value: 'yes', label: m.statements_agreement_yes() },
		{ value: 'from', label: m.statements_agreement_from() },
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
{#if answer === 'from'}
	<DateInput
		id="agreement-{key}-from-date"
		label={m.statements_agreement_from_date({ category })}
		bind:value={() => day, setDay}
		testid="agreement-{key}-from-date"
	/>
{/if}
<p role="status" class="text-ink-muted" data-testid="agreement-saved-{key}">
	{saved ? m.statements_agreement_saved() : ''}
</p>
