<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import IconButton from '$lib/ui/IconButton.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';
	import type { IllustrationName } from '$lib/ui/illustrations';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import NavList from '$lib/ui/NavList.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import ProgressBar from '$lib/ui/ProgressBar.svelte';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';
	import SaveStatus from '$lib/ui/SaveStatus.svelte';
	import Select from '$lib/ui/Select.svelte';
	import Stepper from '$lib/ui/Stepper.svelte';
	import Table from '$lib/ui/Table.svelte';
	import Tabs from '$lib/ui/Tabs.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';

	// Every component of the design system in every state, so the axe check sees them in a real browser
	const motifs: Record<IllustrationName, string> = {
		building: m.apartments_building(),
		apartment: m.tenants_apartment(),
		contract: m.contracts_title(),
		meter: m.gallery_meter(),
		receipts: m.nav_invoices(),
		statement: m.gallery_statement(),
		envelope: m.gallery_dispatch(),
		done: m.gallery_done(),
		'no-results': m.gallery_no_results(),
		problem: m.error_title()
	};
	let dialogOpen = $state(false);
	let busyDialogOpen = $state(false);
	let tab = $state('laufend');
	let duration = $state('unbefristet');

	onMount(() => {
		addToast('success', m.gallery_toast_saved({ name: `${m.tenants_example_first_name()} ${m.tenants_example_last_name()}` }), 0);
		addToast('error', m.gallery_toast_error(), 0);
		addToast('warning', m.gallery_toast_warning(), 0);
		addToast('info', m.gallery_toast_info(), 0);
	});
</script>

<svelte:head>
	<title>{m.gallery_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-12 bg-canvas p-4 text-ink md:p-8" data-testid="gallery">
	<PageHeader
		title={m.gallery_title()}
		purpose={m.gallery_purpose()}
		trail={[{ href: '/dashboard', label: m.nav_overview() }]}
	>
		{#snippet action()}<Button variant="primary" icon="check">{m.gallery_primary_action()}</Button
			>{/snippet}
	</PageHeader>
	<Panel title={m.gallery_dialogs()}>
		<div class="flex flex-wrap gap-4">
			<Button onclick={() => (dialogOpen = true)} testid="gallery-open-dialog"
				>{m.gallery_open_dialog()}</Button
			>
			<Button onclick={() => (busyDialogOpen = true)} testid="gallery-open-busy-dialog"
				>{m.gallery_busy_dialog()}</Button
			>
		</div>
	</Panel>

	<Panel title={m.gallery_buttons()}>
		<div class="flex flex-wrap gap-4">
			<Button variant="primary">{m.contracts_save()}</Button>
			<Button>{m.ui_back()}</Button>
			<Button variant="ghost">{m.ui_draft_discard()}</Button>
			<Button variant="danger">{m.tenants_delete_confirm()}</Button>
			<Button variant="danger-ghost">{m.buildings_delete()}</Button>
			<Button variant="primary" disabled>{m.ui_next()}</Button>
			<Button variant="primary" busy busyLabel={m.ui_saving()}>{m.gallery_save()}</Button>
			<Button href="/tenants/new" icon="check">{m.dashboard_add_tenant()}</Button>
			<IconButton icon="close" label={m.gallery_close()} onclick={() => {}} />
			<IconButton icon="close" label={m.nav_close_menu()} expanded onclick={() => {}} />
		</div>
	</Panel>

	<Panel title={m.gallery_fields()}>
		<div class="grid gap-6 md:grid-cols-2">
			<TextInput id="g-name" label={m.tenants_last_name()} value="Keller" />
			<TextInput
				id="g-number"
				label={m.apartments_number()}
				help={m.apartments_number_help()}
				example="3.01"
				value=""
			/>
			<TextInput id="g-phone" label={m.tenants_phone()} optional value="" />
			<TextInput
				id="g-street"
				label={m.gallery_street()}
				error={m.gallery_street_error()}
				value=""
			/>
			<DateInput
				id="g-date"
				label={m.tenants_contract_start()}
				value="2026-04-01"
				testid="gallery-date-input"
			/>
			<TextInput
				id="g-disabled"
				label={m.apartments_building()}
				value="{m.buildings_street_example()}, 8400 Winterthur"
				disabled
			/>
			<MoneyInput
				id="g-rent"
				label={m.common_net_rent()}
				help={m.gallery_rent_help()}
				example="1'650.00"
				value="1650.00"
			/>
			<MoneyInput
				id="g-advance"
				label={m.common_advance_payment()}
				error={m.gallery_amount_error()}
				value=""
			/>
			<Select
				id="g-channel"
				label={m.tenants_channel()}
				placeholder={m.gallery_please_choose()}
				options={[
					{ value: 'letter', label: m.gallery_letter() },
					{ value: 'email', label: m.tenants_email() }
				]}
				value="letter"
			/>
			<Select
				id="g-building"
				label={m.apartments_building()}
				placeholder={m.gallery_please_choose()}
				options={[{ value: 'b1', label: m.buildings_street_example() }]}
				error={m.gallery_building_error()}
				value=""
			/>
			<Textarea id="g-notes" label={m.statements_notes()} optional value="" />
			<Textarea
				id="g-reason"
				label={m.invoices_override_reason()}
				error={m.gallery_reason_error()}
				value=""
			/>
			<Select
				id="g-language"
				label={m.tenants_language()}
				options={[{ value: 'de', label: m.tenants_language_de() }]}
				value="de"
				disabled
			/>
			<div class="flex flex-col gap-4">
				<Checkbox
					id="g-allocable"
					label={m.glossary_allocable_term()}
					help={m.invoices_allocable_help()}
					checked
				/>
				<Checkbox id="g-unchecked" label={m.gallery_unlimited_contract()} />
				<Checkbox id="g-disabled-box" label={m.keys_predefined()} checked disabled />
			</div>
			<RadioGroup
				name="g-duration"
				legend={m.gallery_duration_question()}
				options={[
					{
						value: 'unbefristet',
						label: m.contracts_unlimited(),
						description: m.gallery_unlimited_text()
					},
					{
						value: 'befristet',
						label: m.contracts_limited(),
						description: m.gallery_limited_text()
					}
				]}
				bind:value={duration}
			/>
			<RadioGroup
				name="g-channel-radio"
				legend={m.tenants_channel()}
				options={[
					{ value: 'letter', label: m.gallery_letter() },
					{ value: 'email', label: m.tenants_email() }
				]}
				error={m.gallery_channel_error()}
				value=""
			/>
		</div>
	</Panel>

	<Panel title={m.gallery_notices()}>
		<Alert tone="info" title={m.gallery_good_to_know()}>
			<p>{m.gallery_drafts_text()}</p>
		</Alert>
		<Alert tone="positive" title={m.gallery_contract_saved()} />
		<Alert tone="caution" title={m.statements_coverage_none()}>
			<p>{m.gallery_no_invoices_text({ year: 2025 })}</p>
			{#snippet action()}<Button href="/invoices/new">{m.dashboard_add_invoice()}</Button>{/snippet}
		</Alert>
		<Alert tone="critical" title={m.gallery_save_failed()}>
			<p>{m.gallery_check_text()}</p>
		</Alert>
		<div class="flex flex-wrap gap-4">
			<Badge label={m.statements_status_draft()} />
			<Badge tone="info" label={m.statements_status_sent()} />
			<Badge tone="positive" label={m.statements_status_paid()} />
			<Badge tone="critical" label={m.statements_status_overdue()} />
			<Badge tone="caution" label={m.apartments_status_vacant()} />
		</div>
		<SaveStatus savedAt={new Date('2026-10-09T14:32:00')} />
		<ProgressBar value={2} max={5} label={m.ui_step_of({ current: 2, total: 5 })} />
	</Panel>

	<Panel title={m.gallery_steps_tabs()}>
		<Stepper
			steps={[
				m.contracts_tenant(),
				m.tenants_apartment(),
				m.contracts_period(),
				m.contracts_rent(),
				m.contracts_step_review()
			]}
			current={3}
			onselect={() => {}}
		/>
		<Tabs
			label={m.nav_contracts()}
			tabs={[
				{ id: 'laufend', label: m.contracts_status_active() },
				{ id: 'beendet', label: m.contracts_status_ended() }
			]}
			bind:selected={tab}
		>
			<p>{tab === 'laufend' ? m.contracts_filter_active() : m.contracts_filter_ended()}</p>
		</Tabs>
	</Panel>

	<Table
		caption={m.statements_lines()}
		columns={[
			{ label: m.buildings_category() },
			{ label: m.glossary_key_term() },
			{ label: m.invoices_amount(), numeric: true },
			{ label: m.gallery_actions(), hidden: true }
		]}
	>
		<tr>
			<td>{m.gallery_water()}</td><td>{m.gallery_per_area()}</td><td class="text-right"
				>CHF 412.50</td
			>
			<td><a href="/invoices" class="text-accent underline">{m.dashboard_invoices()}</a></td>
		</tr>
		<tr>
			<td>{m.gallery_refuse()}</td><td>{m.gallery_per_unit()}</td><td class="text-right"
				>CHF 96.00</td
			>
			<td><a href="/invoices" class="text-accent underline">{m.dashboard_invoices()}</a></td>
		</tr>
	</Table>

	<Panel title={m.gallery_empty_state()}>
		<Illustration name="done" title={m.dashboard_all_done()} />
		<EmptyState
			title={m.tenants_none_yet()}
			text={m.gallery_first_tenant()}
			actionLabel={m.dashboard_add_tenant()}
			actionHref="/tenants/new"
			illustration="contract"
		/>
	</Panel>

	<Panel title={m.gallery_illustrations()}>
		<ul class="grid grid-cols-2 gap-6 md:grid-cols-5">
			{#each Object.entries(motifs) as [name, label] (name)}
				<li class="flex flex-col items-center gap-2">
					<Illustration name={name as IllustrationName} />
					<span class="text-ink-muted">{label}</span>
				</li>
			{/each}
		</ul>
	</Panel>

	<Panel title={m.gallery_navigation()}>
		<NavList
			groups={[
				{
					label: m.nav_group_manage(),
					items: [
						{ label: m.nav_buildings(), href: '/buildings', icon: 'building' },
						{ label: m.gallery_title(), href: '/gallery', icon: 'check' }
					]
				}
			]}
		/>
	</Panel>
</div>

<Dialog
	bind:open={dialogOpen}
	title={m.gallery_delete_tenant_question()}
	confirmLabel={m.tenants_delete_confirm()}
	danger
	onconfirm={() => (dialogOpen = false)}
>
	<p>{m.gallery_delete_tenant_text({ name: `${m.tenants_example_first_name()} ${m.tenants_example_last_name()}` })}</p>
</Dialog>
<Dialog
	bind:open={busyDialogOpen}
	title={m.gallery_mark_sent_question()}
	confirmLabel={m.statements_mark_sent()}
	busy
	busyLabel={m.ui_saving()}
	onconfirm={() => {}}
>
	<p>{m.gallery_mark_sent_text()}</p>
</Dialog>
