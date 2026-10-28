<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { addToast } from '$lib/stores';
	import type { StatementWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import OldAddressWarning from './OldAddressWarning.svelte';

	// Before "Versendet": to a tenant who wants e-mail Dwello sends the PDF itself (#86); for a letter, also instead of a
	// failed e-mail (byLetter), the user delivers the PDF and then records it here
	let {
		open = $bindable(),
		statement,
		byLetter = false,
		outdated,
		onrecalculate
	}: {
		open: boolean;
		statement: StatementWithDetails;
		byLetter?: boolean;
		outdated?: string; // what changed since a draft was created, as sentences: it is not current (#547, #506)
		onrecalculate?: () => void;
	} = $props();

	let form = $state<HTMLFormElement>();
	let sending = $state(false);
	// the letter instead of the e-mail, for this statement only: the Korrespondenzkanal stays (#449, decided in #404,
	// point 6); without an e-mail address the letter is the only way
	let instead = $state(false);
	$effect(() => {
		if (!open) instead = false;
	});
	const noEmail = $derived(statement.tenantCorrespondenceChannel === 'email' && !statement.tenantEmail);
	const letterForEmail = $derived(byLetter || instead || noEmail);
	const byEmail = $derived(statement.tenantCorrespondenceChannel === 'email' && !letterForEmail);
	// the dialog's words: sending by e-mail, or recording a letter as sent
	const words = $derived(
		byEmail
			? {
					title: m.statements_send_email_title(),
					confirm: m.statements_send_email(),
					busy: m.ui_sending(),
					done: m.statements_emailed()
				}
			: {
					title: m.statements_mark_sent_title(),
					confirm: m.statements_mark_sent(),
					busy: m.ui_saving(),
					done: m.statements_marked_sent()
				}
	);
	const address = $derived(
		(byEmail ? statement.tenantEmail : statement.tenantAddress) ||
			(byEmail ? m.statements_no_email() : m.statements_no_address())
	);
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
				addToast('success', words.done);
				await tick(); // after the dialog has handed the focus back
				document.querySelector<HTMLElement>('h1')?.focus(); // "Als versendet markieren" is gone now
			}
		};
	}}
>
	{#if letterForEmail}<input type="hidden" name="byLetter" value="true" />{/if}
</form>

<Dialog
	bind:open
	title={words.title}
	confirmLabel={words.confirm}
	busy={sending}
	busyLabel={words.busy}
	confirmTestid="statement-send-confirm"
	onconfirm={() => form?.requestSubmit()}
>
	<!-- #547: a draft that is not current is said first, with «Neu berechnen»; sending stays possible -->
	{#if outdated}
		<Alert tone="caution" title={m.statements_send_outdated_title()} testid="send-outdated">
			<p>{outdated}</p>
			<div>
				<Button icon="refresh" onclick={onrecalculate} testid="send-recalculate"
					>{m.statements_recalculate()}</Button
				>
			</div>
		</Alert>
	{/if}
	{#if byEmail}
		<p>{m.statements_send_email_text()}</p>
		<p>{m.statements_send_email_bounce()}</p>
	{:else}
		{#if noEmail}<p>{m.statements_send_no_email({ tenant: statement.tenantName })}</p>{/if}
		<p>{m.statements_send_text_1()}</p>
		<p>{m.statements_send_text_2()}</p>
	{/if}
	<dl class="flex flex-col gap-2 rounded-panel bg-sunken p-4" data-testid="send-recipient">
		<div class="flex flex-wrap gap-x-2">
			<dt class="text-ink-muted">{m.statements_recipient()}</dt>
			<dd class="font-semibold text-ink">{statement.tenantName}</dd>
		</div>
		<div class="flex flex-wrap gap-x-2">
			<dt class="text-ink-muted">{m.statements_channel()}</dt>
			<dd class="text-ink">
				{byEmail ? m.tenants_channel_email() : m.tenants_channel_letter()},
				{address}
			</dd>
		</div>
	</dl>
	{#if byEmail}
		<div>
			<Button variant="ghost" onclick={() => (instead = true)} testid="send-by-letter-instead"
				>{m.statements_send_by_letter_instead()}</Button
			>
		</div>
	{/if}
	<OldAddressWarning {statement} testid="send-old-address" />
	<div>
		<Button
			href="/statements/{statement.id}/pdf?ansehen"
			target="_blank"
			icon="document"
			testid="send-pdf-view">{m.statements_view_pdf()}</Button
		>
	</div>
</Dialog>
