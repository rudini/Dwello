<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { beforeNavigate, goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import Dialog from '$lib/ui/Dialog.svelte';

	// Leaving the edit form with unsaved changes asks first, on every way out the landlord takes; closing the tab
	// gets the browser's own prompt (Sven N-3, code review n-4, decided in #668). A change undone counts as none;
	// the form's own `goto` (after saving, after «Änderungen verwerfen») is not asked
	let { values }: { values: object } = $props();

	const saved = untrack(() => JSON.stringify(values)); // the values as loaded
	let leaving = $state<URL | null>(null);
	beforeNavigate(({ cancel, to, type }) => {
		if (type === 'goto' || JSON.stringify(values) === saved) return;
		cancel(); // for 'leave' SvelteKit shows the browser's prompt
		if (type !== 'leave' && to) leaving = to.url;
	});
</script>

<Dialog
	bind:open={() => !!leaving, (open) => !open && (leaving = null)}
	title={m.contracts_leave_title()}
	confirmLabel={m.contracts_leave_confirm()}
	cancelLabel={m.contracts_leave_cancel()}
	danger
	onconfirm={() => goto(leaving!)}
	confirmTestid="contract-leave-confirm"
>
	<p>{m.contracts_leave_text()}</p>
</Dialog>
