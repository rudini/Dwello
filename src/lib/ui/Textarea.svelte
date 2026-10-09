<script lang="ts">
	import Field from './Field.svelte';
	import { controlClass } from './field';

	let {
		id,
		label,
		value = $bindable(''),
		name,
		rows = 4,
		help,
		example,
		error,
		optional = false,
		testid
	}: {
		id: string;
		label: string;
		value?: string;
		name?: string;
		rows?: number;
		help?: string;
		example?: string;
		error?: string;
		optional?: boolean;
		testid?: string;
	} = $props();
</script>

<Field {id} {label} {help} {example} {error} {optional}>
	{#snippet children(control)}
		<textarea
			id={control.id}
			{name}
			{rows}
			bind:value
			aria-required={!optional}
			aria-describedby={control.describedBy}
			aria-invalid={control.invalid || undefined}
			class={controlClass(control.invalid)}
			data-testid={testid}
		></textarea>
	{/snippet}
</Field>
