<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { StatementWithDetails } from '$lib/types';
	import { formatCurrency } from '$lib/utils/format';

	let {
		open = $bindable(),
		statement,
		sentReminders
	}: { open: boolean; statement: StatementWithDetails; sentReminders: number } = $props();

	const TITLES = ['Zahlungserinnerung', '2. Mahnung', '3. Mahnung'];
	const next = $derived(TITLES[sentReminders]);
	const byEmail = $derived(statement.tenantCorrespondenceChannel === 'email');
</script>

<Modal {open} title="Mahnung senden" onclose={() => (open = false)}>
	{#if next}
		<p class="text-gray-600 mb-4" data-testid="reminder-delivery-info">
			{#if byEmail}
				Die {next} wird als PDF erstellt und per E-Mail an {statement.tenantEmail} gesendet.
			{:else}
				Die {next} wird als PDF erstellt und als Brief zum Ausdrucken in den Dokumenten abgelegt.
			{/if}
		</p>
		<div class="p-3 bg-gray-50 rounded-lg mb-4">
			<p class="font-medium text-gray-900">{statement.tenantName}</p>
			<p class="text-lg font-bold text-critical mt-2">
				Offen: {formatCurrency(Math.abs(statement.balance))}
			</p>
		</div>
	{:else}
		<p class="text-gray-600 mb-4">Es wurden bereits 3 Mahnungen versendet.</p>
	{/if}
	<form
		method="POST"
		action="?/remind"
		use:enhance={() =>
			async ({ update }) => {
				await update();
				open = false;
			}}
		class="flex justify-end gap-3"
	>
		<Button variant="secondary" onclick={() => (open = false)}>Abbrechen</Button>
		<Button type="submit" variant="primary" disabled={!next} testid="statement-reminder-confirm">
			<Icon name="send" size={20} />
			{next ?? 'Mahnung'} senden
		</Button>
	</form>
</Modal>
