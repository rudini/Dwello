<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { SplitKeyHint } from '$lib/statement-wizard';
	import Alert from '$lib/ui/Alert.svelte';

	// #528: a Kategorie billed with several Verteilschlüssel stands in several lines; the invoices whose key differs, each
	// a way to its page, and what to do if it is not intended (end); a hint only, no confirmation
	let {
		splitKeys,
		end,
		testid,
		returnTo // the preview: the invoice opens to be edited and leads back (as InvoiceHint)
	}: { splitKeys: SplitKeyHint[]; end: string; testid: string; returnTo?: string } = $props();
	const hrefOf = (id: string) =>
		returnTo ? `/invoices/${id}/edit?returnTo=${encodeURIComponent(returnTo)}` : `/invoices/${id}`;

	const lineText = (split: SplitKeyHint) => {
		const names = { category: split.categoryName, mainKey: split.mainKeyName, key: split.keyName };
		return split.invoices.length === 1
			? m.statements_split_keys_line(names)
			: m.statements_split_keys_line_many(names);
	};
</script>

{#if splitKeys.length}
	<Alert tone="caution" title={m.statements_split_keys_title()} {testid}>
		<div class="flex flex-col gap-2">
			{#each splitKeys as split (`${split.buildingId}-${split.categoryId}-${split.keyId}`)}
				<div data-testid="split-keys-line">
					{#if split.buildingName}<p class="font-semibold">{split.buildingName}</p>{/if}
					<p>{lineText(split)}</p>
					<ul class="flex flex-col">
						{#each split.invoices as invoice (invoice.id)}
							<li>
								<a
									href={hrefOf(invoice.id)}
									class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4"
									data-testid="split-keys-invoice-link">{invoice.description}</a
								>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
			<p>{m.statements_split_keys_contract()} {end}</p>
		</div>
	</Alert>
{/if}
