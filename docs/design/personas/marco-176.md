# Persona Marco – Issue #176 (Kategorie: Abwälzbarkeit wählen und von der KI prüfen lassen, Italienisch, Handy)

Marco, 38, auf dem Handy (390 × 844, Touch), Oberfläche auf Italiano. Aufgabe: auf Impostazioni → Categorie zwei neue Kategorien erfassen («Pulizia scale Marco» und «Dachsanierung Marco» mit italienischer Übersetzung «Risanamento tetto Marco»), jeweils mit «Far verificare dall’IA» prüfen lassen, Vorschlag und Begründung lesen, entscheiden und speichern.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/fbb18b34-b688-5fdb-9b9f-9f01da7bd45c/scratchpad/marco-176/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Nuova categoria, nach «Far verificare dall’IA» | Die KI setzt die Auswahl selbst um, auch wenn ich vorher schon gewählt hatte («Addebitabile» → «Non addebitabile»). Der Kasten heisst aber «Proposta dell’IA», also erwarte ich einen Vorschlag, den ich übernehme, nicht eine schon geänderte Wahl. Kein Hinweis, dass meine Wahl überschrieben wurde. |
| P-2 | Minor | Nuova categoria, Vorschlag sichtbar | Nach dem Ändern des Namens (von «Dachsanierung Marco» zu «Treppenhausreinigung Marco Test») bleibt der alte Vorschlag «Non addebitabile» mit Begründung zum Dachsanieren stehen. Er passt nicht mehr zum Namen, ich könnte mit falscher Wahl speichern. |
| P-3 | Nit | Nuova categoria, Hilfetext zu «Spese accessorie addebitabili» | Auf dem Handy rund 11 Zeilen Text vor den zwei Optionen; ich muss scrollen, bis ich wählen kann. Inhaltlich gut und italienisch korrekt, aber für mich zu lang; der Knopf «Far verificare dall’IA» wird darin nicht erwähnt (was er tut, dass er die Wahl setzt). |

## Beobachtungen

- Das Feld heisst «Nome (tedesco)» mit «Esempio: Treppenhausreinigung». Als Tessiner verstehe ich nicht, warum ich den Namen auf Deutsch eingeben muss; ich habe «Pulizia scale Marco» trotzdem dort eingetragen. Wahrscheinlich prüft die KI nur diesen deutschen Namen (die Aufgabe verlangte für die Dachsanierung ausdrücklich den deutschen Namen).
- Erfolgsmeldung nach dem Speichern: «Categoria «Dachsanierung Marco» salvata» – sie nennt den deutschen Namen, die Liste zeigt aber «Risanamento tetto Marco» (meine italienische Übersetzung). Kurz verwirrend, ob es die gleiche Kategorie ist.
- Die Sprache ist offenbar am Konto gespeichert, nicht im Browser: während meines Laufs stand die Oberfläche plötzlich wieder auf Deutsch (eine andere Persona hat wohl umgestellt), ich musste erneut Italiano wählen. Für einen echten Einzelnutzer kein Problem, für parallele Persona-Läufe schon (gegenseitiges Umstellen).
- In der Kategorienliste stehen viele Kategorien mit deutschen Namen ohne Übersetzung (z. B. «Bewachung Sven», «Dachsanierung Helga», «Gartenpflege Sven», «Treppenhausreinigung Helga»); das sind Datensätze anderer Personas, kein Befund.
- Fusszeile «Versione sconosciuta».

## Aufgabe geschafft: ja

Beide Kategorien sind gespeichert: «Pulizia scale Marco» (Addebitabile) und «Dachsanierung Marco» / it. «Risanamento tetto Marco» (Non addebitabile).

## Aufwand

Etwa 15 Minuten, rund 10 Durchläufe; für eine Kategorie reichen effektiv 5 Schritte (Name, KI-Knopf, Vorschlag lesen, Übersetzung, Speichern). Ein Fehlversuch, weil die Sprache zwischendurch auf Deutsch zurückgesprungen war.

## Ablauf

1. **Sprache wechseln.** Erwartet: Sprachknopf oben. Gesehen: «Sprache: Deutsch» → Liste → «Italiano»; ganze Oberfläche danach italienisch (Screenshot `01-dashboard.png`, `04-menu-it.png`).
2. **Zu den Kategorien.** Menü «Aprire il menu» → «Categorie». Seite «Categorie» mit Einleitung, Knopf «Registrare una categoria», Filter «Tutte / Addebitabile / Non addebitabile» (`05-categorie.png`). Alles italienisch.
3. **Formular öffnen.** «Nuova categoria»: Nome (tedesco), Descrizione, Gruppe «Spese accessorie addebitabili» mit Hilfetext (Art. 257a–257b CO), zwei grosse Optionskarten «Addebitabile – I costi entrano nel conteggio spese accessorie.» und «Non addebitabile – I costi sono a carico del locatore.», keine vorausgewählt; darunter «Far verificare dall’IA» (`06-new-empty.png`). Erwartet: Wahl und Erklärung verständlich – ja, klar.
4. **KI ohne Namen.** Erwartet: Hinweis, dass der Name fehlt. Gesehen: Namensfeld rot, «Il nome è obbligatorio» (`07-ai-empty.png`). Gut.
5. **Kategorie 1: «Pulizia scale Marco», KI prüfen.** Erwartet: Vorschlag «Addebitabile». Gesehen: Kasten «Proposta dell’IA: Addebitabile – Costi d’esercizio correnti legati all’uso della cosa locata (art. 257b cpv. 1 CO).», Option «Addebitabile» ist gleich angewählt (`09-ai-result.png`). Italienisch, verständlich. Ich bin einverstanden, trage Italiano «Pulizia scale Marco» ein und tippe «Salvare la categoria». Zurück zur Liste, Eintrag «Pulizia scale Marco – Addebitabile» (`10-after-save-1.png`).
6. **Kategorie 2: «Dachsanierung Marco».** Ich wähle zuerst absichtlich «Addebitabile», dann «Far verificare dall’IA». Während der Prüfung (künstlich um 3 s verzögert): Knopf grau, «Attendere, prego …», deaktiviert (`13-loading-viewport.png`). Danach: «Proposta dell’IA: Non addebitabile – Il mantenimento e il rinnovo dell’edificio non sono legati al suo uso (art. 257a cpv. 1 CO).», und meine Wahl ist auf «Non addebitabile» umgesprungen (`14-result-viewport.png`, `11-ai-dach.png`). Erwartet hatte ich: Vorschlag anzeigen, ich entscheide → P-1. Der Vorschlag ist im sichtbaren Bereich direkt unter dem Knopf, keine Querscroll-Leiste (Seitenbreite 390 px).
7. **Name ändern nach Vorschlag.** Erwartet: Vorschlag verschwindet oder wird als veraltet markiert. Gesehen: bleibt unverändert stehen → P-2. Name zurückgesetzt.
8. **Speichern.** Italiano «Risanamento tetto Marco», «Salvare la categoria». Liste zeigt «Risanamento tetto Marco – Non addebitabile», Meldung «Categoria «Dachsanierung Marco» salvata» (`12-after-save-2.png`).

## Verwirrung

- «Nome (tedesco)»: warum Deutsch? (Beobachtung)
- «Proposta» vs. tatsächlich schon umgestellte Wahl (P-1).
- Begriffe «addebitabile», «spese accessorie», «conteggio spese accessorie», «locatore», «cosa locata» sind für mich klar und schweizerisch üblich. Kein deutsches Wort in Wahl, Hilfetext, Knopf, Ladezustand, Vorschlag oder Begründung gefunden.

## Fehlerrisiken

- Wer zuerst selbst wählt und dann die KI fragt, merkt evtl. nicht, dass seine Wahl überschrieben wurde (P-1).
- Veralteter Vorschlag nach Namensänderung verleitet zum Speichern mit falscher Abwälzbarkeit (P-2).

## Vorschläge

- **P-1:** Reproduktion: Nuova categoria → Nome «Dachsanierung Marco» → «Addebitabile» antippen → «Far verificare dall’IA» → Wahl springt auf «Non addebitabile». Hilfe: entweder die Wahl nicht automatisch ändern und im Kasten einen Knopf «Accettare la proposta» anbieten, oder im Kasten klar sagen «L’IA ha selezionato “Non addebitabile”. Può cambiare la scelta.»
- **P-2:** Reproduktion: wie P-1, danach Namen ändern → Vorschlag bleibt. Hilfe: Vorschlag beim Ändern des Namens ausblenden oder mit «Il nome è cambiato: faccia verificare di nuovo» markieren.
- **P-3:** Reproduktion: Nuova categoria auf 390 px öffnen. Hilfe: Hilfetext kürzen (zwei Sätze), Details aufklappbar oder unter die Optionen; ein Satz zum KI-Knopf («L’IA propone una scelta; decide Lei.»).

## Nicht geprüft

- Fehlschlag der KI-Prüfung (Anfrage `?/propose` mit Fehler) – nicht Teil der Aufgabe.
- Wie die KI auf einen rein italienischen Namen im Feld «Nome (tedesco)» reagiert – der KI-Ersatz der Persona-App erkennt nur bestimmte deutsche Wörter, das Ergebnis wäre nicht aussagekräftig.
- Bearbeiten einer bestehenden Kategorie mit der KI-Prüfung.
- Zoom / grössere Schrift, Dunkelmodus.
