# Anna – Rechnungen hochladen, Runde 2

Persona: Anna, 29, Erstvermieterin, kommt nach Monaten zurück und weiss nicht mehr, wie Dwello funktioniert. Desktop 1440 × 900, Maus.
Aufgabe: Für «Alpenblick» «Elektro Blitz AG.pdf», «Sammelscan Januar.pdf» und «Werke Schlussrechnung 2025.pdf» hochladen; ohne Aufklappen erkennen, was zu prüfen ist; die angebotenen Rechnungen erstellen; merken, dass es geklappt hat, obwohl eine Datei im Dialog bleibt; abbrechen. Bewertet werden nur meine Befunde P-3, P-4, P-5 und P-6 aus Runde 1 (`anna-rechnungen-hochladen.md`).
App: Persona-Stack http://localhost:3300 (Version 0.4.14+12-gbe436c1d), die KI ist der Stand-in. Skripte und Screenshots liegen in `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/anna-rechnungen-hochladen-2/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog, Zeile «Werke Schlussrechnung 2025.pdf» (zugeklappt) | «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.» nennt nicht, was das Erstellen wirklich verhindert: Die Kategorie fehlt. Das erfahre ich erst nach «2 Rechnungen erstellen», als nur eine erstellt wird (Rest von Runde-1-P-6). |
| P-2 | Minor | Dialog nach einem teilweisen Erfolg | Nach «2 Rechnungen erstellen» springt der Dialog nach oben zu «1 Rechnung erstellt». Dass die Werke-Zeile wegen der fehlenden Kategorie offen geblieben ist, steht weiter unten, ausserhalb der Sicht. Oben deutet nichts darauf hin, dass noch etwas zu tun ist (neue Seite von Runde-1-P-3). |
| P-3 | Minor | Dialog, Zeile «Sammelscan Januar.pdf» | Weiterhin nur «Diese Datei enthält mehrere Rechnungen. Laden Sie jede einzeln hoch.» Ich habe nur diesen einen Scan; wie ich weiterkomme, steht nicht da. «Angaben prüfen» fehlt jetzt bei dieser Zeile, das ist besser (Runde-1-P-4 teilweise behoben). |
| P-4 | Minor | Rückfrage «Hochladen abbrechen?» nach dem Erstellen | «Hochgeladene Dateien und Ihre Eingaben gehen verloren.» Direkt nach «1 Rechnung erstellt» erschrecke ich: Geht die eben erstellte Rechnung auch verloren? Sie ist danach in der Liste, aber das sagt mir die Rückfrage nicht. |
| P-5 | Nit | Dialog, «Prüfen Sie: …» an allen Zeilen | Das Fälligkeitsdatum hat die KI gar nicht gefunden («Die KI hat diesen Wert nicht gefunden …» steht erst aufgeklappt). Zugeklappt heisst es «prüfen», gemeint ist «ausfüllen, falls vorhanden». Beim Sammelscan, der sich gar nicht erstellen lässt, steht «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.» ebenfalls, ohne dass ich dort etwas prüfen kann. |

Behoben aus Runde 1:
- **Runde-1-P-3 (Bestätigung ausser Sicht):** behoben. Nach dem Erstellen steht der Dialog oben, der grüne Kasten «1 Rechnung erstellt» mit Link ist sofort sichtbar, der Fokus liegt darauf (`12-after-create-1.png`, `22-after-create.png`). Ausnahme siehe P-2 und P-4.
- **Runde-1-P-5 (Schlussrechnung):** behoben. «Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich als eigene Rechnungen, sonst zählen sie doppelt.» Jetzt weiss ich, welcher Betrag drinsteht und was ich nicht tun darf.
- **Runde-1-P-6 (Grund für «Bitte prüfen»):** weitgehend behoben. Zugeklappt steht jetzt «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.» Rest siehe P-1 und P-5.

## Beobachtungen

- Die Werte stammen vom KI-Stand-in (alle PDFs: «Allgemeinstrom Q1», CHF 1’250.00, R-1001, 31.03.2026); nicht bewertet.
- Die Zeile «Elektro Blitz AG.pdf» zeigt beim zweiten Hochladen «Diese Rechnung ist schon erfasst.» mit Link, aber auch weiterhin das Etikett «Bitte prüfen» und «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.» Bei einem Duplikat, das ich nicht erstellen will, ist das unnötig.
- Das Dateifeld zeigt weiterhin das englische «Choose Files / No file chosen» (Runde-1-P-11).
- Unten im Dialog stehen nach dem Erfolg weiterhin «Wählen Sie mindestens eine Rechnung zum Erstellen.» und der deaktivierte Knopf «0 Rechnungen erstellen» (`23-after-create-bottom.png`). Da oben jetzt die Erfolgsmeldung steht, stört es weniger.
- Werkzeug, kein Nutzerweg: In meinem ersten Skriptversuch griff die Gebäudewahl nicht; das Werkzeug konnte trotzdem Dateien in das gesperrte Dateifeld setzen, alle drei Zeilen zeigten dann «Die Datei wurde nicht gelesen, weil Dwello nicht geantwortet hat.» Mit der Maus geht das nicht, weil der Knopf gesperrt ist; ich bewerte es nicht.
- In der Rechnungsliste sehe ich auch Elektro-Blitz- und Werke-Rechnungen in «Musterhaus Zentrum» und «Seepark Residenz»; die stammen nicht von mir.

## Aufgabe geschafft

Ja. Für «Alpenblick» sind «Elektro Blitz AG» und «Werke Schlussrechnung 2025» (Kategorie Kaltwasser) erstellt; der Sammelscan lässt sich wie vorgesehen nicht erstellen. Abbrechen mit Rückfrage hat geklappt, danach steht der Fokus wieder auf «Rechnungen hochladen».

## Aufwand

Etwa 5 Minuten Nutzerzeit, rund 14 Schritte: Rechnungen öffnen 1, Dialog 1, Gebäude 1, Dateien 1, Zeilen lesen 1, erstellen 1, Ergebnis lesen und nach unten scrollen 2, neuer Dialog mit denselben Dateien 3 (mein Dialog war zu), Werke aufklappen und Kategorie wählen 2, erstellen 1, abbrechen und verwerfen 2. Das Auslesen dauerte etwa 1 Sekunde.

## Ablauf

1. **Rechnungen › «Rechnungen hochladen», Gebäude Alpenblick, drei Dateien gewählt.** Erwartet: drei Zeilen, an jeder sehe ich, was zu tun ist. Gesehen (`11-rows-bottom.png`): «3 von 3 Dateien gelesen», jede Zeile mit «Bitte prüfen» und einem Kasten «Zu dieser Datei»:
   - Elektro Blitz: «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.» Klar, was ich anschauen soll.
   - Sammelscan: «Diese Datei enthält mehrere Rechnungen. Laden Sie jede einzeln hoch.» plus «Prüfen Sie: …», Haken gesperrt, kein «Angaben prüfen» mehr. Wie ich die Rechnungen trotzdem erfasse, steht nicht da (P-3, P-5).
   - Werke: Erklärung zum Abzug von CHF 1’000.00, verständlich. Dass die Kategorie fehlt, steht nicht da (P-1).
   - Knopf «2 Rechnungen erstellen».
2. **Ohne Aufklappen «2 Rechnungen erstellen».** Erwartet: beide erstellt. Gesehen (`12-after-create-1.png`): Dialog springt nach oben, grün «1 Rechnung erstellt – Elektro Blitz AG». Ich hätte fast geglaubt, alles sei fertig. Erst beim Hinunterscrollen: Werke ist aufgeklappt, mit «Wählen Sie eine Kategorie.», Knopf «1 Rechnung erstellen» (P-2).
3. **Werke: Kategorie «Kaltwasser» gewählt** (im zweiten Dialog; die Kategorieliste war sofort voll), dann «1 Rechnung erstellen». Gesehen (`22-after-create.png`): oben «1 Rechnung erstellt – Werke Schlussrechnung 2025», Fokus auf dieser Meldung. Elektro Blitz bleibt als «Diese Rechnung ist schon erfasst.» mit Link, der Sammelscan bleibt. Ich merke klar, dass es geklappt hat.
4. **«Abbrechen».** Erwartet: Rückfrage. Gesehen (`24-cancel-confirm.png`): «Hochladen abbrechen? Hochgeladene Dateien und Ihre Eingaben gehen verloren.» mit «Weiter prüfen» und «Abbrechen und verwerfen». Ich zögere, weil ich nicht weiss, ob die erstellte Rechnung mit verloren geht (P-4). «Abbrechen und verwerfen»: Dialog zu, Fokus auf «Rechnungen hochladen».
5. **Rechnungsliste.** Elektro Blitz AG und Werke Schlussrechnung 2025 stehen bei Alpenblick, 31.03.2026. Die Rechnungen sind also geblieben.

## Verwirrung

- «Laden Sie jede einzeln hoch»: Soll ich den Scan selbst zerschneiden? Oder über «Rechnung erfassen» gehen?
- «Prüfen Sie: … Fälligkeitsdatum», obwohl da gar nichts steht.
- «Akontozahlungen»: kenne ich nicht, aber «bereits bezahlte Beträge» im selben Satz erklärt es mir.
- «Hochgeladene Dateien … gehen verloren» nach einem Erfolg: Sind damit auch die Belege der erstellten Rechnungen gemeint?

## Fehlerrisiken

- Nach einem teilweisen Erfolg sehe ich nur die grüne Meldung, schliesse den Dialog und die Schlussrechnung fehlt in der Nebenkostenabrechnung (P-2, P-1).
- Ich lasse den Sammelscan liegen, weil ich nicht weiss, wie ich ihn erfasse; die Kosten fehlen (P-3).
- Aus Angst vor «gehen verloren» lasse ich den Dialog offen oder lade die Dateien nochmals hoch; die Duplikat-Erkennung fängt das ab (P-4).

## Vorschläge

- **P-1:** Alpenblick, «Werke Schlussrechnung 2025.pdf» hochladen, Zeile zugeklappt lassen: Nur «Prüfen Sie: Rechnungsdatum, Fälligkeitsdatum.» Fehlende Pflichtangaben vor dem Erstellen an der zugeklappten Zeile nennen, z.B. «Wählen Sie noch eine Kategorie.»
- **P-2:** Elektro Blitz und Werke hochladen, ohne Kategorie «2 Rechnungen erstellen»: Oben steht «1 Rechnung erstellt», die offene Werke-Zeile liegt unten ausser Sicht. In der Erfolgsmeldung den Rest nennen («1 Rechnung braucht noch Angaben: Werke Schlussrechnung 2025.pdf») oder zur ersten offenen Zeile springen.
- **P-3:** «Sammelscan Januar.pdf» hochladen: Einen gangbaren Weg nennen, z.B. «Teilen Sie die Datei in einzelne Rechnungen auf oder erfassen Sie jede Rechnung über ‹Rechnung erfassen›.»
- **P-4:** Eine Rechnung erstellen, dann «Abbrechen»: Die Rückfrage nach einem Erfolg ergänzen, z.B. «Erstellte Rechnungen bleiben gespeichert. Die übrigen Dateien und Ihre Eingaben gehen verloren.»
- **P-5:** Bei Feldern, die die KI nicht gefunden hat, zugeklappt «Ergänzen Sie: Fälligkeitsdatum» statt «Prüfen Sie»; bei Zeilen, die sich nicht erstellen lassen, «Prüfen Sie: …» weglassen.

## Nicht geprüft

- Mobile 390 × 844: Die Aufgabe nannte nur den Dialog; ich habe ihn in dieser Runde nicht auf dem Telefon angesehen.
- Das Erstellen eines Duplikats trotz Hinweis: nicht Teil der Aufgabe.
- Ob die Werke-Rechnung mit CHF 1’250.00 (Wert des Stand-ins) fachlich stimmt: Die Beträge sind die des Stand-ins.
