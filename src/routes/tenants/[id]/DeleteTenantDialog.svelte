<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import FieldError from '$lib/components/FieldError.svelte';

	let {
		name,
		hasContracts,
		error,
		onclose
	}: { name: string; hasContracts: boolean; error?: string; onclose: () => void } = $props();
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
	<div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
		<h3 class="text-lg font-semibold text-gray-900">{name} löschen?</h3>
		<p class="text-gray-600" data-testid="tenant-delete-hint">
			{hasContracts
				? 'Mieter mit Mietverträgen bleiben erhalten, weil Abrechnungen und Dokumente auf sie verweisen.'
				: 'Der Mieter wird endgültig gelöscht.'}
		</p>
		<FieldError message={error} />
		<form method="POST" action="?/delete" use:enhance class="flex gap-3 justify-end">
			<Button variant="secondary" onclick={onclose}>Abbrechen</Button>
			<Button type="submit" variant="danger" disabled={hasContracts} testid="tenant-delete-confirm">Löschen</Button>
		</form>
	</div>
</div>
