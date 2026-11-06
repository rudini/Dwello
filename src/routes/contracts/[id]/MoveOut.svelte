<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { moveOutText } from '$lib/apartment';
	import type { MoveOut } from '$lib/types';

	// #664: the move-out until the Schlussabrechnung exists; once due with the way into the wizard for its period
	let { moveOut }: { moveOut: (MoveOut & { href: string | null }) | null } = $props();
</script>

{#if moveOut}
	<Alert
		tone={moveOut.due ? 'caution' : 'info'}
		title={moveOutText(moveOut)}
		testid="contract-move-out"
	>
		{#if moveOut.href}
			<div>
				<Button href={moveOut.href} icon="calculate" testid="contract-move-out-link"
					>{m.contracts_move_out_create()}</Button
				>
			</div>
		{/if}
	</Alert>
{/if}
