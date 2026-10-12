<script lang="ts">
	import { profileLabel } from '$lib/heating-profile';
	import { localName } from '$lib/names';
	import { m } from '$lib/paraglide/messages';
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
	const NONE: Option = { value: '', label: m.settings_no_suggestion() };

	const periods: Option[] = [
		{ value: 'calendar', label: m.settings_period_calendar() },
		{ value: 'july-june', label: m.settings_period_july() },
		{ value: 'november-october', label: m.settings_period_november() }
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
				label: profileLabel(localName(profile), total),
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

<Panel title={m.settings_suggestions()}>
	<p class="text-ink-muted">
		{m.settings_suggestions_text()}
	</p>
	{@render choice(
		'accountingPeriod',
		m.glossary_period_term(),
		`${help.accountingPeriod} ${m.settings_period_suggested()}`,
		periods
	)}
	{@render choice(
		'defaultHeatingProfileId',
		m.settings_default_profile(),
		`${help.heatingProfile} ${m.settings_profile_complete_only()}`,
		profiles
	)}
	{@render choice(
		'defaultDistributionKeyId',
		m.settings_default_key(),
		`${help.distributionKey} ${m.settings_key_suggested()}`,
		keys
	)}
</Panel>
