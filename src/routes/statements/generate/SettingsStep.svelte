<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import HeatingProfileChart from '$lib/ui/HeatingProfileChart.svelte';
	import type { HeatingProfile } from '$lib/types';
	import { localName } from '$lib/names';
	import { parsePercent } from '$lib/utils/format';
	import Alert from '$lib/ui/Alert.svelte';
	import Field from '$lib/ui/Field.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { controlClass } from '$lib/ui/field';
	import { keepEarlyChoice } from '$lib/early-choice';

	// Step 3: how heating costs spread over the months, and the Verwaltungspauschale of this run
	let {
		heatingProfiles,
		heatingProfileId = $bindable(),
		managementFeePercent = $bindable(),
		errors
	}: {
		heatingProfiles: HeatingProfile[];
		heatingProfileId: string;
		managementFeePercent: number;
		errors: Record<string, string>;
	} = $props();

	// 3 % is the usual guideline for Swiss utility statements (glossary), not a limit;
	// TODO(fachlich prüfen): sources name 3 to 5 % depending on the region (review B, MR2-N2); the MV leaflet 2026 names
	// at most 3 % as usual (cantonal decisions, BWO 32 Nr. 12)
	const USUAL_MAXIMUM = 3;

	const sum = (profile: HeatingProfile) =>
		Object.values(profile.monthlyPercentages).reduce((total, value) => total + Number(value), 0);
	const complete = (profile: HeatingProfile) => Math.abs(sum(profile) - 100) < 0.01;

	// Preselect the first complete profile
	$effect(() => {
		if (!heatingProfileId) heatingProfileId = heatingProfiles.find(complete)?.id ?? '';
	});

	const selected = $derived(heatingProfiles.find((p) => p.id === heatingProfileId));
	// The predefined profiles' descriptions are English; only an own profile's is shown
	const ownDescription = $derived(selected?.type === 'custom' ? selected.description : '');
	// TODO(fachlich prüfen): the glossary says of the building's costs; the fee is of each tenant's own (offene-punkte.md)
	// The text as typed (a half-typed «4,» stays), the number for the run: comma or point, empty is no rate
	let feeText = $state(Number.isFinite(managementFeePercent) ? String(managementFeePercent) : '');
	const typeFee = (text: string) => {
		feeText = text;
		managementFeePercent = parsePercent(text);
	};
</script>

<Field
	id="heatingProfile"
	label={m.glossary_profile_term()}
	help={m.statements_heating_help()}
	error={errors.heatingProfileId}
>
	{#snippet children(control)}
		<!-- selected options instead of bind:value: a choice made before the page is live survives hydration -->
		<select
			id={control.id}
			onchange={(event) => (heatingProfileId = event.currentTarget.value)}
			use:keepEarlyChoice={(id) => (heatingProfileId = id)}
			aria-required="true"
			aria-describedby={control.describedBy}
			aria-invalid={control.invalid || undefined}
			class={controlClass(control.invalid)}
			data-testid="heating-profile-select"
		>
			{#each heatingProfiles as profile (profile.id)}
				<option
					value={profile.id}
					disabled={!complete(profile)}
					selected={profile.id === heatingProfileId}
					data-testid="heating-profile-option-{profile.id}"
				>
					{localName(profile)} ({+sum(profile).toFixed(1)}%){complete(profile)
						? ''
						: ` - ${m.statements_not_selectable()}`}
				</option>
			{/each}
		</select>
	{/snippet}
</Field>
{#if ownDescription}<p class="text-ink-muted">{ownDescription}</p>{/if}
<HeatingProfileChart shares={selected?.monthlyPercentages} />

<TextInput
	id="managementFeePercent"
	label={m.statements_fee_percent()}
	inputmode="decimal"
	help={m.statements_fee_help({ max: USUAL_MAXIMUM })}
	bind:value={() => feeText, typeFee}
	error={errors.managementFeePercent}
	testid="management-fee-input"
/>
<!-- announced while typing: the hint appears without the focus moving -->
<div role="status">
	{#if managementFeePercent > USUAL_MAXIMUM}
		<Alert tone="caution" title={m.statements_fee_above_title()} testid="management-fee-hint">
			<p>{m.statements_fee_above_text({ max: USUAL_MAXIMUM })}</p>
		</Alert>
	{/if}
</div>
