<script lang="ts">
	let { value = $bindable() }: { value: number } = $props();

	// 3 % is the usual guideline for Swiss utility statements, not a limit
	const USUAL_MAXIMUM = 3;
</script>

<div>
	<label for="managementFeePercent" class="block text-sm font-medium text-gray-700 mb-2">
		Verwaltungspauschale (%)
	</label>
	<input
		id="managementFeePercent"
		data-testid="management-fee-input"
		type="number"
		min="0"
		step="0.1"
		bind:value
		class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
	/>
	{#if value > USUAL_MAXIMUM}
		<p class="text-sm text-amber-700 mt-2" data-testid="management-fee-hint">
			Höher als der übliche Richtwert von {USUAL_MAXIMUM} %. Prüfen Sie, ob der Mehraufwand begründet
			ist.
		</p>
	{:else}
		<p class="text-xs text-gray-500 mt-1">
			Gilt für alle Abrechnungen dieses Laufs. Üblich sind bis {USUAL_MAXIMUM} %.
		</p>
	{/if}
</div>
