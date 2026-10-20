# Dr. Weber – «Abgerechnet bis» gegen eine bestehende Dwello-Abrechnung (#499)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack auf http://localhost:3300, Gebäude «Alpenblick», Mietvertrag Laura Keller (Wohnung EG). Gespeichert habe ich nur in Alpenblick.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag bearbeiten, Fehler bei «Abgerechnet bis» (nach «Abrechnung berichtigen») | Ist NK-33333333-2024-0001 schon «Ersetzt», nennt die Ablehnung sie trotzdem als bestehende Abrechnung («Für 2024 gibt es schon die Abrechnung NK-33333333-2024-0001»). Die Meldung sagt nicht, dass sie ersetzt ist und dass auch die berichtigte Abrechnung (Entwurf) 2024 deckt. Ich lese daraus, dass mein Berichtigen nichts bewirkt hat. |
| P-2 | Minor | Mietvertrag bearbeiten, Fehler bei «Abgerechnet bis» | Die Meldung nennt nur einen Weg: höchstens 31.12.2023 eintragen. Wurde 2024 tatsächlich ausserhalb von Dwello abgerechnet und ist die Dwello-Abrechnung 2024 also doppelt, sagt sie nicht, was ich tun soll. Ich weiss auch nicht, ob es dafür überhaupt einen Weg gibt. |
| P-3 | Minor | Mietvertrag, Hinweis «2 Abrechnungen fehlen» (nach «Abrechnung berichtigen») | Nach dem Berichtigen heisst es «2024 abrechnen», und der Link öffnet den allgemeinen Assistenten (Schritt 3 von 5). Er führt nicht zu «Berichtigte Abrechnung erstellen». Dass 2024 nur noch berichtigt werden muss, steht auf der Seite des Mietvertrags nirgends. |

## Beobachtungen

- Die erste Ablehnung ist gut: Sie steht direkt unter dem Feld, rot und mit Symbol. Der Fokus springt ins Feld, das Feld ist als ungültig markiert und mit der Meldung verknüpft (`aria-describedby` enthält `billedUntil-error`). Sie nennt Jahr, Abrechnungsnummer und das höchste zulässige Datum.
- Der Hilfetext bei «Abgerechnet bis» sagt nichts davon, dass das Datum keine bestehende Dwello-Abrechnung überdecken darf. Das erfahre ich erst beim Speichern.
- Nach dem erfolgreichen Speichern (31.12.2023) gibt es keine Bestätigung. Ich lande auf der Seite des Mietvertrags, dort steht «Abgerechnet bis 31.12.2023», und der Hinweis ist von «3 Abrechnungen fehlen» auf «Abrechnung 2025 fehlt» geschrumpft. Das reicht mir als Beleg, eine Meldung «Gespeichert» fehlt aber.
- «Abrechnung berichtigen» hat einen klaren Bestätigungsdialog. Er sagt: «Die bisherige bleibt unverändert erhalten», er nennt die angerechneten CHF 32.35 vom 05.05.2025, «Das lässt sich nicht rückgängig machen» und den Verjährungshinweis Art. 128 Ziff. 1 OR. Der Dialog erwähnt «Abgerechnet bis» nicht.
- Danach zeigt NK-…-0001 den Status «Ersetzt» und den Text «Diese Abrechnung ist ersetzt und gilt nicht mehr», obwohl es noch keine berichtigte Abrechnung gibt. Erst «Berichtigte Abrechnung erstellen» legt sie an. Das geschieht ohne Rückfrage und als Entwurf: NK-33333333-2024-0003, mit «Ersetzt die Abrechnung NK-33333333-2024-0001 vom 14.04.2025», «Bereits zurückerstattet … + CHF 32.35» und dem Saldo «Ausgeglichen CHF 0.00». Ich habe nachgerechnet: 2’247.66 − 2’280.00 + 32.35 = 0.01, auf 5 Rappen gerundet 0.00. Das stimmt.
- Ich habe den Entwurf -0003 gelöscht (Dialog: «… wird gelöscht. Das lässt sich nicht rückgängig machen.»). Danach bleibt -0001 «Ersetzt», und die Zahl «Bezahlt» in der Liste sinkt von 9 auf 8. Der Löschdialog sagt nicht, dass die alte Abrechnung ersetzt bleibt und 2024 damit wieder offen ist. Mit «Berichtigte Abrechnung erstellen» komme ich trotzdem jederzeit weiter. Ich habe so den neuen Entwurf -0004 angelegt (Lücke in der Nummerierung: -0003 ist gelöscht).
- Mit dem Entwurf -0003 oder -0004 lehnt Dwello 30.06.2025 weiterhin ab und nennt dabei immer -0001.
- Nebenbei: «Gültig ab» beim Akonto ist mit 01.11.2026 vorbelegt, obwohl ich das Akonto nicht ändere. Das verunsichert mich, ob ich beim Speichern ungewollt etwas ändere. (Nicht Teil dieser Aufgabe.)

## Aufgabe geschafft: ja

Den Fall habe ich in beiden Reihenfolgen durchgespielt. Dwello lehnt 30.06.2025 beide Male ab, nimmt 31.12.2023 an, und eine Sackgasse gibt es nicht.

## Aufwand

Etwa 25 Minuten und 13 Schritte: Mietvertrag öffnen, bearbeiten, 30.06.2025 speichern (abgelehnt), 31.12.2023 speichern, Abrechnung 2024 öffnen, berichtigen und bestätigen, zurück zum Mietvertrag, bearbeiten, 30.06.2025 speichern (abgelehnt), berichtigte Abrechnung erstellen, 30.06.2025 nochmals (abgelehnt), Entwurf löschen und neu erstellen.

## Ablauf

1. **Mietvertrag Laura Keller öffnen.** Erwartet: Vertragsdaten. Gesehen: der Hinweis «3 Abrechnungen fehlen» (2025, 2023, 2022) mit dem Satz «Haben Sie eine dieser Perioden ausserhalb von Dwello abgerechnet? Tragen Sie beim Bearbeiten des Mietvertrags «Abgerechnet bis» ein.» 2024 fehlt in der Liste, das passt zur bezahlten Abrechnung 2024.
2. **«Bearbeiten», bei «Abgerechnet bis» 30.06.2025 eintragen, «Änderungen speichern».** Erwartet: entweder angenommen oder ein Hinweis auf die Abrechnung 2024. Gesehen (Screenshot `06-refusal-view.png`): Das Feld ist rot umrandet, darunter steht «Für 2024 gibt es schon die Abrechnung NK-33333333-2024-0001 in Dwello. «Abgerechnet bis» kann nur Tage ohne Dwello-Abrechnung decken. Tragen Sie höchstens den Tag vor dem Beginn dieser Abrechnung ein: 31.12.2023.» Darunter die Lesehilfe «Montag, 30. Juni 2025». Mein Urteil: Warum Dwello ablehnt und welches Datum es annimmt, ist klar. Was ich tun soll, wenn ich wirklich glaube, 2024 sei ausserhalb abgerechnet worden, ist nicht klar (P-2).
3. **31.12.2023 eintragen und speichern.** Erwartet: gespeichert. Gesehen: Rückkehr auf die Seite des Mietvertrags mit «Abgerechnet bis 31.12.2023» und nur noch «Abrechnung 2025 fehlt». Eine Bestätigungsmeldung gab es nicht.
4. **Abrechnung NK-33333333-2024-0001 öffnen** (Status Bezahlt, Rückerstattung CHF 32.35, bezahlt am 05.05.2025). Unter «Weitere Aktionen» wähle ich «Abrechnung berichtigen». Erwartet: eine Rückfrage. Gesehen: der Dialog wie unter Beobachtungen beschrieben. Was danach für 2024 gilt, verstehe ich: Die alte Abrechnung bleibt erhalten, die neue rechnet die Rückerstattung an.
5. **Bestätigen.** Gesehen: Status «Ersetzt», der Kasten «Diese Abrechnung ist ersetzt» mit «Mietvertrag öffnen» und «Berichtigte Abrechnung erstellen».
6. **«Mietvertrag öffnen».** Erwartet: ein Hinweis, dass 2024 berichtigt wird. Gesehen: «2 Abrechnungen fehlen» mit «2025 abrechnen» und «2024 abrechnen». «2024 abrechnen» öffnet den Assistenten bei Schritt 3 von 5, ohne Bezug zur Berichtigung (P-3).
7. **Bearbeiten: «Abgerechnet bis» ist mit 31.12.2023 vorbelegt. Ich trage 30.06.2025 ein und speichere.** Erwartet: Jetzt, wo die Abrechnung 2024 ersetzt ist, nimmt Dwello das Datum an, oder es erklärt, warum nicht. Gesehen: wortgleich dieselbe Ablehnung wie in Schritt 2, mit NK-…-0001 (P-1). Was für 2024 gilt, weiss ich: Dwello betrachtet 2024 als in Dwello abgerechnet. Aber der Text passt nicht mehr ganz zum Status «Ersetzt».
8. **Zur Abrechnung zurück, «Berichtigte Abrechnung erstellen».** Gesehen: Ohne Rückfrage entsteht der Entwurf NK-…-0003, Saldo CHF 0.00. 30.06.2025 wird wieder mit derselben Meldung abgelehnt.
9. **Ausweg prüfen: Entwurf -0003 löschen.** Gesehen: -0001 bleibt «Ersetzt», «Berichtigte Abrechnung erstellen» ist weiter da. Ich habe den Entwurf -0004 neu erstellt. Ergebnis: Ich komme überall wieder heraus. Zurück auf «Bezahlt» geht es nicht, das hat der Dialog aber angekündigt.

## Verwirrung

- «Ersetzt»: Das Wort steht schon da, bevor es etwas Ersetzendes gibt. Ich hätte «Wird berichtigt» oder einen ähnlichen Status erwartet, solange noch keine berichtigte Abrechnung existiert.
- «Tage ohne Dwello-Abrechnung decken»: verständlich, aber etwas technisch. Ich lese es als «Zeiträume, für die es in Dwello noch keine Abrechnung gibt».
- Ich weiss nicht, ob eine *ersetzte* Abrechnung zu den «Dwello-Abrechnungen» zählt. Die Meldung nach dem Berichtigen legt nahe: ja, und zwar sie selbst, nicht der Entwurf.

## Fehlerrisiken

- Die Meldung schlägt 31.12.2023 konkret vor. Wer ihr blind folgt, erklärt 2022 und 2023 als «ausserhalb von Dwello abgerechnet», und die Hinweise «2023 abrechnen» und «2022 abrechnen» verschwinden. In meinem angenommenen Fall stimmt das. Ein Vermieter, der 2022 und 2023 nie abgerechnet hat, verliert damit aber unbemerkt die Erinnerung an zwei offene Abrechnungen. Mehr als einen Vorschlag sollte «höchstens» hier nicht bedeuten.
- Wer nach «Abrechnung berichtigen» den Entwurf löscht, hat für 2024 keine geltende Abrechnung mehr (alte «Ersetzt», keine neue). Der Löschdialog warnt nicht davor.
- «2024 abrechnen» auf der Seite des Mietvertrags kann dazu verleiten, den ganzen Assistenten für das Gebäude zu starten statt die eine berichtigte Abrechnung zu erstellen.

## Vorschläge

- **P-1:** Mietvertrag Laura Keller → Abrechnung NK-33333333-2024-0001 → «Abrechnung berichtigen» → bestätigen → Mietvertrag bearbeiten → «Abgerechnet bis» 30.06.2025 → speichern. Es erscheint dieselbe Meldung wie vor dem Berichtigen. Hilfreich wäre, den Status zu nennen, zum Beispiel: «Für 2024 gibt es in Dwello die Abrechnung NK-…-0001 (ersetzt) und ihre berichtigte Abrechnung NK-…-0004 (Entwurf). …», am besten mit Link auf die Abrechnung.
- **P-2:** Mietvertrag bearbeiten → «Abgerechnet bis» 30.06.2025 → speichern. Hilfreich wäre ein zweiter Satz, etwa: «Ist die Abrechnung 2024 in Dwello falsch, berichtigen Sie sie auf ihrer Seite.» Dazu ein Link auf NK-…-0001. Den Fall «doppelt abgerechnet» sollte die Meldung ehrlich benennen: dass Dwello ihn nicht abbildet und was dann zu tun ist.
- **P-3:** Nach dem Berichtigen den Mietvertrag öffnen. Statt «2024 abrechnen» mit dem Assistenten wäre hilfreich: «Abrechnung 2024 wird berichtigt» mit der Schaltfläche «Berichtigte Abrechnung erstellen», die zur Abrechnung -0001 führt.

## Nicht geprüft

- Die PDF der berichtigten Abrechnung habe ich nicht erstellt und nicht geprüft: nicht Teil der Aufgabe, Beträge sind Sache von `daten-pruefer`.
- Andere Sprachen als Deutsch, Mobilansicht, Dunkelmodus: nicht Teil der Aufgabe.
- Ein Datum innerhalb von 2024 (zum Beispiel 30.06.2024) habe ich nicht versucht. Ich nehme an, dass dieselbe Meldung erscheint.
- Fehlerfälle (Server-Fehler beim Speichern): Der Auftrag nannte keinen.
- Hinweis zum Ablauf: Mein erster Speicherversuch lief, bevor die Seite fertig geladen war. Das Formular wurde dabei als GET mit `?duration=unlimited&managementFee=run` in der Adresse abgeschickt, ohne Meldung und ohne zu speichern. Das ist ein Effekt meines zu schnellen Skripts, kein Befund. Ein echter Nutzer klickt kaum so schnell.

Endstand in «Alpenblick»: Mietvertrag Laura Keller «Abgerechnet bis 31.12.2023»; NK-33333333-2024-0001 «Ersetzt»; berichtigte Abrechnung NK-33333333-2024-0004 als Entwurf (Saldo CHF 0.00); Entwurf -0003 gelöscht.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/weber-499/`.
