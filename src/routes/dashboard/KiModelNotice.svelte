<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import type { KiModel } from './+page.server';

	// #577: the local KI's model downloads in the background after the first start; until then invoices by hand
	let { model }: { model: KiModel } = $props();
</script>

{#if model.state === 'loading'}
	<Alert
		tone="info"
		title={m.ki_model_loading_title({ percent: model.percent })}
		testid="ki-model-loading"
	>
		<p>{m.ki_model_loading_text()}</p>
	</Alert>
{:else if model.state === 'failed'}
	<Alert tone="caution" title={m.ki_model_failed_title()} testid="ki-model-loading">
		<p>{m.ki_model_failed_text()}</p>
	</Alert>
{/if}
