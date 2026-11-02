<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementDocument } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import DeliveryFailure from '../../documents/DeliveryFailure.svelte';

	// What became of the Mahnung just sent: e-mailed, or waiting as a letter in the documents
	let { reminder }: { reminder?: { document: StatementDocument; deliveryError?: string } } =
		$props();

	const message = $derived.by(() => {
		if (!reminder) return '';
		const { document, deliveryError } = reminder;
		if (deliveryError) return m.statements_reminder_undelivered({ title: document.title });
		return document.channel === 'email'
			? m.statements_reminder_emailed({ title: document.title })
			: m.statements_reminder_letter({ title: document.title });
	});
</script>

<!-- empty: no gap in the page's column (gap-8), but still in the accessibility tree, so a message is announced -->
<div role="status" class="empty:-mt-8" data-testid="reminder-feedback-box">
	{#if reminder}
		<Alert
			tone={reminder.deliveryError ? 'caution' : 'positive'}
			title={reminder.deliveryError
				? m.statements_email_not_delivered()
				: m.statements_reminder_created()}
		>
			<p data-testid="reminder-feedback">{message}</p>
			<!-- #736: the address it went to, the way to the tenant and to «Dokumente» -->
			{#if reminder.deliveryError}
				<DeliveryFailure
					document={{ ...reminder.document, deliveryError: reminder.deliveryError }}
				/>
			{/if}
		</Alert>
	{/if}
</div>
