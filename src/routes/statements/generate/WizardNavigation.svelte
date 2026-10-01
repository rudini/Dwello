<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let {
		currentStep = $bindable(),
		canProceed,
		submitStep,
		lastStep
	}: { currentStep: number; canProceed: boolean; submitStep: number; lastStep: number } = $props();

	// The step that needs the server (preview) submits the wizard form instead of just advancing
	const submits = $derived(currentStep === submitStep);
	const nextType = $derived(submits ? 'submit' : 'button');
	const advance = () => {
		if (!submits) currentStep++;
	};
</script>

<div class="flex items-center justify-between">
	<div>
		{#if currentStep > 1}
			<Button variant="secondary" onclick={() => currentStep--} testid="wizard-back">
				<Icon name="arrow_back" size={20} />
				Zurück
			</Button>
		{/if}
	</div>
	{#if currentStep < lastStep}
		<Button
			type={nextType}
			variant="primary"
			onclick={advance}
			disabled={!canProceed}
			testid="wizard-next"
		>
			Weiter
			<Icon name="arrow_forward" size={20} />
		</Button>
	{/if}
</div>
