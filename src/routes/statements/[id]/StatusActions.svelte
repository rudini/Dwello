<script lang="ts">
	import type { StatementWithDetails } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';

	// What the statement's status allows next: a draft is sent; a sent one is reminded or marked paid
	let {
		status,
		onremind,
		onmarkpaid,
		onsend
	}: {
		status: StatementWithDetails['status'];
		onremind: () => void;
		onmarkpaid: () => void;
		onsend: () => void;
	} = $props();
</script>

{#if status === 'sent' || status === 'overdue'}
	<Button onclick={onremind} icon="mail" testid="statement-reminder-button">Mahnung senden</Button>
	<Button variant="primary" onclick={onmarkpaid} icon="success" testid="statement-mark-paid-button"
		>Als bezahlt markieren</Button
	>
{:else if status === 'draft'}
	<Button variant="primary" onclick={onsend} icon="send" testid="statement-send-button"
		>Versenden</Button
	>
{/if}
