<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import { dayAfter } from '$lib/swiss-date';
	import { formatDate, normalizeDecimal } from '$lib/utils/format';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';

	// #1301: the apartment's earlier Fläche and Zimmeranzahl with their last day; the last change can be removed, after a
	// confirmation with its consequence (Fachreview 1301-1 V-1)
	let {
		sizes,
		serverError
	}: { sizes: { until: string; area: string; rooms: string }[]; serverError?: string } = $props();

	let open = $state(false);
	let removing = $state(false);
	let form = $state<HTMLFormElement>();
	const last = $derived(sizes.at(-1)!);
	const changed = $derived(dayAfter(last.until)); // the day of the last change
	const values = (size: { area: string; rooms: string }) => ({
		area: normalizeDecimal(size.area),
		rooms: normalizeDecimal(size.rooms)
	});
</script>

<!-- a list of its own below the other facts: the dialog and its form may not stand in a <dl> -->
<dl class="mt-6 flex flex-col items-start gap-2" data-testid="apartment-info-earlier-size">
	<dt class="text-ink-muted">{m.apartments_fact_size_earlier()}</dt>
	{#each sizes as size (size.until)}
		<dd class="text-ink tabular-nums">
			{m.apartments_fact_size_earlier_value({ date: formatDate(size.until), ...values(size) })}
		</dd>
	{/each}
	<dd>
		<Button
			variant="danger-ghost"
			icon="delete"
			onclick={() => (open = true)}
			testid="apartment-size-change-remove"
			>{m.apartments_size_change_remove({ date: formatDate(changed) })}</Button
		>
	</dd>
</dl>

<form
	bind:this={form}
	method="POST"
	action="?/removeSizeChange"
	use:enhance={() => {
		removing = true;
		return async ({ result, update }) => {
			await update();
			removing = false;
			if (result.type === 'success') open = false;
		};
	}}
></form>

<Dialog
	bind:open
	title={m.apartments_size_change_remove_title({ date: formatDate(changed) })}
	confirmLabel={m.apartments_size_change_remove_confirm()}
	danger
	busy={removing}
	busyLabel={m.ui_saving()}
	confirmTestid="apartment-size-change-remove-confirm"
	onconfirm={() => form?.requestSubmit()}
>
	<p>{m.apartments_size_change_remove_text({ date: formatDate(changed), ...values(last) })}</p>
	{#if serverError}
		<Alert tone="critical" title={serverError} testid="form-error" />
	{/if}
</Dialog>
