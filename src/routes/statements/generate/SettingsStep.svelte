<script lang="ts">
	import HeatingProfileChart from '$lib/ui/HeatingProfileChart.svelte';
	import type { HeatingProfile } from '$lib/types';
	import { germanName } from '$lib/names';
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
	// TODO(fachlich prüfen): sources name 3 to 5 % depending on the region (review B, MR2-N2)
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
		managementFeePercent = text.trim() === '' ? NaN : Number(text.replace(',', '.'));
	};
</script>

<Field
	id="heatingProfile"
	label="Heizprofil"
	help="Verteilt die Heizkosten bei einem Mieterwechsel auf die Monate; wählen Sie das Profil, das Ihre Mietverträge vorsehen. Dwello verteilt nach dem Heizprofil und kann Zählerstände nicht berücksichtigen. Wurden beim Mieterwechsel die Zähler für Heizung oder Warmwasser in der Wohnung abgelesen, gelten diese Werte: Erstellen Sie die Abrechnung dieser Wohnung dann ausserhalb von Dwello und löschen Sie die Entwürfe aller Mietverträge dieser Wohnung, auch wenn Sie die Abrechnungen später neu erstellen. Hat Ihr Gebäude in den Wohnungen Wärme- oder Warmwasserzähler oder Heizkostenverteiler (kleine Geräte an den Heizkörpern), müssen Sie meist nach Verbrauch abrechnen. Das kann Dwello nicht: Erstellen Sie die Abrechnungen dann ausserhalb von Dwello. Nur Heizprofile mit zusammen 100 % lassen sich wählen."
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
	inputmode="decimal"
	help="Prozentsatz der eigenen Nebenkosten jedes Mieters, gilt für alle Abrechnungen dieses Laufs. Üblich sind bis {USUAL_MAXIMUM} %. Verlangen Sie eine Verwaltungspauschale nur, wenn sie im Mietvertrag vereinbart ist. Sonst geben Sie 0 ein. Hat ein Mietvertrag einen anderen Satz, löschen Sie danach seinen Entwurf und erstellen Sie ihn mit diesem Satz neu."
	bind:value={() => feeText, typeFee}
	error={errors.managementFeePercent}
	testid="management-fee-input"
/>
<!-- announced while typing: the hint appears without the focus moving -->
<div role="status">
	{#if managementFeePercent > USUAL_MAXIMUM}
		<Alert tone="caution" title="Über dem üblichen Richtwert" testid="management-fee-hint">
			<p>
				Die Verwaltungspauschale ist höher als der übliche Richtwert von {USUAL_MAXIMUM} %. Prüfen Sie,
				ob der Mehraufwand begründet ist.
			</p>
		</Alert>
	{/if}
</div>
