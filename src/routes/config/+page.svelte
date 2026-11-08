<script lang="ts">
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import LiveRegion from '$lib/ui/LiveRegion.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
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
	// #690: before a save, what the stored IBAN lacks
	const errors = $derived(result?.errors ?? data.errors);
	// empty fields of the Firmenadresse that the IBAN's error names (#450, persona Helga P-2)
	const missing = $derived((form as { missing?: string[] } | null)?.missing ?? data.missing);
	// the Kontoinhaber's (#1166) at the error of his name
	const namedBy = (field: string) =>
		missing.includes(field)
			? field.startsWith('accountHolder')
				? 'accountHolderName-error'
				: 'iban-error'
			: undefined;
	// #1166: ticked while no Kontoinhaber of his own is stored; then as the landlord sets it
	const noHolderStored = (stored = data.settings) =>
		!(
			stored.accountHolderName ||
			stored.accountHolderAddress ||
			stored.accountHolderPostalCode ||
			stored.accountHolderCity
		);
	let holderIsSender = $state(noHolderStored());
	const saved = $derived(result?.saved === true);
	// #690 (persona Helga 690 H-4): opened with fields the stored IBAN lacks, two screens down: the first gets the focus,
	// as after a refused save; after the navigation, whose focus reset and scroll to «#sender» would take it (code review
	// 690-3 C-5)
	let settingsForm = $state<HTMLFormElement>();
	afterNavigate(() => {
		// the empty field, not the Kontoinhaber's name that carries the refusal (persona Weber 690 W-7)
		if (data.missing.length) focusFirstError(settingsForm, data.missing);
	});
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
	     into the Protokoll (Review 496-1 C-2). -->
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
		bind:this={settingsForm}
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
		<Panel title={m.settings_sender()} id="sender">
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
				optional
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
		</Panel>

		<!-- #1166: the IBAN with its Kontoinhaber, the Absender unless the box is cleared -->
		<Panel title={m.settings_account()}>
			<SettingField
				name="iban"
				label="IBAN"
				value={settings.iban}
				error={errors.iban}
				help={m.settings_iban_help()}
				example="CH93 0076 2011 6238 5295 7"
			/>
			<Checkbox
				id="accountHolderIsSender"
				name="accountHolderIsSender"
				label={m.settings_account_holder_is_sender()}
				bind:checked={holderIsSender}
				help={m.settings_account_holder_help()}
				testid="setting-accountHolderIsSender"
			/>
			{#if !holderIsSender}
				<fieldset class="flex flex-col gap-6" id="account-holder">
					<legend class="text-lg font-semibold text-ink">{m.settings_account_holder()}</legend>
					<SettingField
						name="accountHolderName"
						label={m.settings_account_holder_name()}
						value={settings.accountHolderName}
						error={errors.accountHolderName}
						invalidBy={namedBy('accountHolderName')}
						example={m.settings_account_holder_name_example()}
					/>
					<SettingField
						name="accountHolderAddress"
						label={m.buildings_street()}
						value={settings.accountHolderAddress}
						optional
						example={m.settings_example_street()}
					/>
					<div class="grid gap-6 sm:grid-cols-3">
						<SettingField
							name="accountHolderPostalCode"
							label={m.buildings_postal_code()}
							value={settings.accountHolderPostalCode}
							error={errors.accountHolderPostalCode}
							invalidBy={namedBy('accountHolderPostalCode')}
							example="8001"
						/>
						<div class="sm:col-span-2">
							<SettingField
								name="accountHolderCity"
								label={m.buildings_city()}
								value={settings.accountHolderCity}
								invalidBy={namedBy('accountHolderCity')}
								example={m.settings_city_example()}
							/>
						</div>
					</div>
				</fieldset>
			{/if}
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

		<!-- #690 (persona Helga 450): every refused save says that none of the fields was saved -->
		{#if result?.errors}
			<Alert tone="critical" title={m.settings_not_saved()} testid="form-error">
				{#if errors.form}<p>{errors.form}</p>{/if}
				<p>{m.settings_not_saved_text()}</p>
			</Alert>
		{/if}
		<LiveRegion shown={saved}>
			<Alert tone="positive" title={m.settings_saved()} testid="settings-saved">
				<p>{m.settings_saved_text()}</p>
			</Alert>
		</LiveRegion>
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
