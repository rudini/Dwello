<script lang="ts">
	import type { StatementStatus } from '$lib/types';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';

	interface Props {
		statementId: string;
		status: StatementStatus;
		balance: number;
		tenantName: string;
		tenantEmail?: string;
		lastReminderDate?: string;
		onSendReminder?: () => void;
		onMarkPaid?: () => void;
		class?: string;
	}

	let {
		status,
		balance,
		tenantName,
		tenantEmail,
		lastReminderDate,
		onSendReminder,
		onMarkPaid,
		class: className = ''
	}: Props = $props();

	let reminderLevel = $state<1 | 2 | 3>(1);
	let showPreview = $state(false);

	function formatDate(dateString?: string): string {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('de-CH');
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF'
		}).format(amount);
	}

	function getReminderLevelLabel(level: number): string {
		switch (level) {
			case 1:
				return '1. Mahnung';
			case 2:
				return '2. Mahnung';
			case 3:
				return '3. Mahnung (letzte)';
			default:
				return 'Mahnung';
		}
	}

	function handleSendReminder() {
		if (onSendReminder) {
			onSendReminder();
		}
	}

	function handleMarkPaid() {
		if (onMarkPaid) {
			onMarkPaid();
		}
	}
</script>

<div class="bg-white border border-gray-200 rounded-xl p-6 {className}">
	<h3 class="text-lg font-semibold text-gray-900 mb-4">Zahlungsaktionen</h3>

	{#if status === 'paid'}
		<div class="flex items-center gap-3 text-green-600 bg-green-50 rounded-lg p-4">
			<Icon name="check_circle" size={24} />
			<span class="font-medium">Diese Abrechnung wurde bezahlt</span>
		</div>
	{:else if status === 'draft'}
		<div class="flex items-center gap-3 text-gray-600 bg-gray-50 rounded-lg p-4">
			<Icon name="info" size={24} />
			<span>Versenden Sie die Abrechnung zuerst, bevor Zahlungen verfolgt werden können.</span>
		</div>
	{:else}
		<!-- Payment Actions for sent/overdue -->
		<div class="space-y-4">
			<!-- Mark as Paid -->
			<div class="border border-gray-200 rounded-lg p-4">
				<div class="flex items-start justify-between">
					<div>
						<p class="font-medium text-gray-900">Als bezahlt markieren</p>
						<p class="text-sm text-gray-500 mt-1">
							Ausstehender Betrag: <span class="font-semibold">{formatCurrency(Math.abs(balance))}</span>
						</p>
					</div>
					<Button variant="primary" size="sm" onclick={handleMarkPaid}>
						<Icon name="paid" size={18} />
						Bezahlt
					</Button>
				</div>
			</div>

			<!-- Send Reminder -->
			{#if status === 'overdue' || (status === 'sent' && balance > 0)}
				<div class="border border-orange-200 rounded-lg p-4 bg-orange-50">
					<div class="flex items-start gap-3 mb-4">
						<Icon name="notification_important" size={24} class="text-orange-600" />
						<div>
							<p class="font-medium text-gray-900">Zahlungserinnerung senden</p>
							{#if lastReminderDate}
								<p class="text-sm text-gray-500 mt-1">
									Letzte Mahnung: {formatDate(lastReminderDate)}
								</p>
							{:else}
								<p class="text-sm text-gray-500 mt-1">Noch keine Mahnung versendet</p>
							{/if}
						</div>
					</div>

					<div class="space-y-3">
						<div>
							<span class="block text-sm font-medium text-gray-700 mb-2">Mahnstufe</span>
							<div class="flex gap-2" role="group" aria-label="Mahnstufe auswählen">
								{#each [1, 2, 3] as level}
									<button
										onclick={() => (reminderLevel = level as 1 | 2 | 3)}
										class="px-4 py-2 rounded-lg text-sm font-medium transition-colors
										{reminderLevel === level
											? 'bg-orange-600 text-white'
											: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}"
									>
										{getReminderLevelLabel(level)}
									</button>
								{/each}
							</div>
						</div>

						<div class="bg-white rounded-lg p-3 border border-orange-200">
							<div class="flex items-center justify-between text-sm">
								<span class="text-gray-600">Empfänger</span>
								<span class="font-medium text-gray-900">{tenantName}</span>
							</div>
							{#if tenantEmail}
								<div class="flex items-center justify-between text-sm mt-2">
									<span class="text-gray-600">E-Mail</span>
									<span class="font-medium text-gray-900">{tenantEmail}</span>
								</div>
							{/if}
						</div>

						<div class="flex items-center gap-3">
							<Button variant="secondary" size="sm" onclick={() => (showPreview = true)}>
								<Icon name="preview" size={18} />
								Vorschau
							</Button>
							<Button
								variant="primary"
								size="sm"
								onclick={handleSendReminder}
								class="bg-orange-600 hover:bg-orange-700"
							>
								<Icon name="send" size={18} />
								Mahnung senden
							</Button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<!-- Reminder Preview Modal -->
{#if showPreview}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-center justify-center p-4">
			<button type="button" class="fixed inset-0 bg-black/50 cursor-default" onclick={() => (showPreview = false)} aria-label="Schliessen"></button>
			<div class="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-900">
						{getReminderLevelLabel(reminderLevel)} - Vorschau
					</h3>
					<button
						onclick={() => (showPreview = false)}
						class="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
					>
						<Icon name="close" size={20} />
					</button>
				</div>

				<div class="bg-gray-50 rounded-lg p-4 text-sm space-y-4">
					<p><strong>An:</strong> {tenantName} ({tenantEmail || 'Keine E-Mail'})</p>

					<p><strong>Betreff:</strong> {getReminderLevelLabel(reminderLevel)} - Nebenkostenabrechnung</p>

					<div class="border-t border-gray-200 pt-4">
						<p>Sehr geehrte/r {tenantName},</p>
						<p class="mt-3">
							{#if reminderLevel === 1}
								wir möchten Sie freundlich daran erinnern, dass die Zahlung für Ihre Nebenkostenabrechnung noch aussteht.
							{:else if reminderLevel === 2}
								trotz unserer ersten Mahnung ist die Zahlung für Ihre Nebenkostenabrechnung noch nicht bei uns eingegangen.
							{:else}
								dies ist unsere letzte Mahnung. Sollte die Zahlung nicht innerhalb von 10 Tagen eingehen, behalten wir uns weitere Schritte vor.
							{/if}
						</p>
						<p class="mt-3">
							<strong>Ausstehender Betrag:</strong> {formatCurrency(Math.abs(balance))}
						</p>
						<p class="mt-3">
							Bitte überweisen Sie den Betrag auf unser Konto. Bei Fragen stehen wir Ihnen gerne zur Verfügung.
						</p>
						<p class="mt-4">Freundliche Grüsse</p>
					</div>
				</div>

				<div class="flex items-center justify-end gap-3 mt-6">
					<Button variant="secondary" onclick={() => (showPreview = false)}>Schliessen</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
