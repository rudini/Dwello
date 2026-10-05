<script lang="ts">
	import type { Tenant } from '$lib/types';
	import { languageLabels } from '$lib/tenant';
	import FieldError from './FieldError.svelte';

	let { tenant = {}, errors = {} }: { tenant?: Partial<Tenant>; errors?: Record<string, string> } =
		$props();

	const inputClass =
		'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary';
	const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
	const value = (key: keyof Tenant) => tenant[key] ?? '';
	const channel = $derived(tenant.correspondenceChannel ?? 'email');
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
	<div>
		<label for="firstName" class={labelClass}>Vorname <span class="text-red-500">*</span></label>
		<input
			id="firstName"
			name="firstName"
			value={value('firstName')}
			placeholder="Hans"
			data-testid="tenant-first-name-input"
			class={inputClass}
		/>
		<FieldError message={errors.firstName} />
	</div>
	<div>
		<label for="lastName" class={labelClass}>Nachname <span class="text-red-500">*</span></label>
		<input
			id="lastName"
			name="lastName"
			value={value('lastName')}
			placeholder="Müller"
			data-testid="tenant-last-name-input"
			class={inputClass}
		/>
		<FieldError message={errors.lastName} />
	</div>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
	<div>
		<label for="email" class={labelClass}>E-Mail</label>
		<input
			id="email"
			name="email"
			type="email"
			value={value('email')}
			placeholder="hans.mueller@email.com"
			data-testid="tenant-email-input"
			class={inputClass}
		/>
		<FieldError message={errors.email} />
	</div>
	<div>
		<label for="phone" class={labelClass}
			>Telefon <span class="text-gray-400">(optional)</span></label
		>
		<input
			id="phone"
			name="phone"
			type="tel"
			value={value('phone')}
			placeholder="+41 79 123 45 67"
			class={inputClass}
		/>
	</div>
</div>

<div>
	<label for="correspondenceChannel" class={labelClass}>Korrespondenz</label>
	<select
		id="correspondenceChannel"
		name="correspondenceChannel"
		value={channel}
		data-testid="tenant-channel-select"
		class={inputClass}
	>
		<option value="email">Per E-Mail</option>
		<option value="letter">Per Brief</option>
	</select>
	<p class="mt-1 text-xs text-gray-500">
		So erhält der Mieter Mahnungen und andere Dokumente. Per E-Mail braucht eine E-Mail-Adresse, per
		Brief eine Adresse.
	</p>
</div>

<div>
	<label for="language" class={labelClass}>Sprache</label>
	<select
		id="language"
		name="language"
		value={tenant.language ?? 'de'}
		data-testid="tenant-language-select"
		class={inputClass}
	>
		{#each Object.entries(languageLabels) as [code, label] (code)}
			<option value={code}>{label}</option>
		{/each}
	</select>
	<p class="mt-1 text-xs text-gray-500">
		In dieser Sprache wird die Nebenkostenabrechnung erstellt.
	</p>
</div>

<div class="border-t border-gray-200 pt-6 space-y-4">
	<h3 class="text-sm font-medium text-gray-700">Adresse</h3>
	<div>
		<label for="address" class={labelClass}>Strasse und Hausnummer</label>
		<input
			id="address"
			name="address"
			value={value('address')}
			placeholder="Musterstrasse 12"
			data-testid="tenant-address-input"
			class={inputClass}
		/>
		<FieldError message={errors.address} />
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		<div>
			<label for="postalCode" class={labelClass}>PLZ</label>
			<input
				id="postalCode"
				name="postalCode"
				value={value('postalCode')}
				placeholder="8000"
				maxlength="4"
				data-testid="tenant-postal-code-input"
				class={inputClass}
			/>
			<FieldError message={errors.postalCode} />
		</div>
		<div class="sm:col-span-2">
			<label for="city" class={labelClass}>Ort</label>
			<input
				id="city"
				name="city"
				value={value('city')}
				placeholder="Zürich"
				data-testid="tenant-city-input"
				class={inputClass}
			/>
			<FieldError message={errors.city} />
		</div>
	</div>
</div>
