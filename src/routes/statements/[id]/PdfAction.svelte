<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import type { Tenant } from '$lib/types';

	// The statement's PDF: made once in the tenant's language (#105), then downloaded
	let {
		id,
		generated,
		generating,
		language = 'de',
		ongenerate
	}: {
		id: string;
		generated: boolean;
		generating: boolean;
		language?: Tenant['language'];
		ongenerate: () => void;
	} = $props();

	const pdfIn = {
		de: m.statements_pdf_in_de,
		fr: m.statements_pdf_in_fr,
		it: m.statements_pdf_in_it,
		en: m.statements_pdf_in_en
	};
</script>

{#if generated}
	<Button href="/statements/{id}/pdf" icon="document-download" testid="statement-pdf-download"
		>{m.documents_download()}</Button
	>
{:else}
	<div class="flex flex-col gap-2">
		<Button
			onclick={ongenerate}
			busy={generating}
			busyLabel={m.statements_pdf_creating()}
			icon="document"
			describedby="statement-pdf-language"
			testid="statement-generate-pdf-button">{m.statements_create_pdf()}</Button
		>
		<p id="statement-pdf-language" class="text-ink-muted" data-testid="statement-pdf-language">
			{(pdfIn[language] ?? pdfIn.de)()}
		</p>
	</div>
{/if}
