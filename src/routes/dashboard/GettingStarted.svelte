<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { DashboardData } from './+page.server';

	// Guides a new manager through the workflow until the first statements exist
	let { portfolio, statements }: Pick<DashboardData, 'portfolio' | 'statements'> = $props();

	const steps = $derived([
		{
			label: 'Gebäude erfassen',
			hint: 'Adresse und Baujahr der Liegenschaft',
			href: '/buildings/new',
			done: portfolio.totalBuildings > 0
		},
		{
			label: 'Wohnungen anlegen',
			hint: 'Nummer, Stockwerk, Fläche und Zimmer je Wohnung',
			href: '/apartments/new',
			done: portfolio.totalApartments > 0
		},
		{
			label: 'Mieter und Mietvertrag erfassen',
			hint: 'Der Vertrag weist der Wohnung ihren Mieter zu',
			href: '/tenants/new',
			done: portfolio.occupiedApartments + portfolio.reletApartments > 0
		},
		{
			label: 'Rechnungen erfassen und Abrechnung erstellen',
			hint: 'Nebenkosten einer Periode auf die Mieter verteilen',
			href: '/invoices/new',
			done: Object.values(statements).some((count) => count > 0)
		}
	]);
	const next = $derived(steps.find((step) => !step.done));

	// Each step is done, the next one to do, or still ahead
	const styles = {
		done: {
			item: 'border-gray-100',
			number: 'bg-green-100 text-positive',
			label: 'line-through text-ink-muted'
		},
		next: { item: 'border-primary bg-primary/5', number: 'bg-primary text-white', label: '' },
		ahead: { item: 'border-gray-100', number: 'bg-gray-100 text-ink-muted', label: '' }
	};
	const styleOf = (step: (typeof steps)[number]) =>
		styles[step.done ? 'done' : step === next ? 'next' : 'ahead'];
</script>

{#if next}
	<div class="bg-white border border-primary/30 rounded-xl p-6" data-testid="getting-started">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
			<div>
				<h2 class="text-lg font-semibold text-gray-900">Erste Schritte</h2>
				<p class="text-sm text-ink-muted">So richten Sie Dwello in vier Schritten ein.</p>
			</div>
			<Button href={next.href} variant="primary" testid="getting-started-next">
				{next.label}
				<Icon name="arrow_forward" size={18} />
			</Button>
		</div>
		<ol class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{#each steps as step, i (step.href)}
				{@const style = styleOf(step)}
				<li
					data-testid="getting-started-step"
					data-done={step.done}
					class="flex items-start gap-3 p-3 rounded-lg border {style.item}"
				>
					<span
						class="flex items-center justify-center size-7 rounded-full text-sm font-semibold shrink-0 {style.number}"
					>
						{#if step.done}<Icon name="check" size={16} />{:else}{i + 1}{/if}
					</span>
					<div class="min-w-0">
						<a href={step.href} class="font-medium text-gray-900 hover:text-primary {style.label}"
							>{step.label}</a
						>
						<p class="text-xs text-ink-muted mt-0.5">{step.hint}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
{/if}
