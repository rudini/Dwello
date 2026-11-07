<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';

	// #690: a Zahlteil (of a PDF, a Mahnung) needs the Firmenadresse the stored IBAN lacks; the warning comes before
	// the refusal and leads where to enter it
	let { shown }: { shown: boolean } = $props();
</script>

{#if shown}
	<Alert
		tone="caution"
		title={m.backend_creditor_address_missing()}
		testid="statement-creditor-missing"
	>
		<a
			href="/config#sender"
			class="text-accent underline underline-offset-4 hover:text-accent-strong"
			data-testid="statement-creditor-missing-settings">{m.documents_to_settings()}</a
		>
	</Alert>
{/if}
