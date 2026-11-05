<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Icon from './Icon.svelte';
	import ProgressBar from './ProgressBar.svelte';

	// Steps of a wizard (current counts from 1); finished steps lead back, later ones wait
	// a finished step names what was chosen in it (#663), e.g. the period
	let {
		steps,
		current,
		onselect,
		values = []
	}: {
		steps: string[];
		current: number;
		onselect: (step: number) => void;
		values?: (string | undefined)[];
	} = $props();
</script>

<nav aria-label={m.ui_progress()} class="flex flex-col gap-4">
	<p class="font-semibold text-ink-muted">
		{m.ui_step_of_named({ current, total: steps.length, name: steps[current - 1] })}
	</p>
	<ProgressBar
		value={current}
		max={steps.length}
		label={m.ui_step_of({ current, total: steps.length })}
	/>
	<!-- Up to xl the numbers without names: five names do not fit next to the sidebar (the current one is named above);
	     a finished step shows its value at every width the list shows (#663).
	     min-w-0 and hyphenation keep long names inside their step instead of widening the page -->
	<ol class="hidden gap-2 md:flex">
		{#each steps as step, i (i)}
			{@const number = i + 1}
			<li class="flex min-w-0 flex-1 items-center gap-2">
				{#if number < current}
					<button
						type="button"
						onclick={() => onselect(number)}
						data-testid="wizard-step"
						class="flex min-h-12 min-w-0 items-center gap-2 rounded-control px-2 font-semibold text-accent hover:bg-accent-soft"
					>
						<span
							class="flex size-8 shrink-0 items-center justify-center rounded-control bg-positive-soft text-positive"
						>
							<Icon name="check" />
						</span>
						<span class="flex min-w-0 flex-col text-left">
							<span
								data-testid="wizard-step-label"
								class="sr-only min-w-0 hyphens-auto break-words xl:not-sr-only">{step}</span
							><span
								data-testid="wizard-step-value"
								class="min-w-0 break-words font-normal text-ink-muted"
							>
								{values[i] ?? ''}</span
							>
						</span><span class="sr-only"> {m.ui_step_done()}</span>
					</button>
				{:else}
					<span
						class="flex min-h-12 min-w-0 items-center gap-2 px-2 {number === current
							? 'font-bold text-ink'
							: 'text-ink-muted'}"
						aria-current={number === current ? 'step' : undefined}
					>
						<span
							class="flex size-8 shrink-0 items-center justify-center rounded-control border-2 tabular-nums {number ===
							current
								? 'border-accent bg-accent text-on-accent'
								: 'border-line-strong'}">{number}</span
						>
						<span
							data-testid="wizard-step-label"
							class="sr-only min-w-0 hyphens-auto break-words xl:not-sr-only">{step}</span
						>
					</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
