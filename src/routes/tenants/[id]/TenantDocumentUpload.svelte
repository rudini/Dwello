<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Field from '$lib/ui/Field.svelte';
	import { controlClass } from '$lib/ui/field';
	import TextInput from '$lib/ui/TextInput.svelte';

	// Adds a file to the tenant: PDF, JPG or PNG up to 10 MB with a title; a refusal shows at the file field
	let {
		form,
		demo = false
	}: { form?: { title?: string; uploadError?: string } | null; demo?: boolean } = $props();

	const MAX_MEGABYTES = 10; // as the backend counts them: 10 × 1024 × 1024 bytes
	const MAX_BYTES = MAX_MEGABYTES * 1024 * 1024;

	// a refusal comes with the title that was sent; a request that failed keeps what the form holds
	let title = $state(untrack(() => form?.title ?? ''));
	let failed = $state<string>();
	let uploading = $state(false);
	let uploadForm = $state<HTMLFormElement>();
</script>

<form
	method="POST"
	action="?/upload"
	enctype="multipart/form-data"
	class="flex flex-col gap-4 border-t border-line pt-6"
	data-testid="tenant-document-upload"
	bind:this={uploadForm}
	use:enhance={({ formData, cancel }) => {
		failed = undefined;
		// a file over the limit would only reach the server to be refused, or not at all (BODY_SIZE_LIMIT)
		if (((formData.get('file') as File | null)?.size ?? 0) > MAX_BYTES) {
			failed = m.backend_document_too_large({ megabytes: MAX_MEGABYTES });
			return cancel();
		}
		uploading = true;
		return async ({ result, update }) => {
			uploading = false;
			// the page could not answer: nothing was saved, the form keeps what was entered
			if (result.type === 'error') {
				failed = m.tenants_document_upload_failed();
				return;
			}
			await update({ reset: false });
			if (result.type !== 'success') return;
			uploadForm?.reset();
			title = '';
			addToast(
				'success',
				m.tenants_document_uploaded_toast({ title: String(result.data?.uploaded) })
			);
		};
	}}
>
	<h3 class="font-semibold text-ink">{m.tenants_document_upload_heading()}</h3>
	{#if demo}
		<Alert tone="caution" title={m.demo_notice_title()} testid="tenant-document-demo">
			<p>{m.tenants_document_demo()}</p>
		</Alert>
	{/if}
	<Field
		id="tenant-document-file"
		label={m.tenants_document_file_label()}
		help={m.tenants_document_file_help()}
		error={failed ?? form?.uploadError}
	>
		{#snippet children(control)}
			<input
				id={control.id}
				name="file"
				type="file"
				accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
				aria-describedby={control.describedBy}
				aria-invalid={control.invalid || undefined}
				class={controlClass(control.invalid)}
				data-testid="tenant-document-file-input"
			/>
		{/snippet}
	</Field>
	<TextInput
		id="tenant-document-title"
		name="title"
		label={m.tenants_document_title_label()}
		help={m.tenants_document_title_help()}
		optional
		bind:value={title}
		testid="tenant-document-title-input"
	/>
	<div>
		<Button type="submit" icon="add" busy={uploading} testid="tenant-document-upload-button"
			>{m.tenants_document_upload()}</Button
		>
	</div>
</form>
