<script lang="ts">
	import Icon from './Icon.svelte';
	import ProgressBar from './ProgressBar.svelte';

	// Steps of a wizard (current counts from 1); finished steps lead back, later ones wait
	let {
		steps,
		current,
		onselect
	}: { steps: string[]; current: number; onselect: (step: number) => void } = $props();
</script>

<nav aria-label="Fortschritt" class="flex flex-col gap-4">
	<p class="font-semibold text-ink-muted">
		Schritt {current} von {steps.length}: {steps[current - 1]}
	</p>
	<ProgressBar value={current} max={steps.length} label="Schritt {current} von {steps.length}" />
	<ol class="hidden gap-2 md:flex">
		{#each steps as step, i (i)}
			{@const number = i + 1}
			<li class="flex flex-1 items-center gap-2">
				{#if number < current}
					<button
						type="button"
						onclick={() => onselect(number)}
						data-testid="wizard-step"
						class="flex min-h-12 items-center gap-2 rounded-control px-2 font-semibold text-accent hover:bg-accent-soft"
					>
						<span
							class="flex size-8 items-center justify-center rounded-control bg-positive-soft text-positive"
						>
							<Icon name="check" />
						</span>
						{step}<span class="sr-only">(erledigt)</span>
					</button>
				{:else}
					<span
						class="flex min-h-12 items-center gap-2 px-2 {number === current
							? 'font-bold text-ink'
							: 'text-ink-muted'}"
						aria-current={number === current ? 'step' : undefined}
					>
						<span
							class="flex size-8 items-center justify-center rounded-control border-2 tabular-nums {number ===
							current
								? 'border-accent bg-accent text-on-accent'
								: 'border-line-strong'}">{number}</span
						>
						{step}
					</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
