<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';
	import KiModelState from './KiModelState.svelte';
	import ProviderChecklist from './ProviderChecklist.svelte';
	import ProviderFields from './ProviderFields.svelte';
	import type { ActionData, PageData } from './$types';

	// #580: which KI reads and categorizes invoices; the API key is never shown again, only that one is stored
	let { data, form }: { data: PageData; form: ActionData } = $props();

	const result = $derived(
		form as { errors?: Record<string, string>; saved?: boolean; check?: string } | null
	);
	const errors = $derived(result?.errors ?? {});
	const ki = $derived(data.ki);
	// svelte-ignore state_referenced_locally
	let mode = $state(data.ki.mode);
	let busy = $state('');

	const choices = $derived([
		{ value: 'local', label: m.ki_settings_local(), description: m.ki_settings_local_help() },
		{
			value: 'provider',
			label: m.ki_settings_provider(),
			description: m.ki_settings_provider_help()
		},
		{ value: 'none', label: m.ki_settings_none(), description: m.ki_settings_none_help() }
	]);
	const chosen = $derived(choices.find((choice) => choice.value === ki.mode)?.label ?? '');
</script>

<svelte:head>
	<title>{m.ki_settings_title()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8" data-testid="ki-settings-page">
	<PageHeader title={m.ki_settings_title()} purpose={m.ki_settings_purpose()} />

	{#if ki.byOperator}
		<Alert tone="info" title={chosen} testid="ki-locked">
			<p>{m.ki_settings_locked()}</p>
		</Alert>
		<Panel title={m.ki_settings_title()}>
			<ProviderFields {ki} {errors} locked />
		</Panel>
	{:else}
		<form
			method="POST"
			action="?/save"
			use:enhance={({ action }) => {
				busy = action.search;
				return async ({ update, formElement }) => {
					await update({ reset: false });
					busy = '';
					focusFirstError(formElement);
				};
			}}
			class="flex flex-col gap-8"
			novalidate
		>
			<Panel title={m.ki_settings_title()}>
				<RadioGroup
					name="mode"
					legend={m.ki_settings_choice()}
					options={choices}
					bind:value={mode}
					testid="ki-mode"
				/>
			</Panel>

			{#if mode === 'provider'}
				<Panel title={m.ki_settings_provider()}>
					<ProviderFields {ki} {errors} locked={false} />
				</Panel>
				<Panel title={m.ki_settings_checklist_title()}>
					<ProviderChecklist
						error={errors.confirmed}
						check={result?.check}
						checking={busy === '?/check'}
					/>
				</Panel>
			{/if}

			{#if errors.form}
				<Alert tone="critical" title={m.ki_settings_not_saved()} testid="form-error">
					<p>{errors.form}</p>
				</Alert>
			{/if}
			<div role="status">
				{#if result?.saved}
					<Alert tone="positive" title={m.settings_saved()} testid="ki-saved">
						<p>{m.ki_settings_saved()}</p>
					</Alert>
				{/if}
			</div>
			<div>
				<Button
					type="submit"
					variant="primary"
					icon="save"
					busy={busy === '?/save'}
					busyLabel={m.ui_saving()}
					testid="ki-save-button">{m.ki_settings_save()}</Button
				>
			</div>
		</form>
	{/if}

	{#if ki.mode === 'local'}
		<KiModelState model={data.model} />
	{/if}
</div>
