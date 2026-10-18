# Helga – Vertragsbeginn korrigieren bei bezahlter Abrechnung (w2e)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. App: Persona-Stack auf http://localhost:3300, gespeichert nur im Gebäude «Alpenblick».
Aufgabe: Vertragsbeginn von Laura Keller (Wohnung EG) von 01.11.2022 auf 01.03.2024 korrigieren und die bezahlte Nebenkostenabrechnung 2024 in Ordnung bringen.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/75e5ca16-73bb-53c3-8081-5e81a17d9c45/scratchpad/helga-w2e/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Ersetzte Abrechnung NK-…-2024-0001 | Die Seite sagt «Stimmen Vertragsdaten oder Rechnungen nicht, korrigieren Sie sie jetzt», führt aber nicht zum Mietvertrag. Es gibt nur Links zu Mieter und Wohnung. Ich musste über «Wohnung EG» zum Mietvertrag. |
| P-2 | Minor | Mietvertrag von Laura Keller, nach dem Speichern | Nach dem Speichern zeigt der Mietvertrag «2 Abrechnungen fehlen» mit «2024 abrechnen». Dieser Link führt in den Assistenten für das ganze Gebäude. Die ersetzte Abrechnung bietet dagegen «Berichtigte Abrechnung erstellen». Zwei Wege, und nirgends steht, welcher für mich gilt. |
| P-3 | Minor | Dialog «Abrechnung berichtigen» | «Die Abrechnung … wird ersetzt. Sie bleibt unverändert erhalten.» Für mich widerspricht sich das: Wird sie nun ersetzt oder bleibt sie? Ich habe trotzdem bestätigt, weil es die Meldung beim Mietvertrag so verlangt hatte. |
| P-4 | Nit | Ersetzte Abrechnung NK-…-2024-0001 | Dort steht weiterhin «Sie erstatten dem Mieter CHF 32.35 zurück.», obwohl das am 05.05.2025 schon geschehen ist. Unter «Weitere Aktionen» steht nach dem Ersetzen nur noch die Überschrift, ohne Inhalt. |
| P-5 | Nit | Berichtigte Abrechnung NK-…-2024-0003 und PDF | «Bereits zurückerstattet auf NK-…-0001 + CHF 32.35» bei einer Rückerstattung: Mit dem Plus dachte ich zuerst, Laura bekommt mehr. Erst beim Nachrechnen (1’900.00 − 1’645.25 − 32.35 = 222.40) sah ich, dass meine Rückzahlung kleiner wird. |

## Beobachtungen

- Die Ablehnung beim ersten Speichern ist gut. Die Seite scrollt zur roten Meldung und setzt den Fokus darauf. Die Meldung nennt die Abrechnung mit Nummer und Status «bezahlt», sagt, was zu tun ist («Abrechnung berichtigen»), und hat einen direkten Link zur Abrechnung. Da wusste ich, was als Nächstes kommt.
- Beim Eintippen des neuen Datums gab es noch keinen Hinweis. Die Meldung kam erst beim Speichern. Das hat mich nicht gestört, weil der Text gut war.
- Der Bestätigungsdialog nennt die Folge: Die CHF 32.35 werden angerechnet, und «Das lässt sich nicht rückgängig machen». Der Satz zur Verjährung (Art. 128 OR) hat mich eher verunsichert, als dass er mir half.
- «Berichtigte Abrechnung erstellen» hat den Entwurf sofort erstellt, ohne Zwischenschritt. Danach zeigte die neue Abrechnung den Link «Ersetzt die Abrechnung NK-33333333-2024-0001 vom 14.04.2025». Die alte zeigt «Ersetzt durch NK-33333333-2024-0003». Das ist gut nachvollziehbar.
- Die neue Nummer ist 0003, nicht 0002. Warum, weiss ich nicht. Das hat mich kurz irritiert.
- Die berichtigte Abrechnung rechnet 306 von 366 Mietstagen. Heizung und Kaminfeger laufen über «68.00 % nach Heizprofil». Das PDF erklärt das auf Seite 2 mit den Monatsanteilen (März bis Dezember zusammen 68 %), und auf Seite 1 steht «Diese Abrechnung ersetzt die Abrechnung NK-33333333-2024-0001 vom 14.04.2025. Diese gilt nicht mehr.» Das finde ich für Laura verständlich.
- Nach der berichtigten Abrechnung zeigte der Mietvertrag nur noch «Abrechnung 2025 fehlt». Der Hinweis zu 2024 war weg, wie erwartet.
- Die Liste der Abrechnungen des Mietvertrags zeigt beide Abrechnungen: 0003 «Versendet» (Rückerstattung CHF 222.40) und 0001 «Ersetzt». Das ist klar.
- Der Bildschirmausschnitt beim Bearbeiten ist sehr lang: Vier Absätze zu Mieterwechsel, Tod und Scheidung stehen vor dem Datum. Das musste ich alles überspringen.

## Aufgabe geschafft: ja

Vertragsbeginn steht auf 01.03.2024. Die bezahlte NK-33333333-2024-0001 ist «Ersetzt». Die berichtigte NK-33333333-2024-0003 (306 Mietstage, Rückerstattung CHF 222.40, Anrechnung der CHF 32.35) hat ein PDF und ist als versendet markiert.

## Aufwand

Etwa 7 Minuten, 9 Schritte: Übersicht → Alpenblick → Wohnung EG → Mietvertrag → Bearbeiten/Speichern (abgelehnt) → Abrechnung öffnen → Berichtigen bestätigen → zurück zum Mietvertrag, Speichern → Berichtigte Abrechnung erstellen → PDF erstellen → Als versendet markieren. Einmal bin ich wegen P-2 unsicher gewesen und habe den Assistenten angeschaut, ohne zu speichern.

## Ablauf

1. **Übersicht.** Erwartet: einen Weg zu den Mietverträgen. Gesehen: «Gebäude auf einen Blick» mit Alpenblick. Ich bin über das Gebäude gegangen.
2. **Alpenblick → Wohnung EG.** Erwartet: Laura Keller. Gesehen: «Aktueller Mieter Laura Keller, Mietvertrag seit 01.11.2022» und den Link «Mietvertrag von Laura Keller».
3. **Mietvertrag.** Gesehen: «3 Abrechnungen fehlen» (2025, 2023, 2022), Vertragsbeginn 01.11.2022, Link «Nebenkostenabrechnungen». Dort fand ich NK-33333333-2024-0001, Bezahlt, 366 Mietstage, Rückerstattung CHF 32.35.
4. **Bearbeiten, Datum 01.03.2024, Speichern.** Erwartet: entweder gespeichert oder eine Warnung wegen der bezahlten Abrechnung. Gesehen: rote Meldung «Der Mietvertrag wurde nicht gespeichert. Die Nebenkostenabrechnung NK-33333333-2024-0001 (bezahlt) wurde mit den bisherigen Vertragsdaten berechnet … berichtigen Sie zuerst jede dieser Abrechnungen …» mit Link zur Abrechnung. Die Seite scrollte zur Meldung (Screenshot 10: Meldung mitten im sichtbaren Bereich). Ich verstand, was zu tun ist.
5. **Abrechnung öffnen, «Abrechnung berichtigen».** Erwartet: eine Erklärung, was passiert. Gesehen: Dialog mit «wird ersetzt. Sie bleibt unverändert erhalten», Anrechnung der CHF 32.35, Hinweis zur Verjährung, «Das lässt sich nicht rückgängig machen.» Ich war unsicher (P-3) und habe «Abrechnung ersetzen» gewählt.
6. **Nach dem Ersetzen.** Erwartet: einen Knopf zurück zum Mietvertrag. Gesehen: «Status: Ersetzt», «Stimmen Vertragsdaten oder Rechnungen nicht, korrigieren Sie sie jetzt. Erstellen Sie danach die berichtigte Abrechnung.» und den Knopf «Berichtigte Abrechnung erstellen», aber keinen Link zum Mietvertrag (P-1). Ich ging über «Wohnung EG» zum Mietvertrag.
7. **Mietvertrag erneut speichern.** Erwartet: gespeichert. Gesehen: Mietvertragsseite mit Vertragsbeginn 01.03.2024, jetzt «2 Abrechnungen fehlen: 2025 abrechnen, 2024 abrechnen» (P-2). Ich habe «2024 abrechnen» angeschaut: Er öffnet den Assistenten «Abrechnungen erstellen» für ganz Alpenblick, Schritt 3 von 5. Das wollte ich nicht. Ich habe dort nichts gespeichert.
8. **Zurück zur ersetzten Abrechnung, «Berichtigte Abrechnung erstellen».** Erwartet: einen neuen Entwurf. Gesehen: NK-33333333-2024-0003, Entwurf, 01.03.2024 – 31.12.2024, 306 Mietstage, Nebenkosten CHF 1’645.25, Akonto CHF 1’900.00, «Bereits zurückerstattet … + CHF 32.35», Saldo Rückerstattung CHF 222.40. Danach stand beim Mietvertrag nur noch 2025 als fehlend.
9. **PDF erstellen.** Gesehen: Meldung «PDF erstellt». Das PDF nennt die ersetzte Abrechnung und «Diese gilt nicht mehr».
10. **Als versendet markieren.** Gesehen: Dialog mit Empfänger, Kanal E-Mail und PDF-Link. Nach dem Bestätigen: «Status: Versendet» und die Meldung «Abrechnung als versendet markiert».

## Verwirrung

- «wird ersetzt» und «bleibt unverändert erhalten» im selben Dialog (P-3).
- «Ersetzt» als Status, obwohl es noch gar keine neue Abrechnung gab: Durch was denn? Erst nach Schritt 8 stand «Ersetzt durch NK-…-0003».
- Zwei Knöpfe für dieselbe Sache: «2024 abrechnen» beim Mietvertrag und «Berichtigte Abrechnung erstellen» bei der Abrechnung (P-2).
- «Heizprofil» und «68.00 % nach Heizprofil»: Das habe ich erst mit dem PDF verstanden.
- «+ CHF 32.35» bei einer Rückerstattung (P-5).
- Der Hinweis zur Verjährung: Muss ich jetzt etwas beachten oder nicht?

## Fehlerrisiken

- Wer nach dem Speichern dem Mietvertrag folgt («2024 abrechnen»), landet im Assistenten für das ganze Gebäude und erstellt vielleicht Entwürfe für alle Mieter von Alpenblick (P-2).
- Wer die ersetzte Abrechnung verlässt, ohne den Mietvertrag zu korrigieren, und dann «Berichtigte Abrechnung erstellen» drückt, bekommt eine Abrechnung mit den alten Daten (nicht geprüft, siehe unten). Der Hinweis «korrigieren Sie sie jetzt» ohne Link macht das wahrscheinlicher (P-1).
- Die ersetzte Abrechnung sagt weiterhin «Sie erstatten dem Mieter CHF 32.35 zurück» (P-4). Ich könnte das zweimal überweisen.

## Vorschläge

- **P-1:** Mietvertrag bearbeiten → Datum 01.03.2024 → Speichern (abgelehnt) → Abrechnung öffnen → «Abrechnung berichtigen» → «Abrechnung ersetzen». Auf der ersetzten Abrechnung fehlt ein Link zum Mietvertrag. Hilfreich: Ein Link «Mietvertrag von Laura Keller bearbeiten» direkt beim Satz «korrigieren Sie sie jetzt».
- **P-2:** Nach P-1 den Mietvertrag erneut speichern. Die Seite zeigt «2024 abrechnen». Hilfreich: Für eine Periode mit ersetzter Abrechnung «Berichtigte Abrechnung erstellen» anbieten (oder auf die ersetzte Abrechnung verlinken) statt des Gebäude-Assistenten. Oder wenigstens ein Satz, welcher Weg gilt.
- **P-3:** Dialog «Abrechnung berichtigen» öffnen. Hilfreich wäre etwa: «Die Abrechnung NK-… gilt danach nicht mehr. Sie bleibt zur Ansicht erhalten.»
- **P-4:** Ersetzte Abrechnung ansehen. Hilfreich: im Zahlungsblock «Sie haben dem Mieter am 05.05.2025 CHF 32.35 zurückerstattet.» Die leere Überschrift «Weitere Aktionen» ausblenden.
- **P-5:** Berichtigte Abrechnung ansehen. Hilfreich: Eine Zeile wie «Bereits zurückerstattet: CHF 32.35 (wird von der Rückerstattung abgezogen)» statt nur des Vorzeichens.

## Nicht geprüft

- Was der Assistent «2024 abrechnen» nach der Korrektur erstellt hätte (ob er Laura doppelt abrechnet). Ich habe ihn nur bis Schritt 3 angesehen und nichts gespeichert, damit Alpenblick sauber bleibt.
- Was «Berichtigte Abrechnung erstellen» tut, wenn der Mietvertrag noch nicht korrigiert ist. Ich habe die richtige Reihenfolge gewählt und konnte es danach nicht mehr probieren.
- Ob nach dem erfolgreichen Speichern des Mietvertrags eine Erfolgsmeldung erschien. Mein Skript hat den Statusbereich nach dem Wechsel auf die Vertragsseite nicht ausgegeben.
- 200 % Zoom, Fehlerfälle (fehlgeschlagene Anfragen): nicht in der Aufgabe.
- «Als bezahlt markieren» der Rückerstattung CHF 222.40: Laura hat das Geld noch nicht erhalten.
