<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { beforeNavigate, goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import { contractBody, type ContractFormValues } from '$lib/contract-form';
	import Dialog from '$lib/ui/Dialog.svelte';

	// Leaving the edit form with unsaved changes asks first, on every way out (links, menu, «Zurück», «Abmelden»);
	// closing the tab gets the browser's own prompt (Sven N-3, code review n-4, decided in #668). What would be
	// saved counts, so a change undone asks nothing (code review 668-n3 C-2); a save and the discard pass
	let {
		values,
		categories,
		saving
	}: { values: ContractFormValues; categories: { id: string }[]; saving: boolean } = $props();

	const body = () => JSON.stringify(contractBody(values, categories));
	const saved = untrack(body);
	let discarded = false;
	let leaving = $state<{ url: URL; delta?: number } | null>(null);
	beforeNavigate(({ cancel, to, type, delta }) => {
		if (saving || discarded || body() === saved) return;
		cancel(); // for 'leave' SvelteKit shows the browser's prompt
		if (type !== 'leave' && to) leaving = { url: to.url, delta };
	});

	// after «Zurück» it goes back, so the next «Zurück» does not reopen the form (code review 668-n3 C-1)
	function discard() {
		discarded = true;
		if (leaving!.delta) history.go(leaving!.delta);
		else goto(leaving!.url);
	}
</script>

<Dialog
	bind:open={() => !!leaving, (open) => !open && (leaving = null)}
	title={m.contracts_leave_title()}
	confirmLabel={m.contracts_leave_confirm()}
	cancelLabel={m.contracts_leave_cancel()}
	danger
	onconfirm={discard}
	confirmTestid="contract-leave-confirm"
>
	<p>{m.contracts_leave_text()}</p>
</Dialog>
