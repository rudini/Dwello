# Code-Review Runde 1, Slice «landing-anim» (cf343b6..898038f, marketing)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | marketing/index.html:544, 586, 972 | Ohne JS bleiben beide Knöpfe «Ablauf abspielen» und «Verteilung abspielen» sichtbar und tun nichts (sie haben weder `hidden` noch eine `js`-Klasse, und das Skript blendet sie nicht ein). Die Commit-Nachricht sagt «without JS … the button is hidden», das stimmt nicht. Belegen lässt es sich so: die Seite mit abgeschaltetem JavaScript öffnen, dann ist der Knopf da und ein Klick bewirkt nichts. Behebung: `hidden` ins Markup, und das Skript entfernt es (`b.hidden = false`). |
| C-2 | Minor | marketing/i18n/fr.json:351, it.json:351 | «Pause» (fr) und «Pausa» (it) sind Substantive. `docs/design/i18n-begriffe.md`:5 verlangt, dass Knöpfe mit einem Verb im Infinitiv beginnen («Enregistrer», «Salvare»). Die übrigen neuen Knopftexte halten sich daran («Reprendre», «Relire», «Riprendere»). Passend wären «Mettre en pause» und «Mettere in pausa». |
| C-3 | Minor | marketing/i18n/build.py:23 | Die vier neuen `SAME`-Einträge «Lift», «Wasserversorgung Zürich», «CHF 930.00» und «CHF 1'690.00» bewirken nichts. `SAME` wird nur in Zeile 81 gebraucht, um Treffer von `GERMAN` auszunehmen, und keiner der vier Texte trifft dieses Muster. Das ist toter Code (ponytail: delete). |
| C-4 | Minor | marketing/index.html:526–545 | Die Anforderung verlangt, dass der Inhalt für Screenreader als Text bleibt. Das SVG der Rechnungs-Animation ist `aria-hidden` und hat kein Textgegenstück: Die konkreten Werte (Wasserversorgung Zürich, CHF 930.00, 31.03.2025, Kaltwasser) und «Bitte prüfen» beim Datum stehen nirgends als Text. Der Fliesstext nennt nur allgemein «Was sie nicht sicher weiss, zeigt Dwello als Hinweis». Bei der Verteilung leistet das der `<p>` mit allen Beträgen. Ein Screenreader-Nutzer hört also einen Knopf, der eine für ihn unsichtbare Szene abspielt. Behebung: ein Satz wie beim Lift-Beispiel, sichtbar oder `sr-only`. |

Keine Blocker, keine Majors.

Geprüft:
- **Zustandsmaschine:** Start, Anhalten, Weiter, Nochmals. Der Neustart über `remove` + Reflow + `add` funktioniert. `animationend` wird über `data-end` gefiltert: `a-pop` kommt im Rechnungs-Figure nur bei `.a-chk` vor, das als letztes nach 3.6 s endet. `a-mark` auf `.me` endet als letztes nach 3.3 s, die letzte Kachel schon nach 2.4 s. Für die zwei Animationen auf `.me` greift die Spezifität: Die `.me`-Regel überschreibt die Kachel-Regel, und die Delays von `nth-child` treffen `.me` nicht.
- **CSS:** `backwards` ohne `forwards` lässt im Ruhezustand und nach dem Ende den Endzustand stehen. `paused` mit `!important` schlägt den Shorthand. `transform-box: fill-box` sitzt auf dem skalierten `<g>`.
- **Barrierefreiheit:** Die Knöpfe sind 48 px hoch (`.btn`) und haben einen sichtbaren Namen. Der Fokus bleibt beim Textwechsel auf dem Knopf. Bei «Bewegung reduzieren» ist der Knopf ausgeblendet. WCAG 2.2.2 ist nicht anwendbar, weil der Nutzer startet und beide Abläufe unter 5 s dauern.
- **Tokens:** Alle Variablen sind in `:root` und im Dunkelmodus definiert (`--caution`, `--caution-soft`, `--accent-soft`, `--font`).
- **build.py:** Die `js:`-Schlüssel ersetzen beide Vorkommen von `'Anhalten'`. In fr/it/en/index.html:977–988 steht kein deutscher Skript-String mehr, und kein Apostroph bricht das JS.
- **Begriffe:** Die Kategorie (Eau froide, Acqua fredda, Cold Water) entspricht backend/migrations/0002_stammdaten.sql:17. «Bitte prüfen» entspricht `invoices_upload_status_check` in allen vier `messages/*.json`, und der Rechnungssteller folgt i18n-begriffe.md:51.
- **Demodaten:** Die Werte stimmen mit backend/demo/demo-data.sql:133 überein.
- **Tests und Szenarien:** Die Marketing-Seite liegt ausserhalb der App. Kein Test und kein a11y-Screen verweist auf `marketing/`, daher fehlt kein Szenario.

## Nicht bestätigt

- **build.py, vom Aufrufer gemeldet:** Ich habe es nicht erneut ausgeführt, weil es Dateien schreibt. Ich habe nur verglichen: Die generierten Seiten haben je 72 geänderte Zeilen wie die deutsche (`git diff --stat`), und Stichproben des Skripts und der Beträge in fr/it/en passen.
- **Playwright, vom Aufrufer gemeldet:** 390 px hell und 1440 px dunkel ohne Überlauf, die Knopftexte und das Ausblenden bei `reducedMotion`.
- **Textbreite im SVG:** Ob «Wasserversorgung Zürich» (16 px, 600, ab x=108) im Rahmen bis x=318 bleibt, konnte ich ohne fontTools nicht nachmessen. Gestützt ist es nur durch die Screenshots des Aufrufers.
- **Vorlesen:** Wie ein Screenreader den Wechsel des Knopfnamens ansagt, habe ich nicht mit einem echten Screenreader geprüft.
