<script lang="ts">
	import { m } from '$lib/paraglide/messages';
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
				addToast('success', m.statements_marked_sent());
				await tick(); // after the dialog has handed the focus back
				document.querySelector<HTMLElement>('h1')?.focus(); // "Als versendet markieren" is gone now
			}
		};
	}}
></form>

<Dialog
	bind:open
	title={m.statements_mark_sent_title()}
	confirmLabel={m.statements_mark_sent()}
	busy={sending}
	busyLabel={m.ui_saving()}
	confirmTestid="statement-send-confirm"
	onconfirm={() => form?.requestSubmit()}
>
	<p>{m.statements_send_text_1()}</p>
	<p>{m.statements_send_text_2()}</p>
	<dl class="flex flex-col gap-2 rounded-panel bg-sunken p-4" data-testid="send-recipient">
		<div class="flex flex-wrap gap-x-2">
			<dt class="text-ink-muted">{m.statements_recipient()}</dt>
			<dd class="font-semibold text-ink">{statement.tenantName}</dd>
		</div>
		<div class="flex flex-wrap gap-x-2">
			<dt class="text-ink-muted">{m.statements_channel()}</dt>
			<dd class="text-ink">
				{byEmail ? m.tenants_channel_email() : m.tenants_channel_letter()},
				{(byEmail ? statement.tenantEmail : statement.tenantAddress) ||
					(byEmail ? m.statements_no_email() : m.statements_no_address())}
			</dd>
		</div>
	</dl>
	<div>
		<Button
			href="/statements/{statement.id}/pdf?ansehen"
			target="_blank"
			icon="document"
			testid="send-pdf-view">{m.statements_view_pdf()}</Button
		>
	</div>
</Dialog>
