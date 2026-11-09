<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { m } from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores';
	import { formatDate } from '$lib/utils/format';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import type { PageData } from './$types';

	// #1410: the list's building and period whose Aufbewahrungsfrist has passed; «Behalten» ends the overview's task,
	// as «Als geprüft markieren» of #459. Dwello deletes nothing
	let { retention, error }: { retention: NonNullable<PageData['retention']>; error?: string } =
		$props();

	const names = $derived({ period: retention.period, building: retention.building });
	let keeping = $state(false);
	const keep: SubmitFunction = () => {
		keeping = true;
		return async ({ result, update }) => {
			if (result.type === 'success') addToast('success', m.dashboard_task_retention_kept(names));
			await update();
			keeping = false;
		};
	};
</script>

<Alert tone="caution" title={m.dashboard_task_retention(names)} testid="invoice-retention-hint">
	<p>
		{(retention.count === 1
			? m.dashboard_task_retention_text_one
			: m.dashboard_task_retention_text_many)({
			count: retention.count,
			date: formatDate(retention.keepUntil)
		})}
	</p>
	<form method="POST" action="?/keep" use:enhance={keep}>
		<input type="hidden" name="buildingId" value={retention.buildingId} />
		<input type="hidden" name="periodStart" value={retention.start} />
		<Button type="submit" icon="check" busy={keeping} testid="invoice-retention-keep"
			>{m.dashboard_task_retention_keep()}</Button
		>
	</form>
	{#if error}
		<p class="font-semibold text-critical" data-testid="invoice-retention-error">{error}</p>
	{/if}
</Alert>
