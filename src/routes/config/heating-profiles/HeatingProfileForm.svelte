<script lang="ts">
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import HeatingProfileChart from '$lib/components/HeatingProfileChart.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { MONTHS, profileTotal } from '$lib/heating-profile';
	import type { HeatingProfile } from '$lib/types';

	let {
		profile,
		errors = {},
		cancelHref,
		submitLabel
	}: { profile?: HeatingProfile; errors?: Record<string, string>; cancelHref: string; submitLabel: string } = $props();

	const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary';
	let shares = $state<Record<string, number>>(
		untrack(() => ({ ...Object.fromEntries(MONTHS.map(({ key }) => [key, 0])), ...profile?.monthlyPercentages }))
	);
	const total = $derived(profileTotal(shares));
	const totalClass = $derived(Math.abs(total - 100) <= 0.1 ? 'text-green-600' : 'text-red-600');
	const name = $derived(profile?.name ?? '');
	const description = $derived(profile?.description ?? '');
</script>

<form method="POST" use:enhance={() => ({ update }) => update({ reset: false })} class="space-y-6">
	<FieldError message={errors.form} />

	<div>
		<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name <span class="text-red-500">*</span></label>
		<input id="name" name="name" value={name} data-testid="heating-profile-name-input" class={inputClass} />
		<FieldError message={errors.name} />
	</div>
	<div>
		<label for="description" class="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
		<input id="description" name="description" value={description} class={inputClass} />
	</div>

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
					<label for={month.key} class="block text-xs font-medium text-gray-600 mb-1">{month.label}</label>
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
		<p class="mt-2 text-xs text-gray-500">Die Monatsanteile verteilen die Heizkosten eines Jahres und ergeben zusammen 100 %.</p>
	</div>

	<HeatingProfileChart {shares} />

	<div class="flex gap-3 pt-4 border-t border-gray-200">
		<Button href={cancelHref} variant="secondary" testid="form-cancel">Abbrechen</Button>
		<Button type="submit" variant="primary" testid="heating-profile-submit">
			<Icon name="save" size={18} />
			{submitLabel}
		</Button>
	</div>
</form>
