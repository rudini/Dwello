<script lang="ts">
	import HeatingProfileChart from '$lib/ui/HeatingProfileChart.svelte';
	import type { HeatingProfile } from '$lib/types';
	import { germanName } from '$lib/names';
	import Alert from '$lib/ui/Alert.svelte';
	import Field from '$lib/ui/Field.svelte';
	import Select from '$lib/ui/Select.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { controlClass } from '$lib/ui/field';
	import { keepEarlyChoice } from '$lib/early-choice';

	// Step 3: how heating costs spread over the months, and the Verwaltungspauschale of this run
	let {
		heatingProfiles,
		distributionKeys,
		heatingProfileId = $bindable(),
		managementFeePercent = $bindable(),
		managementFeeDistributionKeyId = $bindable(),
		errors
	}: {
		heatingProfiles: HeatingProfile[];
		distributionKeys: { id: string; name: string }[];
		heatingProfileId: string;
		managementFeePercent: number;
		managementFeeDistributionKeyId: string;
		errors: Record<string, string>;
	} = $props();

	// 3 % is the usual guideline for Swiss utility statements, not a limit
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
	const fee = $derived(String(managementFeePercent ?? ''));
</script>

<Field
	id="heatingProfile"
	label="Heizprofil"
	help="Verteilt die Heizkosten bei einem Mieterwechsel auf die Monate; wählen Sie das Profil, das Ihre Mietverträge vorsehen. Wurden beim Mieterwechsel die Zähler abgelesen, gelten diese Werte. Nur Heizprofile mit zusammen 100 % lassen sich wählen."
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
					{germanName(profile)} ({+sum(profile).toFixed(1)}%){complete(profile)
						? ''
						: ' - nicht wählbar'}
				</option>
			{/each}
		</select>
	{/snippet}
</Field>
{#if ownDescription}<p class="text-ink-muted">{ownDescription}</p>{/if}
<HeatingProfileChart shares={selected?.monthlyPercentages} />

<TextInput
	id="managementFeePercent"
	label="Verwaltungspauschale in %"
	type="number"
	help="Prozentsatz der Nebenkosten der Liegenschaft, gilt für alle Abrechnungen dieses Laufs. Üblich sind bis {USUAL_MAXIMUM} %. Verlangen Sie eine Verwaltungspauschale nur, wenn sie im Mietvertrag vereinbart ist. Sonst geben Sie 0 ein."
	bind:value={() => fee, (v) => (managementFeePercent = v === '' ? NaN : Number(v))}
	error={errors.managementFeePercent}
	testid="management-fee-input"
/>
{#if managementFeePercent > USUAL_MAXIMUM}
	<Alert tone="caution" title="Über dem üblichen Richtwert" testid="management-fee-hint">
		<p>
			Die Verwaltungspauschale ist höher als der übliche Richtwert von {USUAL_MAXIMUM} %. Prüfen Sie,
			ob der Mehraufwand begründet ist.
		</p>
	</Alert>
{/if}

<Select
	id="managementFeeDistributionKeyId"
	label="Verteilung der Verwaltungspauschale"
	help="Nach diesem Verteilschlüssel wird die Pauschale auf die Wohnungen verteilt; jeder Mieter trägt den Teil seiner Mietstage."
	options={[
		{ value: '', label: 'Gleichmässig pro Wohnung' },
		...distributionKeys.map((key) => ({ value: key.id, label: key.name }))
	]}
	bind:value={managementFeeDistributionKeyId}
	testid="management-fee-key-select"
/>
