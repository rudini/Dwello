<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import { makeInert } from '$lib/inert';

	// The update after its confirmation (#1453): its steps until the page loads again, or why it failed
	let {
		phase,
		step,
		slow,
		notice,
		notStarted,
		onclose
	}: {
		phase: 'running' | 'failed' | 'restore';
		step: number;
		slow: boolean;
		notice: { latest: string; current: string };
		/** why no update started (the Sicherung before it failed), in place of why one failed */
		notStarted: string;
		onclose: () => void;
	} = $props();

	const STEPS = [m.update_step_backup, m.update_step_download, m.update_step_restart];
	const status = $derived(m.update_step_status({ number: step + 1, step: STEPS[step]() }));
	// each step as it looks, and what a screen reader hears after its name
	const steps = $derived(
		STEPS.map((name, index) =>
			index === step
				? {
						name,
						heard: m.update_step_current(),
						current: 'step' as const,
						look: 'font-semibold',
						testid: 'update-step-current'
					}
				: {
						name,
						heard: index < step ? m.update_step_done() : m.update_step_pending(),
						look: 'text-ink-muted'
					}
		)
	);
	// the restore needs the person who looks after Dwello; else the previous version runs on
	const failure = $derived(
		notStarted
			? [notStarted]
			: phase === 'restore'
				? [m.update_failed_restore()]
				: [m.update_failed({ version: notice.current }), m.update_failed_log()]
	);

	// the page behind stays out of reach (code review update-1 C-2): the focus on the heading, after a failure on
	// «Schliessen»
	let overlay = $state<HTMLElement>();
	$effect(() => (overlay ? makeInert(overlay) : undefined));
	$effect(() => {
		void phase;
		(
			overlay?.querySelector<HTMLElement>('[data-testid="update-failed-close"]') ??
			overlay?.querySelector<HTMLElement>('h2')
		)?.focus();
	});
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-canvas p-4"
	role="dialog"
	aria-modal="true"
	aria-labelledby="update-title"
	data-testid="update-overlay"
	bind:this={overlay}
>
	<div
		class="flex w-full max-w-xl flex-col gap-4 rounded-panel border border-line bg-surface p-6 text-ink"
	>
		{#if phase === 'running'}
			<h2 id="update-title" tabindex="-1" class="flex items-center gap-2 text-xl font-semibold">
				<span class="motion-safe:animate-spin"><Icon name="loading" /></span>
				{m.update_overlay_title({ latest: notice.latest })}
			</h2>
			<p>{m.update_overlay_text()}</p>
			<ProgressBar value={step + 1} max={STEPS.length} label={status} />
			<ol class="flex flex-col gap-2">
				{#each steps as { name, heard, current, look, testid } (name)}
					<li aria-current={current} class={look} data-testid={testid}>
						{name()} <span>({heard})</span>
					</li>
				{/each}
			</ol>
			<div role="status" data-testid="update-status">
				<span class="sr-only">{status}</span>
				{#if slow}<p data-testid="update-slow">{m.update_overlay_slow()}</p>{/if}
			</div>
		{:else}
			<h2 id="update-title" tabindex="-1" class="text-xl font-semibold">
				{m.update_failed_restore_title()}
			</h2>
			<div role="alert" class="flex flex-col gap-2" data-testid="update-failed">
				{#each failure as text (text)}<p>{text}</p>{/each}
			</div>
			{#if phase === 'failed'}
				<div>
					<Button variant="primary" onclick={onclose} testid="update-failed-close"
						>{m.update_failed_close()}</Button
					>
				</div>
			{/if}
		{/if}
	</div>
</div>
