<script lang="ts">
	import FieldError from './FieldError.svelte';

	// What the invoice says: building, date, amount, supplier and service; shared by "Neue Rechnung" and "Rechnung bearbeiten"
	let {
		buildingId = $bindable(),
		invoiceDate = $bindable(),
		amount = $bindable(),
		billingEntity = $bindable(),
		description = $bindable(),
		buildings,
		errors,
		onblur
	}: {
		buildingId: string;
		invoiceDate: string;
		amount: string;
		billingEntity: string;
		description: string;
		buildings: { id: string; name: string; address: string }[];
		errors: Record<string, string>;
		onblur?: () => void;
	} = $props();

	const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
	const inputClass = (field: string) =>
		`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;
</script>

<div class="grid gap-4 sm:grid-cols-2">
	<div class="sm:col-span-2">
		<label for="building" class={labelClass}>Gebäude <span class="text-red-500">*</span></label>
		<select id="building" data-testid="invoice-building-select" bind:value={buildingId} class={inputClass('buildingId')}>
			<option value="">Gebäude auswählen...</option>
			{#each buildings as building (building.id)}
				<option value={building.id}>{building.name} - {building.address}</option>
			{/each}
		</select>
		<FieldError message={errors.buildingId} />
	</div>

	<div>
		<label for="invoiceDate" class={labelClass}>Rechnungsdatum <span class="text-red-500">*</span></label>
		<input
			id="invoiceDate"
			data-testid="invoice-date-input"
			type="date"
			bind:value={invoiceDate}
			class={inputClass('invoiceDate')}
		/>
		<FieldError message={errors.invoiceDate} />
	</div>

	<div>
		<label for="amount" class={labelClass}>Betrag (CHF) <span class="text-red-500">*</span></label>
		<input
			id="amount"
			data-testid="invoice-amount-input"
			type="number"
			step="0.01"
			min="0"
			bind:value={amount}
			placeholder="0.00"
			class={inputClass('amount')}
		/>
		<FieldError message={errors.amount} />
	</div>

	<div class="sm:col-span-2">
		<label for="billingEntity" class={labelClass}>Lieferant / Rechnungssteller <span class="text-red-500">*</span></label>
		<input
			id="billingEntity"
			data-testid="invoice-billing-entity-input"
			type="text"
			bind:value={billingEntity}
			{onblur}
			placeholder="z.B. Energie Zürich AG"
			class={inputClass('billingEntity')}
		/>
		<FieldError message={errors.billingEntity} />
	</div>

	<div class="sm:col-span-2">
		<label for="description" class={labelClass}>Beschreibung <span class="text-red-500">*</span></label>
		<textarea
			id="description"
			data-testid="invoice-description-input"
			bind:value={description}
			{onblur}
			rows={3}
			placeholder="z.B. Heizöllieferung Q4 2024"
			class="{inputClass('description')} resize-none"
		></textarea>
		<FieldError message={errors.description} />
	</div>
</div>
