# Dr. Weber, Slice 1148: Aufhebungsvereinbarung erfassen

Desktop 1440 × 900, Maus, Persona-App auf :3300 (Demodaten), heute 08.11.2026. Gespeichert habe ich nur in «Seepark Residenz» (Mietvertrag Thomas Weber, Wohnung A1).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Enddatum erfassen» | «Kündigung» ist vorausgewählt. Wer die Texte nicht liest, speichert eine Aufhebungsvereinbarung als Kündigung. Die Hinweise zur Aufhebung erscheinen erst, wenn man die Auswahl ändert. |
| P-2 | Minor | Vertragsseite, Mietvertragsliste, Mieterseite, Bearbeiten | Für dieselbe Sache gibt es drei Wörter: im Dialog «Aufhebungsvereinbarung», auf der Vertragsseite und in Bearbeiten «Unbefristet, beendet auf den 30.09.2026», in der Liste und auf der Mieterseite «einvernehmlich». Die Vertragsseite nennt die Aufhebungsvereinbarung nirgends. Dass «beendet» die Aufhebung meint und «gekündigt» die Kündigung, sehe ich erst in Bearbeiten an der Hilfe unter den Optionen. |
| P-3 | Minor | Vertragsseite «Nächste Schritte», Übersicht | Die Seiten setzen das Vertragsende mit dem Auszug gleich: «Auszug von Thomas Weber am 30.09.2026» und «Thomas Weber ist ausgezogen». Der Dialog sagt aber ausdrücklich: «Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht.» Im Export steht ausserdem `"movedOut": false`. Die App behauptet also einen Auszug, den ich nie erfasst habe, und widerspricht sich dabei selbst. |
| P-4 | Minor | Übersicht «Nachmieter für Wohnung A1 suchen» | «Der Mietvertrag von Thomas Weber endet am 30.09.2026.» Heute ist der 08.11.2026, der Vertrag ist also schon zu Ende («endete»). Die Kachel «Gebäude auf einen Blick» sagt richtig «Wohnung A1 leer seit 01.10.2026». |
| P-5 | Minor | Bearbeiten, Vertragsdauer | Wechsle ich hier von «beendet auf den» zu «gekündigt auf den», kommt weder das Feld «Kündigung erhalten am» noch einer der Hinweise aus dem Dialog (amtliches Formular, Familienwohnung, Frist von 3 Monaten, Nichtigkeit). Ohne jede Warnung lässt sich die Art des Vertragsendes umschreiben. (Ich habe nur umgeschaltet, nicht gespeichert.) |
| P-6 | Minor | Export «Daten exportieren» (daten.json) | Der Export beschreibt das Ende sachlich richtig: `endDate 2026-09-30`, `terminated false`, `byAgreement true`, `noticeReceivedOn null`. Für den Mieter, der die Datei nach Art. 28 DSG bekommt, steht dort aber «terminated: false» neben einem Enddatum. Ohne Erklärung liest sich das wie «nicht beendet». Die Feldnamen sind englisch, und der ZIP enthält keine Erläuterung dazu. |

## Beobachtungen

- Die Texte im Dialog sind rechtlich sauber und weitgehend vollständig:
  - Bei der Aufhebung wird die Unterschrift von mir und allen Mietern verlangt, bei einer Familienwohnung die ausdrückliche Zustimmung des Ehegatten oder eingetragenen Partners. Es gilt «ohne Kündigung und ohne Kündigungsfrist».
  - Bei der Kündigung stimmen die Hinweise zu Form, amtlichem Formular, separater Zustellung an beide Ehegatten, Nichtigkeit (Art. 266l bis 266o OR), Mindestfrist von 3 Monaten und Verschiebung auf den nächsten Kündigungstermin.
  - Den Tag danach beschreiben beide Arten: «Ein neuer Mietvertrag kann am Tag danach beginnen.» Bei einem Datum in der Vergangenheit kommt dazu: «Seit dem 01.10.2026 gilt die Wohnung als nicht vermietet … Die Nebenkosten dieser Zeit trägt der Vermieter, das Akonto des Mieters zählt nur bis zum Vertragsende.» Das finde ich gut.
- Wählt man «Aufhebungsvereinbarung», verschwinden «Kündigung erhalten am» und der Hinweis zur Frist. Das ist richtig so.
- Was fehlt mir als vorsichtigem Vermieter zum Tag danach? Nichts zur Wohnungsrückgabe und Abnahme, zur Mängelrüge (Art. 267a OR) und zur Mietkaution. Das ist kein Fehler, aber eine Lücke.
- Der Text zum verstorbenen Mieter steht auch bei der Aufhebung: «Erfassen Sie das Vertragsende erst, wenn die Erben oder Sie gekündigt haben.» Eine Aufhebungsvereinbarung mit den Erben wäre ebenso möglich. Der Satz schliesst sie scheinbar aus.
- Die Anrede wechselt: im Aufhebungstext «Mieter und Vermieter beenden …», direkt danach «unterschrieben von Ihnen». Im Bestätigungstext steht «trägt der Vermieter», sonst überall «Sie».
- Für ein Vertragsende in der Vergangenheit verlangt der Dialog eine Bestätigung mit Kästchen. Ohne das Kästchen wurde nichts gesendet, und die Meldung war verständlich.
- In Bearbeiten stehen die Hilfetexte im Präsens («endet mit der Aufhebungsvereinbarung»), obwohl das Ende vorbei ist. Der Text zu «Aufhebungsvereinbarung zurücknehmen» ist korrekt: Zurücknehmen geht nur gemeinsam.
- Im Export sind die Kategorien englisch («Hot Water», «Caretaker»), obwohl die Sprache des Mieters Deutsch ist.
- Die Übersicht nennt für Seepark Residenz drei fehlende Jahre (2023, 2022, 2021), die Vertragsseite «2 Abrechnungen fehlen» (2022, 2023). Das hat mit dem Vertragsende nichts zu tun, ich zähle es nicht.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten und 9 Skriptläufe. Gespeichert: ein POST `?/end` mit Antwort 200.

## Ablauf

- **Speichern im Dialog:** Ich habe erwartet, dass «Mietvertrag beenden» direkt speichert. Stattdessen kam die Meldung «Das Vertragsende liegt in der Vergangenheit. Bestätigen Sie das Vertragsende mit dem Kästchen.» Mit Kästchen ging es (Screenshot 08-past.png, 09-confirmed.png).
- **Vertragsseite nach dem Speichern:** Ich habe erwartet, dass das Vertragsende als «Aufhebungsvereinbarung» angezeigt wird. Die Seite zeigt «Vertragsdauer: Beendet», «Vertragsende: Unbefristet, beendet auf den 30.09.2026» und unter «Nächste Schritte» «Auszug von Thomas Weber am 30.09.2026, Schlussabrechnung nach dem 31.12.2026» (10-after.png).
- **Mietvertragsliste:** Ich habe denselben Begriff wie im Dialog erwartet. Dort steht «01.04.2022 – 30.09.2026, einvernehmlich», bei einem anderen Vertrag «gekündigt» (11-list.png).
- **Übersicht:** Ich habe einen Hinweis zum vergangenen Vertragsende erwartet. Dort stehen «Thomas Weber ist ausgezogen …» und «Der Mietvertrag von Thomas Weber endet am 30.09.2026» (13-dashboard.png).
- **Export:** Ich habe einen lesbaren Hinweis zur Art des Endes erwartet. Im ZIP liegen daten.json mit `terminated: false`, `byAgreement: true` und `movedOut: false` und eine Abrechnungs-PDF, aber keine Erklärung der Felder.

## Vorschläge

- **P-1:** Mietvertrag Thomas Weber, «Enddatum erfassen». Die Auswahl steht schon auf «Kündigung». Lassen Sie «Wie endet der Mietvertrag?» ohne Vorauswahl und verlangen Sie eine Wahl, bevor gespeichert wird.
- **P-2:** Aufhebung speichern, dann Vertragsseite, Liste und Mieterseite ansehen. Verwenden Sie überall einen Begriff, etwa «Unbefristet, beendet mit Aufhebungsvereinbarung auf den 30.09.2026», in der Liste «…, Aufhebungsvereinbarung».
- **P-3:** Aufhebung mit Datum in der Vergangenheit speichern, dann Vertragsseite und Übersicht ansehen. Schreiben Sie «Vertragsende am 30.09.2026» statt «Auszug». Den Satz «ist ausgezogen» nur zeigen, wenn ein Auszug erfasst ist, sonst etwa «Der Mietvertrag von Thomas Weber endete am 30.09.2026».
- **P-4:** Übersicht nach einem vergangenen Vertragsende. Die Zeitform nach dem Datum wählen: «endete am» oder «endet am».
- **P-5:** Bearbeiten, Vertragsdauer von «beendet auf den» auf «gekündigt auf den» umschalten. Zeigen Sie dieselben Hinweise und das Feld «Kündigung erhalten am» wie im Dialog, oder verlangen Sie eine Bestätigung, dass eine gültige Kündigung vorliegt.
- **P-6:** Mieterseite, «Daten exportieren», daten.json öffnen. Legen Sie eine kurze Erläuterung der Felder in den ZIP, in der Sprache des Mieters, oder fassen Sie die Art des Endes als ein lesbares Feld zusammen (z.B. `endKind: "Aufhebungsvereinbarung"`).

## Nicht geprüft

- Die Aufhebung mit einem Datum in der Zukunft: Thomas Webers vereinbarter Tag 30.09.2026 liegt vor heute (08.11.2026). Ich habe nur dieses Datum erfasst.
- Die Kündigung habe ich nicht gespeichert, weil sie hier nicht zutrifft. Ihre Texte habe ich nur gelesen.
- In Bearbeiten habe ich nichts gespeichert, nur zwischen den Optionen umgeschaltet.
- Die Abrechnungs-PDF im Export habe ich nicht inhaltlich geprüft. Sie betrifft 2024, nicht das Vertragsende.
