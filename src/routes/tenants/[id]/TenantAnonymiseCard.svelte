<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores';
	import { formatDate } from '$lib/utils/format';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// #459 (#332): a former tenant 10 years after the end of the year of his last event (Art. 958f Abs. 1, Art. 127 OR);
	// before that day the page names it.
	// allowed: that day has come, the backend says by the Swiss day (#815)
	let {
		from,
		allowed,
		name,
		error
	}: { from: string; allowed: boolean; name: string; error?: string } = $props();
	// the year of the last event: the first day is 1 January 11 years later
	const year = $derived(Number(from.slice(0, 4)) - 11);
	let confirming = $state(false);
	// the name before saving: the page reloads with the replacement name before the toast (code review C-1)
	let anonymised = '';
</script>

<Panel title={m.tenants_anonymise()}>
	<div class="flex flex-col items-start gap-4">
		{#if allowed}
			<p id="tenant-anonymise-help" class="text-ink" data-testid="tenant-anonymise-help">
				{m.tenants_anonymise_help({ year, name })}
			</p>
			<Button
				onclick={() => {
					anonymised = name;
					confirming = true;
				}}
				icon="user"
				describedby="tenant-anonymise-help"
				testid="tenant-anonymise-button">{m.tenants_anonymise()}</Button
			>
		{:else}
			<p class="text-ink" data-testid="tenant-anonymise-from">
				{m.tenants_anonymise_from({ name, date: formatDate(from) })}
			</p>
		{/if}
	</div>
</Panel>

<ActionDialog
	bind:open={confirming}
	action="?/anonymise"
	title={m.tenants_anonymise_dialog_title({ name })}
	confirmLabel={m.tenants_anonymise()}
	danger
	confirmTestid="tenant-anonymise-confirm"
	{error}
	onsuccess={() => addToast('success', m.tenants_anonymised_toast({ name: anonymised }))}
>
	<p data-testid="tenant-anonymise-message">{m.tenants_anonymise_text({ name })}</p>
</ActionDialog>
