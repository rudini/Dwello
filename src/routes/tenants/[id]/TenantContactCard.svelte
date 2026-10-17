<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Tenant } from '$lib/types';
	import { countryName, languageLabels } from '$lib/tenant';
	import Panel from '$lib/ui/Panel.svelte';

	let { tenant }: { tenant: Tenant } = $props();

	const channel = $derived(
		tenant.correspondenceChannel === 'email'
			? m.tenants_channel_email()
			: m.tenants_channel_letter()
	);
	// the country only abroad (#102)
	const address = $derived(
		[
			tenant.address,
			[tenant.postalCode, tenant.city].filter(Boolean).join(' '),
			tenant.country && tenant.country !== 'CH' && countryName(tenant.country)
		].filter(Boolean)
	);
</script>

<Panel title={m.tenants_contact_title()}>
	<dl class="flex flex-col gap-4">
		<div>
			<dt class="text-ink-muted">{m.tenants_email()}</dt>
			<dd class="break-words text-ink">
				{#if tenant.email}
					<a
						href="mailto:{tenant.email}"
						class="text-accent underline underline-offset-4 hover:text-accent-strong"
						data-testid="tenant-email-link">{tenant.email}</a
					>
				{:else}
					{m.tenants_no_email()}
				{/if}
			</dd>
		</div>
		<div>
			<dt class="text-ink-muted">{m.tenants_channel()}</dt>
			<dd class="text-ink" data-testid="tenant-channel">{channel}</dd>
		</div>
		<div>
			<dt class="text-ink-muted">{m.tenants_language()}</dt>
			<dd class="text-ink" data-testid="tenant-language">
				{languageLabels[tenant.language] ?? languageLabels.de}
			</dd>
		</div>
		<div>
			<dt class="text-ink-muted">{m.tenants_phone()}</dt>
			<dd class="text-ink">{tenant.phone ?? m.tenants_no_phone()}</dd>
		</div>
		<div>
			<dt class="text-ink-muted">{m.tenants_correspondence_address()}</dt>
			<dd class="whitespace-pre-line text-ink" data-testid="tenant-address">
				{address.join('\n') || m.tenants_no_address()}
			</dd>
		</div>
	</dl>
</Panel>
