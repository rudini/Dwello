# Dr. Weber – Vorschau: Akonto-Hinweis und Kategorienprüfung bei befristetem Mietvertrag (w3f)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack http://localhost:3300 (Deutsch). Gespeichert nur im Gebäude «Musterhaus Zentrum».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/b764c1fc-ad3b-5410-ae08-ee39473408c9/scratchpad/persona-weber/w3f/`.

Angelegt habe ich: die Mieterin Beatrice Wyss (Zürich, per Brief), einen befristeten Mietvertrag für Wohnung 2.02 (01.01.2025 – 31.12.2030, Nettomiete CHF 1'200, Akonto CHF 20, keine Verwaltungspauschale) und die Rechnung «Winterdienst Limmat GmbH – Schneeräumung Februar 2025», CHF 600, 15.02.2025, Kategorie Schneeräumung, umlagefähig. Abrechnungen habe ich keine erstellt (bei Schritt 4 «Vorschau» aufgehört).

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 4 «Vorschau», Hinweis bei Beatrice Wyss und Kategorienprüfung | «Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich» ist rechtlich schief: Ein befristeter Mietvertrag endet ohne Kündigung, nach dem Vertragsende gibt es nichts mehr zu erhöhen. Gemeint ist wohl: nicht während der festen Dauer, erst für eine Fortsetzung oder einen neuen Vertrag. Der Text sagt mir auch nicht, dass die Nachzahlung trotzdem geschuldet ist. |
| P-2 | Minor | Vorschau, «Kosten im Vergleich zum Vorjahr», Schneeräumung | Der Absatz spricht von neuen Nebenkosten, der Satz zum befristeten Mietvertrag aber von «eine Erhöhung». Ausserdem nennt der Text zuerst «frühestens auf den nächsten Kündigungstermin»; einen Kündigungstermin hat ein befristeter Mietvertrag nicht. Welcher Mietvertrag befristet ist, steht nicht da. |
| P-3 | Minor | Vorschau, Abrechnung Beatrice Wyss | «Kosten CHF 2'558.13 (1066 %) über dem Akonto.» ist kein ganzer Satz und klingt, als betrügen die Kosten CHF 2'558.13. Das Akonto selbst (12 × CHF 20 = CHF 240) wird nicht genannt. Daneben stehen zwei Zahlen für dasselbe: CHF 2'558.13 im Hinweis und «Nachzahlung CHF 2'558.10». |
| P-4 | Minor | Vorschau, beide Hinweise | Die beiden Hinweise widersprechen sich bei den Formvorschriften. Beim Akonto fehlen die Frist «mindestens 10 Tage vor Beginn der Kündigungsfrist» und der Zeitpunkt «nächster Kündigungstermin», bei der Schneeräumung stehen beide. Beides fällt aber unter dieselbe Regel (einseitige Vertragsänderung mit amtlichem Formular). |
| P-5 | Nit | Vorschau, Abrechnung Beatrice Wyss | Der vierzeilige Warnhinweis ist rechtsbündig gesetzt; mit dem ungleichmässigen linken Rand ist er schwer zu lesen. |

## Beobachtungen

- Mietvertrag-Assistent, Schritt 3: Der Hinweis «Der Vertragsbeginn … liegt in der Vergangenheit. Stimmt das Datum?» erscheint dreimal (unter dem Feld, als Meldung und nochmals als «Vertragsbeginn prüfen»). Einmal würde reichen.
- Der Mietvertrag-Assistent fragt nie, welche Nebenkosten im Mietvertrag vereinbart sind. Die Frage «Ist diese Kategorie im Mietvertrag vereinbart?» in der Vorschau schickt mich deshalb zum Papiervertrag; die App kann es selbst nicht prüfen.
- «ausser der Mietvertrag sieht sie vor» ist stark vereinfacht: Während einer festen Dauer lässt das Mietrecht Erhöhungen nur in eng begrenzten Formen zu (indexierte Miete bei mindestens 5 Jahren, gestaffelte Miete). Ein Laie könnte jede Klausel im Vertrag für genügend halten.
- Beim Gebäudehinweis zur Schneeräumung steht der Satz zu befristeten Mietverträgen. Ob er nur erscheint, weil der Mietvertrag Wyss der einzige befristete ist, kann ich nicht erkennen. In diesem Lauf passt es, weil sie die einzige Abrechnung ist.
- Nach dem Speichern der Rechnung erscheint die Meldung «Rechnung von Winterdienst Limmat GmbH gespeichert», sie deckt aber eine Zeile der Liste ab. Die neue Rechnung (15.02.2025) steht nicht auf Seite 1 der Liste; ich kann sie nicht sofort kontrollieren.
- Schrittanzeige bei 1440 px: «Abrechnun gsperiode» wird mitten im Wort umgebrochen.
- Liste der Abrechnungen: «365 Mietstage». Ich hätte «Miettage» erwartet.
- Nachgerechnet: 2'798.13 − 240.00 = 2'558.13; 2'558.13 / 240 = 1066 %; Nachzahlung auf 5 Rappen gerundet = 2'558.10. Das stimmt, aber ich musste es selbst herleiten.
- Schritt 2 des Abrechnungs-Assistenten sagt vorab: «Von 5 Mietverträgen … haben 4 schon eine Abrechnung». Damit war klar, dass nur Wyss eine neue Abrechnung erhält. Gut.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 25 Schritte: Mieter 1 Formular, Mietvertrag 5 Assistentenschritte plus Bestätigen des vergangenen Datums, Rechnung 1 Formular, Abrechnung 4 Schritte bis zur Vorschau.

## Ablauf

1. **Gebäude → Musterhaus Zentrum → Wohnung 2.02.** Erwartet: «Leer» und ein Weg zum Vermieten. Gesehen: «Leer», «Mietvertrag erfassen». In Ordnung.
2. **Mietvertrag erfassen → Neuen Mieter erfassen.** Erwartet: ein Mieterformular, danach zurück zum Mietvertrag. Gesehen: Vorname, Nachname, Korrespondenzkanal (Auswahl, voreingestellt «Per Brief»), Adresse. Nach «Mieter erfassen» zurück in Schritt 1 mit «Beatrice Wyss ist gespeichert und für diesen Mietvertrag gewählt.» Gut.
3. **Schritt 2 Wohnung.** Schon ausgefüllt. In Ordnung.
4. **Schritt 3 Vertragsdauer.** Erwartet: Auswahl befristet/unbefristet. Gesehen: «Befristet – Der Mietvertrag endet an einem festen Tag, ohne Kündigung.» Danach erscheint das Feld Vertragsende. Der Hilfetext sagt richtig «ohne Kündigung». Das vergangene Datum wird hinterfragt (dreifach, siehe Beobachtungen); nochmals «Weiter» bestätigt es.
5. **Schritt 4 Miete.** Nettomiete 1200, Akonto 20, Verwaltungspauschale «Nein». Der Hilfetext zur Verwaltungspauschale nennt Art. 269d OR. Gut.
6. **Schritt 5 Prüfen → Mietvertrag speichern.** Zusammenfassung korrekt (Monatlich total CHF 1'220.00). In der Liste steht «01.01.2025 – 31.12.2030, befristet». In Ordnung.
7. **Rechnungen → Rechnung erfassen.** Musterhaus Zentrum, 15.02.2025, CHF 600, Kategorie Schneeräumung, Verteilschlüssel leer gelassen (gleichmässig pro Wohnung), «Umlagefähig» war schon angekreuzt. Gespeichert; die Meldung bestätigt es, 84 statt 83 Rechnungen.
8. **Nebenkostenabrechnungen → Abrechnungen erstellen.** Schritt 1: Periode 01.01.–31.12.2025 vorgeschlagen. Schritt 2: nur Musterhaus Zentrum (20 Rechnungen, «4 von 5 Mietverträgen haben schon eine Abrechnung»). Schritt 3: Heizprofil «Heizung + Warmwasser»; Wyss steht unter «Ohne vereinbarte Verwaltungspauschale», wie erfasst.
9. **Schritt 4 Vorschau.** Erwartet: eine Abrechnung für Wyss mit einem Hinweis auf das viel zu tiefe Akonto, und ein Hinweis zur neuen Schneeräumung. Gesehen:
   - Vergleich zum Vorjahr: «Schneeräumung: Neu: CHF 600.00, im Vorjahr keine Kosten. Ist diese Kategorie im Mietvertrag vereinbart? Nur vereinbarte Nebenkosten dürfen Sie abrechnen. Wenn nicht, markieren Sie die Rechnungen als nicht umlagefähig. Neue Nebenkosten führen Sie nur für die Zukunft ein, frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist die Änderung nichtig. Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor. Waren die Kosten bisher in der Nettomiete enthalten, senken Sie diese entsprechend.» → Weitgehend richtig und vollständig, aber siehe P-1 und P-2.
   - Beatrice Wyss: «Kosten CHF 2'798.13 / Nachzahlung CHF 2'558.10 / Kosten CHF 2'558.13 (1066 %) über dem Akonto. Prüfen Sie, ob Sie das Akonto erhöhen. Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor. Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig.» → Der Hinweis erscheint wie erwartet, die Zahlen stimmen. Formulierung und Rechtliches: P-1, P-3, P-4, P-5.
   - Zusätzlich «Es gibt schon Abrechnungen» mit dem Kästchen «Die Abrechnungen trotzdem erstellen». Nicht angekreuzt, nicht weitergegangen.

## Verwirrung

- **«erst nach dem Vertragsende»:** Nach dem 31.12.2030 ist der Mietvertrag Wyss vorbei. Was würde ich dann erhöhen? Ob ich das Akonto vor 2030 überhaupt erhöhen darf oder warten muss, verstehe ich nur zwischen den Zeilen (nein, ausser vereinbart).
- **«Erhöhung»** im Schneeräumungs-Hinweis: Erhöhung wovon? Der Nettomiete, des Akontos, oder die Einführung der Nebenkosten?
- **«Kosten … über dem Akonto»:** Ich habe zuerst Kosten von CHF 2'558.13 gelesen, obwohl eine Zeile darüber CHF 2'798.13 steht.
- **«nächster Kündigungstermin»** bei einem befristeten Mietvertrag: Den gibt es nicht.
- **Zwei Beträge 2'558.13 und 2'558.10:** Ohne Wissen um die Rundung auf 5 Rappen sieht das nach einem Fehler aus.

## Fehlerrisiken

- Ein Vermieter liest «erst nach dem Vertragsende möglich» so, dass er die Erhöhung auf das Vertragsende hin ankündigen darf. Das ist rechtlich sinnlos oder weckt eine falsche Vorstellung, wie der Vertrag weiterläuft.
- Ohne den klaren Satz «Die Nachzahlung dieser Abrechnung ist trotzdem geschuldet» meint ein vorsichtiger Vermieter vielleicht, er könne den Fehlbetrag während der festen Dauer nicht verlangen. Oder umgekehrt meint das der Mieter, wenn der Vermieter den Text weitergibt.
- «ausser der Mietvertrag sieht sie vor» lädt dazu ein, eine allgemeine Vorbehaltsklausel für genügend zu halten und das Akonto formwidrig zu erhöhen.
- Bei der Akonto-Erhöhung erfährt der Vermieter die Frist (10 Tage vor Beginn der Kündigungsfrist) nicht und schickt das Formular zu spät.

## Vorschläge

- **P-1:** Reproduktion: in Musterhaus Zentrum einen befristeten Mietvertrag mit tiefem Akonto erfassen, «Abrechnungen erstellen» 2025 bis zur Vorschau, den Hinweis beim Mieter lesen. Hilfreich wäre: «Bei einem befristeten Mietvertrag können Sie das Akonto während der festen Vertragsdauer nicht erhöhen, ausser der Mietvertrag erlaubt es ausdrücklich. Die Nachzahlung dieser Abrechnung schuldet der Mieter trotzdem.» Dieselbe Korrektur für den Satz in der Kategorienprüfung, dort für neue Nebenkosten.
- **P-2:** Reproduktion: wie P-1, dazu eine Rechnung in einer Kategorie ohne Vorjahreskosten; «Kosten im Vergleich zum Vorjahr» lesen. Hilfreich wäre: «eine Erhöhung» durch «neue Nebenkosten einführen» ersetzen und den betroffenen befristeten Mietvertrag nennen («Beatrice Wyss, Wohnung 2.02, ist befristet bis 31.12.2030: …»).
- **P-3:** Reproduktion: wie P-1. Hilfreich wäre: «Die Kosten liegen CHF 2'558.13 (1066 %) über dem Akonto von CHF 240.00 (12 × CHF 20.00).» und bei der Nachzahlung der Zusatz «auf 5 Rappen gerundet», oder im Hinweis ebenfalls den gerundeten Betrag.
- **P-4:** Reproduktion: wie P-2, beide Hinweise vergleichen. Hilfreich wäre: eine gemeinsame Formulierung für beide Fälle (unbefristet: auf den nächsten Kündigungstermin, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist, begründet, mit amtlichem Formular; befristet: siehe P-1).
- **P-5:** Reproduktion: wie P-1, Hinweis unter der Nachzahlung ansehen. Hilfreich wäre: den Hinweistext linksbündig unter die Beträge setzen.

## Nicht geprüft

- Die erstellte Abrechnung und ihr PDF: Die Aufgabe sagte ausdrücklich, nichts zu erstellen.
- Ob der Befristet-Satz auch bei einem unbefristeten Mietvertrag mit tiefem Akonto erscheint: In Musterhaus Zentrum haben alle anderen Mietverträge schon eine Abrechnung 2025 und erscheinen nicht in der Vorschau, und in anderen Gebäuden durfte ich nicht speichern.
- Andere Sprachen (fr/it/en): Der Persona-Stack läuft auf Deutsch.
