<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Category } from '$lib/types';
	import Dialog from '$lib/ui/Dialog.svelte';

	// #309: setting a category back does not bring its invoices back, and Dwello's «nicht umlagefähig» follows the
	// law: such a save asks first. `ask` says whether it does, and opens the question
	let {
		category,
		allowed,
		onconfirm,
		ask = $bindable()
	}: {
		category?: Category & { predefined?: boolean; allocableInvoiceCount?: number };
		allowed: string; // the choice in the form
		onconfirm: () => void;
		ask?: () => boolean;
	} = $props();

	const count = $derived(category?.allocableInvoiceCount ?? 0);
	const excludes = $derived(!!category?.isAllowedUtilityCost && allowed === 'false' && count > 0);
	const includes = $derived(!!category?.predefined && !category.isAllowedUtilityCost && allowed === 'true');
	const name = $derived(category?.name ?? '');
	const excluding = () => ({
		title: m.categories_not_allocable_confirm_title({ name }),
		text: count === 1 ? m.categories_not_allocable_confirm_one() : m.categories_not_allocable_confirm_many({ count }),
		confirm: m.categories_not_allocable_confirm()
	});
	const including = () => ({
		title: m.categories_allocable_confirm_title({ name }),
		text: m.categories_allocable_confirm_text(),
		confirm: m.categories_allocable_confirm()
	});
	const question = $derived(excludes ? excluding() : includes ? including() : null);

	let open = $state(false);
	let confirmed = false;
	ask = () => (open = !!question && !confirmed);
</script>

{#if question}
	<Dialog
		bind:open
		title={question.title}
		confirmLabel={question.confirm}
		confirmTestid="category-allocability-confirm"
		onconfirm={() => {
			confirmed = true;
			open = false;
			onconfirm();
		}}
	>
		<p data-testid="category-allocability-text">{question.text}</p>
	</Dialog>
{/if}
