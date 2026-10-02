<script lang="ts">
	import Card from './Card.svelte';
	import StatusBadge from './StatusBadge.svelte';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import { formatDate } from '$lib/utils/format';

	interface CurrentContract {
		tenantId: string;
		tenantName: string;
		tenantEmail: string | null;
		startDate: string;
	}

	let { contract }: { contract: CurrentContract } = $props();
</script>

<Card>
	<div class="flex justify-between items-start mb-4">
		<h3 class="text-lg font-bold text-text-dark">Aktueller Mieter</h3>
		<StatusBadge status="AKTIV" variant="success" />
	</div>

	<div class="mb-6">
		<p class="text-base font-bold text-text-dark" data-testid="current-tenant-name">{contract.tenantName}</p>
		<p class="text-xs text-text-secondary">Vertrag seit: {formatDate(contract.startDate)}</p>
		{#if contract.tenantEmail}
			<p class="flex items-center gap-2 mt-3">
				<Icon name="email" size={18} class="text-text-secondary" />
				<a href="mailto:{contract.tenantEmail}" class="text-sm text-primary hover:underline">{contract.tenantEmail}</a>
			</p>
		{/if}
	</div>

	<Button variant="secondary" class="w-full" href="/tenants/{contract.tenantId}" testid="current-tenant-profile">
		Mieterprofil ansehen
	</Button>
</Card>
