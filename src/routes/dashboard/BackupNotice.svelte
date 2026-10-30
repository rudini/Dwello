<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { BackupState } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import { formatDate } from '$lib/utils/format';

	// #718 (O1): no Sicherung for more than a day, said to the landlord, who passes it on; once, after the setup, that it runs
	let { state, confirmed }: { state: BackupState; confirmed: boolean } = $props();
	const GUIDE = 'https://github.com/rudini/Dwello/blob/main/docs/installation.md';
</script>

{#if state.backup === 'stale' && state.since}
	<Alert
		tone="critical"
		title={m.backup_stale({ date: formatDate(state.since) })}
		testid="backup-stale"
	>
		<p>
			{m.backup_self()}
			<a
				href={GUIDE}
				class="font-semibold text-accent underline underline-offset-4"
				data-testid="backup-stale-guide">{m.backup_guide_link()}</a
			>
		</p>
	</Alert>
{:else if confirmed}
	<Alert tone="positive" title={m.backup_confirmed()} testid="backup-confirmed" />
{/if}
