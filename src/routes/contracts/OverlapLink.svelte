<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Overlap } from '$lib/contract-form';

	// The contract an overlap is with (fach review b667 V-1), named with its apartment, the one being entered (#1295);
	// the edit form opens it in a new tab, so its input stays
	let {
		contract,
		apartment,
		newTab = false
	}: { contract: Overlap['contract']; apartment: string; newTab?: boolean } = $props();
</script>

<a
	href="/contracts/{contract.id}"
	target={newTab ? '_blank' : undefined}
	rel={newTab ? 'noopener noreferrer' : undefined}
	class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4 hover:text-accent-strong"
	data-testid="overlap-contract-link"
	>{contract.tenant
		? m.contracts_overlap_link({ tenant: contract.tenant, apartment })
		: m.contracts_overlap_link_anonymised({ apartment })}
	{#if newTab}{m.ui_opens_new_tab()}{/if}</a
>
