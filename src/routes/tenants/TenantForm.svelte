<script lang="ts">
	import { enhance } from '$app/forms';
	import TenantFormFields from '$lib/components/TenantFormFields.svelte';
	import { confirmSaved } from '$lib/tenant';
	import type { Tenant } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import type { IconName } from '$lib/ui/icons';

	// Form of "Neuer Mieter" and "Mieter bearbeiten"; the server action checks and saves it
	let {
		tenant,
		errors,
		forContract = false,
		cancelHref,
		submitLabel,
		submitIcon
	}: {
		tenant?: Tenant;
		errors?: Record<string, string>;
		forContract?: boolean; // opened from the contract wizard, which continues with the new tenant
		cancelHref: string;
		submitLabel: string;
		submitIcon: IconName;
	} = $props();

	let saving = $state(false);
</script>

<form
	method="POST"
	novalidate
	use:enhance={({ formData }) => {
		saving = true;
		const after = confirmSaved(formData);
		return async (output) => {
			await after(output);
			saving = false;
			focusFirstError(output.formElement);
		};
	}}
	class="flex flex-col gap-6 rounded-panel border border-line bg-surface p-6"
>
	{#if forContract}<input type="hidden" name="for" value="contract" />{/if}
	{#if errors?.form}
		<Alert tone="critical" title="Der Mieter wurde nicht gespeichert" testid="form-error">
			<p>{errors.form}</p>
		</Alert>
	{/if}
	<TenantFormFields {tenant} errors={errors ?? {}} />

	<div class="flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:justify-end">
		<Button href={cancelHref} testid="form-cancel">Abbrechen</Button>
		<Button
			type="submit"
			variant="primary"
			icon={submitIcon}
			busy={saving}
			busyLabel="Wird gespeichert …"
			testid="tenant-submit">{submitLabel}</Button
		>
	</div>
</form>
