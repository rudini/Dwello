# Fach-Review P-14 (#110): Sprache des Browsers, Runde 1

Geprüft: Worktree `review-p14-fach`, Commit 8c4362d. Gegenstand: die vier ersten Szenarien in `tests/e2e/features/sprachen.feature` (Z. 8–32) mit ihren Schritten (`tests/e2e/steps/language.steps.ts:69-75`, `tests/e2e/tasks/language.ts`, `tests/e2e/screenplay/interactions.ts:172-178`) sowie die Datenschutzerklärung (`src/routes/privacy/+page.svelte:47-53`, `messages/{de,fr,it,en}.json:147-151`).

Kurz: Die Szenarien geben den Entscheid (Option 2) richtig und in der Domänensprache wieder. Keine Blocker, keine Major. Die Datenschutzerklärung **muss** wegen dieser Änderung rechtlich nicht geändert werden; empfohlen wird ein Zusatzsatz zu `privacy_cookies_4` in allen vier Sprachen (R-1, Minor). Unabhängig von dieser Änderung fehlt seit jeher der Hinweis nach Art. 45c lit. b FMG, dass man Cookies ablehnen kann (R-2, Minor, vorbestehend).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| R-1 | Rechtstexte | Minor | `privacy_cookies_4` sagt nicht, dass das Cookie beim ersten Besuch ohne Wahl gesetzt wird und dann die Sprache des Browsers übernimmt |
| R-2 | Rechtstexte | Minor (vorbestehend) | Hinweis fehlt, dass Cookies abgelehnt werden können (Art. 45c lit. b FMG) |
| V-1 | Verwalter | Minor | Das automatisch geschriebene Cookie friert die Sprache des ersten Besuchs ein; kein Szenario hält das fest |
| V-2 | Verwalter | Minor | Szenario «Die gewählte Sprache gilt vor der Sprache des Browsers» ist schon auf dem Basis-Commit grün, `@wip` kann nie rot werden |
| V-3 | Verwalter | Nit | Italienisch als Sprache des Browsers wird nicht geprüft (Tessin steht in der Funktionalität) |
| V-4 | Verwalter | Nit | `UBIQUITOUS_LANGUAGE.md` Z. 227 nennt nur «Deutsch ist Standard», nicht die Sprache des Browsers |
| R-3 | Rechtstexte | Nit (vorbestehend) | Die Sprache der Oberfläche geht mit der KI-Prüfung einer Kategorie an den KI-Anbieter; die Erklärung nennt nur Name und Beschreibung |
| M-– | Mietrecht | – | Keine Befunde: Die Sprache des Browsers berührt die Sprache des Mieters (PDF, Mahnungen) nicht |

## Frage 1: Geben die Szenarien den Entscheid richtig wieder?

Ja.
- Entscheid (#110, «Decided (product owner)»): «Option 2: the cookie wins, otherwise the browser language (de, fr, it or en), otherwise German.»
- Cookie gewinnt: Szenario Z. 26–32 (Wahl «Italiano» schlägt Browser Englisch). Bestätigt.
- Sonst die Sprache des Browsers: Z. 8–13 (Anmeldeseite, Besucher, Französisch) und Z. 15–19 (Übersicht, Liegenschaftsverwalter, Englisch). Damit sind Server (`Accept-Language`) und Seite (`navigator.languages`) abgedeckt: `interactions.ts:172-178` setzt beides. Bestätigt. Das Szenario Z. 8–13 erfüllt auch die «Done means» von #110 («browser language French, no cookie: login page in French»).
- Sonst Deutsch: Z. 21–24 mit `es-ES,es;q=0.9` (`tasks/language.ts:12`). Der Titel «wenn der Browser keine der vier Sprachen will» passt genau zu dieser Kopfzeile (keine der vier Sprachen in der Liste). Dass ein Browser mit `es-ES,es;q=0.9,en;q=0.8` Englisch bekäme, folgt aus dem Entscheid («the browser language») und ist richtig; ein eigenes Szenario dafür braucht es nicht. Ohne `@wip` ist es korrekt, weil es heute schon grün ist (Ersatz des alten Szenarios).
- Begriffe: «Liegenschaftsverwalter», «Besucher», «Übersicht», «Anmeldeseite», «die Sprache … wählt», «ist die Seite auf …» sind die schon verwendeten Formulierungen der Funktionalität; «Sprache des Browsers» ist ein Alltagswort, kein Domänenbegriff. «Sprache» in `UBIQUITOUS_LANGUAGE.md` Z. 23 und 227 meint die Sprache des Mieters; «Sprache der Oberfläche» (Titel der Funktionalität) hält beides auseinander. Bestätigt.

## Frage 2: Muss die Datenschutzerklärung geändert werden?

**Rechtlich zwingend: nein. Empfohlen: ja, ein Satz (R-1).**

Begründung:
- Das Cookie und sein Zweck sind schon genannt (`privacy_cookies_4`: «speichert die Sprache der Oberfläche für 400 Tage»). Das bleibt wahr: Der Wert ist nach wie vor die Sprache der Oberfläche, neu nur anfangs aus der Sprache des Browsers statt fest `de`. Gesetzt wird das Cookie schon heute beim ersten Besuch ohne Wahl (Persona `docs/design/personas/weber-f19a-2.md` Z. 28: «`PARAGLIDE_LOCALE=de` … ohne dass ich eine Sprache gewählt hatte»; ebenso `weber-f19a.md` P-9). Neu ist also nur der Inhalt beim ersten Besuch, nicht das Setzen.
- Art. 45c FMG (Fedlex, SR 784.10, Stand 1.6.2026): «Das Bearbeiten von Daten auf fremden Geräten durch fernmeldetechnische Übertragung ist nur erlaubt: a. für die Fernmeldedienste und ihre Abrechnung; oder b. wenn die Benutzerinnen und Benutzer über die Bearbeitung und ihren Zweck informiert und darauf hingewiesen werden, dass sie die Bearbeitung ablehnen können.» Information über «Bearbeitung und ihren Zweck» liegt vor; die Änderung verlangt keine neue Einwilligung (die Schweiz kennt hier ein Widerspruchs-, kein Einwilligungsmodell). Der fehlende Ablehnungshinweis ist vorbestehend (R-2).
- Art. 19 Abs. 2 DSG (Fedlex, SR 235.1): «Er teilt der betroffenen Person bei der Beschaffung diejenigen Informationen mit, die erforderlich sind, damit sie ihre Rechte nach diesem Gesetz geltend machen kann und eine transparente Datenbearbeitung gewährleistet ist; er teilt ihr mindestens mit: a. die Identität und die Kontaktdaten des Verantwortlichen; b. den Bearbeitungszweck; c. gegebenenfalls die Empfängerinnen und Empfänger …». Zweck ist genannt; die Sprache des Browsers geht an keinen Empfänger (der Server liest `Accept-Language`, die Seite `navigator.languages`; nichts verlässt die Installation). Kein Auslandbezug (Art. 19 Abs. 4).
- Art. 6 Abs. 3 DSG: «Personendaten dürfen nur zu einem bestimmten und für die betroffene Person erkennbaren Zweck beschafft werden; …». Die Oberfläche in der Sprache des Browsers zu zeigen ist der erkennbare Zweck, für den der Browser die Kopfzeile sendet. Ob die Spracheinstellung allein überhaupt Personendaten sind (Art. 5 lit. a: «alle Angaben, die sich auf eine bestimmte oder bestimmbare natürliche Person beziehen»), ist für angemeldete Nutzer zu bejahen, ändert aber das Ergebnis nicht.

### R-1 (Minor): Zusatzsatz zu `privacy_cookies_4`
- **Beleg:** `messages/de.json:151` ««PARAGLIDE_LOCALE» speichert die Sprache der Oberfläche für 400 Tage; JavaScript kann es lesen.»; Persona-Befund P-1 (`weber-f19a-2.md` Z. 8 und 43).
- **Warum:** Der Text klingt nach einer Wahl. Ab jetzt steht im Cookie ohne jede Wahl die Sprache des Browsers. Das ist keine Rechtsverletzung, aber Art. 19 Abs. 2 DSG verlangt eine «transparente Datenbearbeitung», und der Satz verschweigt, woher der erste Wert kommt. Gleichzeitig erledigt er den offenen Persona-Befund P-1.
- **Vorschlag** (Satz 1 unverändert, Satz 2 neu; gleiche Änderung in allen vier Sprachen, weil derselbe Schlüssel):
  - de: «PARAGLIDE_LOCALE» speichert die Sprache der Oberfläche für 400 Tage; JavaScript kann es lesen. Beim ersten Besuch setzt Dwello es auf die Sprache Ihres Browsers, wenn sie Deutsch, Französisch, Italienisch oder Englisch ist, sonst auf Deutsch.
  - fr: « PARAGLIDE_LOCALE » enregistre la langue de l’interface pendant 400 jours ; JavaScript peut le lire. Lors de la première visite, Dwello y inscrit la langue de votre navigateur si c’est l’allemand, le français, l’italien ou l’anglais, sinon l’allemand.
  - it: «PARAGLIDE_LOCALE» salva la lingua dell’interfaccia per 400 giorni; JavaScript può leggerlo. Alla prima visita Dwello vi registra la lingua del Suo browser, se è tedesco, francese, italiano o inglese, altrimenti il tedesco.
  - en: «PARAGLIDE_LOCALE» stores the interface language for 400 days; JavaScript can read it. On the first visit Dwello sets it to your browser’s language if that is German, French, Italian or English, otherwise to German.
- Die Übersetzungen sind Vorschläge; Stil nach `docs/design/i18n-begriffe.md` (fr mit geschützten Leerzeichen in « », it «Suo»), vom Aufrufer gegen die bestehenden Nachbarschlüssel abzugleichen.

### R-2 (Minor, vorbestehend): Ablehnungshinweis nach Art. 45c lit. b FMG fehlt
- **Beleg:** `messages/de.json:147-151`: kein Satz, dass und wie man Cookies ablehnen kann. Art. 45c lit. b FMG (oben wörtlich) verlangt den Hinweis, «dass sie die Bearbeitung ablehnen können». Lit. a (Fernmeldedienste) trifft auf Dwello nicht zu; eine Ausnahme für «technisch notwendige» Cookies steht nicht im Gesetzestext.
- **Warum vorbestehend:** Auf dem Basis-Commit ist der Abschnitt gleich, und das Sprach-Cookie wurde schon dort ohne Wahl gesetzt. Die Änderung macht die Lücke nicht grösser; sie liefert aber die passende Folge für eine Ablehnung.
- **Vorschlag** (an `privacy_cookies_1` anhängen oder als eigener Schlüssel, alle vier Sprachen), de: «Sie können Cookies in Ihrem Browser ablehnen oder löschen. Ohne «dwello_session» können Sie sich nicht anmelden; ohne «PARAGLIDE_LOCALE» zeigt Dwello jede Seite in der Sprache Ihres Browsers.» Der zweite Halbsatz stimmt erst mit der neuen Strategie (Rückfall auf `preferredLanguage`). Nach CLAUDE.md «Done means» darf ein vorbestehender Befund offen bleiben; dann als Issue (`fachlich`) erfassen.

### R-3 (Nit, vorbestehend): Sprache der Oberfläche im KI-Aufruf
- **Beleg:** `src/lib/server/category.ts:91` sendet `language: getLocale()` an `/categories/propose` (`backend/src/routes/categories.ts:80-84`), das daraus den Prompt an den KI-Anbieter baut; `privacy_llm_external` (`messages/de.json:134`) nennt dafür nur «Name und Beschreibung der Kategorie».
- **Warum:** Neu kommt dieser Wert ohne Wahl aus dem Browser. Er sagt über die Person kaum etwas; keine Änderung für #110 nötig. Wenn `privacy_llm_external` ohnehin angefasst wird: «… werden Name und Beschreibung der Kategorie sowie die Sprache der Oberfläche übermittelt …». Nicht bestätigt, dass `buildAllocabilityPrompt` die Sprache tatsächlich in den Prompt schreibt (nur die Route-Signatur gelesen).

## Szenarien: Befunde

### V-1 (Minor): Die Sprache des ersten Besuchs bleibt
- **Beleg:** Hinweis des Aufrufers und `weber-f19a-2.md` Z. 28: Paraglides Client schreibt `PARAGLIDE_LOCALE` beim ersten Seitenaufruf mit der aufgelösten Sprache. Nach dem Entscheid gewinnt danach immer das Cookie. Szenariotitel Z. 9, 16, 21 («Ohne Wahl …») und Z. 27 («Die gewählte Sprache …») legen nahe, dass nur eine Wahl gespeichert wird.
- **Warum:** Ein Verwalter, der beim ersten Besuch einen englischen Browser hatte und später auf Französisch umstellt (oder ein geteilter Computer bei der öffentlichen Demo), bleibt 400 Tage auf Englisch, ohne je gewählt zu haben. Das deckt der Entscheid wörtlich («the cookie wins»), aber kein Szenario macht es sichtbar, und die Datenschutzerklärung sagt es heute nicht (R-1 behebt das).
- **Behebung, eine von zwei:** (a) Verhalten so annehmen und ein Szenario ergänzen, z. B. «Szenario: Die Sprache des ersten Besuchs bleibt, auch wenn der Browser später eine andere bevorzugt» (Browser Französisch, Übersicht öffnen, Browser Englisch, neu laden, Seite auf «Français»); (b) wenn der Product Owner will, dass nur eine echte Wahl das Cookie schreibt, ist das ein neuer Entscheid: Issue mit `fachlich`, `entscheiden`. Ohne Entscheid empfehle ich (a), weil es dem Wortlaut von #110 folgt.

### V-2 (Minor): Szenario Z. 26–32 kann nicht rot werden
- **Beleg:** Auf dem Basis-Commit (`vite.config.ts:32`, `strategy: ['cookie', 'baseLocale']`) ignoriert Dwello den Browser; Wahl «Italiano» und Neuladen ergeben schon heute «Italiano». Das Szenario ist also heute grün, trägt aber `@wip`. Es überschneidet sich zudem mit «Die Wahl bleibt nach Neuladen und neuer Anmeldung» (Z. 41–48), das nur den Browser nicht setzt.
- **Warum:** CLAUDE.md, Workflow 1: «watch it fail at the missing behavior». Inhaltlich ist es als Schutz gegen eine falsche Reihenfolge der Strategie (`preferredLanguage` vor `cookie`) richtig und gewollt.
- **Behebung:** `@wip` entfernen und es als Regressionsschutz kennzeichnen (es ist der einzige Test, der eine vertauschte Reihenfolge fängt), oder mit Z. 41–48 zusammenlegen (dort `Angenommen der Browser des Liegenschaftsverwalters bevorzugt Englisch` voranstellen).

### V-3 (Nit): Italienisch fehlt
- **Beleg:** `tasks/language.ts:9-13` kennt nur Englisch, Französisch, Spanisch; die Funktionalität nennt «im Tessin» (Z. 4).
- **Behebung:** Szenario Z. 8–13 als Szenariogrundriss mit Französisch und Italienisch (Titel «Se connecter - Dwello» / «Accedere - Dwello», Z. 58–59), `Italienisch: 'it-CH,it;q=0.9'` ergänzen. Optional.

### V-4 (Nit): Fehlender Satz in der Domänensprache
- **Beleg:** `UBIQUITOUS_LANGUAGE.md` Z. 227: «Die Oberfläche gibt es auf Deutsch, Französisch, Italienisch und Englisch (Deutsch ist Standard).» Nicht falsch, aber unvollständig nach dem Entscheid. (Nicht bearbeitet.)
- **Vorschlag für das Issue** (Labels `fachlich`, `entscheiden`): «Die Oberfläche gibt es auf Deutsch, Französisch, Italienisch und Englisch. Ohne gewählte Sprache zeigt Dwello die Sprache des Browsers, wenn sie eine dieser vier ist, sonst Deutsch.»

## Mietrecht
Keine Befunde. Die Sprache der Abrechnung bleibt die Sprache des Mieters, ausser sie wird ausdrücklich verlangt (`backend/src/services/statement-pdf.service.ts:257`: `language || statement.tenant?.language || 'de'`); die Sprache des Browsers fliesst dort nicht ein. OR/VMWG werden durch die Sprache der Oberfläche nicht berührt.

## Nicht bestätigt
- Dass Paraglide 2.25.4 mit `cookie, preferredLanguage, baseLocale` beim ersten Besuch die **Sprache des Browsers** (nicht `de`) ins Cookie schreibt: im Worktree gibt es kein `node_modules` (Laufzeitcode nicht lesbar); bestätigt ist nur das heutige Schreiben von `de` (Persona `weber-f19a-2.md` Z. 28). Der Vorschlag R-1 setzt dieses Verhalten voraus; vor dem Übernehmen des Satzes im umgesetzten Stand prüfen (frischer Browser mit `fr-CH`, Cookie ansehen). Schreibt Paraglide nichts, entfällt Satz 2 von R-1 und lautet: «Ohne Wahl zeigt Dwello die Sprache Ihres Browsers, wenn sie Deutsch, Französisch, Italienisch oder Englisch ist, sonst Deutsch.»
- Wie Paraglide `fr-CH` auf `fr` abbildet und q-Werte gewichtet: nicht im Code gesehen (siehe oben); die Szenarien prüfen es mit `fr-CH,fr;q=0.9` bzw. `en-GB,en;q=0.9`, dort ist auch die Grundsprache enthalten.
- Ob `buildAllocabilityPrompt` die Sprache in den Prompt übernimmt (R-3): nur Route und Aufruf gelesen.
- Fedlex: Art. 45c FMG (SR 784.10, Fassung 1.6.2026) sowie Art. 5, 6, 19, 20 DSG (SR 235.1, Fassung 7.7.2025) aus dem Fedlex-Filestore (`fedlex.data.admin.ch/filestore/...`) wörtlich zitiert. Die Einordnung «Widerspruchs-, kein Einwilligungsmodell» und «keine Ausnahme für notwendige Cookies» ist meine Auslegung des Wortlauts, nicht durch Rechtsprechung belegt: **unsicher** in der Tragweite, nicht im Wortlaut.
- Art. 8 UWG, OR-Vertragsrecht, Art. 16–17 DSG: nicht einschlägig (keine Nutzungsbedingungen geändert, keine Bekanntgabe ins Ausland durch diese Änderung).
