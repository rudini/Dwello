<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { periodDays } from '$lib/accounting-period';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatDate } from '$lib/utils/format';

	// #1036 (Option 1): the letter for the tenants' consent from the day of the change, while the short
	// Abrechnungsperiode still runs; once it ended, the missing statement offers it (#521)
	let {
		consent
	}: { consent: { start: string; short: { start: string; end: string }; letter: string } | null } =
		$props();
</script>

{#if consent}
	<Alert tone="caution" title={m.config_period_change_title()} testid="contract-consent">
		<p>
			{m.config_period_change_text({
				start: formatDate(consent.start),
				short: periodDays(consent.short)
			})}
		</p>
		{#snippet action()}
			<Button
				href={consent.letter}
				variant="ghost"
				icon="document-download"
				testid="contract-consent-letter">{m.contracts_consent_letter_download()}</Button
			>
		{/snippet}
	</Alert>
{/if}
