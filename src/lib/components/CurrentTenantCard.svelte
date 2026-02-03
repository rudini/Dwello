<script lang="ts">
	import Card from './Card.svelte';
	import StatusBadge from './StatusBadge.svelte';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import type { Tenant, RentalContract } from '../types';

	interface Props {
		tenant: Tenant;
		contract: RentalContract;
		status: 'AKTIV' | 'Beendet';
	}

	let { tenant, contract, status }: Props = $props();

	const initials = $derived(`${tenant.firstName[0]}${tenant.lastName[0]}`.toUpperCase());

	const contractDate = $derived(new Date(contract.startDate).toLocaleDateString('de-CH', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}));
</script>

<Card>
	<div class="flex justify-between items-start mb-4">
		<h3 class="text-lg font-bold text-text-dark">Aktueller Mieter</h3>
		<StatusBadge {status} variant={status === 'AKTIV' ? 'success' : 'gray'} />
	</div>

	<div class="flex items-center gap-4 mb-6">
		<div
			class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg"
		>
			{initials}
		</div>
		<div>
			<p class="text-base font-bold text-text-dark">{tenant.firstName} {tenant.lastName}</p>
			<p class="text-xs text-text-secondary">Vertrag seit: {contractDate}</p>
		</div>
	</div>

	<div class="space-y-4 mb-6">
		{#if tenant.email}
			<div class="flex items-center gap-3">
				<Icon name="email" size={18} class="text-text-secondary" />
				<a href="mailto:{tenant.email}" class="text-sm text-primary hover:underline">{tenant.email}</a>
			</div>
		{/if}
		{#if tenant.phone}
			<div class="flex items-center gap-3">
				<Icon name="phone" size={18} class="text-text-secondary" />
				<a href="tel:{tenant.phone}" class="text-sm text-primary hover:underline">{tenant.phone}</a>
			</div>
		{/if}
	</div>

	<Button variant="secondary" class="w-full">Mieterprofil ansehen</Button>
</Card>
