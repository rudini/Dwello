# Fachreview #580 «KI im Browser einstellen», Runde 1

Gegenstand: `tests/e2e/features/ki-einstellungen.feature` (Commit 857b838, Worktree `review-580-fach`), dazu die geplanten Texte aus dem Auftrag, `messages/de.json` `privacy_*`, `src/routes/privacy/+page.svelte`, README «External LLM provider», `docs/installation.md` Abschnitt 6, `UBIQUITOUS_LANGUAGE.md`.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| F-1 | Rechtstexte | Major | Der Wortlaut der drei Checklistenpunkte fehlt im Gegenstand. Damit lässt sich nicht prüfen, ob die Bestätigung die README-Checkliste trägt; Formulierung siehe unten |
| F-2 | Rechtstexte | Major | Wird Anbieter, Land oder Adresse geändert, fehlt die Regel, dass die Bestätigung neu verlangt wird |
| F-3 | Rechtstexte | Major | «Verbindung prüfen» sendet an einen Anbieter, den die Datenschutzerklärung noch nicht nennt. Es fehlt die Regel, dass die Testanfrage keine in Dwello erfassten Daten enthält |
| F-4 | Rechtstexte | Major | Wechselt der Liegenschaftsverwalter den Anbieter oder schaltet ihn ab, nennt Dwello den früheren Empfänger nirgends mehr. Auskunft nach Art. 25 Abs. 2 Bst. g DSG ist dann nicht mehr möglich |
| F-5 | Verwalter | Major | Das Herunterladen des KI-Modells (Anforderung «with progress») hat kein Szenario: Start, Fortschritt, fertig, Fehler, kein lokaler KI-Dienst |
| F-6 | Rechtstexte | Minor | `privacy_third_ollama` (de.json:1980) erscheint nur im Modus «Lokale KI» (`+page.svelte:138`) und spricht von «etwa beim ersten Start … einmal». Startet der Liegenschaftsverwalter den Download in einem anderen Modus oder mehrmals, fehlt der Hinweis oder er stimmt nicht. Fix: anzeigen, sobald ein Download möglich ist oder stattfand; «einmal» streichen und den Start aus den Einstellungen nennen |
| F-7 | Verwalter | Minor | Hilfetext «KI eines Anbieters» nennt nur «Rechnungen und Rechnungsdateien». Laut `privacy_llm_external` gehen auch Name und Beschreibung aller Kategorien an den Anbieter, und Namen sind darin möglich. Fix: «Rechnungen, Rechnungsdateien und Kategorien gehen an den Anbieter, auch Namen und Adressen darin.» |
| F-8 | Verwalter | Minor | Hilfetext «Lokale KI auf diesem Server» verschweigt, dass sie rund 16 GB Arbeitsspeicher braucht (`docs/installation.md:13`, `:90`). Er sagt «lädt Dwello selbst herunter», laut Anforderung startet aber der Liegenschaftsverwalter den Download (F-5). Fix: «… braucht rund 16 GB Arbeitsspeicher. Das KI-Modell, rund 6 GB, laden Sie hier herunter.» (oder passend zum gewählten Ablauf) |
| F-9 | Rechtstexte | Minor | Feld «Land, in dem der Anbieter die Daten bearbeitet» und Feld «Anbieter»: Es fehlt der Hinweis, dass mehrere Länder bzw. Empfänger (Unterauftragnehmer, z. B. OpenRouter) alle zu nennen sind (README:304, :309; Art. 19 Abs. 4 DSG). Fix: Hilfetext «Bearbeiten mehrere Firmen oder Länder die Daten, nennen Sie alle, mit Komma getrennt.» Feld «Anbieter» heisst wie in der Fehlermeldung «Name des Anbieters» |
| F-10 | Verwalter | Minor | Die Sperrmeldung «… wenden Sie sich an den Betreiber.» (Feature:77) passt nicht, wenn der Liegenschaftsverwalter selbst Betreiber ist (Glossar «Betreiber»). Fix wie `privacy_controller_none`: «Vom Betreiber in der Einstellungsdatei festgelegt. Betreiben Sie Dwello selbst, ändern Sie die KI dort; sonst wenden Sie sich an den Betreiber.» |
| F-11 | Verwalter | Minor | Welche Umgebungsvariablen sperren (nur `LLM_BASE_URL`? auch `LLM_MODEL`, `LLM_ENABLED=false`?) und was die gesperrte Seite dann zeigt (Anbieter und Land, «Keine KI»), ist nicht festgelegt. Fix: die Regel in #580 oder im Kommentar Feature:74 nennen und für `LLM_ENABLED=false` ein Beispiel ergänzen |
| F-12 | Verwalter | Minor | Fehlende Zustände beim Speichern eines Anbieters: Adresse oder Modell leer; Speichern ohne Prüfung oder nach fehlgeschlagener Prüfung (erlaubt oder nicht?). Fix: Zeilen im Szenariogrundriss Feature:57–60 ergänzen und den Fall der fehlgeschlagenen Prüfung entscheiden |
| F-13 | Rechtstexte | Minor | Bleibt der Schlüssel leer und ändert sich die Adresse, ginge der gespeicherte Schlüssel an den neuen Host. Fix: Ändert sich die Adresse, muss der Schlüssel neu eingegeben werden, mit eigener Fehlermeldung. Nicht funktional, daher Zeile in `offene-punkte.md`, falls es nicht umgesetzt wird |
| F-14 | Rechtstexte | Minor | Feature:28 prüft nur das leere Feld. «Nie wieder im Browser» verlangt, dass auch die Seitendaten (`+page.server.ts`-Load, Antwort des Backends) den Schlüssel nicht enthalten. Fix: Test auf tieferer Ebene, der Load-Daten und API-Vertrag auf den Schlüssel prüft |
| F-15 | Verwalter | Minor | In Schritten wie «sagt die KI "…"» (Feature:29, 44, 77) und «zeigt die KI die Adresse» ist mit «KI» die Seite gemeint. Im Glossar ist KI das Sprachmodell (UBIQUITOUS_LANGUAGE.md:116), so liest es sich, als spreche das Modell. Fix: «sagt die Seite "KI" …» bzw. «zeigt die Seite "KI" die Adresse …» |

## F-1 Checkliste und Bestätigung: Wortlaut fehlt

Belege: Der Auftrag nennt nur «the three points listed» und die Checkbox «Ich habe diese drei Punkte geprüft.». Feature:58 verweist mit «die drei Punkte zum Datenschutz» darauf. Die README-Checkliste (README:301–307) richtet sich an den Betreiber («the operator (not Dwello) makes sure»). Neu bestätigt sie der Liegenschaftsverwalter, der für die erfassten Daten Verantwortlicher ist (Glossar «Verantwortlicher (DSG)», `privacy_controller_1`).

Warum: Die Bestätigung ist rechtlich nicht vorgeschrieben, sie ist eine Leitplanke. Sie trägt nur, wenn die Punkte sagen, was die Datenschutzerklärung nicht leisten kann. Die Erklärung nennt nur Anbieter und Land und keine Garantien nach Art. 16 Abs. 2 DSG. Fedlex, Art. 19 Abs. 4 DSG: «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat oder das internationale Organ und gegebenenfalls die Garantien nach Artikel 16 Absatz 2 oder die Anwendung einer Ausnahme nach Artikel 17 mit.» Das Freitextfeld «Land» nimmt auch einen Staat ohne angemessenen Schutz an. Nur Punkt 2 hält den Liegenschaftsverwalter davon ab, und das muss er ausdrücklich sagen. Art. 9 Abs. 2 DSG: «Der Verantwortliche muss sich insbesondere vergewissern, dass der Auftragsbearbeiter in der Lage ist, die Datensicherheit zu gewährleisten.» Art. 9 Abs. 3 DSG: «Der Auftragsbearbeiter darf die Bearbeitung nur mit vorgängiger Genehmigung des Verantwortlichen einem Dritten übertragen.» Art. 16 Abs. 1 DSG: «Personendaten dürfen ins Ausland bekanntgegeben werden, wenn der Bundesrat festgestellt hat, dass die Gesetzgebung des betreffenden Staates oder das internationale Organ einen angemessenen Schutz gewährleistet.»

Fix, vorgeschlagener Wortlaut (Sie-Form, in alle vier Sprachen):
1. «Sie haben mit dem Anbieter einen Vertrag, nach dem er die Daten nur in Ihrem Auftrag bearbeitet, sie schützt und nicht für das Training seiner KI verwendet (Art. 9 DSG). Andere Firmen zieht er nur mit Ihrer Zustimmung bei.»
2. «Der Anbieter und alle Firmen, die er beizieht, bearbeiten die Daten nur in der Schweiz oder in einem Land, dessen Datenschutz der Bundesrat als angemessen anerkennt (Art. 16 Abs. 1 DSG); in den USA nur Firmen, die nach dem Swiss-U.S. Data Privacy Framework zertifiziert sind. Andere Anbieter unterstützt Dwello nicht: Die Datenschutzerklärung kann keine zusätzlichen Garantien nennen.»
3. «Der Anbieter bewahrt die Daten nicht länger auf als nötig, am besten gar nicht oder nur kurz.»

Darunter «Das ist eine Checkliste, keine Rechtsberatung.» wie README:307. Wenn die Wörter fest sind, das README auf «whoever sets the KI (the operator in `.env`, the landlord in the settings)» umstellen und `docs/installation.md` Abschnitt 6 auf die Einstellungsseite verweisen lassen.

## F-2 Bestätigung gilt für einen bestimmten Anbieter

Belege: Feature:49–60 prüft nur ein erstes Speichern ohne Bestätigung. Keine Zeile legt fest, was gilt, wenn ein gespeicherter Anbieter (Feature:26, 33) mit neuem Namen, Land oder neuer Adresse gespeichert wird.

Warum: Die drei Punkte gelten für einen bestimmten Empfänger. Ist die Checkbox vorbelegt oder entfällt sie bei einer Änderung, dann nennt die Datenschutzerklärung zwar den neuen Anbieter (Art. 19 Abs. 2 Bst. c, Abs. 4 DSG), aber niemand hat dessen Vertrag und Land geprüft.

Fix: Regel «Die Checkbox ist beim Öffnen leer, und jedes Speichern im Modus ‹KI eines Anbieters› verlangt sie neu» (oder mindestens bei geänderter Adresse, Name oder Land). Dazu eine Beispielzeile «Bestätigung nach geändertem Anbieter» im Grundriss Feature:56.

## F-3 Testanfrage an einen noch nicht genannten Empfänger

Belege: Feature:62–72 prüft die Verbindung, bevor gespeichert ist. Der Auftrag sagt: «sends a test request and says whether the model reads invoice images».

Warum: Vor dem Speichern nennt die Datenschutzerklärung den Anbieter nicht. Art. 19 Abs. 5 Satz 2 DSG: «Gibt der Verantwortliche die Personendaten vor Ablauf dieser Frist bekannt, so informiert er die betroffene Person spätestens im Zeitpunkt der Bekanntgabe.» Enthält die Testanfrage eine echte Rechnung oder Kategorie (naheliegend, um «liest Rechnungsbilder» zu prüfen), gehen Personendaten an einen nicht genannten Empfänger, möglicherweise ins Ausland, ohne Bestätigung nach F-1.

Fix: Regel und Test auf tieferer Ebene: Die Prüfung sendet nur ein festes, erfundenes Testbild und einen festen Text, nie Daten aus der Datenbank. Im Kommentar über Feature:62 festhalten.

## F-4 Frühere Empfänger nach einem Wechsel

Belege: Feature:31–37 und 39–46: Nach «Keine KI» oder «Lokale KI» nennt die Datenschutzerklärung «Muster KI AG» nicht mehr. Das Protokoll unter «Einstellungen» hält nur Anmeldungen und Änderungen fest, die Abrechnungen beeinflussen (UBIQUITOUS_LANGUAGE.md:265, `audit_privacy` de.json:1920).

Warum: Bisher änderte nur der Betreiber den Empfänger, in `.env` und mit Neustart. Jetzt wechselt ihn der Liegenschaftsverwalter mit wenigen Klicks. Was der frühere Anbieter erhielt, liegt dort weiter, so lange er es aufbewahrt. Art. 25 Abs. 2 Bst. g DSG verlangt in der Auskunft «gegebenenfalls die Empfängerinnen und Empfänger oder die Kategorien von Empfängerinnen und Empfängern, denen Personendaten bekanntgegeben werden, sowie die Informationen nach Artikel 19 Absatz 4.» Auf diese Auskunft verweist `privacy_controller_3` die Mieter ausdrücklich. Dwello hält nirgends fest, an wen bis wann Rechnungen gingen.

Fix (Produktentscheid): Jeder Wechsel der KI-Einstellung kommt mit Datum, Anbieter und Land ins Protokoll. Dafür müssen die Glossarzeile «Protokoll» und `audit_privacy` erweitert werden. Alternative: ein eigenes Issue (`fachlich`, `entscheiden`), wenn #580 das nicht abdeckt.

## F-5 Herunterladen des KI-Modells ohne Szenario

Belege: Anforderung «The local model can be downloaded from there, with progress». Im Feature kommt der Download nur als Ausgangslage vor («ist zu 40 % geladen», Feature:42). Kein Szenario startet ihn, schliesst ihn ab oder lässt ihn scheitern. Auf einer Installation nach `docs/installation.md` Abschnitt 6 (ohne 16 GB, ohne lokalen KI-Dienst) kann «Lokale KI» gar nicht laufen.

Warum: Ein Liegenschaftsverwalter mit wenig Erfahrung muss sehen, dass etwas passiert (Fortschritt), dass es fertig ist, und was er bei einem Fehler tut (kein Internet, zu wenig Speicherplatz, kein lokaler KI-Dienst). Sonst wartet er, und die Rechnungen bleiben ohne Vorschlag.

Fix: Szenarien «Das KI-Modell herunterladen» (Start, Fortschritt, Meldung bei Abschluss) und ein Grundriss für die Fehler, jeder mit dem, was zu tun ist. Wenn kein lokaler KI-Dienst erreichbar ist: «Lokale KI» nicht anbieten oder erklären, warum es nicht geht.

## Fehlende Begriffe (Issue mit `fachlich`, `entscheiden`)

Vorschläge für `UBIQUITOUS_LANGUAGE.md`, Abschnitt «Einstellungen» oder «KI-Kategorisierung»:
- **KI-Einstellung**: Wahl unter «Einstellungen» › «KI», welche KI Rechnungen kategorisiert und ausliest: lokale KI, KI eines Anbieters oder keine KI. Sie gilt ab der nächsten Rechnung. Hat der Betreiber Umgebungsvariablen gesetzt, gelten diese, und die Seite ist gesperrt.
- **Lokale KI**: KI auf dem Server des Betreibers (Ollama) mit dem KI-Modell. Rechnungen verlassen den Server nicht. Die Oberfläche sagt «Lokale KI auf diesem Server».
- **Anbieter der KI**: Firma, deren KI über ihre Adresse Rechnungen und Kategorien erhält. Der Liegenschaftsverwalter nennt Name und Land. Die Datenschutzerklärung nennt beide, unabhängig von der Adresse. Nicht zu verwechseln mit einem Anbieter für die Anmeldung (Google) oder einem Anbieter, der Dwello betreibt (Betreiber).
- **Adresse der KI**: Internetadresse (OpenAI-kompatibel), unter der der Anbieter der KI Anfragen annimmt.
- **API-Schlüssel**: Geheimer Schlüssel aus dem Konto beim Anbieter der KI. Dwello speichert ihn verschlüsselt und zeigt ihn nie wieder an.
- **Verbindung prüfen**: Testanfrage ohne erfasste Daten an die Adresse der KI. Sie meldet, ob der Schlüssel gilt, die Adresse antwortet und das Modell Bilder liest.

Die Glossarzeile «KI-Modell» (UBIQUITOUS_LANGUAGE.md:252) sagt «Fehlt es, lädt Dwello es … herunter». Sie muss an den Ablauf nach F-5 angepasst werden.

## Nicht bestätigt

- Wortlaut der drei Checklistenpunkte und der Hilfetexte zu «Adresse der KI» und «API-Schlüssel»: nicht im Gegenstand (Feature, Auftrag). Gesucht in `messages/de.json` und im Feature.
- Ob «Lokale KI» ein eigenes Adressfeld hat. Hätte sie eines, könnte `privacy_llm_local` («verlassen den Server nicht») falsch werden. Der Auftrag nennt keines. Geprüft im Auftrag und in `tests/e2e/steps/ki-settings.steps.ts`.
- Die Bundesrats-Liste (DSV Anhang 1) mit der Einschränkung für die USA habe ich nicht auf Fedlex nachgelesen; der Vorschlag in F-1 Punkt 2 übernimmt README:304. **unsicher**, bis die DSV geprüft ist.

Geprüft: Art. 19 Abs. 2 Bst. c und Abs. 4 DSG für den Anbietermodus (Feature:22, `privacy_llm_external`), «Keine KI» (`privacy_llm_off`) und «Lokale KI» (`privacy_llm_local`) stimmen mit der Datenschutzerklärung überein. Die drei Fehlermeldungen Feature:58–60 und die vier Prüfmeldungen Feature:69–72 sagen, was zu tun ist. «Betreiber» passt zum Glossar. Mietrechtlich (OR, VMWG) ist nichts betroffen.
