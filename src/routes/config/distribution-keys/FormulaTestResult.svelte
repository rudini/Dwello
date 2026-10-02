<script lang="ts">
	import type { FormulaTest } from '$lib/distribution-key';

	let { test }: { test: FormulaTest } = $props();
</script>

<div class="mt-4 p-4 bg-gray-50 rounded-lg" data-testid="formula-test-result">
	{#each test.errors as message (message)}
		<p class="text-sm text-red-600" data-testid="formula-test-error">{message}</p>
	{/each}
	<table class="w-full text-sm">
		<tbody class="divide-y divide-gray-200">
			{#each test.results as result (result.apartment)}
				<tr data-testid="formula-test-row">
					<td class="py-2 text-gray-900">{result.apartment}</td>
					<td class="py-2 text-right font-medium text-blue-600" data-testid="formula-test-share">{result.share}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
