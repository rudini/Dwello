<script lang="ts">
	import { onMount } from 'svelte';
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
	import Textarea from '$lib/ui/Textarea.svelte';

	// Every component of the design system in every state, so the axe check sees them in a real browser
	const motifs: Record<IllustrationName, string> = {
		building: 'Gebäude',
		apartment: 'Wohnung',
		contract: 'Mietvertrag',
		meter: 'Zähler',
		receipts: 'Rechnungen',
		statement: 'Nebenkostenabrechnung',
		envelope: 'Versand',
		done: 'Erledigt',
		'no-results': 'Keine Treffer',
		problem: 'Fehler'
	};
	let dialogOpen = $state(false);
	let busyDialogOpen = $state(false);
	let tab = $state('laufend');
	let duration = $state('unbefristet');

	onMount(() => {
		addToast('success', 'Mieter Anna Keller gespeichert', 0);
		addToast(
			'error',
			'Die Abrechnung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
			0
		);
		addToast('warning', 'Die Verwaltungspauschale liegt über dem üblichen Richtwert von 3 %.', 0);
		addToast('info', 'Entwurf gespeichert.', 0);
	});
</script>

<svelte:head>
	<title>Bauteile - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-12 bg-canvas p-4 text-ink md:p-8" data-testid="gallery">
	<PageHeader
		title="Bauteile"
		purpose="Alle Bauteile des Designsystems in allen Zuständen."
		trail={[{ href: '/dashboard', label: 'Übersicht' }]}
	>
		{#snippet action()}<Button variant="primary" icon="check">Hauptaktion</Button>{/snippet}
	</PageHeader>
	<Panel title="Dialoge">
		<div class="flex flex-wrap gap-4">
			<Button onclick={() => (dialogOpen = true)} testid="gallery-open-dialog">Dialog öffnen</Button
			>
			<Button onclick={() => (busyDialogOpen = true)} testid="gallery-open-busy-dialog"
				>Dialog beim Speichern</Button
			>
		</div>
	</Panel>

	<Panel title="Schaltflächen">
		<div class="flex flex-wrap gap-4">
			<Button variant="primary">Mietvertrag speichern</Button>
			<Button>Zurück</Button>
			<Button variant="ghost">Entwurf verwerfen</Button>
			<Button variant="danger">Mieter löschen</Button>
			<Button variant="danger-ghost">Löschen</Button>
			<Button variant="primary" disabled>Weiter</Button>
			<Button variant="primary" busy busyLabel="Wird gespeichert …">Speichern</Button>
			<Button href="/tenants/new" icon="check">Mieter erfassen</Button>
			<IconButton icon="close" label="Schliessen" onclick={() => {}} />
			<IconButton icon="close" label="Menü schliessen" expanded onclick={() => {}} />
		</div>
	</Panel>

	<Panel title="Formularfelder">
		<div class="grid gap-6 md:grid-cols-2">
			<TextInput id="g-name" label="Nachname" value="Keller" />
			<TextInput
				id="g-number"
				label="Wohnungsnummer"
				help="Bezeichnung der Wohnung im Gebäude, pro Gebäude eindeutig."
				example="3.01"
				value=""
			/>
			<TextInput id="g-phone" label="Telefon" optional value="" />
			<TextInput
				id="g-street"
				label="Strasse"
				error="Bitte geben Sie die Strasse ein, zum Beispiel Musterstrasse 12."
				value=""
			/>
			<TextInput id="g-date" type="date" label="Vertragsbeginn" value="2026-04-01" />
			<TextInput
				id="g-disabled"
				label="Gebäude"
				value="Musterstrasse 12, 8400 Winterthur"
				disabled
			/>
			<MoneyInput
				id="g-rent"
				label="Nettomiete"
				help="Die monatliche Miete ohne Nebenkosten, in CHF."
				example="1'650.00"
				value="1650.00"
			/>
			<MoneyInput
				id="g-advance"
				label="Akonto"
				error="Bitte geben Sie einen Betrag ein."
				value=""
			/>
			<Select
				id="g-channel"
				label="Korrespondenzkanal"
				placeholder="Bitte wählen"
				options={[
					{ value: 'letter', label: 'Brief' },
					{ value: 'email', label: 'E-Mail' }
				]}
				value="letter"
			/>
			<Select
				id="g-building"
				label="Gebäude"
				placeholder="Bitte wählen"
				options={[{ value: 'b1', label: 'Musterstrasse 12' }]}
				error="Bitte wählen Sie ein Gebäude."
				value=""
			/>
			<Textarea id="g-notes" label="Bemerkungen" optional value="" />
			<Textarea
				id="g-reason"
				label="Grund der Änderung"
				error="Bitte nennen Sie den Grund der Änderung."
				value=""
			/>
			<Select
				id="g-language"
				label="Sprache"
				options={[{ value: 'de', label: 'Deutsch' }]}
				value="de"
				disabled
			/>
			<div class="flex flex-col gap-4">
				<Checkbox
					id="g-allocable"
					label="Umlagefähig"
					help="Die Rechnung fliesst in die Nebenkostenabrechnung ein."
					checked
				/>
				<Checkbox id="g-unchecked" label="Unbefristeter Mietvertrag" />
				<Checkbox id="g-disabled-box" label="Vordefiniert" checked disabled />
			</div>
			<RadioGroup
				name="g-duration"
				legend="Wie lange läuft der Mietvertrag?"
				options={[
					{
						value: 'unbefristet',
						label: 'Unbefristet',
						description: 'Der Mietvertrag hat kein Vertragsende.'
					},
					{
						value: 'befristet',
						label: 'Befristet',
						description: 'Der Mietvertrag endet an einem festen Datum.'
					}
				]}
				bind:value={duration}
			/>
			<RadioGroup
				name="g-channel-radio"
				legend="Korrespondenzkanal"
				options={[
					{ value: 'letter', label: 'Brief' },
					{ value: 'email', label: 'E-Mail' }
				]}
				error="Bitte wählen Sie, wie der Mieter Post erhält."
				value=""
			/>
		</div>
	</Panel>

	<Panel title="Hinweise und Status">
		<Alert tone="info" title="Gut zu wissen">
			<p>Die Abrechnungen werden als Entwurf erstellt. Sie können sie vor dem Versenden prüfen.</p>
		</Alert>
		<Alert tone="positive" title="Mietvertrag gespeichert" />
		<Alert tone="caution" title="Keine Rechnungen erfasst">
			<p>Für die Abrechnungsperiode 2025 sind keine Rechnungen erfasst.</p>
			{#snippet action()}<Button href="/invoices/new">Rechnung erfassen</Button>{/snippet}
		</Alert>
		<Alert tone="critical" title="Speichern fehlgeschlagen">
			<p>Bitte prüfen Sie die Angaben und versuchen Sie es erneut.</p>
		</Alert>
		<div class="flex flex-wrap gap-4">
			<Badge label="Entwurf" />
			<Badge tone="info" label="Versendet" />
			<Badge tone="positive" label="Bezahlt" />
			<Badge tone="critical" label="Überfällig" />
			<Badge tone="caution" label="Leer" />
		</div>
		<SaveStatus savedAt={new Date('2026-10-09T14:32:00')} />
		<ProgressBar value={2} max={5} label="Schritt 2 von 5" />
	</Panel>

	<Panel title="Schrittanzeige und Registerkarten">
		<Stepper
			steps={['Mieter', 'Wohnung', 'Vertragsdauer', 'Miete', 'Prüfen']}
			current={3}
			onselect={() => {}}
		/>
		<Tabs
			label="Mietverträge"
			tabs={[
				{ id: 'laufend', label: 'Laufend' },
				{ id: 'beendet', label: 'Beendet' }
			]}
			bind:selected={tab}
		>
			<p>{tab === 'laufend' ? 'Laufende Mietverträge' : 'Beendete Mietverträge'}</p>
		</Tabs>
	</Panel>

	<Table
		caption="Abrechnungspositionen"
		columns={[
			{ label: 'Kategorie' },
			{ label: 'Verteilschlüssel' },
			{ label: 'Betrag', numeric: true },
			{ label: 'Aktionen', hidden: true }
		]}
	>
		<tr>
			<td>Wasser</td><td>Pro Fläche (m²)</td><td class="text-right">CHF 412.50</td>
			<td><a href="/invoices" class="text-accent underline">Rechnungen ansehen</a></td>
		</tr>
		<tr>
			<td>Kehricht</td><td>Pro Einheit</td><td class="text-right">CHF 96.00</td>
			<td><a href="/invoices" class="text-accent underline">Rechnungen ansehen</a></td>
		</tr>
	</Table>

	<Panel title="Leerer Zustand">
		<EmptyState
			title="Noch keine Mieter"
			text="Erfassen Sie Ihren ersten Mieter. Danach können Sie einen Mietvertrag erstellen."
			actionLabel="Mieter erfassen"
			actionHref="/tenants/new"
			illustration="contract"
		/>
	</Panel>

	<Panel title="Illustrationen">
		<ul class="grid grid-cols-2 gap-6 md:grid-cols-5">
			{#each Object.entries(motifs) as [name, label] (name)}
				<li class="flex flex-col items-center gap-2">
					<Illustration name={name as IllustrationName} title={label} />
					<span class="text-ink-muted">{label}</span>
				</li>
			{/each}
		</ul>
	</Panel>

	<Panel title="Navigation">
		<NavList
			groups={[
				{
					label: 'Verwalten',
					items: [
						{ label: 'Gebäude', href: '/buildings', icon: 'building' },
						{ label: 'Bauteile', href: '/gallery', icon: 'check' }
					]
				}
			]}
		/>
	</Panel>
</div>

<Dialog
	bind:open={dialogOpen}
	title="Mieter löschen?"
	confirmLabel="Mieter löschen"
	danger
	onconfirm={() => (dialogOpen = false)}
>
	<p>Anna Keller wird gelöscht. Das lässt sich nicht rückgängig machen.</p>
</Dialog>
<Dialog
	bind:open={busyDialogOpen}
	title="Abrechnung als versendet markieren?"
	confirmLabel="Als versendet markieren"
	busy
	busyLabel="Wird gespeichert …"
	onconfirm={() => {}}
>
	<p>Danach können Sie die Abrechnung nicht mehr bearbeiten oder löschen.</p>
</Dialog>
