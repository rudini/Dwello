<script lang="ts">
	import { enhance } from '$app/forms';
	import type { HeatingProfileEditData } from './+page.server';
	import type { ActionData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';

	let { data, form }: { data: HeatingProfileEditData; form: ActionData } = $props();

	const profile = $derived(data.profile);

	// Form state
	let name = $state(data.profile.name);
	let description = $state(data.profile.description || '');
	let january = $state(data.profile.monthlyPercentages.january);
	let february = $state(data.profile.monthlyPercentages.february);
	let march = $state(data.profile.monthlyPercentages.march);
	let april = $state(data.profile.monthlyPercentages.april);
	let may = $state(data.profile.monthlyPercentages.may);
	let june = $state(data.profile.monthlyPercentages.june);
	let july = $state(data.profile.monthlyPercentages.july);
	let august = $state(data.profile.monthlyPercentages.august);
	let september = $state(data.profile.monthlyPercentages.september);
	let october = $state(data.profile.monthlyPercentages.october);
	let november = $state(data.profile.monthlyPercentages.november);
	let december = $state(data.profile.monthlyPercentages.december);

	let isSubmitting = $state(false);

	// Get errors from form action
	const errors = $derived(form?.errors || {});

	// Calculate total
	const total = $derived(
		january + february + march + april + may + june +
		july + august + september + october + november + december
	);

	const months = [
		{ key: 'january', label: 'Januar', get: () => january, set: (v: number) => january = v },
		{ key: 'february', label: 'Februar', get: () => february, set: (v: number) => february = v },
		{ key: 'march', label: 'März', get: () => march, set: (v: number) => march = v },
		{ key: 'april', label: 'April', get: () => april, set: (v: number) => april = v },
		{ key: 'may', label: 'Mai', get: () => may, set: (v: number) => may = v },
		{ key: 'june', label: 'Juni', get: () => june, set: (v: number) => june = v },
		{ key: 'july', label: 'Juli', get: () => july, set: (v: number) => july = v },
		{ key: 'august', label: 'August', get: () => august, set: (v: number) => august = v },
		{ key: 'september', label: 'September', get: () => september, set: (v: number) => september = v },
		{ key: 'october', label: 'Oktober', get: () => october, set: (v: number) => october = v },
		{ key: 'november', label: 'November', get: () => november, set: (v: number) => november = v },
		{ key: 'december', label: 'Dezember', get: () => december, set: (v: number) => december = v }
	];
</script>

<svelte:head>
	<title>Heizprofil bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/config" class="hover:text-primary transition-colors">Einstellungen</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/config/heating-profiles" class="hover:text-primary transition-colors">Heizprofile</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/config/heating-profiles/{profile.id}" class="hover:text-primary transition-colors">{profile.name}</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Bearbeiten</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Heizprofil bearbeiten</h1>
		<p class="text-gray-500 mt-1">Passen Sie die monatliche Verteilung der Heizkosten an.</p>
	</div>

	<!-- Form -->
	<Card>
		<form method="POST" use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}} class="space-y-6">
			{#if errors.form}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<p class="text-sm text-red-700">{errors.form}</p>
				</div>
			{/if}

			<!-- Name -->
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700 mb-1">
					Profilname <span class="text-red-500">*</span>
				</label>
				<input
					id="name"
					name="name"
					type="text"
					bind:value={name}
					placeholder="z.B. Eigenes Profil"
					class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.name ? 'border-red-500' : 'border-gray-300'}"
				/>
				{#if errors.name}
					<p class="mt-1 text-sm text-red-600">{errors.name}</p>
				{/if}
			</div>

			<!-- Description -->
			<div>
				<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
					Beschreibung <span class="text-gray-400">(optional)</span>
				</label>
				<textarea
					id="description"
					name="description"
					bind:value={description}
					rows="2"
					placeholder="Kurze Beschreibung des Profils..."
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
				></textarea>
			</div>

			<!-- Monthly Percentages -->
			<div class="border-t border-gray-200 pt-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-sm font-medium text-gray-700">Monatliche Verteilung</h3>
					<div class="text-sm">
						<span class="text-gray-500">Summe:</span>
						<span class="ml-1 font-semibold {total >= 95 && total <= 105 ? 'text-green-600' : 'text-red-600'}">
							{total}%
						</span>
					</div>
				</div>

				{#if errors.total}
					<div class="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
						<p class="text-sm text-amber-700">{errors.total}</p>
					</div>
				{/if}

				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{#each months as month}
						<div>
							<label for={month.key} class="block text-xs font-medium text-gray-600 mb-1">
								{month.label}
							</label>
							<div class="relative">
								<input
									id={month.key}
									name={month.key}
									type="number"
									min="0"
									max="100"
									value={month.get()}
									oninput={(e) => month.set(parseInt(e.currentTarget.value) || 0)}
									class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
								/>
								<span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
							</div>
						</div>
					{/each}
				</div>

				<p class="mt-4 text-xs text-gray-500">
					Die Summe aller Monatsanteile sollte 100% ergeben. Werte zwischen 95% und 105% werden akzeptiert.
				</p>
			</div>

			<!-- Preview Chart -->
			<div class="border-t border-gray-200 pt-6">
				<h3 class="text-sm font-medium text-gray-700 mb-4">Vorschau</h3>
				<div class="h-32 flex items-end gap-1 bg-gray-50 rounded-lg p-2">
					{#each months as month}
						{@const value = month.get()}
						<div class="flex-1 flex flex-col items-center justify-end h-full">
							<div
								class="w-full rounded-t transition-all duration-300 {value > 0 ? 'bg-primary' : 'bg-gray-200'}"
								style="height: {value > 0 ? Math.max((value / 20) * 100, 8) : 4}%"
							></div>
						</div>
					{/each}
				</div>
				<div class="flex gap-1 text-xs text-gray-500 mt-1">
					{#each months as month}
						<div class="flex-1 text-center">{month.label.slice(0, 3)}</div>
					{/each}
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 pt-4 border-t border-gray-200">
				<Button href="/config/heating-profiles/{profile.id}" variant="secondary">Abbrechen</Button>
				<Button type="submit" variant="primary" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="animate-spin">
							<Icon name="refresh" size={18} />
						</span>
						Wird gespeichert...
					{:else}
						<Icon name="save" size={18} />
						Änderungen speichern
					{/if}
				</Button>
			</div>
		</form>
	</Card>
</div>
