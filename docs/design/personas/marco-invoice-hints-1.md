# Marco – Hinweise zu Rechnungen im Abrechnungsassistenten (Handy)

Persona: Marco, 38, Handy 390 × 844, Touch. App: Persona-Stack auf http://localhost:3300 mit Demodaten. Nur angeschaut, nichts erstellt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/527f7d77-0112-5cce-90a1-4063e5ce2c7e/scratchpad/marco-invoice-hints/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Blocker (für diese Prüfung) | Abrechnungen erstellen, Schritt 4 «Vorschau» | Keiner der beiden Hinweise erscheint, weder für 01.01.2024 – 31.12.2024 noch für 01.01.2025 – 30.06.2025. In «Musterhaus Zentrum» haben alle Mietverträge in beiden Perioden schon eine Abrechnung («Anzahl Abrechnungen 0»). Die Vorschau zeigt dann nur «Alle Mietverträge haben in dieser Periode schon eine Abrechnung». Die Daten für die Hinweise kommen beim Browser aber an (siehe Beobachtungen). |

## Beobachtungen

- Der Browser bekommt die Daten der Hinweise bei der Vorschau (Antwort von `POST /statements/generate?/preview`), die Seite zeigt sie aber nicht an:
  - 2024: «lateInvoices» mit 4 Rechnungen von Musterhaus Zentrum: Lift AG 10.02.2025 (CHF 1690.00), Hauswartung Meier GmbH 31.03.2025 (920.00), Wasserversorgung Zürich 31.03.2025 (930.00), ewz 31.03.2025 (198.70).
  - H1 2025: «invoicesWithoutServicePeriod» mit 9 Rechnungen (Lift AG, Hauswartung Meier GmbH, Wasserversorgung Zürich, ewz, Gartenbau Huber, ERZ …), «lateInvoices» mit Heizöl Brunner AG 22.09.2025 (6565.00) und ein Vorjahresvergleich «Heizung».
  Ich vermute: Die Hinweise sind ausgeblendet, sobald es nichts zu erstellen gibt. Für den Fall «alles schon abgerechnet» ist das vielleicht gewollt; es heisst aber, dass ich als Marco den Hinweis bei bestehenden Entwürfen nie sehe, auch wenn ich die Entwürfe gerade löschen und neu erstellen will.
- Schritt 2 zeigt bei «Seepark Residenz» 2024 «14 Rechnungen in der Abrechnungsperiode», die Vorschau in Schritt 4 «15 Rechnungen vom 31.01.2024 bis 31.12.2024». Wahrscheinlich zählt die Vorschau die Fernwärmerechnung Q4 2024 mit Rechnungsdatum 20.01.2025 über ihren Leistungszeitraum mit. Als Marco sehe ich zwei verschiedene Zahlen für dasselbe und weiss nicht, welche stimmt.
- Kein seitliches Scrollen in Schritt 2 bis 4 (scrollWidth = 390 bei beiden Perioden).
- Der Text in Schritt 3 «Heizprofil» ist auf dem Handy sehr lang (etwa 12 Zeilen vor dem Auswahlfeld). Das war aber nicht Teil der Aufgabe.
- Unten steht «Entwurf gespeichert, 19:26»: Damit ist der Stand des Assistenten gemeint, nicht eine Abrechnung. Beim ersten Lesen dachte ich kurz, ich hätte schon einen Abrechnungsentwurf erstellt.

## Aufgabe geschafft: nein

Ich bin bei Schritt 4 «Vorschau» hängen geblieben, weil kein Hinweis erscheint. Drei Versuche:
1. Nur Musterhaus Zentrum gewählt.
2. Alle Gebäude gewählt.
3. Mit «Zurück» und «Weiter» die Vorschau neu geladen.

Das gilt für beide Perioden.

## Aufwand

Etwa 15 Minuten, 13 Skripte. Bis zur Vorschau braucht man pro Periode etwa 8 Tipp-Aktionen: Daten eingeben, Weiter, Gebäude wählen, Weiter, Weiter.

## Ablauf

1. Übersicht → Menü → «Nebenkostenabrechnungen» → «Abrechnungen erstellen». Erwartet: Assistent. Gesehen: Schritt 1 von 5 mit dem Vorschlag 01.01.2025 – 31.12.2025. Ok.
2. Beginn 01.01.2024 und Ende 31.12.2024 eingetippt, «Weiter». Erwartet: Gebäude wählen. Gesehen: drei Gebäude, Musterhaus Zentrum mit «19 Rechnungen in der Abrechnungsperiode, 6 Wohnungen». Ok.
3. Musterhaus Zentrum angetippt, «Weiter». Gesehen: Schritt 3, Heizprofil «Heizung + Warmwasser», Verwaltungspauschale 3 %. Ok.
4. «Weiter» zur Vorschau. Erwartet: ein Hinweis auf Rechnungen kurz nach dem 31.12.2024 (z. B. Lift AG vom 10.02.2025), mit Links. Gesehen: Abrechnungsperiode, «Anzahl Abrechnungen 0», «CHF 0.00», «Musterhaus Zentrum 19 Rechnungen vom 12.02.2024 bis 31.12.2024», «Alle Mietverträge haben in dieser Periode schon eine Abrechnung …» und der Link «Abrechnungen von Musterhaus Zentrum ansehen». Kein Hinweis. Screenshot `08-2024-step4.png`.
5. Nochmals «Weiter» getippt. Gesehen: Fehlermeldung «Wählen Sie eine andere Abrechnungsperiode oder andere Gebäude, oder löschen Sie zuerst die Entwürfe …» (`09-2024-step5.png`). Weiterhin kein Hinweis.
6. Gleiches mit allen Gebäuden (`11-2024-all-step4.png`): Auch hier kein Hinweis, obwohl Seepark eine Rechnung vom 20.01.2025 hat.
7. Periode 01.01.2025 – 30.06.2025, Musterhaus Zentrum (`12-2025h1-step2.png`, `13-2025h1-step4.png`). Erwartet: ein Hinweis auf Rechnungen ohne Leistungszeitraum (z. B. «Serviceabonnement Lift 2025», ganz im ersten Halbjahr verbucht). Gesehen: «9 Rechnungen vom 10.02.2025 bis 30.06.2025», «Alle Mietverträge haben … schon eine Abrechnung». Kein Hinweis. Nach «Zurück» und «Weiter» ebenfalls keiner.
8. Deshalb konnte ich keine genannte Rechnung antippen und nicht zurückkehren.

## Verwirrung

- Ich weiss nicht, ob es die Hinweise gibt und ich sie nur nicht sehe. Als Nutzer hätte ich hier nie gemerkt, dass Dwello etwas zu den Rechnungen vom Februar und März 2025 weiss.
- «Entwurf gespeichert» unten im Assistenten: Ist damit eine Abrechnung gemeint oder meine Eingaben?
- In Schritt 2 und Schritt 4 stehen unterschiedliche Rechnungszahlen für dasselbe Gebäude (Seepark 14 bzw. 15).

## Fehlerrisiken

- Will ich einen Entwurf neu berechnen, prüfe ich zuerst die Vorschau, sehe keinen Hinweis und lösche dann die Entwürfe. Erst nach dem Löschen erscheint (vermutlich) der Hinweis, dass Rechnungen fehlen oder ganz in die Periode fallen. Ohne Hinweis vergesse ich die Rechnungen von Anfang 2025 leicht.
- Bei H1 2025 geht das Lift-Abonnement 2025 (CHF 1690.00) ganz in das erste Halbjahr. Ohne sichtbaren Hinweis merke ich das nicht.

## Vorschläge

- **P-1**
  - Reproduktion: Handy 390 px → «Abrechnungen erstellen» → 01.01.2024 – 31.12.2024 → Musterhaus Zentrum → Weiter → Weiter: Es erscheint kein Hinweis. Mit 01.01.2025 – 30.06.2025 dasselbe.
  - Für diese Prüfung: Vor dem nächsten Lauf die Entwürfe von Musterhaus Zentrum für 2024 bzw. 2025 per SQL in `dwello_persona` löschen (README, «Demo records in the way»), damit es etwas zu erstellen gibt.
  - Für das Produkt: Prüfen, ob die Hinweise auch bei «Anzahl Abrechnungen 0» erscheinen sollen. Wer einen Entwurf neu berechnen will, braucht sie vor dem Löschen.

## Nicht geprüft

- Lesbarkeit, Länge und Treffsicherheit der Links in beiden Hinweisen, seitliches Scrollen mit sichtbarem Hinweis, das Antippen einer genannten Rechnung und die Rückkehr in den Assistenten. Der Grund: Die Hinweise erscheinen mit den Demodaten nicht, weil Musterhaus Zentrum in beiden Perioden schon abgerechnet ist. Entwürfe zu löschen war nicht erlaubt (nur anschauen).
- Desktop habe ich nicht geprüft (nicht Marcos Gerät).
