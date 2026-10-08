<script lang="ts">
	const sections = [
		{
			title: 'Welche Daten Dwello speichert',
			paragraphs: [
				'Dwello speichert die Daten, die für die Verwaltung der Liegenschaften und die Nebenkostenabrechnung nötig sind: Gebäude und Wohnungen, Mieter mit Kontaktdaten und Korrespondenzadresse, Mietverträge, Rechnungen sowie die erstellten Abrechnungen, Zahlungen und Mahnungen.',
				'Die Daten liegen in der PostgreSQL-Datenbank des Betreibers dieser Dwello-Installation. Rechnungen werden mit einem Sprachmodell kategorisiert. Läuft es auf dem Server des Betreibers (Standard: Ollama), verlassen Rechnungsdaten dafür den Server nicht; nutzt der Betreiber einen externen Anbieter, erhält dieser Rechnungssteller, Beschreibung und Betrag der Rechnung.'
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
</script>

<svelte:head>
	<title>Datenschutz - Dwello</title>
</svelte:head>

<div class="space-y-6 max-w-3xl">
	<div>
		<h1 class="text-2xl font-bold text-gray-900" data-testid="page-title">Datenschutz</h1>
		<p class="text-gray-500 mt-1">Welche Daten Dwello bearbeitet und wohin sie gehen</p>
	</div>

	{#each sections as section (section.title)}
		<section
			data-testid="page-section"
			class="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-3"
		>
			<h2 class="text-lg font-semibold text-gray-900">{section.title}</h2>
			{#each section.paragraphs as paragraph (paragraph)}
				<p class="text-gray-700">{paragraph}</p>
			{/each}
		</section>
	{/each}
</div>
