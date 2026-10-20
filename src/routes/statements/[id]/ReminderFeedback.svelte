<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { deliveryErrorText } from '$lib/backend-error';
	import type { StatementDocument } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';

	// What became of the Mahnung just sent: e-mailed, or waiting as a letter in the documents
	let { reminder }: { reminder?: { document: StatementDocument; deliveryError?: string } } =
		$props();

	const message = $derived.by(() => {
		if (!reminder) return '';
		const { document, deliveryError } = reminder;
		if (deliveryError) {
			const reason = deliveryErrorText({ ...document, deliveryError });
			return m.statements_reminder_undelivered({ title: document.title, reason });
		}
		return document.channel === 'email'
			? m.statements_reminder_emailed({ title: document.title })
			: m.statements_reminder_letter({ title: document.title });
	});
</script>

<!-- empty: no gap in the page's column (gap-8), but still in the accessibility tree, so a message is announced -->
<div role="status" class="empty:-mt-8">
	{#if reminder}
		<Alert
			tone={reminder.deliveryError ? 'caution' : 'positive'}
			title={reminder.deliveryError
				? m.statements_email_not_delivered()
				: m.statements_reminder_created()}
		>
			<p data-testid="reminder-feedback">{message}</p>
		</Alert>
	{/if}
</div>
