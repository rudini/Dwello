<script lang="ts">
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Who receives invoice data for the KI categorization (DSG Art. 19: recipient and country)
	const llmNotice = $derived(
		data.recipient
			? `Rechnungen werden von ${data.recipient.provider} (${data.recipient.country}) mit einem Sprachmodell kategorisiert. Dafür werden Rechnungssteller (auch Einzelpersonen), Beschreibung und Betrag der Rechnung übermittelt; steht in der Beschreibung ein Name, wird auch er übermittelt.`
			: 'Rechnungen werden mit einem Sprachmodell kategorisiert, das auf dem Server des Betreibers läuft; Rechnungsdaten verlassen dafür den Server nicht.'
	);

	const sections = [
		{
			title: 'Welche Daten Dwello speichert',
			paragraphs: [
				'Dwello speichert die Daten, die für die Verwaltung der Liegenschaften und die Nebenkostenabrechnung nötig sind: Gebäude und Wohnungen, Mieter mit Kontaktdaten und Korrespondenzadresse, Mietverträge, Rechnungen sowie die erstellten Abrechnungen, Zahlungen und Mahnungen.',
				'Die Daten liegen in der PostgreSQL-Datenbank des Betreibers dieser Dwello-Installation.'
			]
		},
		{
			title: 'Anmeldung',
			paragraphs: [
				'Die Anmeldung erfolgt über Google oder Microsoft. Dwello erhält dabei Name, E-Mail-Adresse und Profilbild des angemeldeten Kontos und verwendet sie nur, um die Sitzung zu führen und den Namen in der Kopfzeile anzuzeigen. Passwörter sieht Dwello nie.'
			]
		},
		{
			title: 'Weitergabe an Dritte',
			paragraphs: [
				'Zahlungserinnerungen und Mahnungen per E-Mail werden über den vom Betreiber eingerichteten Mailversand zugestellt (eigener SMTP-Server oder Resend). Dabei werden Name und E-Mail-Adresse des Mieters sowie der Inhalt der Nachricht übermittelt.',
				'Schriften und Symbole werden von Google Fonts geladen. Dabei erhält Google die IP-Adresse des Browsers.',
				'Darüber hinaus gibt Dwello keine Daten an Dritte weiter.'
			]
		},
		{
			title: 'Cookies',
			paragraphs: [
				'Dwello setzt nur technisch notwendige Cookies: ein Sitzungs-Cookie, das für JavaScript nicht lesbar ist, und ein Cookie zum Schutz vor gefälschten Anfragen (XSRF). Tracking- oder Werbe-Cookies werden nicht verwendet.'
			]
		}
	];

	// TODO(fachlich prüfen): legal wording of the draft notice (docs/design/offene-punkte.md, Privacy)
	const draftNotice =
		'Ungespeicherte Eingaben in «Mietvertrag erfassen» und «Abrechnungen erstellen» bewahrt Dwello als Entwurf in diesem Browser auf, bis Sie sie speichern, verwerfen oder sich abmelden. Ein Entwurf kann Namen und Beträge enthalten; er bleibt auf dem Gerät, auf dem Sie arbeiten.';
</script>

<svelte:head>
	<title>Datenschutz - Dwello</title>
</svelte:head>

<div class="flex max-w-3xl flex-col gap-8">
	<PageHeader title="Datenschutz" purpose="Welche Daten Dwello bearbeitet und wohin sie gehen." />

	{#each sections as section (section.title)}
		<Panel title={section.title} testid="page-section">
			{#if section.title === 'Weitergabe an Dritte'}
				<p class="text-ink" data-testid="llm-recipient">{llmNotice}</p>
			{/if}
			{#each section.paragraphs as paragraph (paragraph)}
				<p class="text-ink">{paragraph}</p>
			{/each}
			{#if section.title === 'Welche Daten Dwello speichert'}
				<p class="text-ink" data-testid="draft-notice">{draftNotice}</p>
			{/if}
		</Panel>
	{/each}
</div>
