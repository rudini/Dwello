# Dr. Weber – w6b: Mahnungen an fremdsprachige Mieter (Musterhaus Zentrum)

Persona: Dr. Weber, 52, juristisch vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus, Oberfläche Deutsch.
Gespeichert nur im Gebäude Musterhaus Zentrum: je eine Mahnung an Pierre Dubois (NK-11111111-2025-0003) und Maria Rossi (NK-11111111-2025-0004), danach den Brief an Pierre Dubois als versendet markiert. Der Brief an Maria Rossi steht noch auf «Zu versenden».

Skripte, Screenshots und PDFs: `/tmp/claude-0/-home-user-Dwello/fe3bd9b5-d5c3-55d0-aa4e-428ea53d7e2c/scratchpad/weber-w6b/` (ausserhalb des Repositorys).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnung, Dialog «Mahnung senden», Bestätigung, «Dokumente» | Vor und nach dem Erstellen steht nirgends im Mahnungsablauf, in welcher Sprache der Brief rausgeht. Der einzige Hinweis «PDF auf Französisch» steht beim Knopf «PDF erstellen» (Abrechnung), nicht bei der Mahnung; im Dialog liegt er hinter dem Overlay. Erst der Dateiname des Downloads («Rappel de paiement …») oder die Mieterseite («Sprache für Abrechnung und Mahnungen: Französisch») verraten es. |
| P-2 | Minor | Dialog «Mahnung senden» | Der Bestätigungsknopf heisst «Zahlungserinnerung senden», aber Dwello sendet nichts, es legt nur ein PDF ab. Dazu wechselt der Begriff innerhalb eines Schritts: Knopf «Mahnung senden», Knopf im Dialog «Zahlungserinnerung senden», Bestätigung «Mahnung erstellt». |
| P-3 | Minor | PDF der Zahlungserinnerung (fr) | Die Anrede «Bonjour Pierre Dubois,» ist für einen förmlichen Brief mit Zahlungsaufforderung zu salopp; üblich in der Westschweiz wäre «Monsieur,» bzw. «Madame, Monsieur,». |
| P-4 | Minor | PDF der Zahlungserinnerung (fr, it) | Kein Einzahlungsschein (QR-Zahlteil). Der Mieter muss die QR-IBAN und die 27-stellige Referenz von Hand abtippen; die Abrechnung selbst hatte einen Zahlteil. |
| P-5 | Nit | PDF der Zahlungserinnerung (fr, it) | IBAN ungegliedert: «IBAN CH4431999123000889012» (im Zahlteil der Abrechnung korrekt «CH44 3199 9123 0008 8901 2»). Fehleranfällig beim Abtippen. |
| P-6 | Nit | PDF der Zahlungserinnerung (fr, it) | Ort und Datum bleiben deutsch: «Zürich, 16.10.2026» auch im französischen und italienischen Brief (üblich: «Zurich, le 16.10.2026» / «Zurigo, 16.10.2026»). |
| P-7 | Nit | PDF der Zahlungserinnerung (it) | Höflichkeitsform uneinheitlich: «Forse il pagamento le è sfuggito» und «Se ha già effettuato …» klein, aber «La preghiamo di versare …» gross. |
| P-8 | Nit | PDF der Zahlungserinnerung (fr, it) | Das Mietobjekt (Musterhaus Zentrum, Wohnung 2.01 bzw. 3.01) steht nicht im Brief, und eine Kontaktmöglichkeit für Rückfragen fehlt (weder Telefon noch E-Mail des Vermieters). |

## Beobachtungen

- Beide Briefe sind in der richtigen Sprache: Dubois französisch («Rappel de paiement – Décompte des charges NK-11111111-2025-0003»), Rossi italienisch («Promemoria di pagamento – Conteggio spese accessorie NK-11111111-2025-0004»). Die Dateinamen sind ebenfalls übersetzt.
- Die Beträge stimmen mit der Abrechnung überein: Dubois CHF 142.40 (Saldo: Nachzahlung auf der Abrechnung), Rossi CHF 238.10 (Dialog). Die Referenz im französischen Brief («00 65288 62713 22532 90815 25421») ist dieselbe wie im Zahlteil der Abrechnung. IBAN gleich. Bei Rossi habe ich die Abrechnung nicht gegengeprüft (siehe «Nicht geprüft»).
- Die neue Frist ist der 26.10.2026: 10 Tage nach dem Briefdatum 16.10.2026. Für eine einfache Zahlungserinnerung ist das knapp, aber vertretbar.
- Rechtlich korrekt eingeordnet: Der Brief ist eine einfache Zahlungserinnerung ohne Kündigungsandrohung, ohne Verweis auf Art. 257d OR, ohne Verzugszins und ohne Gebühren. Gut: «Sauf erreur de notre part … Ce paiement vous a peut-être échappé.» / «Si vous avez déjà effectué le paiement, veuillez considérer ce courrier comme sans objet.» bzw. «Forse il pagamento le è sfuggito.» / «Se ha già effettuato il pagamento, non tenga conto della presente.» Der Ton ist freundlich und sachlich, nichts klingt nach Drohung.
- «Meilleures salutations» und «Cordiali saluti» passen zum Schweizer Gebrauch. «Gentile Maria Rossi,» ist förmlich genug.
- Nach dem Erstellen verschwindet der Knopf «Mahnung senden» von der Abrechnung. Neu stehen dort «Letzte Mahnung 16.10.2026», «Nächste Mahnung möglich ab 27.10.2026» und ein Abschnitt «Mahnungen» mit dem Brief. Das ist nachvollziehbar.
- «Als versendet markieren» läuft ohne Rückfrage. Die Bestätigung erklärt die Folgen gut: «Der Brief trägt jetzt das heutige Datum und eine neue Zahlungsfrist. Drucken Sie ihn jetzt aus und schicken Sie ihn heute per Post.» Daneben gibt es direkt einen Link «PDF herunterladen».
- In der Dokumentliste steht nach dem Markieren nur «Versendet», ohne Datum. Auf der Mieterseite steht dagegen «16.10.2026 · per Brief · Versendet».
- Der Hintergrund des Dialogs deckt im ganzseitigen Screenshot nur den sichtbaren Bereich ab (Artefakt der Aufnahme, kein Befund).

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 12 Bedienschritte: Übersicht → Frist Dubois → Mahnung senden → bestätigen; dasselbe für Rossi; Dokumente → zwei PDFs herunterladen; Abrechnungs-PDF zum Vergleich; als versendet markieren; PDF erneut herunterladen.

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis auf die überfälligen Abrechnungen. Gesehen: «Überfällige Abrechnungen prüfen – 2 Nebenkostenabrechnungen sind über der Zahlungsfrist …», unter «Fristen» «01.10.2026 Zahlungsfrist · Pierre Dubois seit 15 Tagen abgelaufen» (ebenso Maria Rossi). Gut.
2. **Abrechnung NK-…-0003 (Dubois).** Erwartet: ein Knopf für die Mahnung und ein Hinweis zur Sprache. Gesehen: die Knöpfe «PDF erstellen» (darunter «PDF auf Französisch»), «Mahnung senden» und «Als bezahlt markieren»; Status: Überfällig. Der Sprachhinweis gehört sichtbar zum Abrechnungs-PDF, nicht zur Mahnung.
3. **Dialog «Mahnung senden».** Erwartet: Betrag, neue Frist, Sprache, was genau passiert. Gesehen: «Dwello erstellt die Zahlungserinnerung als PDF und legt sie unter «Dokumente» bereit. Markieren Sie den Brief dort am Tag, an dem Sie ihn zur Post bringen, als versendet. Drucken Sie ihn danach aus und schicken Sie ihn per Post.» und «Pierre Dubois schuldet noch CHF 142.40.» Keine Sprache, keine neue Frist. Knopf «Zahlungserinnerung senden» (P-1, P-2).
4. **Bestätigung.** Gesehen: «Mahnung erstellt – Das Dokument «Zahlungserinnerung» liegt unter «Dokumente» als Brief zum Ausdrucken bereit.» Wieder keine Sprache (P-1).
5. **Maria Rossi (NK-…-0004).** Gleicher Ablauf, «PDF auf Italienisch» beim PDF-Knopf, im Dialog «Maria Rossi schuldet noch CHF 238.10.» Bestätigung identisch.
6. **Dokumente.** Erwartet: beide Briefe mit Sprache und Frist. Gesehen: «Zahlungserinnerung · NK-11111111-2025-0003 – An Pierre Dubois, erstellt am 16.10.2026, per Brief – Zahlungsfrist der Mahnung: 26.10.2026 – Zu versenden», bei Rossi dasselbe. Keine Sprache (P-1).
7. **PDFs herunterladen.** Dateinamen «Rappel de paiement NK-11111111-2025-0003.pdf» und «Promemoria di pagamento NK-11111111-2025-0004.pdf». Erst hier sehe ich die Sprache. Inhalt: siehe Befunde P-3 bis P-8 und Beobachtungen.
8. **Gegenprüfung mit dem Abrechnungs-PDF (Dubois).** Referenz und IBAN stimmen überein. Die Abrechnung hat einen Zahlteil («Section paiement»), die Mahnung nicht (P-4).
9. **Als versendet markieren (Dubois).** Erwartet: eine Rückfrage oder eine klare Bestätigung. Gesehen: keine Rückfrage, Bestätigung ««Zahlungserinnerung» an Pierre Dubois ist als versendet markiert. Der Brief trägt jetzt das heutige Datum und eine neue Zahlungsfrist. …», Status «Versendet».
10. **PDF nach dem Markieren.** Erwartet: weiterhin Französisch. Gesehen: «Rappel de paiement NK-11111111-2025-0003.pdf». Der Text ist Wort für Wort gleich wie vorher (Datum 16.10.2026, Frist 26.10.2026, weil am selben Tag erstellt und markiert). Weiterhin Französisch.

## Verwirrung

- «Mahnung» und «Zahlungserinnerung» bezeichnen dasselbe, wechseln aber innerhalb eines Schritts (P-2). Juristisch ist eine «Mahnung» die strengere Form; der Brief selbst ist eine freundliche Erinnerung. Das passt, nur sollte die Oberfläche bei einem Wort bleiben.
- «Zahlungserinnerung senden»: Ich habe kurz geglaubt, Dwello verschicke den Brief selbst.
- Die Reihenfolge «Markieren Sie den Brief … als versendet. Drucken Sie ihn danach aus» wirkt zuerst verkehrt (versendet markieren, bevor er gedruckt ist). Die Seite «Dokumente» erklärt den Grund (Datum und Frist werden dann gesetzt). Im Dialog fehlt diese Begründung.

## Fehlerrisiken

- Ein Vermieter, der kein Französisch liest, druckt einen Brief, den er nicht prüfen kann, ohne vorher gesagt zu bekommen, dass er französisch ist (P-1).
- Der Mieter tippt die QR-IBAN und die Referenz ab; ein Tippfehler in der Referenz macht die Zuordnung der Zahlung schwierig (P-4, P-5).
- Wer das Markieren als versendet vergisst, schickt einen Brief, dessen Datum und Frist nicht zum Posttag passen. Die Hinweise dazu sind aber deutlich.

## Vorschläge

- **P-1:** Abrechnung NK-…-0003 öffnen → «Mahnung senden». Im Dialog zum Beispiel «Der Brief wird auf Französisch erstellt (Sprache des Mieters).» ergänzen, ebenso in der Bestätigung und in der Dokumentliste («per Brief, Französisch»).
- **P-2:** Gleicher Weg. Den Bestätigungsknopf «Zahlungserinnerung erstellen» oder «Mahnung erstellen» nennen und ein Wort durchgehend verwenden.
- **P-3:** PDF «Rappel de paiement NK-11111111-2025-0003.pdf» öffnen. «Monsieur,» oder «Madame, Monsieur,» statt «Bonjour Pierre Dubois,», sofern keine Anrede am Mieter erfasst ist.
- **P-4:** Mahnungs-PDF öffnen. Den QR-Zahlteil mit Restbetrag und gleicher Referenz anhängen, wie bei der Abrechnung.
- **P-5:** IBAN im Brief in Vierergruppen drucken.
- **P-6:** Ort und Datum in der Briefsprache: «Zurich, le 16.10.2026» bzw. «Zurigo, 16.10.2026».
- **P-7:** Im italienischen Brief die Höflichkeitsform einheitlich schreiben (durchgehend «Le/La» gross oder durchgehend klein).
- **P-8:** Eine Zeile «Objet : Musterhaus Zentrum, appartement 2.01» und eine Kontaktzeile (Telefon/E-Mail des Vermieters) ergänzen.

## Nicht geprüft

- Ob das Markieren als versendet an einem späteren Tag Datum und Frist neu setzt: Erstellen und Markieren fielen auf denselben Tag (16.10.2026), deshalb ist das PDF unverändert.
- Den Brief an Maria Rossi habe ich nicht als versendet markiert (nicht Teil der Aufgabe). Ihre Referenz habe ich nicht mit dem Abrechnungs-PDF verglichen.
- Die Mahnung per E-Mail (beide Mieter erhalten Briefe) und andere Oberflächensprachen.
- Ein Nebeneffekt aus Schritt 8: «PDF erstellen» auf der Abrechnung Dubois hat das Abrechnungs-PDF neu erzeugt (Verlauf: «PDF erstellt 16.10.2026, 23:05»), nur in Musterhaus Zentrum.
