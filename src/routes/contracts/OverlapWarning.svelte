<script lang="ts">
	import type { Snippet } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import type { Overlap } from '$lib/contract-form';
	import Alert from '$lib/ui/Alert.svelte';
	import OverlapLink from './OverlapLink.svelte';

	// The box «Zeitraum überschneidet sich»: the other contract, what helps and its link; at «Vertragsdauer» and in
	// «Prüfen», where `children` says where to change it (#669, fach-review V-7)
	let {
		overlap,
		newTab = false,
		children
	}: { overlap: Overlap; newTab?: boolean; children?: Snippet } = $props();
</script>

<Alert tone="caution" title={m.contracts_overlap_title()} testid="overlap-warning">
	<p>{overlap.text}</p>
	{@render children?.()}
	<OverlapLink contract={overlap.contract} {newTab} />
</Alert>
