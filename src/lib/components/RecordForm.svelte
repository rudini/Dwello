<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import FieldError from './FieldError.svelte';
	import Icon from './Icon.svelte';

	// Form of a record's form action: the action's form error on top, cancel and save at the bottom
	let {
		action,
		error,
		cancelHref,
		submitLabel,
		submitTestid,
		children
	}: {
		action?: string;
		error?: string;
		cancelHref: string;
		submitLabel: string;
		submitTestid: string;
		children: Snippet;
	} = $props();
</script>

<form method="POST" {action} use:enhance={() => ({ update }) => update({ reset: false })} class="space-y-6">
	<FieldError message={error} />

	{@render children()}

	<div class="flex gap-3 pt-4 border-t border-gray-200">
		<Button href={cancelHref} variant="secondary" testid="form-cancel">Abbrechen</Button>
		<Button type="submit" variant="primary" testid={submitTestid}>
			<Icon name="save" size={18} />
			{submitLabel}
		</Button>
	</div>
</form>
