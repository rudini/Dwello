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
	// empty fields of the Firmenadresse that the IBAN's error names (#450, persona Helga P-2)
	const missing = $derived((form as { missing?: string[] } | null)?.missing ?? []);
	const namedBy = (field: string) => (missing.includes(field) ? 'iban-error' : undefined);
	const saved = $derived(result?.saved === true);
	let saving = $state(false);
</script>

<svelte:head>
	<title>{m.nav_settings()} - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8" data-testid="config-page">
	<PageHeader title={m.nav_settings()} purpose={m.settings_purpose()} />

	<ConfigLinks />

	<!-- #580: which KI reads and categorizes invoices -->
	<ConfigLinks
		title={m.ki_settings_title()}
		testid="ki-links"
		links={[
			{
				key: 'ki',
				href: '/config/ki',
				label: m.ki_settings_title(),
				text: m.ki_settings_link(),
				icon: 'ai-suggestion'
			}
		]}
	/>

	<!-- #718, part 3: a new Wiederherstellungscode, only where Dwello backs up -->
	{#if data.backup !== 'off'}
		<ConfigLinks
			title={m.backup_settings_title()}
			testid="backup-links"
			links={[
				{
					key: 'backup',
					href: '/config/backup',
					label: m.backup_new_title(),
					text: m.backup_new_link(),
					icon: 'settings'
				}
			]}
		/>
	{/if}

	<!-- #817: read access for an AI program of the landlord's choice -->
	<ConfigLinks
		title={m.ai_keys_title()}
		testid="access-key-links"
		links={[
			{
				key: 'access-keys',
				href: '/config/access-keys',
				label: m.ai_keys_title(),
				text: m.ai_keys_link(),
				icon: 'settings'
			}
		]}
	/>

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

	<!-- #496: everything the landlord entered, as one ZIP; a download, so the page stays open. A form POST: it writes
	     into the Protokoll (Review 496-1 C-2). TODO(fachlich prüfen, #1039): the term «Export aller Daten» -->
	<Panel title={m.config_export_title()}>
		<form method="POST" action="/config/export" class="flex flex-col items-start gap-4">
			<p id="config-export-help" class="text-ink" data-testid="config-export-help">
				{m.config_export_help()}
			</p>
			<Button
				type="submit"
				icon="document-download"
				describedby="config-export-help"
				testid="config-export-button">{m.config_export()}</Button
			>
		</form>
	</Panel>

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
				invalidBy={namedBy('companyName')}
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
					invalidBy={namedBy('companyPostalCode')}
					example="8001"
				/>
				<div class="sm:col-span-2">
					<SettingField
						name="companyCity"
						label={m.buildings_city()}
						value={settings.companyCity}
						example={m.settings_city_example()}
						invalidBy={namedBy('companyCity')}
					/>
				</div>
			</div>
			<!-- #465: in the statement's letterhead only (Fachreview 465-1 V-3) -->
			<SettingField
				type="tel"
				name="companyPhone"
				label={m.tenants_phone()}
				value={settings.companyPhone}
				help={m.settings_phone_help()}
				example="044 123 45 67"
			/>
			<SettingField
				type="email"
				name="companyEmail"
				label={m.tenants_email()}
				value={settings.companyEmail}
				error={errors.companyEmail}
				help={m.settings_email_help()}
				example="info@example.ch"
			/>
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
