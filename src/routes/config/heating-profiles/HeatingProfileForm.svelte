<script lang="ts">
	import { untrack } from 'svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import RecordForm from '$lib/components/RecordForm.svelte';
	import HeatingProfileChart from '$lib/components/HeatingProfileChart.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { MONTHS, profileTotal } from '$lib/heating-profile';
	import type { HeatingProfile } from '$lib/types';

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

	const inputClass =
		'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary';
	let shares = $state<Record<string, number>>(
		untrack(() => ({
			...Object.fromEntries(MONTHS.map(({ key }) => [key, 0])),
			...profile?.monthlyPercentages
		}))
	);
	const total = $derived(profileTotal(shares));
	const totalClass = $derived(Math.abs(total - 100) <= 0.1 ? 'text-positive' : 'text-critical');
	const name = $derived(profile?.name ?? '');
	const description = $derived(profile?.description ?? '');
</script>

<RecordForm error={errors.form} {cancelHref} {submitLabel} submitTestid="heating-profile-submit">
	<TextField
		label="Name"
		name="name"
		value={name}
		required
		error={errors.name}
		testid="heating-profile-name-input"
	/>
	<TextField label="Beschreibung" name="description" value={description} />

	<div>
		<div class="flex items-center justify-between mb-3">
			<h3 class="text-sm font-medium text-gray-700">Anteil der Heizkosten pro Monat (%)</h3>
			<p class="text-sm font-semibold {totalClass}" data-testid="heating-profile-form-total">
				Summe: {total} %
			</p>
		</div>
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
			{#each MONTHS as month (month.key)}
				<div>
					<label for={month.key} class="block text-xs font-medium text-gray-600 mb-1"
						>{month.label}</label
					>
					<input
						id={month.key}
						name={month.key}
						type="number"
						min="0"
						max="100"
						step="0.01"
						value={shares[month.key]}
						oninput={(e) => (shares[month.key] = Number(e.currentTarget.value) || 0)}
						data-testid="heating-profile-month-{month.key}"
						class={inputClass}
					/>
				</div>
			{/each}
		</div>
		<FieldError message={errors.total} />
		<p class="mt-2 text-xs text-ink-muted">
			Die Monatsanteile verteilen die Heizkosten eines Jahres und ergeben zusammen 100 %.
		</p>
	</div>

	<HeatingProfileChart {shares} />
</RecordForm>
