<script lang="ts">
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
		{ value: 'letter', label: 'Per Brief' },
		{ value: 'email', label: 'Per E-Mail' }
	];
	const languages = Object.entries(languageLabels).map(([code, label]) => ({ value: code, label }));
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
	<TextInput
		id="firstName"
		name="firstName"
		label="Vorname"
		value={value('firstName')}
		example="Anna"
		error={errors.firstName}
		testid="tenant-first-name-input"
	/>
	<TextInput
		id="lastName"
		name="lastName"
		label="Nachname"
		value={value('lastName')}
		example="Keller"
		error={errors.lastName}
		testid="tenant-last-name-input"
	/>
</div>

<Select
	id="correspondenceChannel"
	name="correspondenceChannel"
	label="Korrespondenzkanal"
	help="Wie der Mieter Post erhält, zum Beispiel Mahnungen. Per E-Mail braucht eine E-Mail-Adresse, per Brief eine Adresse."
	options={channels}
	bind:value={channel}
	onchange={() => (channelChangedFor = errors)}
	testid="tenant-channel-select"
/>

<TextInput
	id="email"
	name="email"
	type="email"
	label="E-Mail"
	value={value('email')}
	optional={!byEmail}
	example="anna.keller@example.ch"
	error={channelError('email')}
	testid="tenant-email-input"
/>

<TextInput
	id="phone"
	name="phone"
	type="tel"
	label="Telefon"
	value={value('phone')}
	optional
	example="079 123 45 67"
/>

<Select
	id="language"
	name="language"
	label="Sprache"
	help="In dieser Sprache wird die Nebenkostenabrechnung erstellt. Auf Rätoromanisch erstellt Dwello die Abrechnung vorerst auf Deutsch."
	options={languages}
	value={tenant.language ?? 'de'}
	testid="tenant-language-select"
/>

<fieldset class="flex flex-col gap-6">
	<legend class="pb-6 text-xl font-bold text-ink">Adresse</legend>
	<TextInput
		id="address"
		name="address"
		label="Strasse und Hausnummer"
		value={value('address')}
		optional={byEmail}
		example="Musterstrasse 12"
		error={channelError('address')}
		testid="tenant-address-input"
	/>
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
		<TextInput
			id="postalCode"
			name="postalCode"
			label="PLZ"
			value={value('postalCode')}
			optional
			example="8400"
			error={errors.postalCode}
			testid="tenant-postal-code-input"
		/>
		<div class="sm:col-span-2">
			<TextInput
				id="city"
				name="city"
				label="Ort"
				value={value('city')}
				optional={byEmail}
				example="Winterthur"
				error={channelError('city')}
				testid="tenant-city-input"
			/>
		</div>
	</div>
</fieldset>
