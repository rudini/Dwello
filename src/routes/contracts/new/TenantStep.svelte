<script lang="ts">
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
		tenants: { id: string; name: string }[];
		createdId: string | null; // back from "Neuen Mieter erfassen" with this tenant
		error?: string;
	} = $props();

	const createdName = $derived(
		createdId && tenantId === createdId ? tenants.find((t) => t.id === createdId)?.name : undefined
	);
</script>

{#if createdName}
	<Alert tone="positive" title="Mieter erfasst" testid="tenant-created">
		<p>{createdName} ist gespeichert und für diesen Mietvertrag gewählt.</p>
	</Alert>
{/if}

<Field
	id="tenant"
	label="Mieter"
	help="Die Person, die die Wohnung mietet. Steht sie noch nicht in der Liste, erfassen Sie sie zuerst."
	{error}
>
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
			<option value="" selected={!tenantId}>Mieter wählen</option>
			{#each tenants as tenant (tenant.id)}
				<option value={tenant.id} selected={tenant.id === tenantId}>{tenant.name}</option>
			{/each}
		</select>
	{/snippet}
</Field>

<div>
	<Button href="/tenants/new?for=contract" icon="user-add" testid="contract-new-tenant"
		>Neuen Mieter erfassen</Button
	>
</div>
