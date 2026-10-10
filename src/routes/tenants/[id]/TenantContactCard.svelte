<script lang="ts">
	import type { Tenant } from '$lib/types';
	import { languageLabels } from '$lib/tenant';
	import Panel from '$lib/ui/Panel.svelte';

	let { tenant }: { tenant: Tenant } = $props();

	const channel = $derived(tenant.correspondenceChannel === 'email' ? 'Per E-Mail' : 'Per Brief');
	const address = $derived(
		[tenant.address, [tenant.postalCode, tenant.city].filter(Boolean).join(' ')].filter(Boolean)
	);
</script>

<Panel title="Kontaktdaten">
	<dl class="flex flex-col gap-4">
		<div>
			<dt class="text-ink-muted">E-Mail</dt>
			<dd class="break-words text-ink">
				{#if tenant.email}
					<a
						href="mailto:{tenant.email}"
						class="text-accent underline underline-offset-4 hover:text-accent-strong"
						data-testid="tenant-email-link">{tenant.email}</a
					>
				{:else}
					Keine E-Mail-Adresse erfasst
				{/if}
			</dd>
		</div>
		<div>
			<dt class="text-ink-muted">Korrespondenzkanal</dt>
			<dd class="text-ink" data-testid="tenant-channel">{channel}</dd>
		</div>
		<div>
			<dt class="text-ink-muted">Sprache</dt>
			<dd class="text-ink" data-testid="tenant-language">
				{languageLabels[tenant.language] ?? languageLabels.de}
			</dd>
		</div>
		<div>
			<dt class="text-ink-muted">Telefon</dt>
			<dd class="text-ink">{tenant.phone ?? 'Keine Telefonnummer erfasst'}</dd>
		</div>
		<div>
			<dt class="text-ink-muted">Adresse</dt>
			<dd class="whitespace-pre-line text-ink">{address.join('\n') || 'Keine Adresse erfasst'}</dd>
		</div>
	</dl>
</Panel>
