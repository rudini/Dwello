<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import TenantFormFields from '$lib/components/TenantFormFields.svelte';
	import type { Tenant } from '$lib/types';
	import type { ActionData } from './$types';

	let { data, form }: { data: { tenant: Tenant }; form: ActionData } = $props();

	const name = $derived(`${data.tenant.firstName} ${data.tenant.lastName}`);
</script>

<svelte:head>
	<title>{name} bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-ink-muted">
		<a href="/tenants" data-testid="breadcrumb-link" class="hover:text-primary transition-colors"
			>Mieter</a
		>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a
			href="/tenants/{data.tenant.id}"
			data-testid="breadcrumb-link"
			class="hover:text-primary transition-colors"
		>
			{name}
		</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Bearbeiten</span>
	</nav>

	<div>
		<h1 class="text-2xl font-bold text-gray-900">Mieter bearbeiten</h1>
		<p class="text-ink-muted mt-1">Kontaktdaten und Korrespondenz von {name}.</p>
	</div>

	<Card>
		<form method="POST" use:enhance class="space-y-6">
			<FieldError message={form?.errors?.form} />
			<TenantFormFields tenant={data.tenant} errors={form?.errors} />

			<div class="flex gap-3 pt-4 border-t border-gray-200">
				<Button href="/tenants/{data.tenant.id}" variant="secondary" testid="form-cancel">
					Abbrechen
				</Button>
				<Button type="submit" variant="primary" testid="tenant-submit">
					<Icon name="save" size={18} />
					Speichern
				</Button>
			</div>
		</form>
	</Card>
</div>
