<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import TextInput from '$lib/ui/TextInput.svelte';
	import type { PageData } from './$types';

	// #580: the provider's fields; locked shows what the operator set, without the API key
	let {
		ki,
		errors,
		locked
	}: { ki: PageData['ki']; errors: Record<string, string>; locked: boolean } = $props();

	const shown = $derived(ki.mode === 'provider' || locked);
	const named = $derived(!locked || ki.mode === 'provider');
</script>

<TextInput
	id="ki-base-url"
	name="baseUrl"
	type="url"
	label={m.ki_settings_base_url()}
	help={m.ki_settings_base_url_help()}
	value={shown ? ki.baseUrl : ''}
	error={errors.baseUrl}
	disabled={locked}
	testid="ki-base-url-input"
/>
{#if !locked}
	<TextInput
		id="ki-api-key"
		name="apiKey"
		type="password"
		autocomplete="off"
		label={m.ki_settings_api_key()}
		help={ki.apiKeyStored ? m.ki_settings_api_key_stored() : undefined}
		error={errors.apiKey}
		optional
		testid="ki-api-key-input"
	/>
{/if}
<TextInput
	id="ki-model"
	name="model"
	label={m.ki_settings_model()}
	help={m.ki_settings_model_help()}
	value={shown ? ki.model : ''}
	error={errors.model}
	disabled={locked}
	testid="ki-model-input"
/>
{#if named}
	<TextInput
		id="ki-provider"
		name="provider"
		label={m.ki_settings_provider_name()}
		help={m.ki_settings_names_help()}
		value={ki.provider}
		error={errors.provider}
		disabled={locked}
		testid="ki-provider-input"
	/>
	<TextInput
		id="ki-country"
		name="providerCountry"
		label={m.ki_settings_provider_country()}
		help={m.ki_settings_names_help()}
		value={ki.providerCountry}
		error={errors.providerCountry}
		disabled={locked}
		testid="ki-country-input"
	/>
{/if}
