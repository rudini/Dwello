# Persona-Lauf: Helga – Issue #176, Runde 2 (Kategorie erfassen, KI-Prüfung)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus.
App: Persona-Stack auf http://localhost:3300 (frische Demodaten). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/fbb18b34-b688-5fdb-9b9f-9f01da7bd45c/scratchpad/helga-176-2/` (s1.mjs bis s3.mjs, 01 bis 08).

Gespeichert habe ich: «Dachsanierung Helga 2» (Nicht umlagefähig). Die anderen Versuche («… Test») habe ich nicht gespeichert.

## Befunde aus Runde 1

| ID | Runde 1 | Jetzt | Was ich gesehen habe |
|---|---|---|---|
| P-1 | Major | **behoben** | «Treppenhausreinigung Helga 2» prüfen lassen: «Umlagefähig» war gewählt, blauer Kasten mit Vorschlag (02). Name auf «Dachsanierung Helga 2» geändert: Der Kasten ist sofort weg, und keines der beiden Kästchen ist mehr gewählt (03). Nochmals prüfen lassen: «Vorschlag der KI: Nicht umlagefähig», «Nicht umlagefähig» gewählt (04). Gespeichert, in der Liste «Dachsanierung Helga 2 – Nicht umlagefähig», 0 Rechnungen (05). |
| P-2 | Minor | **behoben** (mit neuem Befund P-8) | Im Kasten steht jetzt: «Dwello hat diese Wahl vorgewählt. Sie entscheiden: Prüfen Sie die Begründung und ändern Sie die Wahl, wenn sie nicht passt.» Das verstehe ich: Die KI hat angeklickt, ich entscheide. Habe ich vor der Prüfung selbst gewählt, bleibt meine Wahl, und es steht «Ihre Wahl bleibt. Vergleichen Sie sie mit der Begründung der KI.» (06). |
| P-3 bis P-6 | Minor/Nit | nicht Teil dieser Runde | Der Text ohne Vorschlag ist unverändert («Die KI ist nicht erreichbar oder ist sich nicht sicher. …»). |

## Neue Befunde (nur zu den geänderten Stellen)

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-7 | Nit | Neue Kategorie | Nach dem Umbenennen verschwindet der Vorschlag still. Kein Satz sagt, warum er weg ist, und dass ich nochmals prüfen lassen kann. Ich habe es gemerkt, weil der blaue Kasten fehlte, aber jemand, der nicht hinschaut, merkt nur, dass nichts mehr gewählt ist. Gefährlich ist es nicht: Ohne Wahl hält Dwello mich beim Speichern auf. |
| P-8 | Minor | Neue Kategorie | Die KI wählt «Umlagefähig», ich klicke danach selbst «Nicht umlagefähig». Im Kasten steht weiter «Dwello hat diese Wahl vorgewählt. Sie entscheiden: … ändern Sie die Wahl, wenn sie nicht passt.» Angewählt ist jetzt aber meine Wahl, nicht die von Dwello. «Diese Wahl» passt nicht mehr, ich habe mich gefragt, ob mein Klick überhaupt zählt. |
| P-9 | Minor | Neue Kategorie | Ich wähle zuerst selbst «Nicht umlagefähig», die KI schlägt dann «Umlagefähig» vor. Im Kasten steht nur «Ihre Wahl bleibt. Vergleichen Sie sie mit der Begründung der KI.» Dass die KI **anderer Meinung** ist als ich, sagt Dwello nicht; ich muss «Vorschlag der KI: Umlagefähig» selbst mit dem Kästchen weiter oben vergleichen. Derselbe Satz kommt, wenn die KI gleicher Meinung ist. Bei 150 % liegen Kästchen und Kasten so weit auseinander, dass ich hin und her schauen musste. |
| P-10 | Nit | Neue Kategorie | Ich wähle selbst «Umlagefähig» und lasse «Bewachung Test» prüfen (KI unsicher). Der gelbe Kasten sagt «Wählen Sie selbst, ob die Kosten umlagefähig sind.», obwohl ich schon gewählt habe. Meine Wahl bleibt zwar (gesehen), aber der Satz «Ihre Wahl bleibt» fehlt hier, anders als beim Vorschlag. |
| P-11 | Nit | Neue Kategorie | Während der Prüfung (Antwort absichtlich um 8 s verzögert): Knopf heisst «Bitte warten …» und ist ausgegraut, darunter in grauer Schrift «Die KI prüft die Kategorie …» (08). Der Text ist klar und steht dort, wo nachher der Vorschlag kommt. Gut. Der ausgegraute Knopf ist aber sehr blass, «Bitte warten …» konnte ich bei 150 % nur mit Mühe lesen. |

## Beobachtungen

- Während die KI prüft, bleibt «Kategorie speichern» anklickbar. Was dann passiert, habe ich nicht ausprobiert (ich hätte eine weitere Kategorie gespeichert).
- Ändere ich nach eigener Wahl den Namen, bleibt meine eigene Wahl stehen, nur der Vorschlag verschwindet. Habe ich die KI-Wahl selbst umgeklickt und benenne dann um, bleibt meine Wahl auch. Das finde ich richtig.
- In der Kategorienliste steht jetzt «Alle (22)», «Umlagefähig (12)», «Nicht umlagefähig (10)». Kategorien anderer (z. B. von Sven) habe ich nicht angefasst.
- Der lange Hilfetext mit «Liegenschaft» und Gesetzesartikeln ist unverändert (siehe P-4 aus Runde 1).
- Auf den Ganzseiten-Screenshots steht die Kopfzeile mitten im Bild (Werkzeug, nicht die App).

## Aufgabe geschafft: ja

## Aufwand

Etwa 6 Minuten, 3 Durchläufe. «Dachsanierung Helga 2» erfassen: Name tippen, prüfen, Name ändern, nochmals prüfen, speichern = 5 Schritte. Die KI antwortete ohne künstliche Verzögerung in unter einer Sekunde.

## Ablauf

1. **Kategorie erfassen öffnen** (direkt über `/config/categories/new`, den Weg über das Benutzermenü kannte ich aus Runde 1). Erwartet: leeres Formular. Gesehen: wie in Runde 1, keine Wahl getroffen (01).
2. **«Treppenhausreinigung Helga 2» → «Von der KI prüfen lassen».** Erwartet: Vorschlag und ein Satz, dass ich entscheide. Gesehen: «Vorschlag der KI: Umlagefähig», Begründung, dazu «Dwello hat diese Wahl vorgewählt. Sie entscheiden: …»; «Umlagefähig» gewählt (02). Jetzt weiss ich, dass schon angeklickt ist.
3. **Name auf «Dachsanierung Helga 2» geändert.** Erwartet: Vorschlag weg oder als veraltet markiert, Wahl zurückgenommen. Gesehen: Kasten weg, keine Wahl mehr (03). Ein erklärender Satz fehlt (P-7).
4. **Nochmals prüfen.** Gesehen: «Vorschlag der KI: Nicht umlagefähig», «Nicht umlagefähig» gewählt (04).
5. **Speichern.** Gesehen: zurück in der Liste, «Dachsanierung Helga 2 – Nicht umlagefähig» zuoberst (05).
6. **Selbst «Nicht umlagefähig» gewählt, dann «Treppenhausreinigung Test» prüfen lassen.** Erwartet: Meine Wahl bleibt, Hinweis darauf. Gesehen: meine Wahl bleibt, «Ihre Wahl bleibt. Vergleichen Sie sie mit der Begründung der KI.» (06). Dass die KI widerspricht, steht nicht da (P-9).
7. **KI-Wahl «Umlagefähig» selbst auf «Nicht umlagefähig» umgeklickt.** Erwartet: Der Satz passt sich an. Gesehen: weiterhin «Dwello hat diese Wahl vorgewählt …» (P-8). Danach umbenannt: Kasten weg, meine Wahl bleibt.
8. **Selbst «Umlagefähig», dann «Bewachung Test» prüfen.** Gesehen: gelber Kasten «Kein Vorschlag … Wählen Sie selbst …», meine Wahl bleibt (P-10).
9. **Langsame KI (Antwort um 8 s verzögert).** Erwartet: Ich sehe, dass gearbeitet wird. Gesehen: «Bitte warten …» (blass, nicht klickbar), darunter «Die KI prüft die Kategorie …» (08). Danach erschien der Vorschlag normal.

## Verwirrung

- «Dwello hat diese Wahl vorgewählt», wenn ich selbst schon umgeklickt habe: welche Wahl ist gemeint?
- «Ihre Wahl bleibt»: Bin ich gleicher Meinung wie die KI oder nicht? Muss ich selbst vergleichen.
- Warum ist der Vorschlag nach dem Umbenennen plötzlich weg?

## Fehlerrisiken

- P-9: Wer selbst falsch gewählt hat und den Widerspruch zur KI übersieht, speichert die falsche Wahl. Die KI hätte es bemerkt, Dwello sagt es aber nicht deutlich.
- P-1 ist kein Risiko mehr: Nach einer Namensänderung bleibt keine alte Wahl der KI stehen.

## Vorschläge

- **P-7:** Neue Kategorie → Name eingeben → prüfen lassen → Name ändern. Hilfreich: kurz an der Stelle des Kastens «Der Name hat sich geändert. Lassen Sie die KI nochmals prüfen.»
- **P-8:** Name «Treppenhausreinigung …» → prüfen → «Nicht umlagefähig» anklicken. Hilfreich: Sobald ich selbst klicke, den Satz ersetzen, z. B. «Sie haben «Nicht umlagefähig» gewählt. Die KI schlägt «Umlagefähig» vor.», oder im Satz die Wahl beim Namen nennen («Dwello hat «Umlagefähig» vorgewählt.»).
- **P-9:** «Nicht umlagefähig» anklicken → Name «Treppenhausreinigung …» → prüfen. Hilfreich: bei Widerspruch deutlich «Die KI sieht es anders als Sie: …», bei Übereinstimmung «Die KI ist gleicher Meinung.»
- **P-10:** «Umlagefähig» anklicken → Name «Bewachung …» → prüfen. Hilfreich: «Ihre Wahl bleibt.» statt «Wählen Sie selbst …», wenn schon gewählt ist.
- **P-11:** Prüfen mit langsamer Antwort. Hilfreich: den wartenden Knopf besser lesbar machen (stärkerer Kontrast), Text gern so lassen.

## Nicht geprüft

- Speichern während die KI noch prüft: hätte eine zusätzliche Kategorie angelegt.
- Ein echter Ausfall der KI (Fehler 500): nicht verlangt.
- 200 % Zoom, andere Sprachen, Mobilansicht, Bearbeiten einer bestehenden Kategorie: nicht Teil dieser Runde.
