<script lang="ts">
	import type { StatementDocument } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';

	// What became of the Mahnung just sent: e-mailed, or waiting as a letter in the documents
	let { reminder }: { reminder?: { document: StatementDocument; deliveryError?: string } } =
		$props();

	const message = $derived.by(() => {
		if (!reminder) return '';
		const { document, deliveryError } = reminder;
		if (deliveryError) {
			return `${document.title}: ${deliveryError} Sie liegt in den Dokumenten zum Versand bereit.`;
		}
		return document.channel === 'email'
			? `${document.title} wurde per E-Mail versendet.`
			: `${document.title} liegt als Brief zum Ausdrucken in den Dokumenten bereit.`;
	});
</script>

<div role="status">
	{#if reminder}
		<Alert
			tone={reminder.deliveryError ? 'caution' : 'positive'}
			title={reminder.deliveryError ? 'E-Mail nicht zugestellt' : 'Mahnung erstellt'}
		>
			<p data-testid="reminder-feedback">{message}</p>
		</Alert>
	{/if}
</div>
