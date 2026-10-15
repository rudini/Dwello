<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { tick, untrack } from 'svelte';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Field from '$lib/ui/Field.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import { controlClass } from '$lib/ui/field';
	import TextInput from '$lib/ui/TextInput.svelte';

	// Adds a file to the tenant: PDF, JPG or PNG up to 10 MB with a title; a refusal shows at its field
	let {
		form,
		demo = false
	}: {
		form?: { title?: string; uploadError?: string; titleError?: string } | null;
		demo?: boolean;
	} = $props();

	const MAX_MEGABYTES = 10; // as the backend counts them: 10 × 1024 × 1024 bytes
	const MAX_BYTES = MAX_MEGABYTES * 1024 * 1024;

	// a refusal comes with the title that was sent; a request that failed keeps what the form holds
	let title = $state(untrack(() => form?.title ?? ''));
	let failed = $state<string>();
	let uploading = $state(false);
	let uploadForm = $state<HTMLFormElement>();

	let unanswered = $state(false);

	async function notAnswered() {
		unanswered = true;
		await tick();
		uploadForm?.querySelector<HTMLElement>('button[type="submit"]')?.focus();
	}

	async function uploaded(title_: string) {
		uploadForm?.reset();
		title = '';
		addToast('success', m.tenants_document_uploaded_toast({ title: title_ }));
		await tick();
		uploadForm?.querySelector<HTMLElement>('input[type="file"]')?.focus();
	}

	// Checks the size before sending; then hands the answer to the form
	const submit: SubmitFunction = ({ formData, cancel }) => {
		failed = undefined;
		unanswered = false;
		// a file over the limit would only reach the server to be refused, or not at all (BODY_SIZE_LIMIT)
		if (((formData.get('file') as File | null)?.size ?? 0) > MAX_BYTES) {
			failed = m.backend_document_too_large({ megabytes: MAX_MEGABYTES });
			focusFirstError(uploadForm);
			return cancel();
		}
		uploading = true;
		return async ({ result, update }) => {
			uploading = false;
			// the page could not answer: nothing was saved, the form keeps what was entered, and «Dokument hochladen»
			// sends it again (an alert, not an error of the file)
			if (result.type === 'error') return notAnswered();
			await update({ reset: false });
			if (result.type === 'success') uploaded(String(result.data?.uploaded));
			// a refusal is read out at its field; after saving the focus stays at the form, below the new document
			else focusFirstError(uploadForm);
		};
	};
</script>

<form
	method="POST"
	action="?/upload"
	enctype="multipart/form-data"
	class="flex flex-col gap-4 border-t border-line pt-6"
	data-testid="tenant-document-upload"
	bind:this={uploadForm}
	use:enhance={submit}
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
		error={form?.titleError}
		bind:value={title}
		testid="tenant-document-title-input"
	/>
	{#if unanswered}
		<Alert tone="critical" title={m.ui_action_failed()} testid="form-error">
			<p>{m.tenants_document_upload_failed()}</p>
		</Alert>
	{/if}
	<div>
		<Button type="submit" icon="add" busy={uploading} testid="tenant-document-upload-button"
			>{m.tenants_document_upload()}</Button
		>
	</div>
</form>
