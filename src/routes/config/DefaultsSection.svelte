<script lang="ts">
	import { germanName } from '$lib/names';
	import type { Settings } from '$lib/server/settings';
	import type { HeatingProfile } from '$lib/types';
	import Field from '$lib/ui/Field.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { controlClass } from '$lib/ui/field';
	import { help } from './help';

	let {
		settings,
		heatingProfiles,
		distributionKeys
	}: {
		settings: Settings;
		heatingProfiles: HeatingProfile[];
		distributionKeys: { id: string; name: string }[];
	} = $props();

	type Option = { value: string; label: string; disabled?: boolean };
	const NONE: Option = { value: '', label: 'Kein Vorschlag' };

	const periods: Option[] = [
		{ value: 'calendar', label: 'Kalenderjahr (Januar – Dezember)' },
		{ value: 'july-june', label: 'Juli – Juni' },
		{ value: 'november-october', label: 'November – Oktober' }
	];
	// Only profiles summing to 100 % distribute all heating costs
	const profiles = $derived([
		NONE,
		...heatingProfiles.map((profile) => {
			const total =
				Math.round(
					Object.values(profile.monthlyPercentages).reduce((sum, pct) => sum + pct, 0) * 100
				) / 100;
			return {
				value: profile.id,
				label: `${germanName(profile)} (${total}%)`,
				disabled: total !== 100
			};
		})
	]);
	const keys = $derived([
		NONE,
		...distributionKeys.map((key) => ({ value: key.id, label: key.name }))
	]);
</script>

<!-- The stored value as a selected option, not bind:value: a choice made before the page is live survives hydration -->
{#snippet choice(name: keyof Settings, label: string, text: string, options: Option[])}
	<Field id={name} {label} help={text}>
		{#snippet children(control)}
			<select
				id={control.id}
				{name}
				aria-describedby={control.describedBy}
				class={controlClass(false)}
				data-testid="setting-{name}"
			>
				{#each options as option (option.value)}
					<option
						value={option.value}
						disabled={option.disabled}
						selected={option.value === settings[name]}>{option.label}</option
					>
				{/each}
			</select>
		{/snippet}
	</Field>
{/snippet}

<Panel title="Vorschläge für Abrechnungen und Rechnungen">
	<p class="text-ink-muted">
		Dwello schlägt diese Werte vor. Sie können sie beim Erstellen der Abrechnungen und beim Erfassen
		von Rechnungen jedes Mal ändern.
	</p>
	{@render choice(
		'accountingPeriod',
		'Abrechnungsperiode',
		`${help.accountingPeriod} Vorgeschlagen wird jeweils die letzte abgelaufene Periode.`,
		periods
	)}
	{@render choice(
		'defaultHeatingProfileId',
		'Standard-Heizprofil',
		`${help.heatingProfile} Wählbar sind nur Heizprofile, deren Monatsanteile zusammen 100 % ergeben.`,
		profiles
	)}
	{@render choice(
		'defaultDistributionKeyId',
		'Standard-Verteilschlüssel',
		`${help.distributionKey} Dieser wird beim Erfassen neuer Rechnungen vorgeschlagen.`,
		keys
	)}
</Panel>
