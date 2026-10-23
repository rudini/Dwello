# Code-Review: Landingpage «wärmer, nicht grösser», Runde 2 (Abschluss, 29cc002)

Range `git diff eaa6240 29cc002 -- marketing` (a2ef734, 2b5a76d, 29cc002), Worktree `review-landing-warm-close`. Vorheriger Bericht: `docs/reviews/landing-warm-review-1.md`.

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 | erledigt | Die Alt-Texte für fr, it und en nennen jetzt die Person, die das Bild zeigt: Pierre Dubois 2.01, Maria Rossi 3.01 und Nina Brunner, Seepark Residenz A2 (`i18n/fr.json:232`, `it.json:232`, `en.json:229`). Die Bilder habe ich geöffnet. Die Kategorie im Alt-Text: siehe C-13. |
| C-2 | erledigt | Die neuen Bilder `shots/{,fr/,it/,en/}statement-{light,dark}.webp` messen 2080 × 1104 (Kopf der WebP-Dateien gelesen) und zeigen die Zeile mit Mieter, Gebäude und Wohnung und beide Knöpfe ganz. `width` und `height` in `index.html:510–511` stimmen mit den Bildern überein. |
| C-3 | erledigt | `journey` (`index.html:420`) und `.anim-doc` (`:190`) haben jetzt `var(--ink-muted)`. In keiner Zeichnung steht noch `line-strong`. |
| C-4 | erledigt | Das Badge zeigt `#i-alert` (`:488`). fr, it und en werden aus derselben Quelle gebaut. |
| C-5 | erledigt | it «Trascini …», «Verifichi i dati e confermi.»: Das ist der Imperativ in der Lei-Form. |
| C-6 | erledigt | Die Zusammenfassung lautet jetzt «PC, Homeserver oder Cloud, und die Befehle». Der Hinweis «Anmeldung mit Passwort» steht ausserhalb von `details` (`:557`). Der Einleitungstext sagt, dass der PC dafür an sein muss. |
| C-7 | erledigt | «Die Bildschirmfotos und Beispiele …» steht in allen vier Sprachen. |
| C-8 | erledigt | «Das ganze Jahr» / «Nach Periodenende» und «etwa Juli bis Juni oder das Kalenderjahr». Die Begriffe in fr/it/en folgen `i18n-begriffe.md:81` (période de décompte, periodo di conteggio, billing period). |
| C-9 | erledigt | In `implementation_plan.md` sind die Punkte 1–8 abgehakt. Offen sind nur noch Reviews und Archiv. |

## Neue Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-10 | Major | `marketing/index.html:135`, `:144`, `:405` | Der neue Link um den Brief hat keinen sichtbaren Fokus. `.paper` hat `overflow: hidden`, und der Link füllt den Rahmen genau aus. Der Fokusring (`:focus-visible`, 3 px mit `outline-offset: 2px`, `:88`) liegt deshalb ganz ausserhalb und wird abgeschnitten (WCAG 2.4.7). |
| C-11 | Minor | `marketing/index.html:143` | Unter 980 px setzt `order` den Brief vor die Knöpfe, im DOM folgt er aber nach ihnen. Die Tab-Taste springt deshalb von «So kommen Sie zu Dwello» wieder hinauf zum Brief und danach hinunter zum nächsten Abschnitt. Das betrifft auch einen Desktop mit 200 % Zoom, also Helgas Fall (WCAG 2.4.3 / C27). Auch der Screenreader liest nach «einen Brief wie diesen» zuerst die Knöpfe und den Hinweis vor. Behebung: `.pdfs` im DOM direkt nach `.lede` setzen und auf dem Desktop mit Grid-Platzierung in Spalte 2 stellen. Dann braucht es kein `order` mehr. |
| C-12 | Minor | `marketing/index.html:405`; `i18n/{fr,it}.json:261`, `en.json:258` | `aria-label="Abrechnung vergrössert anzeigen"` ersetzt den Namen, den der Link sonst aus dem Alt-Text bekäme. Screenreader nennen deshalb nur noch die Aktion. Die Beschreibung des Briefs («Hans Müller: Nachzahlung CHF 215.80, Kostenübersicht nach Kategorien») hört man nicht mehr, und genau auf diesen Brief zeigt der Satz davor. Behebung: Aktion und Inhalt in den Namen nehmen, zum Beispiel ohne `aria-label` und mit dem Alt-Text «…; vergrössert anzeigen». |
| C-13 | Minor | `marketing/index.html:510`; `i18n/fr.json:232`, `it.json:232`, `en.json:229` | Der Alt-Text nennt eine zweite Kategorie, die das neue Bild nicht zeigt. Der Ausschnitt endet nach der ersten Zeile der Kostenaufstellung: de/fr/it zeigen nur Lift / Ascenseur / Ascensore, en nur TV/Cable. Allgemeinstrom, «électricité des parties communes», «elettricità delle parti comuni» und «caretaker» sind nicht zu sehen. Mit dem neuen Ausschnitt (29cc002) stimmt der Text nicht mehr. Behebung: nur die gezeigte Kategorie nennen. |

## C-10 (Major): Der Fokus auf dem Brief-Link ist unsichtbar

**Warum falsch:** Der Link `<a href="shots/pdf-page-1.webp">` (`:405`) ist neu in 2b5a76d und bekommt den Fokus. Er hat `display: block` (`:144`) und enthält nur das Bild mit `display: block; width: 100%` (`:136`). Er ist deshalb genau so gross wie die Innenfläche von `.paper` (ohne Padding, `:135`). `.paper` hat `overflow: hidden` und schneidet alles ab, was über die Innenfläche hinausragt, auch die Outline der Kinder. Die einzige Fokusmarkierung der Seite ist `:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }` (`:88`). Sie liegt 2–5 px ausserhalb des Links und wird darum vollständig abgeschnitten. Wer mit der Tastatur arbeitet, sieht nicht, wo der Fokus steht (WCAG 2.4.7, AA). Axe prüft das nicht. Betroffen sind alle vier Sprachen, hell und dunkel, auf allen Breiten.

**So zeigt man ihn:** Die Seite öffnen und mit Tab über «Demo ansehen» und «So kommen Sie zu Dwello» hinaus weitergehen. Der nächste Tab-Stopp ist der Brief, und um ihn erscheint kein Ring. In den DevTools zeigt `getComputedStyle(document.querySelector('.hero .paper')).overflow`, dass er `hidden` ist. Das Outline-Rechteck des Links liegt ganz ausserhalb der Clip-Box von `.paper`.

**Behebung (kurz):** `.hero .paper a:focus-visible { outline-offset: -3px; }`. Dann liegt der Ring innerhalb der Fläche. Man kann auch `overflow: hidden` von `.paper` auf das Bild verschieben.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: axe-core (de/fr/it/en, hell und dunkel, 1440/768/390, 0 Verstösse, kein seitliches Scrollen); Ablauf der Animationen (einmal abspielen, Anhalten/Weiter, «Nochmals abspielen», ausgeblendet bei reduzierter Bewegung); das Aufklappfeld öffnet sich; Position des Briefs bei 390 px (575 px); Höhen 10 808 / 16 462 px; Erstladung etwa 360 KB; HTML 71 437 Bytes; die französische Kopfzeile bricht bei 1440 px um (gibt es auch auf origin/main).
- Selbst wiederholt: `build.py` lief im Speicher, `write_text` war abgefangen. Es gibt keinen unbenutzten Schlüssel und kein «German left?». Die gebauten Seiten für fr/it/en sind byte-gleich mit den committeten. Die Links auf den vergrösserten Brief führen je Sprache auf `../shots/{lang}/pdf-page-1.webp`, und die Dateien sind vorhanden.
- C-10 und C-11 habe ich nicht im Browser gesehen. Ich habe sie aus dem CSS abgeleitet (Clip durch `overflow: hidden` bzw. die Folge von DOM und `order`), denn ich habe keinen Browser gestartet.
- `a-step` mit `both`: Ich habe das nur im CSS und JS gelesen, nicht gesehen. Vor dem ersten Abspielen sind die Schritte unmarkiert, denn ohne `.run` gibt es keine Animation. Der Keyframe hat nur `to`, deshalb sind die Schritte auch während ihrer Verzögerung unmarkiert. Danach bleiben sie markiert (`forwards`), solange `.run` und `.done` gesetzt sind. Beim erneuten Abspielen setzt `classList.remove('run', …)` mit Reflow alles zurück. `.anim.paused *` hält auch die Schritte an. Das Ende erkennt die Seite weiter an `a-pop` (das Badge endet bei 5.1 s, nach dem dritten Schritt bei 5.0 s).
- `display: contents` auf `.hero-copy`: Das ist ein `div` ohne Rolle, im Accessibility-Baum geht also nichts verloren, und Landmarks sind nicht betroffen (`<section class="hero">` bleibt). Die Reihenfolge beim Fokus und beim Vorlesen: siehe C-11.
- Geprüft: Die Bilder (de NK-11111111-2025-0001 Hans Müller 1.01, fr -0003 Pierre Dubois 2.01, it -0004 Maria Rossi 3.01, en NK-22222222-2025-0003 Nina Brunner A2, in hell und dunkel gleich); `.badge.plan` ist dasselbe wie `.b-plan` in `brand.html:121`; «Lift» heisst in en «Elevator», wie es V-4 aus der Fachprüfung verlangt; die Begriffe in fr (vous) und it (Lei) der neuen Schlüssel folgen `i18n-begriffe.md` (période/periodo di conteggio, serveur domestique/server domestico, sauvegardes/backup); die entfernten Schlüssel sind aus allen drei Tabellen gelöscht; `implementation_plan.md` ist gehakt. Ponytail: nichts zu kürzen, die Diff ist schon schlank.
