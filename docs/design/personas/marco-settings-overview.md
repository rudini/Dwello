# Persona-Bericht: Marco – Einstellungen und «Absender und Konto» auf dem Handy

Persona: Marco, 38, Smartphone 390 × 844, Touch. Aufgabe: Über das Benutzermenü «Einstellungen» öffnen und schnell nachsehen, welche IBAN und welche Zahlungsfrist meine Abrechnungen verwenden. Nur ansehen, nichts speichern. Ausgangslage (vom Aufrufer per SQL gesetzt): IBAN erfasst, Firmenname und Ort fehlen.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/48924d67-1049-5133-b716-46d184d677e3/scratchpad/marco-settings-overview/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Absender und Konto | Ich will nur die IBAN ansehen, und genau das IBAN-Feld hat einen roten Rahmen mit Fehlermeldung darunter. Auf den ersten Blick heisst das für mich «Ihre IBAN ist falsch». Erst beim Lesen merke ich, dass eigentlich Name und Ort fehlen. Die Meldung steht beim falschen Feld, die IBAN selbst ist in Ordnung. |
| P-2 | Minor | Absender und Konto | Oben sind «Firmenname» und «Ort» beim Öffnen rot umrandet, aber ohne Text daneben. Die Erklärung dazu steht erst rund zwei Bildschirme weiter unten bei der IBAN. Wer oben anfängt, sieht rote Felder ohne Grund. |
| P-3 | Minor | Absender und Konto | Beim Öffnen der Seite steht der Fokus sofort im leeren Feld «Firmenname» (auch nach dem Neuladen). Auf dem Handy kann das die Tastatur öffnen und die halbe Seite verdecken, obwohl ich nur nachschauen will. Ob die Tastatur tatsächlich aufgeht, konnte ich im Testbrowser nicht sehen (siehe «Nicht geprüft»). |

## Beobachtungen

- Das Benutzermenü ist sofort zu finden (Personen-Symbol oben rechts). Der Eintrag «Einstellungen» ist 254 × 48 px gross und gut zu treffen.
- Die Übersicht «Einstellungen» ist rund 2580 px hoch, also gut drei Bildschirme. Für meine Aufgabe muss ich aber gar nicht scrollen: Die Karte «Absender und Konto» ist die erste. Ihr Text «Absender, Konto, Fristen, …» sagt mir, dass dort auch die Frist steht.
- Die ganze Karte ist ein Link: Ein Tipp auf den Beschreibungstext oder auf die Warnung führt auch auf «Absender und Konto». Der unterstrichene Titel allein ist nur 24 px hoch, das stört deshalb nicht. Alle Karten sind gross genug zum Tippen.
- Die Meldung «Es fehlen Angaben zur Firmenadresse.» ist gut lesbar: 16 px, Warnsymbol plus dunkelrote Schrift, also nicht nur Farbe, und in Hell und Dunkel lesbar. Sie sagt aber nicht, was fehlt (Name und Ort) und was das bewirkt (keine QR-Rechnung?). Ich wüsste nicht, ob das dringend ist.
- Auf keiner der beiden Seiten scrollt etwas seitwärts (scrollWidth = 390).
- «Absender und Konto» ist sehr lang, rund 4830 px, also fast sechs Bildschirme. Die IBAN steht bei etwa 1500 px (zwei Bildschirme scrollen), die Zahlungsfrist bei etwa 2980 px (dreieinhalb Bildschirme). Die Abschnittstitel «Konto» und «Fristen» helfen beim Finden. Dazwischen stehen aber sehr lange Hilfetexte (Kontoinhaber, Verwaltungspauschale mit VMWG-Artikel), durch die ich mit dem Daumen durch muss.
- Gefunden: IBAN «CH44 3199 9123 0008 8901 2», Zahlungsfrist «30» Tage (Mahnfrist 14).
- Wo ich bin, ist klar: Die Brotkrümelnavigation «Einstellungen › Absender und Konto» steht oben, darunter der Titel. Der Link «Einstellungen» darin ist 48 px hoch und führt zurück zur Übersicht. Die Browser-Zurück-Taste geht ebenfalls.
- Die Kopfzeile bleibt beim Scrollen oben stehen. Die Brotkrümel scrollen aber weg: Ganz unten muss ich wieder nach oben, um zurückzukommen, oder ich nehme die Zurück-Taste.
- «Einstellungen speichern» ist der einzige Hauptknopf, ganz unten bei etwa 4620 px, 48 px hoch. Er klebt nicht unten am Bildschirm. Das ist in Ordnung, weil ich ihn nur zum Ändern brauche. Wer aber nur ein Feld oben ändert, muss fünf Bildschirme nach unten. Nicht gedrückt.
- Die Checkbox «Kontoinhaber ist der Absender» ist selbst 24 px gross, ihre Beschriftung aber 48 px hoch. Gut zu treffen.
- Dunkelmodus auf beiden Seiten: gut lesbar. Fehlerrahmen und Fehlertext erscheinen hellrot auf dunklem Grund, die Links hellblau, der Speichern-Knopf hellblau mit dunkler Schrift. Der Fokusrahmen im Feld «Firmenname» ist im Dunkelmodus gelb-orange und deutlich sichtbar.

## Aufgabe geschafft: ja

## Aufwand

Etwa 1–2 Minuten für einen echten Nutzer. Schritte: Benutzermenü antippen, «Einstellungen» antippen, Karte «Absender und Konto» antippen, rund zwei Bildschirme bis zur IBAN scrollen, weitere eineinhalb Bildschirme bis zur Zahlungsfrist scrollen. Dazu den Weg zurück über die Brotkrümel geprüft. Insgesamt 3 Tipps und 4–5 Wischbewegungen.

## Ablauf

- Seite «Absender und Konto» öffnen. Erwartet: ein ruhiges Formular, in dem ich die Werte ablese. Gesehen: Oben zwei rot umrandete leere Felder (Firmenname, Ort) ohne Text; der Cursor steht schon in «Firmenname».
- Zur IBAN scrollen. Erwartet: die IBAN als normaler Wert. Gesehen: Das IBAN-Feld ist rot umrandet, darunter steht in Rot «Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort.». Ich musste kurz überlegen, ob meine IBAN falsch ist.
- Meldung auf der Übersicht lesen. Erwartet: was genau fehlt. Gesehen: nur «Es fehlen Angaben zur Firmenadresse.»; welche Angaben, steht erst auf der nächsten Seite.

## Vorschläge

- **P-1**: «Einstellungen» → «Absender und Konto» öffnen, mit gespeicherter IBAN und ohne Firmenname und Ort; zu «Konto» scrollen. Das IBAN-Feld ist rot umrandet und hat die Fehlermeldung. Hilfreich: Das IBAN-Feld bleibt neutral, wenn die IBAN gültig ist. Die Meldung steht bei den fehlenden Feldern (Firmenname, Ort), oder ein neutraler Hinweis bei der IBAN sagt «Für die QR-Rechnung fehlen noch Name und Ort beim Absender».
- **P-2**: Gleiche Ausgangslage, Seite oben ansehen: «Firmenname» und «Ort» sind rot, ohne Text. Hilfreich: ein kurzer Text direkt bei diesen Feldern («Für die QR-Rechnung nötig») oder ein Hinweis oben auf der Seite, was fehlt, mit Sprung zum Feld.
- **P-3**: «Absender und Konto» öffnen und das aktive Element prüfen: Es ist `companyName`. Hilfreich: beim blossen Öffnen keinen Fokus ins Feld setzen (Fokus auf den Titel oder gar nicht), erst nach einem Speicherversuch zum ersten fehlerhaften Feld springen.

## Nicht geprüft

- Ob auf einem echten Handy durch den Fokus im Feld «Firmenname» die Bildschirmtastatur aufgeht (P-3): Headless-Chromium zeigt keine Tastatur. Geprüft habe ich nur, dass `document.activeElement` nach dem Antippen der Karte und nach dem Neuladen das Feld «Firmenname» ist.
- Speichern und das Verhalten beim Speichern: laut Aufgabe nicht gedrückt.
- Dunkelmodus nur über die Systemeinstellung des Browsers (prefers-color-scheme) geprüft. Einen Umschalter in der App habe ich im Benutzermenü nicht gefunden.
