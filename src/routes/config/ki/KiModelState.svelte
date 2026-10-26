<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import KiModelNotice from '../../dashboard/KiModelNotice.svelte';
	import type { KiModel } from '$lib/types';

	// #580: the local KI's model on the page «KI»: its progress as on the overview, else whether it is there, and a new
	// download when it failed (domain review 580 F-5); a local KI that does not answer gets no download (persona Anna
	// 580 P-1)
	let { model }: { model: KiModel } = $props();
	let downloading = $state(false);
	const failed = $derived(model.state === 'failed');
</script>

<section data-testid="ki-model-state">
	{#if model.state === 'loading'}
		<KiModelNotice {model} />
	{:else if model.state === 'ready'}
		<Alert tone="positive" title={m.ki_settings_model_ready()}><p></p></Alert>
	{:else}
		<Alert
			tone="caution"
			title={failed ? m.ki_model_failed_title() : m.ki_settings_model_offline()}
			testid={failed ? 'ki-model-loading' : 'ki-model-offline'}
		>
			{#if failed}
				<p>{m.ki_settings_model_failed()}</p>
				<form
					method="POST"
					action="?/download"
					use:enhance={() => {
						downloading = true;
						return async ({ update }) => {
							await update();
							downloading = false;
						};
					}}
				>
					<Button
						type="submit"
						icon="document-download"
						busy={downloading}
						testid="ki-model-download-button">{m.ki_settings_model_download()}</Button
					>
				</form>
			{/if}
		</Alert>
	{/if}
</section>
