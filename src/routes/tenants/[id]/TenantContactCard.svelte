<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { Tenant } from '$lib/types';
	import { languageLabels } from '$lib/tenant';

	let { tenant }: { tenant: Tenant } = $props();

	const channel = $derived(tenant.correspondenceChannel === 'email' ? 'Per E-Mail' : 'Per Brief');
	const address = $derived(
		[tenant.address, [tenant.postalCode, tenant.city].filter(Boolean).join(' ')].filter(Boolean)
	);
</script>

<Card>
	<h2 class="text-lg font-semibold text-gray-900 mb-4">Kontaktdaten</h2>
	<dl class="space-y-4">
		<div>
			<dt class="flex items-center gap-2 text-sm text-ink-muted"><Icon name="email" size={20} />E-Mail</dt>
				<dd>
					{#if tenant.email}
						<a
							href="mailto:{tenant.email}"
							class="text-primary hover:underline"
							data-testid="tenant-email-link">{tenant.email}</a
						>
					{:else}
						<span class="text-gray-900">–</span>
					{/if}
				</dd>
			</div>
		<div>
			<dt class="flex items-center gap-2 text-sm text-ink-muted"><Icon name="forward_to_inbox" size={20} />Korrespondenz</dt>
				<dd class="text-gray-900" data-testid="tenant-channel">{channel}</dd>
			</div>
		<div>
			<dt class="flex items-center gap-2 text-sm text-ink-muted"><Icon name="translate" size={20} />Sprache</dt>
				<dd class="text-gray-900" data-testid="tenant-language">
					{languageLabels[tenant.language] ?? languageLabels.de}
				</dd>
			</div>
		<div>
			<dt class="flex items-center gap-2 text-sm text-ink-muted"><Icon name="phone" size={20} />Telefon</dt>
				<dd class="text-gray-900">{tenant.phone ?? '–'}</dd>
			</div>
		<div>
			<dt class="flex items-center gap-2 text-sm text-ink-muted"><Icon name="location_on" size={20} />Adresse</dt>
				<dd class="text-gray-900 whitespace-pre-line">{address.join('\n') || '–'}</dd>
			</div>
	</dl>
</Card>
