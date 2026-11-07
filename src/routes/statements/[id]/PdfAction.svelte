<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores';
	import Button from '$lib/ui/Button.svelte';
	import type { Tenant } from '$lib/types';

	// The statement's PDF: made once in the tenant's language (#105), then downloaded
	let {
		id,
		generated,
		language = 'de',
		list = ''
	}: {
		id: string;
		generated: boolean;
		language?: Tenant['language'];
		list?: string; // the list it was opened from: the refusal page of the PDF leads back there (#1094)
	} = $props();

	let generating = $state(false);

	const pdfIn = {
		de: m.statements_pdf_in_de,
		fr: m.statements_pdf_in_fr,
		it: m.statements_pdf_in_it,
		en: m.statements_pdf_in_en
	};
</script>

{#if generated}
	<Button
		href="/statements/{id}/pdf{list ? `?${new URLSearchParams({ list })}` : ''}"
		icon="document-download"
		testid="statement-pdf-download">{m.documents_download()}</Button
	>
{:else}
	<!-- #686: a form, so a click before the page has loaded its scripts makes the PDF too -->
	<form
		method="POST"
		action="?/generatePdf"
		class="flex flex-col gap-2"
		use:enhance={() => {
			generating = true;
			return async ({ result, update }) => {
				if (result.type === 'success') {
					await update(); // the statement loaded again offers the PDF for download
					addToast('success', m.statements_pdf_created());
				}
				generating = false; // after the reload: a click meanwhile would send the action again (code review 686-1 C-2)
				if (result.type !== 'success')
					addToast(
						'error',
						result.type === 'failure' ? String(result.data?.actionError) : m.statements_pdf_failed()
					);
			};
		}}
	>
		<Button
			type="submit"
			busy={generating}
			busyLabel={m.statements_pdf_creating()}
			icon="document"
			describedby="statement-pdf-language"
			testid="statement-generate-pdf-button">{m.statements_create_pdf()}</Button
		>
		<p id="statement-pdf-language" class="text-ink-muted" data-testid="statement-pdf-language">
			{pdfIn[language]()}
		</p>
	</form>
{/if}
