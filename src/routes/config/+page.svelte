<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import ConfigLinks from './ConfigLinks.svelte';
	import DefaultsSection from './DefaultsSection.svelte';
	import SettingField from './SettingField.svelte';
	import { help } from './help';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const settings = $derived(data.settings);
	const result = $derived(form as { errors?: Record<string, string>; saved?: boolean } | null);
	const errors = $derived(result?.errors ?? {});
	const saved = $derived(result?.saved === true);
	let saving = $state(false);
</script>

<svelte:head>
	<title>{m.nav_settings()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8" data-testid="config-page">
	<PageHeader title={m.nav_settings()} purpose={m.settings_purpose()} />

	<ConfigLinks />

	<ConfigLinks
		title={m.audit_title()}
		testid="audit-log-links"
		links={[
			{
				key: 'audit-log',
				href: '/config/audit-log',
				label: m.audit_title(),
				text: m.audit_link(),
				icon: 'calendar'
			}
		]}
	/>

	<form
		method="POST"
		use:enhance={() => {
			saving = true;
			return async ({ update, formElement }) => {
				await update({ reset: false });
				saving = false;
				focusFirstError(formElement);
			};
		}}
		class="flex flex-col gap-8"
		novalidate
	>
		<Panel title={m.settings_sender()}>
			<p class="text-ink-muted">
				{m.settings_sender_text()}
			</p>
			<SettingField
				name="companyName"
				label={m.settings_company_name()}
				value={settings.companyName}
				example={m.settings_company_name_example()}
			/>
			<SettingField
				name="companyAddress"
				label={m.buildings_street()}
				value={settings.companyAddress}
				example={m.settings_example_street()}
			/>
			<div class="grid gap-6 sm:grid-cols-3">
				<SettingField
					name="companyPostalCode"
					label={m.buildings_postal_code()}
					value={settings.companyPostalCode}
					error={errors.companyPostalCode}
					example="8001"
				/>
				<div class="sm:col-span-2">
					<SettingField
						name="companyCity"
						label={m.buildings_city()}
						value={settings.companyCity}
						example={m.settings_city_example()}
					/>
				</div>
			</div>
			<SettingField
				name="iban"
				label="IBAN"
				value={settings.iban}
				error={errors.iban}
				help={m.settings_iban_help()}
				example="CH93 0076 2011 6238 5295 7"
			/>
		</Panel>

		<Panel title={m.glossary_fee_term()}>
			<SettingField
				type="decimal"
				name="managementFeePercent"
				label={m.settings_fee_label()}
				value={settings.managementFeePercent}
				error={errors.managementFeePercent}
				help="{help.managementFee} {m.settings_fee_suggestion()}"
				example="3"
			/>
		</Panel>

		<Panel title={m.settings_deadlines()}>
			<SettingField
				type="number"
				name="paymentDeadlineDays"
				label={m.settings_payment_days_label()}
				value={settings.paymentDeadlineDays}
				error={errors.paymentDeadlineDays}
				help={m.settings_payment_days_help()}
			/>
			<SettingField
				type="number"
				name="reminderAfterDays"
				label={m.settings_reminder_days_label()}
				value={settings.reminderAfterDays}
				error={errors.reminderAfterDays}
				help={m.settings_reminder_days_help()}
			/>
		</Panel>

		<DefaultsSection
			{settings}
			heatingProfiles={data.heatingProfiles}
			distributionKeys={data.distributionKeys}
		/>

		{#if errors.form}
			<Alert tone="critical" title={m.settings_not_saved()} testid="form-error">
				<p>{errors.form}</p>
			</Alert>
		{/if}
		<div role="status">
			{#if saved}
				<Alert tone="positive" title={m.settings_saved()} testid="settings-saved">
					<p>{m.settings_saved_text()}</p>
				</Alert>
			{/if}
		</div>
		<div>
			<Button
				type="submit"
				variant="primary"
				icon="save"
				busy={saving}
				busyLabel={m.ui_saving()}
				testid="settings-submit">{m.settings_save()}</Button
			>
		</div>
	</form>
</div>
