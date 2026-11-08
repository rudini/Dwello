# Dr. Weber – Löschen einer Wohnung (Runde 1257)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Ich habe nur geschaut, nichts gespeichert oder gelöscht. Beide Löschdialoge habe ich geöffnet, aber nicht bestätigt.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Wohnung 2.02, Dialog «Wohnung 2.02 löschen?» | Der Dialog sagt «verteilt Dwello die Nebenkosten des Gebäudes nur noch auf die übrigen Wohnungen». Dass dann die **Mieter** den Anteil der Wohnung bezahlen, den bisher ich als Vermieter trage, muss ich selbst daraus schliessen. Das ist die eigentliche Gefahr, und sie steht nicht da. |
| P-2 | Minor | Wohnung 2.02, Dialog | Kein Wort zu den Abrechnungen, die es schon gibt. Im Musterhaus Zentrum gibt es für 2025 drei Entwürfe und eine versendete (überfällige) Abrechnung (Hans Müller, NK-11111111-2025-0001). Sie rechnen 2.02 in Fläche und Einheiten mit. Der Dialog sagt nicht, ob diese Abrechnungen unverändert bleiben, und nennt sie nicht. Der Dialog «Mietvertrag löschen?» zählt die betroffenen Abrechnungen dagegen einzeln auf. |
| P-3 | Minor | Wohnung 2.02, Dialog | Der Dialog unterscheidet nur zwei Fälle: «irrtümlich erfasst» und «gibt es die Wohnung». Den dritten Fall nennt er nicht: Die Wohnung gab es, aber jetzt nicht mehr (zusammengelegt, umgebaut). Ein Vermieter wird sie dann löschen, weil sie «nicht mehr existiert». Ab dann rechnet Dwello sie auch für die Perioden nicht mehr mit, in denen es sie noch gab. |
| P-4 | Minor | Wohnung 2.01, Dialog «Wohnung kann nicht gelöscht werden» | Die Begründung stimmt in der Sache, ist aber unvollständig. Sie schickt mich zum Mietvertrag («löschen Sie ihn auf seiner Seite»). Dort lehnt Dwello das Löschen erneut ab, weil schon Abrechnungen bestehen (NK-11111111-2025-0003 Entwurf, NK-11111111-2024-0003 bezahlt). Dass eine Wohnung mit versendeten oder bezahlten Abrechnungen nie gelöscht werden kann, steht nirgends. Ausserdem nennt der Dialog weder den laufenden Mietvertrag von Pierre Dubois noch die Wohnung selbst. |

## Beobachtungen

- Ich habe die Verteilung nachgerechnet, und sie stimmt mit dem überein, was der Dialog sagt. Die Flächen im Gebäude ergeben zusammen 75.5 + 92 + 85 + 65 + 120 + 55 = 492.5 m². Pierre Dubois (2.01, 85 m²) hat im Entwurf 2025 einen Flächenanteil von 17.26 % (85 / 492.5) und einen Anteil «Pro Einheit» von 16.67 % (1 von 6). Die leere Wohnung 2.02 zählt heute also mit. Ohne 2.02 wären es 19.88 % (85 / 427.5) und 20 % (1 von 5). Bei Hauswart (CHF 3'680) wären das rund CHF 97 mehr für Pierre Dubois, nur für diese Kategorie. Ob Dwello nach dem Löschen wirklich so rechnet, konnte ich nicht prüfen (siehe «Nicht geprüft»).
- Die Aussage «Den Anteil dieser Wohnung an den Nebenkosten tragen Sie als Vermieter» ist sachlich richtig: Leerstandskosten gehen zulasten des Vermieters. Sie stimmt auch mit der Wohnungsseite überein («Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.»).
- «Endgültig gelöscht. Das lässt sich nicht rückgängig machen.» ist klar. Der Dialog sagt nicht, ob mit der Wohnung noch etwas anderes verschwindet, etwa Zählerstände oder Dokumente. Bei 2.02 war auf der Seite nichts davon zu sehen.
- Der Dialog bei 2.02 nennt im Titel die Wohnung («Wohnung 2.02 löschen?»). Der Dialog bei 2.01 sagt nur «Wohnung kann nicht gelöscht werden», ohne Nummer.
- Bei 2.01 zeigt die Seite «Löschen» an, obwohl nach dem Klick nur die Absage kommt. Das hat mich nicht gestört, weil die Absage sofort kommt und nichts passiert.
- Auf der Seite des Mietvertrags von Pierre Dubois steht der Hinweis «Abrechnung 2023 fehlt», obwohl es Abrechnungen für 2024 und 2025 gibt. Das gehört nicht zur Aufgabe, ist mir aber aufgefallen.
- Zum Zeitpunkt der Prüfung (Datensatz kann sich durch andere Personas ändern) gab es im Musterhaus Zentrum 6 Wohnungen, davon 4 vermietet und 2 leer (2.02, 3.02).

## Aufgabe geschafft: ja

Ich habe beide Dialoge geöffnet, gelesen und beurteilt. Die Aussagen sind sachlich richtig, aber an den Stellen aus der Tabelle nicht vollständig.

## Aufwand

Etwa 15 Minuten, 6 Skripte, rund 14 Schritte: Gebäudeliste, Gebäude, Wohnung 2.02, Dialog, Wohnung 2.01, Dialog, Abrechnungsliste, zwei Abrechnungen nachgerechnet, Mietvertrag von Pierre Dubois mit seinem Löschdialog.

## Ablauf

- Wohnung 2.02, Dialog. Erwartet: ein Hinweis, welche bestehenden Abrechnungen 2.02 mitrechnen und was mit ihnen geschieht. Gesehen: nur die allgemeine Aussage «auch wenn Sie eine Abrechnung neu berechnen oder berichtigen», keine Abrechnung genannt.
- Wohnung 2.01, Dialog. Erwartet: Wenn ich dem Hinweis folge und den Mietvertrag lösche, geht es weiter. Gesehen: Auf der Seite des Mietvertrags lehnt Dwello das Löschen ab, weil zwei Abrechnungen bestehen, eine davon bezahlt. Der Hinweis im Wohnungsdialog führt in eine Sackgasse.
- Klick auf «Wohnung 2.02» in der Gebäudeansicht. Erwartet: sofort die Wohnungsseite. Gesehen: Die Seite kam erst nach dem Laden. Mein erstes Skript las deshalb noch die Gebäudeseite. Das lag an meinem Skript, nicht an Dwello.

## Vorschläge

- **P-1:** Gebäude «Musterhaus Zentrum», dann Wohnung 2.02, dann «Löschen». Hilfreich wäre ein Satz, der die Folge in Worten des Vermieters sagt, zum Beispiel: «Ihre Mieter bezahlen dann den Anteil dieser Wohnung mit. Ist die Wohnung nur leer, wäre das falsch.»
- **P-2:** Gleicher Weg. Der Dialog könnte, wie der Löschdialog des Mietvertrags, die Abrechnungen nennen, die diese Wohnung mitrechnen. Dazu sollte er sagen, dass versendete Abrechnungen unverändert bleiben (sofern das stimmt) und dass Entwürfe nach «Neu berechnen» höhere Anteile für die übrigen Mieter zeigen.
- **P-3:** Gleicher Weg. Ein Satz für den Fall, dass es die Wohnung nicht mehr gibt: was der Vermieter stattdessen tun soll (z. B. sie behalten und als «Gesperrt» führen), oder ab wann sie aus der Verteilung fällt.
- **P-4:** Gebäude «Musterhaus Zentrum», dann Wohnung 2.01, dann «Löschen». Danach dem Hinweis folgen: Mietvertrag von Pierre Dubois, dann «Löschen». Hilfreich wäre, wenn der Wohnungsdialog den Grund vollständig nennt: Die Wohnung hat einen laufenden Mietvertrag (Pierre Dubois) und Abrechnungen. Ein Mietvertrag mit versendeten oder bezahlten Abrechnungen lässt sich nicht löschen, also auch die Wohnung nicht. Im Titel sollte die Wohnungsnummer stehen.

## Nicht geprüft

- Was nach dem Löschen wirklich mit der Verteilung und mit bestehenden Abrechnungen geschieht: Ich sollte nur schauen und habe den Dialog nicht bestätigt. Die Aussage «verteilt nur noch auf die übrigen Wohnungen» habe ich nur gegen die heutigen Anteile im Entwurf von Pierre Dubois nachgerechnet.
- Ob «Abrechnung berichtigen» bei der versendeten Abrechnung von Hans Müller nach dem Löschen andere Anteile ergibt: Das ginge nur mit Löschen und Speichern.
- Andere Sprachen, Tastatur und Mobilansicht gehören nicht zu meinem Profil.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/af7b8d5a-bf30-59c8-8e16-91d2a20ee4e8/scratchpad/weber-1257/` (`04a-dialog-2.02.png` zeigt den Löschdialog von 2.02 über der Wohnungsseite, `04b-dialog-2.01.png` die Absage bei 2.01, `09-contract-delete-dialog.png` die Absage beim Mietvertrag von Pierre Dubois).
