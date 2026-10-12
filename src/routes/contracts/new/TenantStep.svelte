<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { keepEarlyChoice } from '$lib/early-choice';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Field from '$lib/ui/Field.svelte';
	import { controlClass } from '$lib/ui/field';

	// Step 1: who rents; a new tenant is created on the tenant form, which returns here
	let {
		tenantId = $bindable(),
		tenants,
		createdId,
		error
	}: {
		tenantId: string;
		tenants: { id: string; name: string; place?: string }[];
		createdId: string | null; // back from "Neuen Mieter erfassen" with this tenant
		error?: string;
	} = $props();

	const createdName = $derived(
		createdId && tenantId === createdId ? tenants.find((t) => t.id === createdId)?.name : undefined
	);
</script>

{#if createdName}
	<Alert tone="positive" title={m.contracts_tenant_created()} testid="tenant-created">
		<p>{m.contracts_tenant_created_text({ name: createdName })}</p>
	</Alert>
{/if}

<Field id="tenant" label={m.contracts_tenant()} help={m.contracts_tenant_help()} {error}>
	{#snippet children(control)}
		<!-- selected options instead of bind:value: a choice made before the page is live survives hydration -->
		<select
			id={control.id}
			onchange={(event) => (tenantId = event.currentTarget.value)}
			use:keepEarlyChoice={(id) => (tenantId = id)}
			aria-required="true"
			aria-describedby={control.describedBy}
			aria-invalid={control.invalid || undefined}
			class={controlClass(control.invalid)}
			data-testid="contract-tenant-select"
		>
			<option value="" selected={!tenantId}>{m.contracts_choose_tenant()}</option>
			{#each tenants as tenant (tenant.id)}
				<option value={tenant.id} selected={tenant.id === tenantId}
					>{tenant.place ? `${tenant.name}, ${tenant.place}` : tenant.name}</option
				>
			{/each}
		</select>
	{/snippet}
</Field>

<div>
	<Button href="/tenants/new?for=contract" icon="user-add" testid="contract-new-tenant"
		>{m.contracts_new_tenant()}</Button
	>
</div>
