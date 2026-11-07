# Dr. Weber – Abrechnungen 2025, Zahlungsfrist und Heizhinweis (#686)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack von `/home/user/w-672` (Branch w-686), :3300.
Gebäude, in dem ich gespeichert habe: Alpenblick (Abrechnungsperiode 01.01.2025 – 31.12.2025). Andere Datensätze habe ich nur gelesen (PDFs per Download).

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| W-1 | Minor | Abrechnung (Entwurf), Feld «Rückerstattung bis» | Der neue Hilfetext sagt «Versenden Sie später, verschiebt Dwello sie auf 30 Tage nach dem Versand». Dwello verschiebt aber auch dann, wenn ich noch am selben Tag versende: Ich hatte 20.11.2026 eingetragen und am 07.11.2026 per E-Mail versendet, danach stand 07.12.2026 da, auch im versendeten PDF. Dass eine Frist unter 30 Tagen, die ich selbst eintrage, nie gilt, steht so nicht da. Wer der Mieterin in einer Bemerkung oder am Telefon den 20.11. nennt, sagt ihr etwas anderes als das PDF. |
| W-2 | Minor | Abrechnung bearbeiten («Frist und Bemerkungen bearbeiten») | Wo ich die Frist eintrage, fehlt der neue Hilfetext. Dort steht nur «Bis zu diesem Datum erstatten Sie dem Mieter den Betrag zurück». Den 20.11.2026, also 13 Tage nach dem Abrechnungsdatum, nahm Dwello ohne Hinweis an und speicherte ihn. Erst auf der Detailseite und im E-Mail-Dialog erfahre ich, dass er beim Versand nicht bleibt. |

## Beobachtungen

- Die Zählung in Schritt 2 stimmt mit Schritt 4 überein. Alpenblick: 6 Rechnungen in Schritt 2, in Schritt 4 «6 Rechnungen vom 31.03.2025 bis 31.12.2025». Seepark Residenz 15 = 15 und Musterhaus Zentrum 19 = 19 (nur in der Vorschau angesehen, nicht erstellt). Bei Seepark habe ich alle Rechnungen einzeln nachgezählt. Die «Fernwärme Q4 2025» mit Rechnungsdatum 20.01.2026 und Leistungszeitraum Q4 2025 gehört nach Leistungszeitraum zu 2025, die «Fernwärme Q4 2024» vom 20.01.2025 nicht. Das ergibt 15. Nach Rechnungsdatum käme allerdings zufällig auch 15 heraus, an der Zahl allein lässt sich die Änderung hier also nicht erkennen.
- «Rechnungen vom … bis …» in Schritt 4 vermischt Datumsarten. Bei Alpenblick beginnt die Spanne mit einem Rechnungsdatum (31.03.2025, Schneeräumung Januar bis März), bei Seepark mit dem Beginn eines Leistungszeitraums (01.01.2025) und endet am 31.12.2025, obwohl eine Rechnung vom 20.01.2026 dabei ist. Was die Spanne bedeutet, ist nicht erklärt.
- Beim Seepark-Wizard für 2023 erklärt der Hinweis «Rechnungen kurz nach der Abrechnungsperiode» sauber, dass Rechnungen ohne Leistungszeitraum nach Rechnungsdatum zählen. Das passt zur Hilfe auf der Rechnungsseite («Bestimmt, in welche Abrechnungsperiode die Rechnung fällt»).
- «PDF erstellen» funktioniert beim ersten Klick, auch wenn ich direkt nach dem ersten Laden der Seite klicke (bei Laura Keller und Kevin Fischer: genau ein POST `?/generatePdf` mit 200). Danach heisst der Knopf «PDF herunterladen». Ein Download startet nicht von selbst, und die Zeile «PDF auf Deutsch» verschwindet.
- Nachgerechnet, Alpenblick 2025: Heizung 1’792.00 + 4’880.00 − 1’494.00 = 5’178.00, das stimmt. Wohnungsanteil Laura Keller 72/255 × 5’178.00 = 1’462.02, das stimmt. Verwaltungspauschale 3 % von 2’068.77 = 62.06, das stimmt. Die Kostenabstimmung in Schritt 4 (Mieter 3’452.00 / Sie 1’726.00) passt zu 2 von 3 Wohnungen nach Fläche.
- Heizhinweis bei Seepark A2 (Nina Brunner, Sarah Meier, Leistungszeitraum-Fall, nur gelesen): Der Text «Heizkosten nach Heizprofil «Heizung + Warmwasser»: Bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin; ihr Anteil steht unter der Abrechnungsposition» passt zur Tabelle. Nina: (395 + 1’410) / 4’115 × 1’054.47 = 462.53, Zeitanteil 43.86 %. Sarah: 591.94. Zusammen 1’054.47.
- Die Zahlungsfrist mit längerer Frist hält, was die Hilfe sagt: Kevin Fischer auf 31.12.2026 gesetzt, als versendet markiert (per Brief), die Frist blieb 31.12.2026.
- Der E-Mail-Dialog erklärt die Fristverschiebung («so viele Tage danach, wie in den Einstellungen festgelegt; eine spätere Zahlungsfrist … bleibt»). Der Dialog «Als versendet markieren» (Brief) sagt dazu nichts.
- Die Hilfe spricht von «Frist», das Feld heisst bei einer Rückerstattung «Rückerstattung bis», der E-Mail-Dialog sagt «Zahlungsfrist». Drei Wörter für dasselbe.
- Französisches PDF (Pierre Dubois, NK-11111111-2025-0003, nur gelesen): durchgehend französisch. Heizung nach Verbrauch: 2’650.00 + 6’565.00 − 2’257.20 = 6’957.80, das stimmt. Anteil 70 % × 85/492.5 + 30 % × 1/6, × 6’957.80 = 1’188.48, das stimmt. Einen Heizprofil-Hinweis gibt es dort nicht, weil das Mietverhältnis das ganze Jahr dauert.

## Aufgabe geschafft: teilweise

Abrechnungen erstellt, Schritt 2 und 4 verglichen, Entwurf und Zahlungsfrist-Hilfe geprüft, PDF erstellt, französisches PDF geöffnet. Den neuen Heizhinweis «… X % des Wohnungsanteils an den Heizkosten in der Abrechnungsperiode» konnte ich in keinem PDF finden (siehe «Nicht geprüft»).

## Aufwand

Etwa 15 Minuten, 23 Skripte. Für den Wizard (5 Schritte) und die zwei Entwürfe brauchte ich etwa 25 Klicks und Eingaben.

## Ablauf

- Laura Keller, PDF: Ich erwartete den neuen Heizhinweis. Gesehen habe ich keinen Hinweis, nur «Heizprofil … (nicht angewendet: Mietvertrag über die ganze Periode)». Bei Kevin Fischer war es gleich.
- Laura Keller, Frist 20.11.2026 gesetzt und am selben Tag per E-Mail versendet: Nach der Hilfe («Versenden Sie später …») erwartete ich, dass der 20.11. bleibt. Gesehen habe ich 07.12.2026 auf der Seite und im versendeten PDF (W-1).
- Abrechnung bearbeiten: Ich erwartete den Hilfetext zur Frist beim Datumsfeld. Dort stand nur der alte Text, und der 20.11. wurde ohne Hinweis gespeichert (W-2).
- Kevin Fischer nach «PDF erstellen»: Ich erwartete «Per E-Mail senden» wie bei Laura. Da stand «Als versendet markieren», weil Kevin Fischer per Brief zugestellt wird. Das ist richtig, ich musste es aber erst im Dialog nachlesen.

## Vorschläge

- **W-1:** Abrechnung NK-33333333-2025-0001 öffnen, «Frist und Bemerkungen bearbeiten», «Rückerstattung bis» auf 20.11.2026 setzen, speichern, «Per E-Mail senden». Danach steht 07.12.2026 da. Hilfreich wäre ein Text, der beide Fälle nennt, etwa: «Beim Versand setzt Dwello die Frist auf {n} Tage nach dem Versand, wenn sie früher endet; eine längere Frist bleibt.» Das «später» würde dann wegfallen.
- **W-2:** Denselben Hilfetext auf «Abrechnung bearbeiten» beim Datumsfeld zeigen. Bei einem Datum, das weniger als {n} Tage nach heute liegt, sollte ein Hinweis erscheinen, dass Dwello es beim Versand verschiebt.

## Nicht geprüft

- **Neuer Heizhinweis «X % des Wohnungsanteils …» (de, fr, it, en):** In den Demodaten kommt kein Fall vor, in dem er erscheint. Dazu bräuchte es einen Mietvertrag über einen Teil der Periode und eine Heizrechnung ohne Leistungszeitraum. Ich habe die PDFs aller 2025er Abrechnungen (de, fr, it) und der 2024er gelesen. Alle ganzjährigen zeigen keinen Hinweis, Seepark A2 zeigt die Variante mit Leistungszeitraum. Den Wizard für 2023 habe ich auch angesehen, ohne zu erstellen: Für 2023 sind keine Rechnungen erfasst. Einen Mieter und Mietvertrag im leeren Alpenblick OG2 habe ich nicht angelegt, weil der Auftrag nur Abrechnungen erlaubt. Dass der Text zur Tabelle passt, ist also offen, auch auf Französisch.
- Ein Versand an einem späteren Tag als dem Erstellen («Versenden Sie später») lässt sich ohne andere Serveruhr nicht nachstellen. Den gleichen Mechanismus habe ich nur über eine zu kurze Frist am selben Tag gesehen (W-1).
- PDFs der Seepark-, Musterhaus- und französischen Entwürfe habe ich nur heruntergeladen und nicht neu erstellt, weil es nicht meine Datensätze sind.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/weber-686/` (u. a. `05-wizard4.png` Vorschau, `10-draft.png` Entwurf mit Hilfe, `13-frist-edit.png` Bearbeiten ohne Hilfe, `16-laura-sent.png` verschobene Frist; PDFs `laura-sent.pdf`, `nina-de.pdf`, `pierre.pdf`).
