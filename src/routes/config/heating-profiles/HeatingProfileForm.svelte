<script lang="ts">
	import { untrack } from 'svelte';
	import HeatingProfileChart from '$lib/ui/HeatingProfileChart.svelte';
	import { MONTHS, profileTotal } from '$lib/heating-profile';
	import type { HeatingProfile } from '$lib/types';
	import Field from '$lib/ui/Field.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { controlClass } from '$lib/ui/field';
	import SaveForm from '../SaveForm.svelte';

	let {
		profile,
		errors = {},
		cancelHref,
		submitLabel
	}: {
		profile?: HeatingProfile;
		errors?: Record<string, string>;
		cancelHref: string;
		submitLabel: string;
	} = $props();

	let name = $state(untrack(() => profile?.name ?? ''));
	let description = $state(untrack(() => profile?.description ?? ''));
	let shares = $state<Record<string, number>>(
		untrack(() => ({
			...Object.fromEntries(MONTHS.map(({ key }) => [key, 0])),
			...profile?.monthlyPercentages
		}))
	);
	const total = $derived(profileTotal(shares));
	const complete = $derived(Math.abs(total - 100) <= 0.1);
	// What is still missing to 100 %, in words, so the sum does not speak by colour alone
	const remainder = $derived(
		complete
			? 'stimmt'
			: total < 100
				? `es fehlen noch ${+(100 - total).toFixed(2)} %`
				: `${+(total - 100).toFixed(2)} % zu viel`
	);
</script>

<SaveForm
	record="Heizprofil"
	error={errors.form}
	{cancelHref}
	{submitLabel}
	submitTestid="heating-profile-submit"
>
	<TextInput
		id="name"
		name="name"
		label="Name"
		example="Heizung Altbau"
		bind:value={name}
		error={errors.name}
		testid="heating-profile-name-input"
	/>
	<TextInput
		id="description"
		name="description"
		label="Beschreibung"
		optional
		bind:value={description}
	/>

	<fieldset class="flex flex-col gap-4" aria-describedby="shares-help">
		<legend class="text-lg font-semibold text-ink">Anteil der Heizkosten pro Monat in %</legend>
		<p id="shares-help" class="text-ink-muted">
			Die Monatsanteile verteilen die Heizkosten eines Jahres und ergeben zusammen 100 %. Im Winter
			wird mehr geheizt als im Sommer.
		</p>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
			{#each MONTHS as month (month.key)}
				<Field id={month.key} label={month.label}>
					{#snippet children(control)}
						<input
							id={control.id}
							name={month.key}
							type="number"
							inputmode="decimal"
							min="0"
							max="100"
							step="0.01"
							value={shares[month.key]}
							oninput={(e) => (shares[month.key] = Number(e.currentTarget.value) || 0)}
							class={controlClass(!!errors.total)}
							data-testid="heating-profile-month-{month.key}"
						/>
					{/snippet}
				</Field>
			{/each}
		</div>
		<p
			class="flex items-center gap-2 font-semibold {complete ? 'text-positive' : 'text-critical'}"
			role="status"
			data-testid="heating-profile-form-total"
		>
			<Icon name={complete ? 'success' : 'warning'} />
			Summe: {total} % – {remainder}
		</p>
		{#if errors.total}
			<p class="flex items-start gap-2 font-semibold text-critical" data-testid="form-error">
				<Icon name="error" />
				{errors.total}
			</p>
		{/if}
	</fieldset>

	<HeatingProfileChart {shares} />
</SaveForm>
