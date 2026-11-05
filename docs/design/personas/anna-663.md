# Anna, Runde 663: Mietvertrag beenden mit Entwurfs-Konflikt, danach «Abrechnungen erstellen» 2025

Persona: Anna, 29, erste eigene Vermietung, war monatelang nicht in Dwello. Desktop 1440 × 900, Maus; der Assistent zusätzlich auf dem Handy 390 × 844. Persona-App auf http://localhost:3300 (Demodaten), gespeichert nur in «Musterhaus Zentrum».

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mietvertrag, Dialog «… beenden?» nach der Ablehnung | Nach «Das hat nicht geklappt» stehen drei Schaltflächen nebeneinander: «Entwurf löschen und Mietvertrag beenden» (rot), «Abbrechen» und nochmals «Mietvertrag beenden» (blau, sieht wie die Hauptaktion aus). Das blaue «Mietvertrag beenden» liest sich wie ein zweiter Weg ohne Löschen. Ich habe es geklickt: Nichts ändert sich, der Dialog zeigt dieselbe Meldung wieder. Für mich ist das eine doppelte Schaltfläche. |
| P-2 | Minor | Dialog «… beenden?», Link «Nebenkostenabrechnung NK-11111111-2025-0002 öffnen» | Der Link öffnet den Entwurf im selben Tab. Zurück auf dem Mietvertrag ist der Dialog zu, und meine Eingaben sind weg: Vertragsende 31.08.2025, «Kündigung erhalten am» 20.05.2025 und das Häkchen «Der Mietvertrag endete am 31.08.2025.». Das Vertragsende zeigt wieder «Unbefristet». Vorher sagt mir nichts, dass die Eingaben verloren gehen. Auf der Seite des Entwurfs gibt es auch keinen Weg zurück zum Mietvertrag, nur «Anna Schmidt» und «Wohnung 1.02». |
| P-3 | Minor | Dialog «… beenden?», Meldung nach dem Klick | Die Meldung hat rot den Titel «Das hat nicht geklappt», obwohl Dwello mich nur vor eine Wahl stellt (Entwurf löschen oder nicht). Ich dachte zuerst, ich hätte etwas falsch eingegeben, und habe meine Daten nochmals geprüft. |
| P-4 | Minor | Abrechnungen erstellen, Schritt 5 «Erstellen» | Der Text sagt «Es wird 1 Nebenkostenabrechnung als Entwurf erstellt.», die Schaltfläche heisst «Entwürfe erstellen» (Mehrzahl). Kurz habe ich mich gefragt, ob noch weitere Entwürfe entstehen, z. B. für die leere Wohnung 1.02 ab September. Eine Schaltfläche «… trotzdem erstellen» gibt es nicht mehr; doppelt war in Schritt 5 sonst nichts. |

## Beobachtungen

- Den Weg zum Beenden fand ich: Mietverträge → «Anna Schmidt» → «Beenden». Erst hatte ich «Bearbeiten» versucht. Dort gibt es nur «Unbefristet / Befristet», aber der Hinweistext schickt mich zu «Beenden» auf der Seite des Mietvertrags. Das hat geholfen.
- Die Warnung «Das Vertragsende liegt in der Vergangenheit, über ein Jahr zurück. Prüfen Sie das Jahr.» mit dem Kästchen zum Bestätigen ist klar. Ich musste zweimal klicken (zuerst kam die Warnung, dann der Konflikt mit dem Entwurf).
- Nach «Entwurf löschen und Mietvertrag beenden» landete ich direkt in «Abrechnungen erstellen», Schritt 3 von 5, für Musterhaus Zentrum 2025. Die Meldung oben rechts sagte: «Entwurf NK-11111111-2025-0002 gelöscht. Der Mietvertrag von Anna Schmidt endet am 31.08.2025. Erstellen Sie jetzt die Nebenkostenabrechnung neu.» Das war hilfreich. Die Meldung deckte aber einen Teil des Hilfetexts bei «Heizprofil» zu (Screenshot 12-ended.png).
- Mietvertrag danach: «Unbefristet, gekündigt auf den 31.08.2025», neu «Nächste Schritte: Neue Adresse eintragen» und «3 Abrechnungen fehlen» (2025 kam dazu). Gut verständlich.
- In der Übersicht steht «Nachmieter für Wohnung 1.02 suchen: Der Mietvertrag von Anna Schmidt endet am 31.08.2025.» Das ist Präsens, obwohl das Datum schon über ein Jahr zurückliegt.
- In der Vorschau (Schritt 4) steht bei Anna Schmidt «01.01.2025 – 31.08.2025, 243 Mietstage». Dazu kommen der Hinweis «Es gibt schon Abrechnungen» für 3 Mietverträge und «Anna Schmidt ist ausgezogen. Die Adresse ist noch die der Wohnung.» Das ist alles verständlich.
- Den Assistenten gibt es nur in Schritt 1 mit «Abbrechen». In Schritt 5 gibt es nur «Zurück» und «Entwürfe erstellen». Verlassen habe ich ihn über das Menü, ohne Rückfrage. Kam ich zurück, stand «Angaben wiederhergestellt» da, aber bei Schritt 3, nicht bei Schritt 5, wo ich aufgehört hatte. «Angaben verwerfen» fragt nochmals nach («Angaben verwerfen? Ihre Angaben werden gelöscht.»). Danach beginnt der Assistent wieder bei Schritt 1. Dass dort «Angaben» steht und nicht «Entwurf», finde ich gut: «Entwurf» ist bei Dwello schon die Abrechnung.
- Schritt 2 (Gebäude): Die Kästchen der Gebäude lesen die Zeilen «6 Rechnungen in der Abrechnungsperiode» und «3 Wohnungen» im Namen doppelt vor (im Accessibility-Tree gesehen, nicht auf dem Bildschirm).
- Auf dem Handy (390 px) liefen die Schritte 1 bis 5 ohne seitliches Scrollen. Die Texte sind dieselben wie auf dem Desktop.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten, 17 Durchläufe. Als Nutzerin: Mietvertrag beenden in 6 Klicks, davon ein Fehlversuch über «Bearbeiten». Den Konflikt-Dialog musste ich nach dem Ausflug zum Entwurf nochmals ganz ausfüllen. Bis zu Schritt 5 des Assistenten waren es 5 Klicks, Verwerfen 2 Klicks.

## Ablauf

- «Bearbeiten» beim Mietvertrag. Erwartet: ein Feld «Vertragsende». Gesehen: nur «Unbefristet / Befristet» und ein Hinweis auf «Beenden».
- «Mietvertrag beenden» mit 31.08.2025. Erwartet: gespeichert oder eine Frage zum Entwurf. Gesehen: zuerst die Warnung zum Jahr mit Kästchen, nach dem zweiten Klick rot «Das hat nicht geklappt» mit Link und drei Schaltflächen (P-1, P-3).
- Klick auf das blaue «Mietvertrag beenden» im Konflikt. Erwartet: beenden ohne Löschen, oder eine Erklärung. Gesehen: nichts ändert sich (P-1).
- Link zum Entwurf. Erwartet: neuer Tab, oder meine Eingaben bleiben. Gesehen: gleicher Tab; nach «Zurück» sind Dialog und Eingaben weg (P-2).
- «Entwurf löschen und Mietvertrag beenden». Erwartet: zurück auf den Mietvertrag. Gesehen: direkt der Assistent in Schritt 3 mit Bestätigung oben rechts.
- Schritt 5. Erwartet: ein Text und eine Schaltfläche, die zusammenpassen. Gesehen: «1 Nebenkostenabrechnung» und «Entwürfe erstellen» (P-4).
- Zurück in den Assistenten nach dem Verlassen in Schritt 5. Erwartet: Schritt 5. Gesehen: Schritt 3 mit «Angaben wiederhergestellt».

## Vorschläge

- **P-1:** Mietverträge → Anna Schmidt (1.02) → «Beenden» → 31.08.2025 eintragen → «Mietvertrag beenden» → Kästchen ankreuzen → «Mietvertrag beenden». Im Konflikt nochmals das blaue «Mietvertrag beenden» klicken. Es hilft, wenn im Konflikt-Zustand nur noch «Entwurf löschen und Mietvertrag beenden» und «Abbrechen» stehen. Oder die zweite Schaltfläche sagt, was sie anders macht.
- **P-2:** Wie P-1 bis zum Konflikt, dann «Nebenkostenabrechnung NK-…-0002 öffnen» und im Browser zurück. Es hilft, den Entwurf in einem neuen Tab zu öffnen oder die Eingaben beim Zurückkommen wiederherzustellen. Mindestens sollte beim Link stehen, dass der Dialog sich schliesst und die Eingaben verloren gehen.
- **P-3:** Wie P-1. Als Titel eine Frage oder einen Hinweis statt eines Fehlers, z. B. «Zu diesem Mietvertrag gibt es einen Entwurf», und nicht rot, solange nichts falsch eingegeben ist.
- **P-4:** «Abrechnungen erstellen» → 2025 → Musterhaus Zentrum → Weiter bis Schritt 5. Die Schaltfläche nach der Zahl richten: «Entwurf erstellen» bei 1, «Entwürfe erstellen» bei mehreren.

## Nicht geprüft

- Die Abrechnung habe ich nicht erstellt (so verlangt).
- Den Konflikt-Dialog auf dem Handy konnte ich nicht prüfen: Nach dem Beenden ist der Mietvertrag beendet, und den Entwurf gibt es nicht mehr. Ein zweites Mal ging es nicht, ohne Daten ausserhalb der Aufgabe zu ändern.
- Ob «Mietvertrag beenden» im Konflikt-Zustand serverseitig etwas tut, sehe ich nur an der Oberfläche: Die Meldung blieb gleich, der Mietvertrag war danach noch «Unbefristet».
- Die Zahl der Entwürfe in der Übersicht (7, später 4) ändert sich auch durch andere Personas in derselben Datenbank. Das habe ich nicht bewertet.
