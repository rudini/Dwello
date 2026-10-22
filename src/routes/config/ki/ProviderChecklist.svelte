<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';

	// #580: the data-protection checklist a provider is confirmed with (domain review 580 F-1), empty on every opening
	// because the three points hold for one provider (F-2), and «Verbindung prüfen» with its result
	let { error, check, checking }: { error?: string; check?: string; checking: boolean } = $props();

	const points = $derived([
		m.ki_settings_checklist_1(),
		m.ki_settings_checklist_2(),
		m.ki_settings_checklist_3()
	]);
</script>

<ol class="flex list-decimal flex-col gap-2 pl-6 text-ink">
	{#each points as point (point)}<li>{point}</li>{/each}
</ol>
<p class="text-ink-muted">{m.ki_settings_checklist_note()}</p>
<Checkbox
	id="ki-privacy-confirm"
	name="confirmed"
	label={m.ki_settings_confirm()}
	{error}
	testid="ki-privacy-confirm"
/>
<div class="flex flex-col gap-4">
	<div>
		<Button
			type="submit"
			formaction="?/check"
			icon="refresh"
			busy={checking}
			busyLabel={m.ki_settings_checking()}
			testid="ki-check-button">{m.ki_settings_check()}</Button
		>
	</div>
	<div role="status">
		{#if check}<p class="text-ink" data-testid="ki-check-result">{check}</p>{/if}
	</div>
</div>
