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
	// without values each step as wide as its name (#667, W-10); with them the steps share the width
	// whole words that do not fit in one row (a long building name) move the next steps to a second one; a single
	// word wider than the whole list still overflows (#1146, code review 1146-4 C-1)
	const width = $derived(values.length ? 'flex-1' : 'flex-auto');
	const rows = $derived(values.length ? 'flex-wrap' : '');
	// below md every step is named on a line of its own (#1179); from md only the current one (#673, Helga P-6),
	// from xl all of them, unless the finished steps show values: next to them five names do not fit unbroken (#1146)
	const wide = $derived(values.length ? '' : 'xl:not-sr-only');
	const named = (number: number) => (number === current ? '' : `md:sr-only ${wide}`);
	// the current step keeps its longest word whole, unhyphenated, and takes the room from the others; with values
	// every step keeps its words whole: from md the names but one are hidden, so the words fit (#1146, Dr. Weber P-1)
	const shrink = (number: number) => (number === current || values.length ? '' : 'min-w-0');
	const wrap = (number: number) => (number === current ? '' : 'min-w-0 hyphens-auto break-words');
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
	<!-- Below md the steps stand one below the other, each named (#1179). From md up to xl, and with values from md
	     at every width, the numbers without names: five names do not fit next to the sidebar or the values (the current one is
	     named above, and next to its number; #1146);
	     a finished step shows its value at every width the list shows (#663).
	     Without values min-w-0 and hyphenation keep the other long names inside their step instead of widening the
	     page, and each step is as wide as its name, so a long one is not cut inside the word next to short ones
	     (#667, Dr. Weber W-10); with values the steps share the width and keep their words whole -->
	<ol class="flex flex-col gap-2 md:flex-row {rows}">
		{#each steps as step, i (i)}
			{@const number = i + 1}
			<li class="flex items-center gap-2 {width} {shrink(number)}">
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
								class="min-w-0 hyphens-auto break-words {named(number)}">{step}</span
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
						class="flex min-h-12 items-center gap-2 px-2 {shrink(number)} {number === current
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
						<span data-testid="wizard-step-label" class="{wrap(number)} {named(number)}"
							>{step}</span
						>
					</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
