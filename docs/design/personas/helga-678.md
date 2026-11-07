# Persona-Lauf: Helga – Issue #678 (Hilfe «Umlagefähige Nebenkosten», KI-Prüfung einer Kategorie)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom und bei normaler Grösse (100 %), Maus.
App: Persona-Stack auf http://localhost:3300 (Demodaten, Build von w-678). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/helga-678/` (s1.mjs bis s9.mjs; Bilder 01 bis 14, z150-* und z100-*).

Gespeichert habe ich nur «Fassadenreinigung Helga» (Nicht umlagefähig) und sie am Schluss wieder gelöscht (Liste wieder «Alle (21)»). Alle anderen Versuche hat Dwello nicht gespeichert (ohne Wahl abgelehnt). Demokategorien habe ich nicht angefasst.

## Befunde

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| H-1 | Minor | Neue Kategorie | Ich lasse «Bewachung Helga» prüfen, die KI ist sich nicht sicher (gelber Kasten «Kein Vorschlag der KI … Im Zweifel: nicht umlagefähig»). Ich speichere ohne Wahl. Rot erscheint: «Wählen Sie, ob die Kosten umlagefähig sind. Sind Sie unsicher, wählen Sie «Von der KI prüfen lassen».» Genau das habe ich schon getan, und darunter steht weiter, dass die KI unsicher ist. Der Hinweis schickt mich im Kreis; ich hätte nochmals geprüft und dieselbe Antwort bekommen. Hilfreich wäre hier der Satz aus dem gelben Kasten («Im Zweifel: nicht umlagefähig»). |
| H-2 | Minor | Neue Kategorie, Hilfe «Umlagefähige Nebenkosten» | Im Absatz über Wasser, Abwasser und Kehricht bricht «z. B.» auseinander: «z.» steht am Zeilenende, «B.» am Anfang der nächsten Zeile. Gesehen bei 150 % und bei 100 %. Ich habe «B. nach dem Versicherungswert» zuerst nicht verstanden und die Zeile nochmals gelesen. |

## Frühere Befunde (Issue #678)

| ID | Jetzt | Was ich gesehen habe |
|---|---|---|
| P-4 (Hilfe lang, «Liegenschaft», KI-Knopf nicht erklärt) | **behoben** | Die Hilfe sagt «Gebäude», nicht mehr «Liegenschaft». Sie besteht aus fünf kurzen Absätzen (bei 150 % etwa 13 Zeilen): Einleitung, Heizung und Lift, Wasser/Abwasser/Kehricht, Mietvertrag, und zuletzt was «Von der KI prüfen lassen» tut. Das lässt sich lesen; die Absätze helfen. Zu den Restpunkten siehe H-2 und N-1. |
| P-5 (KI ohne Name nur «Name ist erforderlich») | **behoben** | Am Namenfeld steht rot «Geben Sie zuerst den Namen ein. Die KI prüft die Kategorie nach Name und Beschreibung.», das Feld ist rot umrandet und der Cursor steht drin; die Seite scrollt hinauf zum Feld. Sobald ich einen Namen tippe, ist der Hinweis weg. Ich wusste sofort, was zu tun ist. |
| P-6 (Ablehnung zeigt nicht auf den KI-Knopf) | **behoben**, mit H-1 | Ohne Wahl gespeichert: «Wählen Sie, ob die Kosten umlagefähig sind. Sind Sie unsicher, wählen Sie «Von der KI prüfen lassen».» direkt unter den beiden Kästchen, über dem KI-Knopf. Passt, solange ich die KI noch nicht gefragt habe. |
| P-7 (nach Umbenennen verschwindet der Vorschlag still) | **behoben** | Hatte die KI gewählt: «Name oder Beschreibung haben sich seit der Prüfung geändert. Dwello hat die Wahl der KI zurückgenommen. Wählen Sie selbst oder lassen Sie die KI nochmals prüfen.», beide Kästchen leer. Hatte ich selbst gewählt: «… Ihre Wahl bleibt. Lassen Sie die KI bei Bedarf nochmals prüfen.», meine Wahl bleibt (10). Beides verstehe ich. |
| P-8 («Dwello hat diese Wahl vorgewählt», obwohl ich umgeklickt habe) | **behoben** | KI wählt «Umlagefähig», ich klicke «Nicht umlagefähig»: Der Satz wird sofort zu «Die KI sieht es anders als Sie. Ihre Wahl bleibt: «Nicht umlagefähig». Prüfen Sie sie mit der Begründung der KI.» (09). |
| P-9 (Widerspruch zur KI nicht gesagt) | **behoben** | Selbst «Nicht umlagefähig», KI sagt «Umlagefähig»: «Die KI sieht es anders als Sie. …». Selbst «Umlagefähig», KI gleich: «Die KI sieht es wie Sie. Ihre Wahl bleibt: «Umlagefähig».» Ich muss nicht mehr hin und her schauen; meine Wahl steht im Satz. |
| P-10 («Wählen Sie selbst», obwohl schon gewählt) | **behoben** | Selbst «Umlagefähig», KI unsicher: «Die KI ist sich nicht sicher. Ihre Wahl bleibt: «Umlagefähig». Prüfen Sie sie mit den Regeln oben. Im Zweifel: nicht umlagefähig.» (z150-C). Ohne Wahl bleibt «Wählen Sie selbst …; die Regeln stehen im Hilfetext oben.» Richtig so. |

## Beobachtungen

- N-1: Die Hilfe beantwortet meine eigentliche Frage nicht ganz: Ist Fassadenreinigung «Gebrauch des Gebäudes» (wie Hauswart) oder Unterhalt (wie Reparaturen)? Ich blieb unsicher und habe mich an «Im Zweifel: nicht umlagefähig» gehalten. Der Absatz über «Grundgebühren, die sich nach dem Wert richten» ist für mich der schwerste; für meine Kategorie brauchte ich ihn nicht.
- N-2: Die KI (Stand-in) sagt zu «Fassadenreinigung» «Umlagefähig» mit «Laufende Betriebskosten aus dem Gebrauch der Mietsache (Art. 257b Abs. 1 OR).» Das ist eine feste Antwort des Stand-ins, kein Befund zur App.
- N-3: «Prüfen Sie sie mit der Begründung der KI»: Beim ersten Lesen wusste ich nicht, ob «sie» meine Wahl oder die KI meint. Aus dem Satz davor wird es klar (meine Wahl).
- N-4: Zwei leicht verschiedene Sätze für dasselbe: «Prüfen Sie sie mit den Regeln oben» und «die Regeln stehen im Hilfetext oben». Gestört hat es nicht.
- N-5: Enter im Namenfeld speichert (ohne Wahl kommt die rote Ablehnung), die KI-Prüfung startet nur mit ihrem Knopf. So hatte ich es erwartet.
- N-6: Während die KI prüft (Antwort von mir um 5 s verzögert): Knopf «Bitte warten …», sehr blass, darunter «Die KI prüft die Kategorie …» (11). Die Blässe ist ein eigenes Issue (früher P-11). «Kategorie speichern» liess sich klicken, sichtbar geschah nichts; gespeichert wurde nichts. Nach der Antwort verschwand die rote Ablehnung und die KI-Wahl war gesetzt.
- N-7: Nach dem Speichern: Meldung «Kategorie «Fassadenreinigung Helga» gespeichert», in der Liste «Fassadenreinigung Helga – Eigene – Nicht umlagefähig – 0 Rechnungen». Der Löschdialog nennt die Folgen klar.
- N-8: Bei 150 % ist «Einstellungen» nur über das Benutzermenü erreichbar (bekannt, bestand vorher).
- N-9: Auf Ganzseiten-Screenshots steht die Kopfzeile mitten im Bild (Werkzeug, nicht die App).

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 9 Skripte. «Fassadenreinigung Helga» erfassen: Name tippen, prüfen lassen, eigene Wahl anklicken, speichern = 4 Schritte; Löschen 2 Schritte. Die KI antwortete ohne Verzögerung in unter einer Sekunde.

## Ablauf

1. **Speichern ohne Wahl, nachdem die KI unsicher war** («Bewachung Helga»). Erwartet: ein Hinweis, wie ich mich ohne KI entscheide. Gesehen: «Sind Sie unsicher, wählen Sie «Von der KI prüfen lassen».», obwohl der gelbe Kasten darunter sagt, dass die KI unsicher ist (H-1, z150-D-save).
2. **Hilfe lesen.** Erwartet: durchgehend lesbare Sätze. Gesehen: «z.» / «B.» auf zwei Zeilen verteilt (H-2, z150-D-save, z100-E-viewport-top).

## Vorschläge

- **H-1:** Neue Kategorie → Name «Bewachung …» → «Von der KI prüfen lassen» (KI unsicher) → keine Wahl → «Kategorie speichern». Hilfreich: Hat die KI schon keinen Vorschlag gemacht, in der Ablehnung statt auf den KI-Knopf auf die Regel zeigen, z. B. «Wählen Sie, ob die Kosten umlagefähig sind. Sind Sie unsicher, wählen Sie «Nicht umlagefähig».» Und für den Knopf lieber «klicken Sie auf» statt «wählen Sie», weil «wählen» im selben Satz schon die Kästchen meint.
- **H-2:** Neue Kategorie bei 150 % oder 100 % öffnen, Absatz «Bei Wasser, Abwasser und Kehricht …» ansehen. Hilfreich: ein geschütztes Leerzeichen in «z. B.» (wie bei den Gesetzesartikeln).

## Nicht geprüft

- 200 % Zoom und die Handyansicht: nicht Teil dieser Aufgabe.
- Ein echter Ausfall der KI (Fehler 500 bei der Prüfung): nicht verlangt.
- Bearbeiten einer bestehenden Kategorie: nicht verlangt; Demokategorien durfte ich nicht ändern.
- Ob beim Klick auf «Kategorie speichern» während der Prüfung eine Anfrage an den Server ging: nicht mitgeschnitten; sichtbar geschah nichts, und die Liste zählte danach nur meine eine Kategorie mehr.
- Andere Sprachen: nicht verlangt.
