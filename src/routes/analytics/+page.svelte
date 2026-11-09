<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Select from '$lib/ui/Select.svelte';
	import ReportSection from './ReportSection.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	// the building and year chosen, reset by each loaded report; while they differ from the report shown, no download
	// of it (personas Helga P-1, Sven P-3, Marco P-5, 1409-2)
	let building = $derived(data.buildingId ?? '');
	let year = $derived(String(data.report?.year ?? ''));
	const shown = $derived(
		building === (data.buildingId ?? '') && year === String(data.report?.year ?? '')
	);
</script>

<svelte:head>
	<title>{m.analytics_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader title={m.analytics_title()} purpose={m.analytics_purpose()} />
	{#if !data.report}
		<EmptyState
			testid="analytics-empty"
			illustration="building"
			title={m.buildings_none_yet()}
			text={m.buildings_none_yet_text()}
			actionLabel={m.buildings_add()}
			actionHref="/buildings/new"
		/>
	{:else}
		<form method="GET" class="flex flex-col gap-4 sm:flex-row sm:items-end">
			<Select
				id="annual-report-building"
				name="building"
				label={m.analytics_building_label()}
				options={data.buildings}
				bind:value={building}
				testid="annual-report-building"
			/>
			<Select
				id="annual-report-year"
				name="year"
				label={m.analytics_year_label()}
				help={m.analytics_year_help()}
				options={data.years.map((year) => ({ value: year, label: year }))}
				bind:value={year}
				testid="annual-report-year"
			/>
			<Button type="submit" variant="primary" testid="annual-report-show"
				>{m.analytics_show()}</Button
			>
		</form>

		<section aria-labelledby="annual-report-heading" class="flex flex-col gap-8">
			<h2
				id="annual-report-heading"
				class="text-xl font-bold text-ink"
				data-testid="annual-report-heading"
			>
				{m.analytics_report_heading({ building: data.buildingName, year: data.report.year })}
			</h2>
			{#if data.report.year >= data.currentYear}
				<Alert
					title={m.analytics_current_year({ year: data.report.year })}
					testid="annual-report-current-year"
				/>
			{/if}

			{#each data.report.sections as section (section.key)}
				<ReportSection {section} />
			{/each}
			<div class="flex flex-col gap-4 sm:flex-row">
				{#each shown ? ['csv', 'pdf'] : [] as kind (kind)}
					<Button
						href="/analytics/{kind}?building={data.buildingId}&year={data.report.year}"
						download
						testid="annual-report-{kind}"
						>{kind === 'csv' ? m.analytics_download_csv() : m.analytics_download_pdf()}</Button
					>
				{/each}
			</div>
		</section>
	{/if}
</div>
