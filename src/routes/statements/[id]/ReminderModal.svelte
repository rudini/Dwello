<script lang="ts">
	import type { StatementWithDetails } from '$lib/types';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import FormDialog from './FormDialog.svelte';

	// Before a Mahnung: which one comes next, how it reaches the tenant, and the amount still open
	let {
		open = $bindable(),
		statement,
		sentReminders
	}: { open: boolean; statement: StatementWithDetails; sentReminders: number } = $props();

	const TITLES = ['Zahlungserinnerung', '2. Mahnung', '3. Mahnung'];
	const next = $derived(TITLES[sentReminders]);
	const byEmail = $derived(statement.tenantCorrespondenceChannel === 'email');
</script>

{#if next}
	<FormDialog
		bind:open
		action="?/remind"
		title="Mahnung senden"
		confirmLabel="{next} senden"
		confirmTestid="statement-reminder-confirm"
	>
		<p data-testid="reminder-delivery-info">
			{#if byEmail}
				Dwello erstellt die {next} als PDF und schickt sie per E-Mail an {statement.tenantEmail}.
			{:else}
				Dwello erstellt die {next} als PDF und legt sie unter «Dokumente» bereit. Drucken Sie den Brief
				aus und schicken Sie ihn per Post.
			{/if}
		</p>
		<p class="rounded-panel bg-sunken p-4 text-ink">
			{statement.tenantName} schuldet noch
			<strong class="tabular-nums">{formatCurrency(Math.abs(statement.balance))}</strong>.
		</p>
	</FormDialog>
{:else}
	<!-- TODO(fachlich prüfen): what follows after the 3rd Mahnung (e.g. Betreibung) is not part of Dwello -->
	<Dialog
		bind:open
		title="Keine weitere Mahnung möglich"
		confirmLabel="Verstanden"
		confirmTestid="statement-reminder-confirm"
		onconfirm={() => (open = false)}
	>
		<p>
			Es wurden bereits 3 Mahnungen versendet. Dwello erstellt keine weitere. Klären Sie das weitere
			Vorgehen direkt mit dem Mieter.
		</p>
	</Dialog>
{/if}
