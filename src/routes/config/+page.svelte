<script lang="ts">
	import { enhance } from '$app/forms';
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
	<title>Einstellungen - Dwello</title>
</svelte:head>

<div class="mx-auto flex max-w-3xl flex-col gap-8" data-testid="config-page">
	<PageHeader
		title="Einstellungen"
		purpose="Absender für Abrechnungen und Mahnungen, Vorschläge für neue Abrechnungen und Rechnungen und die Stammdaten."
	/>

	<ConfigLinks />

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
		<Panel title="Absender">
			<p class="text-ink-muted">
				Steht auf jeder Abrechnung und jeder Mahnung. Mit der IBAN erstellt Dwello die QR-Rechnung.
			</p>
			<SettingField
				name="companyName"
				label="Firmenname"
				value={settings.companyName}
				example="Muster Immobilien AG"
			/>
			<SettingField
				name="companyAddress"
				label="Strasse und Hausnummer"
				value={settings.companyAddress}
				example="Bahnhofstrasse 1"
			/>
			<div class="grid gap-6 sm:grid-cols-3">
				<SettingField
					name="companyPostalCode"
					label="PLZ"
					value={settings.companyPostalCode}
					error={errors.companyPostalCode}
					example="8001"
				/>
				<div class="sm:col-span-2">
					<SettingField
						name="companyCity"
						label="Ort"
						value={settings.companyCity}
						example="Zürich"
					/>
				</div>
			</div>
			<SettingField
				name="iban"
				label="IBAN"
				value={settings.iban}
				error={errors.iban}
				help="Konto, auf das Ihre Mieter Nachzahlungen überweisen; es steht auf der QR-Rechnung."
				example="CH93 0076 2011 6238 5295 7"
			/>
		</Panel>

		<Panel title="Verwaltungspauschale">
			<SettingField
				type="decimal"
				name="managementFeePercent"
				label="Verwaltungspauschale in %"
				value={settings.managementFeePercent}
				error={errors.managementFeePercent}
				help="{help.managementFee} Vorschlag beim Erstellen der Abrechnungen, dort für jeden Lauf anpassbar."
				example="3"
			/>
		</Panel>

		<DefaultsSection
			{settings}
			heatingProfiles={data.heatingProfiles}
			distributionKeys={data.distributionKeys}
		/>

		{#if errors.form}
			<Alert tone="critical" title="Die Einstellungen wurden nicht gespeichert" testid="form-error">
				<p>{errors.form}</p>
			</Alert>
		{/if}
		<div role="status">
			{#if saved}
				<Alert tone="positive" title="Einstellungen gespeichert" testid="settings-saved">
					<p>Absender, Verwaltungspauschale und Vorschläge gespeichert.</p>
				</Alert>
			{/if}
		</div>
		<div>
			<Button
				type="submit"
				variant="primary"
				icon="save"
				busy={saving}
				busyLabel="Wird gespeichert …"
				testid="settings-submit">Einstellungen speichern</Button
			>
		</div>
	</form>
</div>
