<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { backendMessage } from '$lib/backend-error';
	import Alert from '$lib/ui/Alert.svelte';

	// #690: a Zahlteil (of a PDF, a Mahnung) needs the address the stored IBAN's settings lack, named by the backend's
	// code (the Kontoinhaber's or the Absender's, persona Weber 690 W-1, W-2); the warning comes before the refusal and
	// leads where to enter it
	let { code }: { code: string | null } = $props();
</script>

{#if code}
	<Alert
		tone="caution"
		title={backendMessage({ code }, m.backend_creditor_address_missing())}
		testid="statement-creditor-missing"
	>
		<a
			href="/config#sender"
			class="text-accent underline underline-offset-4 hover:text-accent-strong"
			data-testid="statement-creditor-missing-settings">{m.documents_to_settings()}</a
		>
	</Alert>
{/if}
