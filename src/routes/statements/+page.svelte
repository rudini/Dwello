<script lang="ts">
	import type { StatementsListData, StatementStatus } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';

	let { data }: { data: StatementsListData } = $props();

	let searchTerm = $state('');
	let buildingFilter = $state('');
	let statusFilter = $state<StatementStatus | ''>('');

	const filteredStatements = $derived.by(() => {
		return data.statements.filter((statement) => {
			const matchesSearch =
				!searchTerm ||
				statement.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				statement.statementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
				statement.apartmentUnit.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesBuilding = !buildingFilter || statement.buildingId === buildingFilter;
			const matchesStatus = !statusFilter || statement.status === statusFilter;

			return matchesSearch && matchesBuilding && matchesStatus;
		});
	});

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF'
		}).format(amount);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('de-CH');
	}

	function getStatusVariant(status: StatementStatus): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
		switch (status) {
			case 'draft':
				return 'default';
			case 'sent':
				return 'info';
			case 'paid':
				return 'success';
			case 'overdue':
				return 'danger';
			default:
				return 'default';
		}
	}

	function getStatusLabel(status: StatementStatus): string {
		switch (status) {
			case 'draft':
				return 'Entwurf';
			case 'sent':
				return 'Versendet';
			case 'paid':
				return 'Bezahlt';
			case 'overdue':
				return 'Überfällig';
			default:
				return status;
		}
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
</script>

<svelte:head>
	<title>Nebenkostenabrechnungen - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Nebenkostenabrechnungen</h1>
			<p class="text-gray-500 mt-1">{data.total} Abrechnungen</p>
		</div>
		<Button href="/statements/generate" variant="primary">
			<Icon name="add" size={20} />
			Abrechnungen erstellen
		</Button>
	</div>

	<!-- Status Overview Cards -->
	<div class="grid gap-4 sm:grid-cols-4">
		<button
			onclick={() => (statusFilter = statusFilter === 'draft' ? '' : 'draft')}
			class="p-4 bg-white border rounded-xl transition-all {statusFilter === 'draft'
				? 'border-gray-400 shadow-md'
				: 'border-gray-200 hover:border-gray-300'}"
		>
			<div class="flex items-center gap-3">
				<div class="p-2 bg-gray-100 rounded-lg">
					<Icon name="edit_note" size={24} class="text-gray-600" />
				</div>
				<div class="text-left">
					<p class="text-2xl font-bold text-gray-900">{data.statusCounts.draft}</p>
					<p class="text-sm text-gray-500">Entwürfe</p>
				</div>
			</div>
		</button>
		<button
			onclick={() => (statusFilter = statusFilter === 'sent' ? '' : 'sent')}
			class="p-4 bg-white border rounded-xl transition-all {statusFilter === 'sent'
				? 'border-blue-400 shadow-md'
				: 'border-gray-200 hover:border-gray-300'}"
		>
			<div class="flex items-center gap-3">
				<div class="p-2 bg-blue-100 rounded-lg">
					<Icon name="send" size={24} class="text-blue-600" />
				</div>
				<div class="text-left">
					<p class="text-2xl font-bold text-gray-900">{data.statusCounts.sent}</p>
					<p class="text-sm text-gray-500">Versendet</p>
				</div>
			</div>
		</button>
		<button
			onclick={() => (statusFilter = statusFilter === 'paid' ? '' : 'paid')}
			class="p-4 bg-white border rounded-xl transition-all {statusFilter === 'paid'
				? 'border-green-400 shadow-md'
				: 'border-gray-200 hover:border-gray-300'}"
		>
			<div class="flex items-center gap-3">
				<div class="p-2 bg-green-100 rounded-lg">
					<Icon name="check_circle" size={24} class="text-green-600" />
				</div>
				<div class="text-left">
					<p class="text-2xl font-bold text-gray-900">{data.statusCounts.paid}</p>
					<p class="text-sm text-gray-500">Bezahlt</p>
				</div>
			</div>
		</button>
		<button
			onclick={() => (statusFilter = statusFilter === 'overdue' ? '' : 'overdue')}
			class="p-4 bg-white border rounded-xl transition-all {statusFilter === 'overdue'
				? 'border-red-400 shadow-md'
				: 'border-gray-200 hover:border-gray-300'}"
		>
			<div class="flex items-center gap-3">
				<div class="p-2 bg-red-100 rounded-lg">
					<Icon name="warning" size={24} class="text-red-600" />
				</div>
				<div class="text-left">
					<p class="text-2xl font-bold text-gray-900">{data.statusCounts.overdue}</p>
					<p class="text-sm text-gray-500">Überfällig</p>
				</div>
			</div>
		</button>
	</div>

	<!-- Filters -->
	<Card>
		<div class="flex flex-wrap gap-4">
			<div class="flex-1 min-w-[200px]">
				<label for="search" class="sr-only">Suche</label>
				<div class="relative">
					<Icon
						name="search"
						size={20}
						class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
					/>
					<input
						id="search"
						type="text"
						bind:value={searchTerm}
						placeholder="Suche nach Mieter, Nr. oder Wohnung..."
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
			</div>
			<div class="w-48">
				<label for="building" class="sr-only">Gebäude</label>
				<select
					id="building"
					bind:value={buildingFilter}
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="">Alle Gebäude</option>
					{#each data.buildings as building}
						<option value={building.id}>{building.name}</option>
					{/each}
				</select>
			</div>
			{#if statusFilter}
				<Button variant="secondary" size="sm" onclick={() => (statusFilter = '')}>
					<Icon name="close" size={16} />
					Filter zurücksetzen
				</Button>
			{/if}
		</div>
	</Card>

	<!-- Statements Table -->
	{#if filteredStatements.length === 0}
		<Card>
			<div class="text-center py-12">
				<Icon name="receipt_long" size={48} class="mx-auto text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Abrechnungen gefunden</h3>
				<p class="text-gray-500 mb-6">
					{#if searchTerm || buildingFilter || statusFilter}
						Versuchen Sie, Ihre Filter anzupassen.
					{:else}
						Erstellen Sie Ihre erste Nebenkostenabrechnung.
					{/if}
				</p>
				{#if !searchTerm && !buildingFilter && !statusFilter}
					<Button href="/statements/generate" variant="primary">
						<Icon name="add" size={20} />
						Abrechnungen erstellen
					</Button>
				{/if}
			</div>
		</Card>
	{:else}
		<Card padding={false}>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Nr. / Mieter
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Wohnung
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Periode
							</th>
							<th
								class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Saldo
							</th>
							<th
								class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Status
							</th>
							<th
								class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Aktionen
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each filteredStatements as statement}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-6 py-4">
									<div>
										<p class="font-mono text-sm text-gray-500">{statement.statementNumber}</p>
										<p class="font-medium text-gray-900">{statement.tenantName}</p>
									</div>
								</td>
								<td class="px-6 py-4">
									<div>
										<p class="text-sm text-gray-900">
											{statement.buildingName}
										</p>
										<p class="text-sm text-gray-500">
											Wohnung {statement.apartmentUnit} · {statement.apartmentFloor}
										</p>
									</div>
								</td>
								<td class="px-6 py-4">
									<p class="text-sm text-gray-900">
										{formatDate(statement.periodStart)} - {formatDate(statement.periodEnd)}
									</p>
									<p class="text-sm text-gray-500">{statement.rentalDays} Tage</p>
								</td>
								<td class="px-6 py-4 text-right">
									<p class="font-medium {getBalanceClass(statement.balance)}">
										{formatCurrency(Math.abs(statement.balance))}
									</p>
									<p class="text-xs text-gray-500">{getBalanceLabel(statement.balance)}</p>
								</td>
								<td class="px-6 py-4 text-center">
									<Badge variant={getStatusVariant(statement.status)}>
										{getStatusLabel(statement.status)}
									</Badge>
									{#if statement.status === 'overdue' && statement.lastReminderDate}
										<p class="text-xs text-gray-500 mt-1">
											Mahnung: {formatDate(statement.lastReminderDate)}
										</p>
									{/if}
								</td>
								<td class="px-6 py-4 text-right">
									<div class="flex items-center justify-end gap-1">
										<a
											href="/statements/{statement.id}"
											class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
											title="Ansehen"
										>
											<Icon name="visibility" size={18} />
										</a>
										{#if statement.pdfGeneratedAt}
											<a
												href="/api/statements/{statement.id}/pdf"
												class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												title="PDF herunterladen"
												download
											>
												<Icon name="picture_as_pdf" size={18} />
											</a>
										{/if}
										{#if statement.status === 'sent' || statement.status === 'overdue'}
											<button
												class="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
												title="Als bezahlt markieren"
											>
												<Icon name="paid" size={18} />
											</button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Card>
	{/if}
</div>
