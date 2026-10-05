<script lang="ts">
	interface Props {
		id: string;
		label: string;
		checked?: boolean;
		disabled?: boolean;
		description?: string;
		class?: string;
		onchange?: (_checked: boolean) => void;
	}

	let {
		id,
		label,
		checked = $bindable(false),
		disabled = false,
		description = '',
		class: className = '',
		onchange
	}: Props = $props();

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const newValue = target.checked;
		checked = newValue;
		onchange?.(newValue);
	}
</script>

<label
	class="flex items-start gap-3 cursor-pointer {disabled
		? 'opacity-50 cursor-not-allowed'
		: ''} {className}"
>
	<input
		type="checkbox"
		{id}
		{checked}
		{disabled}
		onchange={handleChange}
		class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 transition-colors"
	/>
	<div class="flex-1">
		<span class="text-sm font-medium text-gray-700">{label}</span>
		{#if description}
			<p class="text-sm text-gray-500 mt-0.5">{description}</p>
		{/if}
	</div>
</label>
