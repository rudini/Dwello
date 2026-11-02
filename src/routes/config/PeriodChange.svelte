<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { periodDays } from '$lib/accounting-period';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import type { PeriodChangeHint } from '$lib/server/settings';
	import { formatDate } from '$lib/utils/format';

	// #1036 (Option 1): after saving another Abrechnungsperiode, the contracts whose tenants must agree, each with its
	// letter; a new period that already began asks for the letter now (Fachreview 1036-1 V-1)
	let { change }: { change: PeriodChangeHint } = $props();
	const dates = $derived({ start: formatDate(change.start), short: periodDays(change.short) });
</script>

<Alert tone="caution" title={m.config_period_change_title()} testid="settings-period-change">
	<p>
		{change.started
			? m.config_period_change_text_started(dates)
			: m.config_period_change_text(dates)}
	</p>
	{#if change.contracts.length}
		<p>{m.config_period_change_list()}</p>
		<ul class="flex flex-col gap-2">
			{#each change.contracts as contract (contract.id)}
				<li class="flex flex-col gap-1">
					<span>{m.config_period_change_contract(contract)}</span>
					<Button
						href={contract.letter}
						variant="ghost"
						icon="document-download"
						testid="settings-period-change-letter-{contract.id}"
						>{m.statements_consent_letter_download_of(contract)}</Button
					>
				</li>
			{/each}
		</ul>
	{/if}
</Alert>
