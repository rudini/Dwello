# Persona-Review Dr. Weber – Issue #176 (Umlagefähigkeit, KI-Prüfung, Datenschutz)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, prüft Behauptungen nach.
Umgebung: Persona-App http://localhost:3300 (Demo-Daten), Desktop 1440 × 900, Maus, Zoom 100 %.
Nichts gespeichert (Aufgabe: nur ansehen). «Von der KI prüfen lassen» speichert nicht (geprüft: nur eine POST-Anfrage `?/propose`, Liste danach unverändert 21 Kategorien).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/fbb18b34-b688-5fdb-9b9f-9f01da7bd45c/scratchpad/weber-176/`.

Zum Abgleich habe ich Art. 257a/257b OR und Art. 5/6 VMWG nachgelesen sowie das Merkblatt «Zulässige und unzulässige Nebenkosten» des Mieterverbands (Ausgabe 2026). Daraus wörtlich:
- Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Art. 6 VMWG: Nicht anrechenbar als Heizungs- und Warmwasserkosten sind «a. die Reparatur und Erneuerung der Anlagen; b. die Verzinsung und Abschreibung der Anlagen».
- Merkblatt Mieterverband: unzulässig bei Wasser/Abwasser «Grundgebühren, die unabhängig vom Verbrauch anfallen und an den Wert der Liegenschaft gekoppelt sind» und die «Gebühr für Regenwasser (= Meteorabwasser)»; ebenso bei Kehricht. Zu Wartungsabos (ausdrücklich «Feuerlöschgeräte»): «Es ist rechtlich umstritten, ob Serviceabos für Kontrolle und Wartung als Nebenkosten überwälzbar sind.» Schädlingsbekämpfung steht unter «Unzulässige Gartenpflegekosten».

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neue Kategorie, «Von der KI prüfen lassen» | Die KI schlägt für «Gebäudeversicherung Weber», «Liegenschaftssteuer», «Regenwassergebühr», «Abwasser Grundgebühr nach Gebäudeversicherungswert», «Schädlingsbekämpfung Keller», «Feuerlöscher-Wartung Haus B» und sogar für den Unsinn «Xyzq» «Umlagefähig» vor, jedes Mal mit derselben Begründung und Gesetzesstelle («Laufende Betriebskosten aus dem Gebrauch der Mietsache (Art. 257b Abs. 1 OR).»). Das widerspricht dem Hilfetext direkt darüber und den eigenen Standard-Kategorien. |
| P-2 | Minor | Neue Kategorie, KI-Vorschlag | Der Vorschlag wählt die Option selbst aus und klingt wie eine Rechtsauskunft. Kein Hinweis, dass Sie selbst entscheiden und prüfen müssen, dass der Mietvertrag die Kosten nennen muss (Art. 257a Abs. 2 OR) und dass manche Fälle umstritten sind. |
| P-3 | Minor | Kategorienliste | «Schädlingsbekämpfung» und «Feuerlöscher-Wartung» stehen korrekt als «Nicht umlagefähig» da, aber nichts auf dem Bildschirm sagt, warum. Für einen aufmerksamen Leser widerspricht «Feuerlöscher-Wartung: nicht umlagefähig» dem Hilfetext «bei Lift und Hauswart zählen nur Betrieb und Wartung». |
| P-4 | Minor | Datenschutz, «Weitergabe an Dritte» | Der Text sagt nicht, *welche* Daten an das Sprachmodell gehen (bei Rechnungen: Text, Beträge, Rechnungssteller, Namen? Bei der Prüfung: Name, Beschreibung, Übersetzungen). Ausserdem stellt er absolut fest, die Daten verliessen den Server nicht; für eine Installation, deren Betreiber ein externes Modell anbindet, wäre das falsch. |
| P-5 | Nit | Neue Kategorie, Hilfetext | Zitierweise uneinheitlich: Der Hilfetext schreibt «Art. 257a Absatz 2 OR», die KI «Art. 257b Abs. 1 OR». Die Regel zu wertabhängigen Grundgebühren nennt nur Wasser und Abwasser, nicht Kehricht. Ein Hinweis auf die VMWG (Art. 6: Reparatur/Erneuerung der Heizanlage) fehlt. |

## Beobachtungen

- Fusszeile: «© 2026 Dwello · Version unbekannt». Für ein Programm, dessen Abrechnungen rechtlich Gewicht haben, möchte ich die Version kennen.
- Einstellungen, Verwaltungspauschale: «Üblich sind bis 3 %.» Das ist eine Behauptung ohne Quelle (nicht Teil dieser Änderung).
- Auf dem ganzseitigen Screenshot liegt die Kopfzeile mitten im Bild. Das ist vermutlich ein Effekt der Aufnahme (fixierte Kopfzeile), kein Fehler, den ich am Bildschirm gesehen hätte.
- Die Beschreibung der Standard-Kategorien sagt nur «(trägt der Vermieter)» (in Schädlingsbekämpfung und Feuerlöscher-Wartung). Diese Beschreibung ist nur im Bearbeiten-Formular sichtbar, nicht in der Liste.
- Die KI antwortet immer in rund 3,8 Sekunden und mit genau zwei Begründungen im Wortlaut. Es sieht aus, als laufe in der Persona-App ein Stellvertreter statt eines echten Sprachmodells (siehe «Nicht geprüft»).

## Aufgabe geschafft: ja

Alle drei Teilaufgaben durchgeführt. Die Ergebnisse sind unten bewertet.

## Aufwand

Etwa 20 Minuten, rund 25 Schritte (Datenschutz lesen; Einstellungen → Kategorien → Kategorie erfassen; elf Namen von der KI prüfen lassen; drei Kategorien im Bearbeiten-Formular angesehen, ohne zu speichern; Filter «Nicht umlagefähig»).

## Ablauf

1. **Datenschutz (/privacy), «Weitergabe an Dritte».** Erwartet: welche Rechnungsdaten an das Sprachmodell gehen, wo es läuft, ob die Kategorieprüfung erwähnt ist. Gesehen: «Rechnungen werden mit einem Sprachmodell kategorisiert; auf Wunsch prüft es auch neue Kategorien darauf, ob ihre Kosten umlagefähig sind. Das Sprachmodell läuft auf dem Server des Betreibers; die Daten verlassen dafür den Server nicht.» Die Kategorieprüfung ist also genannt, gut. Es fehlt aber, welche Daten verarbeitet werden, und die Aussage «verlassen den Server nicht» ist absolut formuliert (P-4). Screenshot `01-privacy.png`.
2. **Übersicht → Einstellungen → Kategorien.** Erwartet: ein klarer Weg. Gesehen: «Einstellungen» in der Seitenleiste, dort die Kachel «Kategorien», die Liste mit 21 Kategorien und den Filtern «Alle (21) / Umlagefähig (12) / Nicht umlagefähig (9)». Einleitung: «Nur Kosten aus umlagefähigen Kategorien fliessen in die Nebenkostenabrechnung, die übrigen trägt der Vermieter.» Screenshots `03-einstellungen.png`, `04-kategorien.png`.
3. **«Kategorie erfassen», Hilfetext bei «Umlagefähige Nebenkosten».** Erwartet: eine korrekte, verständliche Erklärung mit Gesetzesstelle. Gesehen: «Umlagefähig sind Kosten, die mit dem Gebrauch der Liegenschaft zusammenhängen (Art. 257a–257b OR), z. B. Heizung, Wasser, Hauswart. Reparaturen, Erneuerungen, Gebäudeversicherung und Steuern trägt der Vermieter; bei Lift und Hauswart zählen nur Betrieb und Wartung. Bei Wasser und Abwasser zählen Grundgebühren, die vom Wert der Liegenschaft abhängen, und die Gebühr für Regenwasser nicht. Der Mieter bezahlt umlagefähige Kosten nur, wenn der Mietvertrag sie als Nebenkosten nennt (Art. 257a Absatz 2 OR).» Inhaltlich stimmt das mit Gesetz und Merkblatt überein. Besonders gut finde ich den Hinweis auf die vertragliche Vereinbarung (Art. 257a Abs. 2 OR). Kleinigkeiten unter P-5. Vor der Prüfung ist keine Option vorausgewählt, gut. Screenshot `05-neu-leer.png`.
4. **Name «Dachsanierung Weber», «Von der KI prüfen lassen».** Erwartet: «Nicht umlagefähig» mit Begründung Unterhalt/Erneuerung. Gesehen nach etwa 3,8 s: Kasten «Vorschlag der KI: Nicht umlagefähig» mit «Erhalt und Erneuerung des Gebäudes hängen nicht mit dem Gebrauch zusammen (Art. 257a Abs. 1 OR).» Die Option «Nicht umlagefähig» ist danach angewählt. Ergebnis und Begründung richtig. Die Stelle ist vertretbar (Art. 257a Abs. 1 definiert Nebenkosten über den Gebrauch); bei Wohnräumen wäre Art. 257b Abs. 1 OR die genauere. Screenshot `08-dach-ergebnis.png`.
5. **Gegenprobe mit weiteren Namen.** Erwartet: Die KI hält sich an den Hilfetext. Gesehen:
   - «Treppenhausreinigung»: Umlagefähig, «Laufende Betriebskosten aus dem Gebrauch der Mietsache (Art. 257b Abs. 1 OR).» Richtig.
   - «Reparatur Lift»: Nicht umlagefähig, Begründung wie bei der Dachsanierung. Richtig.
   - «Gebäudeversicherung Weber»: **Umlagefähig**, Begründung «Laufende Betriebskosten …». Falsch; der Hilfetext darüber sagt das Gegenteil (Screenshot `08-gv-ergebnis.png`: Hilfetext «Gebäudeversicherung … trägt der Vermieter» direkt über dem Kasten «Vorschlag der KI: Umlagefähig»).
   - «Liegenschaftssteuer»: **Umlagefähig**. Falsch, keine Abgabe aus dem Gebrauch.
   - «Regenwassergebühr»: **Umlagefähig**. Widerspricht dem Hilfetext.
   - «Abwasser Grundgebühr nach Gebäudeversicherungswert»: **Umlagefähig**. Widerspricht dem Hilfetext.
   - «Schädlingsbekämpfung Keller», «Feuerlöscher-Wartung Haus B»: **Umlagefähig**. Widerspricht den gleichnamigen Standard-Kategorien in der Liste (beide «Nicht umlagefähig»).
   - «Xyzq» (sinnlos): **Umlagefähig**, mit Gesetzesstelle. Erwartet hätte ich «kann ich nicht beurteilen».
   In allen Fällen wird die Option sofort angewählt (P-1, P-2).
6. **Kategorienliste, «Schädlingsbekämpfung» und «Feuerlöscher-Wartung».** Erwartet: «Nicht umlagefähig» und ein Grund. Gesehen: beide mit dem Text «Nicht umlagefähig» (nicht nur durch Farbe), 0 Rechnungen, löschbar. Ein Grund steht nirgends in der Liste. Im Bearbeiten-Formular steht als Beschreibung «Schädlingsbekämpfung (trägt der Vermieter)» bzw. «Wartung der Feuerlöscher und Brandschutzeinrichtungen (trägt der Vermieter)», also auch dort ohne Begründung (P-3). Screenshots `04-kategorien.png`, `10-liste-nicht.png`, `09-edit-schaedl.png`, `09-edit-feuer.png`.

## Verwirrung

- «Umlagefähig: Die Kosten fliessen in die Nebenkostenabrechnung.» Der Hilfetext sagt richtig, dass der Mieter nur zahlt, was der Mietvertrag nennt. Die Option klingt dagegen bedingungslos. Ob Dwello prüft, was im Mietvertrag vereinbart ist, erfahre ich hier nicht.
- «Wartung»: beim Lift umlagefähig, bei den Feuerlöschern nicht. Ohne Erklärung wirkt das willkürlich.
- «Steuern» im Hilfetext: Gemeint ist offenbar die Liegenschaftssteuer. Öffentliche Abgaben aus dem Gebrauch (Abwasser-, Kehrichtgebühren) sind nach Art. 257b Abs. 1 OR aber zulässig. Ein Laie könnte «Gebühren» und «Steuern» verwechseln.
- «Vorschlag der KI»: Ist das eine Empfehlung oder schon eine Entscheidung? Die Option wird ja gleich angewählt.

## Fehlerrisiken

- Ein Vermieter erfasst «Gebäudeversicherung» oder «Liegenschaftssteuer» neu, lässt die KI prüfen, sieht «Umlagefähig» mit Gesetzesartikel und speichert. Die Kosten gehen in die Abrechnung, der Mieter kann sie zurückfordern, und Dwello hat dafür eine scheinbar juristische Begründung geliefert.
- Doppelte Kategorien («Feuerlöscher-Wartung» nicht umlagefähig und «Feuerlöscher-Wartung Haus B» umlagefähig) führen zu widersprüchlichen Abrechnungen.
- Datenschutz: Bindet ein Betreiber ein externes Modell an, ist die Datenschutzerklärung falsch, und der Vermieter als Verantwortlicher informiert seine Mieter unrichtig.

## Vorschläge

- **P-1 (Major).** Reproduktion: Einstellungen → Kategorien → «Kategorie erfassen» → Name «Gebäudeversicherung Weber» → «Von der KI prüfen lassen». Ergebnis «Vorschlag der KI: Umlagefähig – Laufende Betriebskosten aus dem Gebrauch der Mietsache (Art. 257b Abs. 1 OR).» Dasselbe mit «Liegenschaftssteuer», «Regenwassergebühr», «Xyzq». Hilfreich wäre:
  1. Prüfen Sie mit dem echten Sprachmodell, ob dieses Verhalten bleibt. In der Persona-App wirkt die Antwort vorgefertigt.
  2. Die Regeln aus dem Hilfetext (Gebäudeversicherung, Steuern, Reparaturen, wertabhängige Grundgebühren, Regenwasser) sollten Vorrang vor dem Modell haben oder ihm mitgegeben werden.
  3. Bei unklaren Namen sollte die KI «nicht sicher» melden statt «Umlagefähig» mit Gesetzesstelle.
  4. Ein Name, der einer bestehenden nicht umlagefähigen Kategorie entspricht, sollte nicht das Gegenteil vorschlagen.
- **P-2 (Minor).** Reproduktion: wie P-1. Der Kasten wählt die Option ohne weiteres Zutun. Vorschlag: im Kasten ein Satz wie «Prüfen Sie den Vorschlag. Der Mieter bezahlt die Kosten nur, wenn der Mietvertrag sie als Nebenkosten nennt.» Bei umstrittenen Kostenarten (Wartungsabos) sollte die KI das sagen. Die Option sollte erst auf Klick übernommen werden, z. B. mit «Vorschlag übernehmen».
- **P-3 (Minor).** Reproduktion: Einstellungen → Kategorien. Bei «Schädlingsbekämpfung» und «Feuerlöscher-Wartung» steht nur «Nicht umlagefähig». Vorschlag: den Grund in der Beschreibung dieser Standard-Kategorien nennen und in der Liste anzeigen, z. B. «Wartungsabos sind rechtlich umstritten; Dwello rechnet sie vorsichtshalber nicht ab» bzw. «Schädlingsbekämpfung ist Unterhalt der Liegenschaft». Den Hilfetext ergänzen: «Wartung» gilt sicher nur bei Heizung (Art. 5 VMWG), Lift und Hauswart.
- **P-4 (Minor).** Reproduktion: /privacy, Abschnitt «Weitergabe an Dritte», erster Absatz. Vorschlag: nennen, welche Angaben das Modell erhält (z. B. «Text und Beträge der Rechnung, Rechnungssteller; bei der Prüfung Name und Beschreibung der Kategorie»). «Läuft auf dem Server des Betreibers» nur dann so absolut formulieren, wenn die Installation ein externes Modell ausschliesst. Sonst den Anbieter nennen wie bei CARTO und OpenPLZ.
- **P-5 (Nit).** Reproduktion: Hilfetext und KI-Begründung vergleichen. Vorschlag: einheitlich «Abs.» (oder überall «Absatz»), Kehricht bei den wertabhängigen Grundgebühren ergänzen und bei «Reparaturen, Erneuerungen» für Heizungen Art. 6 VMWG nennen.

## Nicht geprüft

- **Echtes Sprachmodell:** Die KI antwortete bei allen elf Namen in 3,7 bis 3,8 Sekunden mit nur zwei Begründungen im Wortlaut. Offenbar läuft in der Persona-App ein Stellvertreter, der auf Wörter wie «Reparatur» oder «Sanierung» reagiert. Ob ein echtes Modell P-1 ebenso zeigt, konnte ich nicht prüfen. Die Darstellung (P-2) gilt unabhängig davon.
- **KI-Kategorisierung von Rechnungen:** Nicht ausgelöst, weil die Aufgabe nur das Ansehen erlaubt.
- **KI-Prüfung im Bearbeiten-Formular bestehender Kategorien:** Nicht ausgelöst.
- **Wo das Sprachmodell tatsächlich läuft (Datenschutzaussage):** Als Nutzer nicht überprüfbar.
- **Speichern einer Kategorie und deren Wirkung auf Abrechnungen:** Laut Aufgabe nicht speichern.
- **Übersetzungen (fr/it/en) des Hilfetexts und der Datenschutzerklärung:** Nicht Teil der Aufgabe.
