<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { untrack } from 'svelte';
	import type { Tenant } from '$lib/types';
	import { languageLabels } from '$lib/tenant';
	import Select from '$lib/ui/Select.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';

	// Fields of "Mieter erfassen" and "Mieter bearbeiten"; the Korrespondenzkanal decides which address is needed
	let { tenant = {}, errors = {} }: { tenant?: Partial<Tenant>; errors?: Record<string, string> } =
		$props();

	const value = (key: keyof Tenant) => String(tenant[key] ?? '');
	let channel = $state(untrack(() => tenant.correspondenceChannel ?? 'letter')); // Brief is the glossary's default
	const byEmail = $derived(channel === 'email');
	// The errors of the fields the channel decides on no longer apply once it changes
	let channelChangedFor = $state.raw<Record<string, string>>();
	const channelError = (key: 'email' | 'address' | 'city') =>
		channelChangedFor === errors ? undefined : errors[key];
	const channels = [
		{ value: 'letter', label: m.tenants_channel_letter() },
		{ value: 'email', label: m.tenants_channel_email() }
	];
	const languages = Object.entries(languageLabels).map(([code, label]) => ({ value: code, label }));
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
	<TextInput
		id="firstName"
		name="firstName"
		label={m.tenants_first_name()}
		value={value('firstName')}
		example={m.tenants_example_first_name()}
		error={errors.firstName}
		testid="tenant-first-name-input"
	/>
	<TextInput
		id="lastName"
		name="lastName"
		label={m.tenants_last_name()}
		value={value('lastName')}
		example={m.tenants_example_last_name()}
		error={errors.lastName}
		testid="tenant-last-name-input"
	/>
</div>

<Select
	id="correspondenceChannel"
	name="correspondenceChannel"
	label={m.tenants_channel()}
	help={m.tenants_channel_help()}
	options={channels}
	bind:value={channel}
	onchange={() => (channelChangedFor = errors)}
	testid="tenant-channel-select"
/>

<TextInput
	id="email"
	name="email"
	type="email"
	label={m.tenants_email()}
	value={value('email')}
	optional={!byEmail}
	example={m.tenants_example_email()}
	error={channelError('email')}
	testid="tenant-email-input"
/>

<TextInput
	id="phone"
	name="phone"
	type="tel"
	label={m.tenants_phone()}
	value={value('phone')}
	optional
	example="079 123 45 67"
/>

<Select
	id="language"
	name="language"
	label={m.tenants_language()}
	help={m.tenants_language_help()}
	options={languages}
	value={tenant.language ?? 'de'}
	testid="tenant-language-select"
/>

<fieldset class="flex flex-col gap-6">
	<legend class="pb-6 text-xl font-bold text-ink">{m.buildings_address()}</legend>
	<TextInput
		id="address"
		name="address"
		label={m.buildings_street()}
		value={value('address')}
		optional={byEmail}
		example={m.buildings_street_example()}
		error={channelError('address')}
		testid="tenant-address-input"
	/>
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
		<TextInput
			id="postalCode"
			name="postalCode"
			label={m.buildings_postal_code()}
			value={value('postalCode')}
			optional={byEmail}
			example="8400"
			error={errors.postalCode}
			testid="tenant-postal-code-input"
		/>
		<div class="sm:col-span-2">
			<TextInput
				id="city"
				name="city"
				label={m.buildings_city()}
				value={value('city')}
				optional={byEmail}
				example="Winterthur"
				error={channelError('city')}
				testid="tenant-city-input"
			/>
		</div>
	</div>
</fieldset>
