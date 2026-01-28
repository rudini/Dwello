<script lang="ts">
	import type { StatementStatus } from '$lib/types';
	import Icon from './Icon.svelte';

	interface Props {
		status: StatementStatus;
		paymentDeadline?: string;
		paidDate?: string;
		lastReminderDate?: string;
		class?: string;
	}

	let { status, paymentDeadline, paidDate, lastReminderDate, class: className = '' }: Props = $props();

	function formatDate(dateString?: string): string {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('de-CH');
	}

	function getDaysOverdue(): number {
		if (!paymentDeadline) return 0;
		const deadline = new Date(paymentDeadline);
		const today = new Date();
		const diff = Math.floor((today.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24));
		return Math.max(0, diff);
	}

	const statusConfig = $derived(() => {
		switch (status) {
			case 'draft':
				return {
					icon: 'edit_note',
					label: 'Entwurf',
					description: 'Noch nicht versendet',
					bgColor: 'bg-gray-100',
					textColor: 'text-gray-700',
					iconColor: 'text-gray-500'
				};
			case 'sent':
				return {
					icon: 'send',
					label: 'Versendet',
					description: `Fällig am ${formatDate(paymentDeadline)}`,
					bgColor: 'bg-blue-50',
					textColor: 'text-blue-700',
					iconColor: 'text-blue-500'
				};
			case 'paid':
				return {
					icon: 'check_circle',
					label: 'Bezahlt',
					description: `Bezahlt am ${formatDate(paidDate)}`,
					bgColor: 'bg-green-50',
					textColor: 'text-green-700',
					iconColor: 'text-green-500'
				};
			case 'overdue':
				return {
					icon: 'warning',
					label: 'Überfällig',
					description: `${getDaysOverdue()} Tage überfällig`,
					bgColor: 'bg-red-50',
					textColor: 'text-red-700',
					iconColor: 'text-red-500'
				};
			default:
				return {
					icon: 'help',
					label: 'Unbekannt',
					description: '',
					bgColor: 'bg-gray-100',
					textColor: 'text-gray-700',
					iconColor: 'text-gray-500'
				};
		}
	});
</script>

<div class="rounded-lg p-4 {statusConfig().bgColor} {className}">
	<div class="flex items-start gap-3">
		<div class="flex-shrink-0">
			<Icon name={statusConfig().icon} size={24} class={statusConfig().iconColor} />
		</div>
		<div class="flex-1 min-w-0">
			<p class="font-semibold {statusConfig().textColor}">{statusConfig().label}</p>
			<p class="text-sm {statusConfig().textColor} opacity-80 mt-0.5">
				{statusConfig().description}
			</p>
			{#if status === 'overdue' && lastReminderDate}
				<p class="text-sm {statusConfig().textColor} opacity-70 mt-1">
					Letzte Mahnung: {formatDate(lastReminderDate)}
				</p>
			{/if}
		</div>
	</div>

	{#if status === 'sent' || status === 'overdue'}
		<div class="mt-3 pt-3 border-t border-current/10">
			<div class="flex items-center justify-between text-sm {statusConfig().textColor}">
				<span>Zahlungsfrist</span>
				<span class="font-medium">{formatDate(paymentDeadline)}</span>
			</div>
		</div>
	{/if}
</div>
