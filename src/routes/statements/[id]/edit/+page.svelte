<script lang="ts">
	import type { StatementWithDetails, Category, DistributionKey, StatementLineItem } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';

	interface StatementEditData {
		statement: StatementWithDetails;
		categories: Category[];
		distributionKeys: DistributionKey[];
	}

	let { data }: { data: StatementEditData } = $props();

	// Extract initial values from props (these don't need to be reactive to data changes)
	const statement = $derived(data.statement);
	const categories = $derived(categories);
	const distributionKeys = $derived(distributionKeys);
	const totalAdvancePayments = $derived(data.statement.totalAdvancePayments);

	// Form state - initialized once from props
	let statementDate = $state('');
	let paymentDeadline = $state('');
	let managementFeePercentage = $state(3); // Default 3%
	let lineItems = $state<StatementLineItem[]>([]);

	// Initialize form values
	$effect(() => {
		statementDate = data.statement.statementDate;
		paymentDeadline = data.statement.paymentDeadline;
		lineItems = [...data.statement.lineItems];
	});

	// Modal state
	let showAddLineModal = $state(false);
	let editingLineIndex = $state<number | null>(null);
	let newLine = $state<Partial<StatementLineItem>>({
		categoryId: '',
		distributionKeyId: '',
		totalAmount: 0,
		tenantShare: 0,
		percentage: 21
	});

	// Computed values
	const totalCosts = $derived(lineItems.reduce((sum, item) => sum + item.tenantShare, 0));
	const managementFee = $derived(totalCosts * (managementFeePercentage / 100));
	const totalWithFee = $derived(totalCosts + managementFee);
	const balance = $derived(totalWithFee - totalAdvancePayments);

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF'
		}).format(amount);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('de-CH');
	}

	function getBalanceClass(balance: number): string {
		if (balance > 0) return 'text-red-600';
		if (balance < 0) return 'text-green-600';
		return 'text-gray-600';
	}

	function getBalanceLabel(balance: number): string {
		if (balance > 0) return 'Nachzahlung';
		if (balance < 0) return 'Rückerstattung';
		return 'Ausgeglichen';
	}

	function openAddLineModal() {
		newLine = {
			categoryId: '',
			distributionKeyId: '',
			totalAmount: 0,
			tenantShare: 0,
			percentage: 21
		};
		editingLineIndex = null;
		showAddLineModal = true;
	}

	function openEditLineModal(index: number) {
		const item = lineItems[index];
		newLine = { ...item };
		editingLineIndex = index;
		showAddLineModal = true;
	}

	function closeLineModal() {
		showAddLineModal = false;
		editingLineIndex = null;
		newLine = {
			categoryId: '',
			distributionKeyId: '',
			totalAmount: 0,
			tenantShare: 0,
			percentage: 21
		};
	}

	function saveLineItem() {
		const category = categories.find((c) => c.id === newLine.categoryId);
		const distributionKey = distributionKeys.find((d) => d.id === newLine.distributionKeyId);

		const lineItem: StatementLineItem = {
			id: editingLineIndex !== null ? lineItems[editingLineIndex].id : `li-new-${Date.now()}`,
			categoryId: newLine.categoryId!,
			categoryName: category?.name || '',
			distributionKeyId: newLine.distributionKeyId,
			distributionKeyName: distributionKey?.name,
			totalAmount: newLine.totalAmount!,
			tenantShare: newLine.tenantShare!,
			percentage: newLine.percentage!
		};

		if (editingLineIndex !== null) {
			lineItems[editingLineIndex] = lineItem;
		} else {
			lineItems = [...lineItems, lineItem];
		}

		closeLineModal();
	}

	function removeLineItem(index: number) {
		lineItems = lineItems.filter((_, i) => i !== index);
	}

	function updateTenantShare() {
		if (newLine.totalAmount && newLine.percentage) {
			newLine.tenantShare = (newLine.totalAmount * newLine.percentage) / 100;
		}
	}

	function handleSave() {
		// TODO: Implement save logic
		console.log('Saving statement...', {
			statementDate,
			paymentDeadline,
			managementFeePercentage,
			lineItems
		});
	}
</script>

<svelte:head>
	<title>Abrechnung bearbeiten - {statement.statementNumber} - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex items-center gap-4">
			<a
				href="/statements/{statement.id}"
				class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
			>
				<Icon name="arrow_back" size={24} />
			</a>
			<div>
				<div class="flex items-center gap-3">
					<h1 class="text-2xl font-bold text-gray-900">{statement.statementNumber}</h1>
					<Badge variant="default">Entwurf</Badge>
				</div>
				<p class="text-gray-500 mt-1">
					{statement.tenantName} · {statement.apartmentUnit}
				</p>
			</div>
		</div>
		<div class="flex items-center gap-3">
			<Button href="/statements/{statement.id}" variant="secondary">Abbrechen</Button>
			<Button variant="primary" onclick={handleSave}>
				<Icon name="save" size={20} />
				Speichern
			</Button>
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Main Content -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Statement Details -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Abrechnungsdetails</h2>

				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label for="statementDate" class="block text-sm font-medium text-gray-700 mb-2">
							Abrechnungsdatum
						</label>
						<input
							id="statementDate"
							type="date"
							bind:value={statementDate}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="paymentDeadline" class="block text-sm font-medium text-gray-700 mb-2">
							Zahlungsfrist
						</label>
						<input
							id="paymentDeadline"
							type="date"
							bind:value={paymentDeadline}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="managementFee" class="block text-sm font-medium text-gray-700 mb-2">
							Verwaltungspauschale (%)
						</label>
						<input
							id="managementFee"
							type="number"
							min="0"
							max="3"
							step="0.1"
							bind:value={managementFeePercentage}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
						<p class="text-xs text-gray-500 mt-1">Max. 3% gemäss Schweizer Mietrecht</p>
					</div>
				</div>
			</Card>

			<!-- Line Items -->
			<Card>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-semibold text-gray-900">Kostenpositionen</h2>
					<Button variant="secondary" size="sm" onclick={openAddLineModal}>
						<Icon name="add" size={18} />
						Position hinzufügen
					</Button>
				</div>

				{#if lineItems.length === 0}
					<div class="text-center py-8 text-gray-500">
						<Icon name="receipt" size={48} class="mx-auto text-gray-300 mb-3" />
						<p>Keine Kostenpositionen vorhanden</p>
						<Button variant="secondary" size="sm" onclick={openAddLineModal} class="mt-4">
							<Icon name="add" size={18} />
							Erste Position hinzufügen
						</Button>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="bg-gray-50 border-b border-gray-200">
								<tr>
									<th
										class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
									>
										Kategorie
									</th>
									<th
										class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
									>
										Verteilschlüssel
									</th>
									<th
										class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
									>
										Gesamtkosten
									</th>
									<th
										class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
									>
										Anteil
									</th>
									<th
										class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
									>
										Mieteranteil
									</th>
									<th class="px-4 py-3 text-right"></th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each lineItems as item, index}
									<tr class="hover:bg-gray-50">
										<td class="px-4 py-3 text-sm text-gray-900">{item.categoryName}</td>
										<td class="px-4 py-3 text-sm text-gray-500">
											{item.distributionKeyName || '-'}
										</td>
										<td class="px-4 py-3 text-sm text-gray-900 text-right">
											{formatCurrency(item.totalAmount)}
										</td>
										<td class="px-4 py-3 text-sm text-gray-500 text-right">{item.percentage}%</td>
										<td class="px-4 py-3 text-sm font-medium text-gray-900 text-right">
											{formatCurrency(item.tenantShare)}
										</td>
										<td class="px-4 py-3 text-right">
											<div class="flex items-center justify-end gap-1">
												<button
													onclick={() => openEditLineModal(index)}
													class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
													title="Bearbeiten"
												>
													<Icon name="edit" size={16} />
												</button>
												<button
													onclick={() => removeLineItem(index)}
													class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
													title="Entfernen"
												>
													<Icon name="delete" size={16} />
												</button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</Card>
		</div>

		<!-- Sidebar - Summary -->
		<div class="space-y-6">
			<!-- Tenant Info -->
			<Card>
				<h3 class="text-sm font-medium text-gray-500 mb-3">Mieter</h3>
				<p class="font-medium text-gray-900">{statement.tenantName}</p>
				<p class="text-sm text-gray-500 mt-1">{statement.buildingName}</p>
				<p class="text-sm text-gray-500">
					Wohnung {statement.apartmentUnit} · {statement.apartmentFloor}
				</p>
			</Card>

			<!-- Period Info -->
			<Card>
				<h3 class="text-sm font-medium text-gray-500 mb-3">Abrechnungsperiode</h3>
				<p class="font-medium text-gray-900">
					{formatDate(statement.periodStart)} - {formatDate(statement.periodEnd)}
				</p>
				<p class="text-sm text-gray-500 mt-1">{statement.rentalDays} Tage</p>
			</Card>

			<!-- Cost Summary -->
			<Card>
				<h3 class="text-sm font-medium text-gray-500 mb-4">Kostenübersicht</h3>

				<div class="space-y-3">
					<div class="flex justify-between text-sm">
						<span class="text-gray-600">Nebenkosten</span>
						<span class="font-medium text-gray-900">{formatCurrency(totalCosts)}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-600">Verwaltungspauschale ({managementFeePercentage}%)</span>
						<span class="font-medium text-gray-900">{formatCurrency(managementFee)}</span>
					</div>
					<div class="border-t border-gray-200 pt-3 flex justify-between text-sm">
						<span class="text-gray-600">Gesamtkosten</span>
						<span class="font-semibold text-gray-900">{formatCurrency(totalWithFee)}</span>
					</div>
					<div class="flex justify-between text-sm">
						<span class="text-gray-600">Akontobeiträge</span>
						<span class="font-medium text-gray-900">
							- {formatCurrency(totalAdvancePayments)}
						</span>
					</div>
					<div class="border-t border-gray-200 pt-3 flex justify-between">
						<span class="font-semibold text-gray-900">Saldo</span>
						<div class="text-right">
							<span class="font-bold text-lg {getBalanceClass(balance)}">
								{formatCurrency(Math.abs(balance))}
							</span>
							<p class="text-xs text-gray-500">{getBalanceLabel(balance)}</p>
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>
</div>

<!-- Add/Edit Line Item Modal -->
{#if showAddLineModal}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-center justify-center p-4">
			<button type="button" class="fixed inset-0 bg-black/50 cursor-default" onclick={closeLineModal} aria-label="Schliessen"></button>
			<div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-900">
						{editingLineIndex !== null ? 'Position bearbeiten' : 'Position hinzufügen'}
					</h3>
					<button
						onclick={closeLineModal}
						class="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
					>
						<Icon name="close" size={20} />
					</button>
				</div>

				<div class="space-y-4">
					<div>
						<label for="lineCategory" class="block text-sm font-medium text-gray-700 mb-2">
							Kategorie
						</label>
						<select
							id="lineCategory"
							bind:value={newLine.categoryId}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Kategorie wählen...</option>
							{#each categories as category}
								<option value={category.id}>{category.name}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="lineDistKey" class="block text-sm font-medium text-gray-700 mb-2">
							Verteilschlüssel
						</label>
						<select
							id="lineDistKey"
							bind:value={newLine.distributionKeyId}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Verteilschlüssel wählen...</option>
							{#each distributionKeys as key}
								<option value={key.id}>{key.name}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="lineTotalAmount" class="block text-sm font-medium text-gray-700 mb-2">
							Gesamtkosten (CHF)
						</label>
						<input
							id="lineTotalAmount"
							type="number"
							min="0"
							step="0.01"
							bind:value={newLine.totalAmount}
							oninput={updateTenantShare}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label for="linePercentage" class="block text-sm font-medium text-gray-700 mb-2">
							Mieteranteil (%)
						</label>
						<input
							id="linePercentage"
							type="number"
							min="0"
							max="100"
							step="0.1"
							bind:value={newLine.percentage}
							oninput={updateTenantShare}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label for="lineTenantShare" class="block text-sm font-medium text-gray-700 mb-2">
							Mieteranteil (CHF)
						</label>
						<input
							id="lineTenantShare"
							type="number"
							min="0"
							step="0.01"
							bind:value={newLine.tenantShare}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
							readonly
						/>
					</div>
				</div>

				<div class="flex items-center justify-end gap-3 mt-6">
					<Button variant="secondary" onclick={closeLineModal}>Abbrechen</Button>
					<Button
						variant="primary"
						onclick={saveLineItem}
						disabled={!newLine.categoryId || !newLine.totalAmount}
					>
						{editingLineIndex !== null ? 'Speichern' : 'Hinzufügen'}
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
