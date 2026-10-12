<script lang="ts">
	// Box left, label right; the whole row is the click target (48 px)
	let {
		id,
		label,
		checked = $bindable(false),
		name,
		help,
		error,
		describedby,
		disabled = false,
		testid
	}: {
		id: string;
		label: string;
		checked?: boolean;
		name?: string;
		help?: string;
		error?: string;
		describedby?: string; // texts elsewhere on the page that this choice answers
		disabled?: boolean;
		testid?: string;
	} = $props();
</script>

<div class="flex flex-col gap-1">
	<label for={id} class="flex min-h-12 cursor-pointer items-center gap-4 font-semibold text-ink">
		<input
			{id}
			{name}
			type="checkbox"
			bind:checked
			{disabled}
			aria-describedby={[error && `${id}-error`, describedby, help && `${id}-help`]
				.filter(Boolean)
				.join(' ') || undefined}
			aria-invalid={error ? true : undefined}
			class="size-6 shrink-0 cursor-pointer rounded-control border-2 border-line-strong accent-accent"
			data-testid={testid}
		/>
		{label}
	</label>
	{#if help}<p id="{id}-help" class="pl-10 text-ink-muted">{help}</p>{/if}
	{#if error}
		<p id="{id}-error" class="pl-10 font-semibold text-critical" data-testid="form-error">
			{error}
		</p>
	{/if}
</div>
