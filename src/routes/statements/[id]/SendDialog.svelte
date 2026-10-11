<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { addToast } from '$lib/stores';
	import type { StatementWithDetails } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';

	// Before "Versendet": Dwello sends nothing itself; the user delivers the PDF and then records it here
	let { open = $bindable(), statement }: { open: boolean; statement: StatementWithDetails } =
		$props();

	let form = $state<HTMLFormElement>();
	let sending = $state(false);
	const byEmail = $derived(statement.tenantCorrespondenceChannel === 'email');
</script>

<form
	bind:this={form}
	method="POST"
	action="?/send"
	use:enhance={() => {
		sending = true;
		return async ({ update, result }) => {
			await update();
			sending = false;
			open = false;
			if (result.type === 'success') {
				addToast('success', 'Abrechnung als versendet markiert');
				await tick(); // after the dialog has handed the focus back
				document.querySelector<HTMLElement>('h1')?.focus(); // "Versenden" is gone now
			}
		};
	}}
></form>

<Dialog
	bind:open
	title="Abrechnung als versendet markieren"
	confirmLabel="Als versendet markieren"
	busy={sending}
	busyLabel="Wird gespeichert …"
	confirmTestid="statement-send-confirm"
	onconfirm={() => form?.requestSubmit()}
>
	<p>
		Dwello verschickt die Abrechnung nicht selbst. Stellen Sie dem Mieter das PDF zu und markieren
		Sie die Abrechnung danach als versendet.
	</p>
	<p>
		Die Zahlungsfrist läuft ab dem Tag, an dem Sie die Abrechnung als versendet markieren. Stellen
		Sie das PDF deshalb am selben Tag zu.
	</p>
	<dl class="flex flex-col gap-2 rounded-panel bg-sunken p-4" data-testid="send-recipient">
		<div class="flex flex-wrap gap-x-2">
			<dt class="text-ink-muted">Empfänger:</dt>
			<dd class="font-semibold text-ink">{statement.tenantName}</dd>
		</div>
		<div class="flex flex-wrap gap-x-2">
			<dt class="text-ink-muted">Korrespondenzkanal:</dt>
			<dd class="text-ink">
				{byEmail ? 'Per E-Mail' : 'Per Brief'},
				{(byEmail ? statement.tenantEmail : statement.tenantAddress) ||
					(byEmail ? 'keine E-Mail-Adresse erfasst' : 'keine Postadresse erfasst')}
			</dd>
		</div>
	</dl>
	<div>
		<Button
			href="/statements/{statement.id}/pdf?ansehen"
			target="_blank"
			icon="document"
			testid="send-pdf-view">PDF ansehen</Button
		>
	</div>
</Dialog>
