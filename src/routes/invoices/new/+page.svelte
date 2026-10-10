<script lang="ts">
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import { localToday } from '$lib/contract-status';
	import { api } from '$lib/api';
	import {
		plainAmount,
		servicePeriodOf,
		suggestionProvenance,
		validateInvoice,
		type Suggestion
	} from '$lib/invoice';
	import { addToast } from '$lib/stores';
	import type { Category } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import InvoiceCategoryFields from '../InvoiceCategoryFields.svelte';
	import InvoiceDataFields from '../InvoiceDataFields.svelte';
	import InvoiceFormActions from '../InvoiceFormActions.svelte';
	import InvoiceSuggestion from './InvoiceSuggestion.svelte';

	let {
		data
	}: {
		data: {
			buildings: { id: string; name: string; address: string }[];
			categories: Category[];
			distributionKeys: { id: string; name: string }[];
			llmAvailable: boolean;
			defaultDistributionKeyId: string;
			buildingId: string;
			returnTo: string | null;
			period?: { start: string; end: string } | null;
		};
	} = $props();

	// Back to where the form was opened from, e.g. the statement wizard
	const back = $derived(data.returnTo ?? '/invoices');

	let buildingId = $state(untrack(() => data.buildingId));
	// From the statement wizard the date stays empty: today would fall outside the period being completed
	let invoiceDate = $state(
		untrack(() => (data.period ? '' : localToday()))
	);
	let servicePeriodStart = $state('');
	let servicePeriodEnd = $state('');
	let billingEntity = $state('');
	let description = $state('');
	let amount = $state('');
	let categoryId = $state('');
	let distributionKeyId = $state(untrack(() => data.defaultDistributionKeyId));
	let isValidUtilityCost = $state(true);

	let categorizing = $state(false);
	let suggestion = $state<Suggestion | null>(null);
	let errors = $state<Record<string, string>>({});
	let saving = $state(false);

	function take(choice: Suggestion | null) {
		if (!choice?.category) return;
		categoryId = choice.category.id;
		isValidUtilityCost = choice.isAllowedUtilityCost;
	}

	// The KI suggests a category once supplier and service are known; a sure suggestion is taken over
	async function categorize() {
		if (!billingEntity.trim() || !description.trim() || !data.llmAvailable) return;
		categorizing = true;
		suggestion = null;
		const response = await api.post<Suggestion>('/invoices/categorize', {
			billingEntityName: billingEntity.trim(),
			description: description.trim(),
			amount: plainAmount(amount) || '0'
		});
		categorizing = false;
		if (response.error) addToast('error', 'Die KI konnte die Rechnung nicht kategorisieren.');
		else if (response.data) {
			suggestion = response.data;
			if (suggestion.confidence >= 0.7) take(suggestion);
		}
	}

	async function save(event: Event) {
		event.preventDefault();
		errors = validateInvoice({
			buildingId,
			invoiceDate,
			servicePeriodStart,
			servicePeriodEnd,
			billingEntity,
			description,
			amount
		});
		if (Object.keys(errors).length) return focusFirstError(event.target as Element);

		saving = true;
		const response = await api.post('/invoices', {
			buildingId,
			invoiceDate,
			...servicePeriodOf({ servicePeriodStart, servicePeriodEnd }),
			billingEntityName: billingEntity.trim(),
			description: description.trim(),
			amount: plainAmount(amount),
			categoryId: categoryId || null,
			distributionKeyId: distributionKeyId || null,
			isValidUtilityCost,
			...suggestionProvenance(suggestion)
		});
		saving = false;
		if (response.error) {
			addToast('error', 'Die Rechnung konnte nicht gespeichert werden. Versuchen Sie es erneut.');
			return;
		}
		addToast('success', `Rechnung von ${billingEntity.trim()} gespeichert`);
		goto(back);
	}
</script>

<svelte:head>
	<title>Neue Rechnung - Dwello</title>
</svelte:head>

<form onsubmit={save} class="mx-auto flex max-w-3xl flex-col gap-8" novalidate>
	<PageHeader
		title="Neue Rechnung"
		purpose="Erfassen Sie eine Rechnung, damit ihre Kosten in die Nebenkostenabrechnung einfliessen."
		trail={[{ href: '/invoices', label: 'Rechnungen' }]}
	/>

	{#if data.llmAvailable}
		<Alert title="KI-Kategorisierung ist aktiv">
			<p>
				Sobald Rechnungssteller und Beschreibung erfasst sind, schlägt die KI eine Kategorie vor.
			</p>
		</Alert>
	{/if}

	<Panel title="Rechnungsdaten">
		<InvoiceDataFields
			bind:buildingId
			bind:invoiceDate
			bind:servicePeriodStart
			bind:servicePeriodEnd
			bind:amount
			bind:billingEntity
			bind:description
			buildings={data.buildings}
			{errors}
			period={data.period}
			onblur={categorize}
		/>
	</Panel>

	{#if categorizing || suggestion}
		<InvoiceSuggestion {suggestion} onaccept={() => take(suggestion)} />
	{/if}

	<Panel title="Kategorie und Verteilung">
		<InvoiceCategoryFields
			bind:categoryId
			bind:distributionKeyId
			bind:isValidUtilityCost
			categories={data.categories}
			distributionKeys={data.distributionKeys}
		/>
	</Panel>

	<InvoiceFormActions
		cancelHref={back}
		label="Rechnung speichern"
		busyLabel="Wird gespeichert …"
		busy={saving}
	/>
</form>
