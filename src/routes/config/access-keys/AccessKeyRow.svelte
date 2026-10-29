<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import { formatDate } from '$lib/utils/format';
	import type { PageData } from './$types';

	// #817: one Zugangsschlüssel with when it was created, last used and runs out
	let { key, onrevoke }: { key: PageData['keys'][number]; onrevoke: () => void } = $props();

	const used = $derived(
		key.lastUsedAt
			? m.ai_keys_last_used({ date: formatDate(key.lastUsedAt) })
			: m.ai_keys_never_used()
	);
	const ends = $derived(
		(key.expired ? m.ai_keys_expired : m.ai_keys_expires)({ date: formatDate(key.expiresOn) })
	);
</script>

<li
	class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-4 md:flex-row md:items-center"
	data-testid="access-key-row"
>
	<div class="flex min-w-0 flex-1 flex-col gap-1">
		<p class="break-words font-semibold text-ink" data-testid="access-key-name">{key.name}</p>
		<p class="text-ink-muted">
			{m.ai_keys_created_on({ date: formatDate(key.createdAt) })} · {used} · {ends}
		</p>
	</div>
	<Button
		variant="danger-ghost"
		icon="delete"
		onclick={onrevoke}
		ariaLabel={m.ai_keys_revoke_label({ name: key.name })}
		testid="access-key-revoke-button">{m.ai_keys_revoke()}</Button
	>
</li>
