# Persona-Review p14: Dr. Weber – Sprach-Cookie in der Datenschutzerklärung

Persona: Dr. Weber, 52, will alles genau wissen und prüft jede Aussage nach. Desktop 1440 × 900, Maus. Ich habe nur angesehen, nichts gespeichert. Die Sprache auf der Anmeldeseite habe ich in einem eigenen, frischen Browser gewechselt. Das ist eine Einstellung im Browser und schreibt nichts in die Datenbank.

Geprüfte Änderung: Dwello startet in der Sprache des Browsers (de/fr/it/en), wenn noch keine Sprache gewählt ist. Eine gewählte Sprache bleibt. Stimmt der Abschnitt «Cookies» der Datenschutzerklärung damit überein?

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Kein Befund. Der Abschnitt «Cookies» beschreibt auf Deutsch, Englisch und Italienisch genau, was ich beobachtet habe. |

## Beobachtungen

- **Wer setzt das Cookie:** Kein Server-Antwortkopf enthält `Set-Cookie`. Das Cookie `PARAGLIDE_LOCALE` entsteht im Browser selbst (es steht in `document.cookie`). Die Erklärung sagt «Dwello setzt es». Das ist für den Leser richtig, auch wenn das Script und nicht der Server es setzt.
- **Ohne Anmeldung:** Das Cookie wird schon beim ersten Aufruf der Anmeldeseite gesetzt, also bevor man irgendetwas tut. Die Erklärung nennt es «technisch notwendig». Man kann darüber streiten, ob eine gespeicherte Sprache wirklich «technisch notwendig» ist oder eher eine Komfort-Einstellung. In der Schweiz verlangt sie aber keine Einwilligung, und die Erklärung beschreibt sie offen. Ich halte das für vertretbar.
- **Angemeldet, Browser auf Englisch, ohne Sprach-Cookie:** Die Übersicht erscheint auf Englisch («Overview»), und das Cookie wird auf `en` gesetzt. Laut Persona-Anleitung wird die Sprache auch am Konto gespeichert. Ob für das Demo-Konto eine Sprache hinterlegt ist, kann ich von aussen nicht sehen. Der Abschnitt «Welche Daten Dwello speichert» erwähnt eine Sprache am Konto nicht. Das liegt ausserhalb dieser Änderung, ich nenne es nur.
- **Italienisch:** Die Anmeldeseite schreibt «Acceda con il **suo** account» (klein), die Datenschutzseite «la **Sua** sessione», «quando **Lei** sceglie» (gross). Die Höflichkeitsform ist uneinheitlich. Das liegt ausserhalb dieser Änderung.
- Seitenaufrufe zu fremden Servern habe ich auf der Anmelde- und der Datenschutzseite keine gesehen.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 6 Skriptläufe (Deutsch angemeldet, Englisch frisch zweimal, Italienisch frisch zweimal, Gegenproben für den Rückfall auf Deutsch und für eine gewählte Sprache).

## Ablauf

1. **Deutsch (de-CH, angemeldet), Fusszeile «Datenschutz» → /privacy, Abschnitt «Cookies».**
   Erwartet: eine Aussage zum Sprach-Cookie mit Name, Dauer und Herkunft der Sprache.
   Gesehen: «‹PARAGLIDE_LOCALE› speichert die Sprache der Oberfläche für 400 Tage; JavaScript kann es lesen. Beim ersten Besuch setzt Dwello es auf die Sprache Ihres Browsers, wenn sie Deutsch, Französisch, Italienisch oder Englisch ist, sonst auf Deutsch.»
   Nachgeprüft: Cookie `PARAGLIDE_LOCALE=de`. Ablauf minus jetzt = 34 560 000 s = genau 400 Tage. `httpOnly` ist aus, JavaScript kann es also lesen. Stimmt.
2. **Frischer Browser en-GB, keine Cookies, Aufruf von /.**
   Erwartet: Weiterleitung zur Anmeldung auf Englisch, danach ein Sprach-Cookie `en`.
   Gesehen: Vorher keine Cookies. Danach /login, `<html lang="en">`, «Sign in», «Sign in with Google», Sprachwahl «Language: English». Einziges Cookie: `PARAGLIDE_LOCALE=en`, 400 Tage, per JavaScript lesbar. Keine Sitzungs-Cookies, weil ich nicht angemeldet war.
   Dann Fusszeile «Privacy» → Seite «Privacy», Abschnitt «Cookies»: «‹PARAGLIDE_LOCALE› stores the interface language for 400 days; JavaScript can read it. On the first visit Dwello sets it to your browser's language if that is German, French, Italian or English, otherwise to German.» Stimmt mit der Beobachtung überein und entspricht dem deutschen Text.
3. **Frischer Browser it-CH, keine Cookies.**
   Gesehen: /login auf Italienisch («Accedere», «Accedere con Google», «Lingua: Italiano»), `<html lang="it">`. Cookie `PARAGLIDE_LOCALE=it`, 400 Tage, lesbar.
   «Protezione dei dati», Abschnitt «Cookie»: «‹PARAGLIDE_LOCALE› salva la lingua dell'interfaccia per 400 giorni; JavaScript può leggerlo. Alla prima visita Dwello vi registra la lingua del Suo browser, se è tedesco, francese, italiano o inglese, altrimenti il tedesco.» Stimmt. Screenshot `03-it-privacy.png`: vier Karten, «Cookie» als letzte, gut lesbar, kein deutsches Wort.
4. **Gegenprobe «sonst auf Deutsch»:** Bei es-ES, rm-CH (Rätoromanisch) und de-DE ist die Anmeldeseite auf Deutsch und das Cookie `de`. Bei fr-CH ist sie auf Französisch («Se connecter»), Cookie `fr`. Stimmt.
5. **Gegenprobe «gewählte Sprache bleibt»:**
   a) Browser en-GB, Cookie `fr` schon vorhanden: Die Seite ist auf Französisch, das Cookie bleibt `fr`. Der Browser überschreibt die Wahl nicht.
   b) Browser en-GB frisch, «Language: English» → «Italiano»: Die Seite wechselt auf Italienisch, Cookie `it` mit wieder 400 Tagen. Auch nach Neuladen und in einem neuen Tab ist alles auf Italienisch.
   Das passt zur Erklärung: Das Cookie speichert die Sprache, der Browser zählt nur beim ersten Besuch.

## Verwirrung

- «PARAGLIDE_LOCALE» ist ein technischer Name. Ein Laie weiss nicht, was «Paraglide» ist. Der Satz danach erklärt aber den Zweck. Weil die Erklärung die Cookies mit ihren echten Namen aufführt, ist der Name hier richtig.
- «JavaScript kann es lesen» sagt einem Laien wenig. Gemeint ist der Gegensatz zu «dwello_session». In allen drei Sprachen ist es gleich formuliert.

## Fehlerrisiken

- Wenn die Dauer im Code einmal geändert wird, stimmt die Angabe «400 Tage» in allen vier Sprachtexten nicht mehr. Beim nächsten Wechsel bitte mitprüfen.
- Wird die Liste der Sprachen erweitert, muss der Satz «Deutsch, Französisch, Italienisch oder Englisch» mitwachsen.

## Vorschläge

Keine Tabellen-ID, also keine Vorschläge zur Änderung.

## Nicht geprüft

- Französisch: Den Text der Datenschutzseite habe ich nicht gelesen. Die Aufgabe nannte nur de, en und it. Die Anmeldeseite auf fr-CH habe ich gesehen.
- Ein Browser mit mehreren Sprachen in der Reihenfolge (z. B. zuerst Spanisch, dann Französisch): Der Testbrowser lässt sich nur auf eine Sprache stellen. Ob dann «die Sprache Ihres Browsers» die erste oder die erste passende ist, bleibt offen.
- Eine Anmeldung über Google: Im Persona-Stack nicht möglich. Die Cookies «dwello_oauth_state» und «dwello_login» habe ich deshalb nicht beobachtet.
- Ob eine Sprache am Konto das Cookie nach der Anmeldung überschreibt: Ich sehe nicht, was am Demo-Konto hinterlegt ist, und sollte nichts speichern.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/74573eec-a8c7-5a4e-9962-dac8343cddae/scratchpad/weber-p14/` (`01-privacy-de.png`, `02-en-start.png`, `03-en-privacy.png`, `02-it-start.png`, `03-it-privacy.png`, `04a-switcher-open.png`, `04b-after-pick-it.png`, `05-signedin-en.png`).
