<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ConfigLinks from './ConfigLinks.svelte';
	import DefaultsSection from './DefaultsSection.svelte';
	import SettingField from './SettingField.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const settings = $derived(data.settings);
	const result = $derived(form as { errors?: Record<string, string>; saved?: boolean } | null);
	const errors = $derived(result?.errors ?? {});
	const saved = $derived(result?.saved === true);
</script>

<svelte:head>
	<title>Einstellungen - Dwello</title>
</svelte:head>

<div class="space-y-6" data-testid="config-page">
	<div>
		<h1 class="text-2xl font-bold text-gray-900" data-testid="page-title">Einstellungen</h1>
		<p class="text-gray-500 mt-1">
			Absender für Abrechnungen und Mahnungen, Standardwerte und Stammdaten
		</p>
	</div>

	<ConfigLinks />

	<form
		method="POST"
		use:enhance={() =>
			({ update }) =>
				update({ reset: false })}
		class="space-y-6"
	>
		<Card>
			<h2
				class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
				data-testid="company-info-section"
			>
				<Icon name="business" size={20} class="text-gray-400" />
				Verwaltung (Absender)
			</h2>
			<div class="grid gap-4 sm:grid-cols-3">
				<SettingField
					class="sm:col-span-3"
					name="companyName"
					label="Firmenname"
					value={settings.companyName}
					placeholder="z.B. Muster Immobilien AG"
				/>
				<SettingField
					class="sm:col-span-3"
					name="companyAddress"
					label="Strasse und Hausnummer"
					value={settings.companyAddress}
					placeholder="z.B. Bahnhofstrasse 1"
				/>
				<SettingField
					name="companyPostalCode"
					label="PLZ"
					value={settings.companyPostalCode}
					error={errors.companyPostalCode}
					placeholder="8001"
				/>
				<SettingField
					class="sm:col-span-2"
					name="companyCity"
					label="Ort"
					value={settings.companyCity}
					placeholder="Zürich"
				/>
				<SettingField
					class="sm:col-span-3"
					name="iban"
					label="IBAN (für QR-Rechnungen und Mahnungen)"
					value={settings.iban}
					error={errors.iban}
					placeholder="CH93 0076 2011 6238 5295 7"
				/>
			</div>
		</Card>

		<Card>
			<h2
				class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
				data-testid="accounting-settings-section"
			>
				<Icon name="calendar_month" size={20} class="text-gray-400" />
				Verwaltungspauschale
			</h2>
			<SettingField
				type="number"
				name="managementFeePercent"
				label="Verwaltungspauschale (%)"
				value={settings.managementFeePercent}
				error={errors.managementFeePercent}
				hint="Vorschlag beim Erstellen der Abrechnungen, pro Liegenschaft und Periode anpassbar. Üblicher Richtwert: bis 3%."
			/>
		</Card>

		<DefaultsSection
			{settings}
			heatingProfiles={data.heatingProfiles}
			distributionKeys={data.distributionKeys}
		/>

		<div class="flex items-center justify-end gap-4">
			<FieldError message={errors.form} />
			{#if saved}
				<p class="text-sm text-green-700 flex items-center gap-1" data-testid="settings-saved">
					<Icon name="check_circle" size={16} />
					Einstellungen gespeichert
				</p>
			{/if}
			<Button type="submit" variant="primary" testid="settings-submit">
				<Icon name="check" size={20} />
				Einstellungen speichern
			</Button>
		</div>
	</form>
</div>
