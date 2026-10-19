# Fach-Review #405: it-Wort für «Ersatzmieter»

Grundlage: `/home/user/Dwello` (HEAD 7e10cba8, nur gelesen), Issue #405 mit Kommentaren (`gh api`), `UBIQUITOUS_LANGUAGE.md:44–45`, `docs/design/i18n-begriffe.md:31–32`. Fedlex: OR (SR 220) it/fr/de, Fassung in Kraft seit 1.10.2026. Die HTML-Dateien stammen aus dem Fedlex-Filestore (über den SPARQL-Endpunkt gefunden) und liegen in `scratchpad/fedlex/or-{it,fr,de}.html`. Die Fassung vom 1.7.2027 ist publiziert, gilt aber noch nicht.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | it «nuovo inquilino» steht heute für Ersatzmieter (Art. 264) und für Nachmieter. In `contracts_notice_period_short` (it.json:1612) und `glossary_notice_period_text` (it.json:122) ist so die Ausnahme nach Art. 264 nicht von einem gewöhnlichen Mieterwechsel zu unterscheiden. Fix: **«inquilino sostitutivo»** |
| V-1 | Verwalter | Minor | it.json:122 fehlt in der Fundstellenliste des #405-Kommentars, der nur `contracts_notice_period_short` nennt. Beide Stellen gehören in dieselbe Änderung. |

## Fedlex-Wortlaut

Art. 264 cpv. 1 CO (it): «Il conduttore che restituisce la cosa senza osservare i termini di preavviso o le scadenze è liberato dai suoi obblighi verso il locatore soltanto se gli propone un **nuovo conduttore** solvibile che non possa essere ragionevolmente rifiutato dal locatore; il nuovo conduttore deve essere disposto a riprendere il contratto alle medesime condizioni.»

Dasselbe Wort steht in Art. 256a cpv. 1 CO für den gewöhnlichen Folgemieter: «Se alla fine della locazione precedente è stato steso un processo verbale sullo stato della cosa, il locatore deve darne visione al **nuovo conduttore**, a sua domanda, al momento della consegna della cosa.»

Die Parallelfassungen zeigen dasselbe Muster: de Art. 264 Abs. 1 «einen für den Vermieter zumutbaren **neuen Mieter**», Art. 256a Abs. 1 «dem **neuen Mieter**»; fr Art. 264 al. 1 «un **nouveau locataire** qui soit solvable», Art. 256a al. 1 «au **nouveau locataire**». Weder «subentrante» noch «sostitutivo» kommt im OR-it im Mietrecht vor. «subentra» steht nur in Art. 149 (Solidarschuld).

Folgerung: Fedlex hat für den Ersatzmieter kein eigenes Wort. «nuovo conduttore» ist im Gesetz zugleich das Wort für den Nachmieter. Das Fedlex-Wort trennt die beiden Begriffe also nicht und scheidet als Lösung aus. Auch mit #405 Punkt 2a («inquilino» bleibt) ergäbe es nur wieder «nuovo inquilino». Die Lage ist dieselbe wie im Deutschen und Französischen: «Ersatzmieter» und «locataire de remplacement» sind Praxiswörter, und Dwello verwendet sie schon.

## M-1 (Major): «nuovo inquilino» für zwei Begriffe

- **Beleg:** `i18n-begriffe.md:31` (Nachmieter: «nuovo inquilino»), `:32` (Ersatzmieter: «nuovo inquilino ❓ (#405)»). Im it-Text steht dasselbe Wort an diesen Stellen:
  - für Ersatzmieter: `messages/it.json:122` `glossary_notice_period_text` («… o se un nuovo inquilino lo riprende.»; de.json:122 «ein Ersatzmieter ihn übernimmt») und `messages/it.json:1612` `contracts_notice_period_short` («Eccezione: un nuovo inquilino riprende il contratto di locazione …»; de.json:1612 «Ein Ersatzmieter übernimmt den Mietvertrag»);
  - für Nachmieter oder neuer Mieter (diese bleiben): it.json:793, 801, 1626, 1627, 1633, 1634, 1663. it.json:633 `tenants_new_title` «Nuovo inquilino» bedeutet «neuer Mieter (Datensatz)» und bleibt ebenfalls.
- **Warum falsch:** Der Hinweis bei 1612 erscheint, wenn die Kündigung zu spät eingeht. Die einzige Ausnahme, die er nennt, ist die Übernahme des **bestehenden** Mietvertrags zu gleichen Bedingungen (Art. 264). Steht dort «nuovo inquilino», versteht ein Vermieter im Tessin: Sobald ein neuer Mieter einzieht, endet der alte Vertrag früher. Dieselbe Formulierung steht auf dem Dashboard in der Aufgabe «Cercare un nuovo inquilino» (1626). Der Vermieter kann so annehmen, jeder Nachmieter, den er selbst sucht, löse den kündigenden Mieter vorzeitig aus dem Vertrag. Ein Nachmieter mit eigenem Vertrag ab dem Kündigungstermin tut das aber nicht. Der Text führt also über die Rechtsfolge in die Irre.
- **Fix:** Ersatzmieter heisst it **«inquilino sostitutivo»** (Plural «inquilini sostitutivi»). Die beiden Stellen lauten dann:
  - 1612: «Eccezione: un inquilino sostitutivo riprende il contratto di locazione, oppure Lei ha concordato la fine con l’inquilino.»
  - 122: «… o se un inquilino sostitutivo lo riprende.»
  - `i18n-begriffe.md:32`: «inquilino sostitutivo», ❓ entfernen.
  - Nachmieter bleibt «nuovo inquilino».

## Empfehlung: «inquilino sostitutivo»

- **Eindeutig: ja**, mit dem Vorbehalt unter «Nicht bestätigt».
- **Begründung:**
  1. Das Fedlex-Wort scheidet aus (siehe oben).
  2. «sostitutivo» entspricht genau «Ersatz-», fr «de remplacement» und en «replacement». Die vier Sprachen bilden den Begriff damit gleich, und «sostitutivo» ist klar von «nuovo» (Nachmieter) verschieden.
  3. Die italienische Rechtsprechung verwendet die Form mit «conduttore» für genau diesen Fall: Regesto BGE 117 II 156 «Il locatore può rifiutare un conduttore sostitutivo che sia disposto a pagare solo una pigione considerevolmente inferiore …». Ebenso die Tessiner Mietgerichtspraxis (m3.ti.ch, GDL 5/27 und 11/20: «conduttore sostitutivo», «ad art. 264 CO»). «inquilino sostitutivo» übernimmt diesen Begriff mit dem Wort, das nach #405 Punkt 2a gilt. Auch Praxisseiten verwenden es für Art. 264 (newhome.ch it, nachmieter.ch it: «devi proporre un inquilino sostitutivo»).
  4. Die Alternative **«inquilino subentrante»** ist in der Tessiner Praxis zwar häufiger (homegate.ch, newhome.ch, immolaudi.ch, GDL-Regesto «inquilino subentrante»). Sie wird aber auch für den gewöhnlichen Nachmieter gebraucht, etwa homegate «Ricerca di un inquilino subentrante» beim normalen Auszug, oder als Wiedergabe von «Nachmieter». Sie trennt also gerade die beiden Begriffe nicht, um die es hier geht. Dazu kommt ein Konflikt mit it.json:702 `contracts_parties_fixed_transfer` («Se un’altra persona subentra nel contratto»): Dort steht «subentrare» für Art. 263 und die Wohnungszuteilung bei Scheidung, also für einen anderen Fall.
- Die Beschränkung auf die zwei Stellen 122 und 1612 bestätige ich. Alle übrigen Fundstellen von «nuovo inquilino» meinen den Nachmieter oder einen neuen Mieter-Datensatz (de.json 793, 801, 1626, 1634 geprüft). Backend-Texte sind nicht betroffen: `backend/src` enthält weder «inquilino» noch «Ersatzmieter». Die Mietertexte (`pdf.service.ts`, `reminder-letter.ts`) sprechen mit «Lei» an. Die E2E-Prüfung `tests/e2e/steps/contract-detail.steps.ts:384` liest nur den deutschen Text.

## Fehlende Begriffe

Keine. «Ersatzmieter» steht im Glossar (UL:45). Hier geht es nur um das it-Wort in `i18n-begriffe.md`, das #405 entscheidet.

## Nicht bestätigt

- Den Wortlaut von BGE 117 II 156 (Regesto it) habe ich nur aus Suchtreffern (`mmx search`, Snippets von search.bger.ch und entscheide.weblaw.ch). Der Abruf von search.bger.ch scheiterte am Proxy (403). Die Tessiner Fundstellen (m3.ti.ch GDL 5/27, 11/20) sind ebenfalls nur als Snippets gelesen.
- Wie oft «inquilino sostitutivo» gegenüber «inquilino subentrante» im Tessin tatsächlich vorkommt, kann ich nur aus der Websuche schätzen (beide kommen vor, «subentrante» häufiger). Ein Tessiner Muttersprachler kann bei der Lesung nach #405 Punkt 5 bestätigen, dass «sostitutivo» verstanden wird. Es stützt sich auf die Rechtsprechung, nicht auf Fedlex.
