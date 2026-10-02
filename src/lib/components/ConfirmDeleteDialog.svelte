<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from './Button.svelte';
	import FieldError from './FieldError.svelte';

	let {
		title,
		message,
		error,
		disabled = false,
		testid,
		onclose
	}: {
		title: string;
		message: string;
		error?: string;
		disabled?: boolean;
		testid: string;
		onclose: () => void;
	} = $props();
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
	<div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
		<h3 class="text-lg font-semibold text-gray-900">{title}</h3>
		<p class="text-gray-600" data-testid="delete-dialog-message">{message}</p>
		<FieldError message={error} />
		<form method="POST" action="?/delete" use:enhance class="flex gap-3 justify-end">
			<Button variant="secondary" onclick={onclose}>Abbrechen</Button>
			<Button type="submit" variant="danger" {disabled} {testid}>Löschen</Button>
		</form>
	</div>
</div>
