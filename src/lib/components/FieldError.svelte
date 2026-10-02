<script lang="ts">
	let { message }: { message?: string } = $props();
</script>

{#if message}
	<p class="mt-1 text-sm text-red-600" data-testid="form-error">{message}</p>
{/if}
