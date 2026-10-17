<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';

	// #86: the e-mail did not go out; the statement stays a draft, it is sent again or delivered by letter
	let { error, onletter }: { error?: string; onletter: () => void } = $props();
</script>

<div role="status">
	{#if error}
		<Alert tone="caution" title={m.statements_send_not_sent()}>
			<p data-testid="send-feedback">{error}</p>
			<div>
				<Button onclick={onletter} icon="document" testid="statement-send-by-letter"
					>{m.statements_send_by_letter()}</Button
				>
			</div>
		</Alert>
	{/if}
</div>
