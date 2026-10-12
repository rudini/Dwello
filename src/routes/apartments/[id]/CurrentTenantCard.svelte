<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { formatDate } from '$lib/utils/format';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	interface CurrentContract {
		tenantId: string;
		tenantName: string;
		tenantEmail: string | null;
		startDate: string;
	}

	// Who lives in the apartment now, and how to reach them
	let { contract }: { contract: CurrentContract } = $props();
</script>

<Panel title={m.apartments_current_tenant()}>
	<div class="flex flex-col gap-2">
		<p class="text-lg font-semibold text-ink" data-testid="current-tenant-name">
			{contract.tenantName}
		</p>
		<p class="text-ink-muted">
			{m.apartments_contract_since({ date: formatDate(contract.startDate) })}
		</p>
		{#if contract.tenantEmail}
			<p class="flex items-center gap-2">
				<span class="text-ink-muted"><Icon name="mail" /></span>
				<a
					href="mailto:{contract.tenantEmail}"
					class="break-all text-accent underline underline-offset-4 hover:text-accent-strong"
					data-testid="tenant-email-link">{contract.tenantEmail}</a
				>
			</p>
		{/if}
	</div>
	<div>
		<Button href="/tenants/{contract.tenantId}" icon="user" testid="current-tenant-profile"
			>{m.apartments_open_tenant({ name: contract.tenantName })}</Button
		>
	</div>
</Panel>
