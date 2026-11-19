<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import LiveRegion from '$lib/ui/LiveRegion.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import ConfigLinks from './ConfigLinks.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// #1456: the switch saves when switched; refused, it shows what is stored again
	const stored = () => data.updateCheck ?? false;
	let updateCheck = $state(stored());
	const saved = $derived(form && 'updateCheck' in form ? form.updateCheck : null);
</script>

<svelte:head>
	<title>{m.nav_settings()} - Dwello</title>
</svelte:head>

<!-- #1456: three groups of links; the form is on «Absender und Konto» -->
<div class="mx-auto flex max-w-3xl flex-col gap-8" data-testid="config-page">
	<PageHeader title={m.nav_settings()} purpose={m.settings_purpose()} />

	<ConfigLinks
		title={m.settings_group_own()}
		testid="own-links"
		links={[
			{
				key: 'sender',
				href: '/config/sender',
				label: m.settings_sender_account(),
				text: m.settings_sender_account_text(),
				icon: 'settings',
				// #690: what the stored IBAN lacks; the form marks the fields
				warnings: [
					...(data.missing.company ? [m.settings_missing_company()] : []),
					...(data.missing.holder ? [m.settings_missing_holder()] : [])
				]
			}
		]}
	/>

	<ConfigLinks />

	<ConfigLinks
		title={m.settings_group_data()}
		testid="data-links"
		links={[
			// #580: which KI reads and categorizes invoices
			{
				key: 'ki',
				href: '/config/ki',
				label: m.ki_settings_title(),
				text: m.ki_settings_link(),
				icon: 'ai-suggestion'
			},
			// #718, part 3: a new Wiederherstellungscode, only where Dwello backs up
			...(data.backup !== 'off'
				? [
						{
							key: 'backup',
							href: '/config/backup',
							label: m.backup_new_title(),
							text: m.backup_new_link(),
							icon: 'settings' as const
						}
					]
				: []),
			// #817: read access for an AI program of the landlord's choice
			{
				key: 'access-keys',
				href: '/config/access-keys',
				label: m.ai_keys_title(),
				text: m.ai_keys_link(),
				icon: 'settings'
			},
			{
				key: 'audit-log',
				href: '/config/audit-log',
				label: m.audit_title(),
				text: m.audit_link(),
				icon: 'calendar'
			}
		]}
	>
		<!-- #1453: only where Dwello may ask GitHub (an installation from the published images, no fixed version) -->
		{#if data.updateCheck !== null}
			<form
				method="POST"
				action="?/updateCheck"
				class="flex flex-col gap-4"
				onchange={(event) => event.currentTarget.requestSubmit()}
				use:enhance={() =>
					async ({ update, result }) => {
						await update({ reset: false });
						if (result.type !== 'success') updateCheck = stored();
					}}
			>
				<Checkbox
					id="updateCheck"
					name="updateCheck"
					label={m.settings_updates_check_label()}
					bind:checked={updateCheck}
					help={m.settings_updates_check_help()}
					error={form && 'error' in form ? form.error : undefined}
					testid="setting-updateCheck"
				/>
				<LiveRegion shown={saved !== null}>
					<Alert
						tone="positive"
						title={saved ? m.settings_update_check_on() : m.settings_update_check_off()}
						testid="update-check-saved"
					/>
				</LiveRegion>
				<!-- without scripts nothing saves on switching -->
				<noscript><Button type="submit">{m.settings_save()}</Button></noscript>
			</form>
		{/if}

		<!-- #496: everything the landlord entered, as one ZIP; a download, so the page stays open. A form POST: it writes
		     into the Protokoll (Review 496-1 C-2). The last entry of the group (#1456) -->
		<form method="POST" action="/config/export" class="flex flex-col items-start gap-4">
			<h3 class="text-lg font-semibold text-ink" data-testid="settings-entry-name">
				{m.config_export_title()}
			</h3>
			<p id="config-export-help" class="text-ink" data-testid="config-export-help">
				{m.config_export_help()}
			</p>
			<Button
				type="submit"
				icon="document-download"
				describedby="config-export-help"
				testid="config-export-button">{m.config_export()}</Button
			>
		</form>
	</ConfigLinks>
</div>
