<script lang="ts">
	import type { StatementDocument } from '$lib/types';

	let { reminder }: { reminder?: { document: StatementDocument; deliveryError?: string } } =
		$props();

	const tone = $derived(
		reminder?.deliveryError
			? 'bg-amber-50 border-amber-200 text-caution'
			: 'bg-green-50 border-green-200 text-green-800'
	);

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

{#if message}
	<p class="p-3 rounded-lg border text-sm {tone}" data-testid="reminder-feedback">
		{message}
	</p>
{/if}
