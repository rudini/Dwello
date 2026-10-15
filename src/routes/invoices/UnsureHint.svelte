<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Icon from '$lib/ui/Icon.svelte';

	// Below a field the KI filled without being sure: the property manager checks the value before saving
	let { field, unsure }: { field: string; unsure: string[] } = $props();
</script>

{#if unsure.includes(field)}
	<p class="flex items-center gap-2 font-semibold text-caution" data-testid="invoice-upload-unsure-{field}">
		<Icon name="warning" size={16} />{m.invoices_upload_unsure()}
	</p>
{/if}
