<!-- Persona run J1 on 87ac838; screenshots stayed in the session's scratchpad -->

# Persona-Test J1: Anna, 29 – Kündigung erfassen, Kündigung aufheben, früheren Mietvertrag verstehen

**Persona:** Anna, 29, vermietet zum ersten Mal, öffnet Dwello nach Monaten wieder, ordnungsliebend, will jedes Wort verstehen. Fenster 1024 × 768 (Kit mit `viewport: 'desktop'` geöffnet, danach mit `page.setViewportSize` auf 1024 × 768 gesetzt). Heute: Montag, 12.10.2026. Nur Gebäude «Musterhaus Zentrum».

**Aufgaben:**

1. «Pierre Dubois (Wohnung 2.01) hat mir heute geschrieben: Er kündigt auf den 31.03.2027. Tragen Sie das ein.»
2. «Zwei Wochen später ruft er an: Er bleibt doch. Machen Sie die Kündigung rückgängig.»
3. «In der Wohnung 1.01 wohnte früher Kevin Fischer. Was für ein Vertrag war das, und wie ist er geendet?»

**Geänderte Daten:**

- Mietvertrag Pierre Dubois (Wohnung 2.01, Musterhaus Zentrum): über «Beenden» gekündigt auf den 31.03.2027, danach über «Bearbeiten» → «Kündigung aufheben» wieder unbefristet gespeichert. Endzustand wie vorher (01.01.2023, unbefristet, CHF 1’650.00; nur der Änderungszeitpunkt ist neu). Nach dem Neuladen: Liste «seit 01.01.2023, unbefristet», Detail «Vertragsende Unbefristet», Knopf «Beenden» wieder da.
- Dialog «Mietvertrag löschen?» bei Pierre Dubois zur Kontrolle geöffnet und mit «Abbrechen» geschlossen, nichts gelöscht.
- Mietvertrag Kevin Fischer (Wohnung 1.01): nur angesehen, Formular «Bearbeiten» geöffnet, nicht gespeichert.
- Keine Nebenkostenabrechnung gelöscht, erstellt oder geändert.

## Aufgabe geschafft

- **Aufgabe 1: Ja.** Über «Beenden» mit Datum 31.03.2027. Die Hilfe im Dialog («also der Kündigungstermin») bestätigt, dass «Beenden» der richtige Weg ist. Danach steht im Vertrag «Unbefristet, gekündigt auf den 31.03.2027». In der Liste «Mietverträge» steht derselbe Vertrag aber als «01.01.2023 – 31.03.2027, befristet» (M1).
- **Aufgabe 2: Ja, ohne Umweg.** Anna findet «Kündigung aufheben» im Formular «Bearbeiten» unter «Vertragsdauer», wählt es und speichert. Rund eine Minute. Sie hat nichts anderes zuerst versucht: Löschen kam für sie nicht in Frage («dann ist ja alles weg»), und eine reine Option «Unbefristet» gibt es in diesem Zustand nicht. Die Folge («Der Mietvertrag läuft dann ohne Ende weiter.») versteht sie.
- **Aufgabe 3: Antwort gefunden, aber falsch verstanden.** Anna schliesst: «Das war ein befristeter Mietvertrag, er ist am 28.02.2021 einfach ausgelaufen, ohne Kündigung.» Dwello sagt das an drei Stellen so («befristet», «Befristet bis 28.02.2021», im Formular «Der Mietvertrag endet an einem festen Tag, ohne Kündigung»). Dass die Daten aus der Zeit stammen, als Dwello Kündigung und Befristung nicht unterschied, ist nirgends erkennbar (M2).

## Aufwand

- Aufgabe 1: «Mietverträge» → Pierre Dubois → «Beenden» → Datum tippen → «Mietvertrag beenden». 4 Klicks plus Tippen, rund 1 Minute (davon die Hälfte Lesen der Hilfe im Dialog).
- Aufgabe 2: Vertrag öffnen → Suche nach «Kündigung» auf der Seite (nichts) → «Bearbeiten» → nach unten scrollen bis «Vertragsdauer» (liegt bei 768 px unter dem Fensterrand) → «Kündigung aufheben» → «Änderungen speichern». 3 Klicks, 1 Mal scrollen, rund 1 Minute.
- Aufgabe 3: «Wohnungen» → «Wohnung 1.01» → «Mietvertrag von Kevin Fischer» → zur Sicherheit «Bearbeiten» angesehen, wo «befristet» erklärt wird → «Abbrechen». 4 Klicks, rund 2 Minuten. Zusätzlich die Mieterseite von Kevin Fischer und die Hilfe angesehen.
- Gesamt rund 15 Aktionen, etwa 5 Minuten.

## Laut gedacht

1. *Übersicht.* Pierre ist ein Mietvertrags-Thema, also links «Mietverträge». Elf Verträge, Pierre Dubois, Wohnung 2.01, «seit 01.01.2023, unbefristet». Draufklicken.
2. *Vertragsseite.* Drei Knöpfe: «Bearbeiten», «Beenden», «Löschen». «Kündigung» steht nirgends. «Beenden» klingt nach «jetzt sofort Schluss», das will ich nicht, der Vertrag läuft ja noch bis März. Ich probiere es trotzdem, es ist ja ein Dialog.
3. *Dialog «Mietvertrag beenden?».* «Der letzte Tag des Mietverhältnisses, also der Kündigungstermin. Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht.» Gut, genau das. Darunter der Hinweis zur Kündigungsfrist von mindestens 3 Monaten: Pierre kündigt heute auf Ende März, das sind über 5 Monate, passt. Ich tippe 31.03.2027, darunter erscheint «Mittwoch, 31. März 2027». Kein Kästchen, keine Warnung, weil das Datum in der Zukunft liegt. «Mietvertrag beenden».
4. *Zurück im Vertrag.* Meldung unten rechts: «Der Mietvertrag von Pierre Dubois endet am 31.03.2027». Bei «Vertragsdauer» steht weiterhin grün «Laufend» und «Unbefristet, gekündigt auf den 31.03.2027». Das verstehe ich: unbefristeter Vertrag, aber gekündigt. Schön, dass beides dasteht. Der Knopf «Beenden» ist weg, logisch.
5. *Kontrolle in der Liste.* Bei Pierre steht jetzt «01.01.2023 – 31.03.2027, befristet». Moment, befristet? Im Vertrag stand gerade «unbefristet, gekündigt». Habe ich etwas falsch gemacht und den Vertrag in einen befristeten verwandelt? Bei einem befristeten Vertrag braucht es doch keine Kündigung … Ich gehe nochmals in den Vertrag: dort wieder «Unbefristet, gekündigt». Ich glaube der Detailseite, bin aber verunsichert.
6. *Aufgabe 2.* Pierre bleibt. Auf der Vertragsseite gibt es nur «Bearbeiten» und «Löschen». Löschen ist sicher falsch, dann wäre der ganze Vertrag weg. Also «Bearbeiten». Oben gelber Kasten «Laufender Mietvertrag: Änderungen … gelten sofort», dann Mieter und Wohnung. Die Vertragsdauer sehe ich erst nach dem Scrollen.
7. *«Vertragsdauer».* Drei Möglichkeiten: «Unbefristet, gekündigt auf den 31.03.2027» (gewählt), «Kündigung aufheben – Der Mietvertrag läuft dann ohne Ende weiter.», «Befristet – Der Mietvertrag endet an einem festen Tag, ohne Kündigung.» Das ist genau meine Aufgabe, ich muss nicht raten. Ich wähle «Kündigung aufheben», das Feld «Vertragsende» verschwindet. Kurz zögere ich, weil die erste Möglichkeit immer noch «gekündigt auf den 31.03.2027» heisst, aber das ist ja der alte Stand.
8. *«Änderungen speichern».* «Mietvertrag von Pierre Dubois gespeichert», Vertragsende «Unbefristet», «Beenden» wieder da, in der Liste «seit 01.01.2023, unbefristet». Erledigt. Die Meldung hätte ruhig sagen dürfen «Kündigung aufgehoben», ich habe zur Sicherheit die Liste nochmals angeschaut.
9. *(Zur Kontrolle, nicht Annas erste Wahl:)* «Löschen» bei Pierre öffnet «Mietvertrag löschen?» mit «Ein Mietvertrag, der begonnen hat, kann nicht gelöscht werden … Ist er falsch erfasst, korrigieren Sie ihn unter «Bearbeiten».» Wer hier gelandet wäre, würde also zurückgeschickt. Gut.
10. *Aufgabe 3.* «Wohnungen» → «Wohnung 1.01». Unten «Mietverträge der Wohnung»: Hans Müller laufend, darunter «Mietvertrag von Kevin Fischer, 01.06.2018 – 28.02.2021, befristet, Beendet». Ich öffne ihn: «Vertragsende: Befristet bis 28.02.2021».
11. Was heisst befristet genau? Im Formular «Bearbeiten» steht es: «Befristet – Der Mietvertrag endet an einem festen Tag, ohne Kündigung.» Also: Kevin hatte einen Zeitmietvertrag bis Ende Februar 2021, der einfach ausgelaufen ist. Niemand hat gekündigt. Passt auch dazu, dass er auf der Mieterseite seit 01.05.2021 in Wohnung OG1 im Alpenblick wohnt: Vertrag lief aus, er ist umgezogen.
12. In der Hilfe finde ich zu «befristet» oder «Kündigung» nichts. Meine Antwort an mich selbst: «Befristeter Vertrag, regulär am 28.02.2021 abgelaufen.» Ich bin mir sicher. (Laut Aufgabenstellung stimmt das so nicht: Der Vertrag wurde erfasst, bevor Dwello Kündigung und Befristung unterschied. Anna hat keine Chance, das zu merken.)

**Findet Anna «Kündigung aufheben»?** Ja, beim ersten Versuch, über «Bearbeiten», nach einmal Scrollen; rund eine Minute. Sie hat weder Löschen noch «Unbefristet» zuerst versucht (eine reine Option «Unbefristet» wird in diesem Zustand gar nicht angeboten). Die Folge versteht sie. Gesucht hat sie das Wort zuerst auf der Vertragsseite selbst, wo es fehlt.

**Versteht Anna den alten Vertrag?** Nein. Sie schliesst sicher und falsch auf einen befristeten Vertrag ohne Kündigung. Die Erklärung im Formular verstärkt den Irrtum.

## Befunde

### Blocker

Keine.

### Major

| # | Bildschirm | Beobachtung | Vorschlag |
|---|---|---|---|
| M1 | Liste «Mietverträge», Zeile Pierre Dubois nach der Kündigung | Die Zeile zeigt «Laufend · 01.01.2023 – 31.03.2027, befristet», die Vertragsseite gleichzeitig «Unbefristet, gekündigt auf den 31.03.2027». Die Liste behauptet etwas Falsches über die Vertragsart; Anna fürchtet, sie habe den Vertrag in einen befristeten verwandelt. (Wohnungs- und Mieterseite im gekündigten Zustand nicht geprüft; sie nutzen dieselbe Zeilenform «… , befristet» und sind vermutlich gleich betroffen.) | Überall denselben Text wie auf der Vertragsseite: «01.01.2023 – 31.03.2027, gekündigt» bzw. «unbefristet, gekündigt auf den 31.03.2027». Eine gemeinsame Formatierungsfunktion für Liste, Wohnung, Mieter und Detail. |
| M2 | Mietvertrag Kevin Fischer (Wohnung 1.01), auch Wohnung 1.01 und Mieter Kevin Fischer | Altvertrag erscheint als «01.06.2018 – 28.02.2021, befristet» und «Vertragsende: Befristet bis 28.02.2021»; im Formular erklärt «Befristet – Der Mietvertrag endet an einem festen Tag, ohne Kündigung.» Anna schliesst sicher, es sei ein Zeitmietvertrag ohne Kündigung gewesen. Dass Dwello die Art des Endes für diesen Vertrag gar nicht kennt, ist nirgends sichtbar. Falsche Auskunft, die Anna z. B. bei einer Auskunft an Kevin oder einer Wiedervermietung weitergeben würde. | Altdaten ohne Unterscheidung nicht als «befristet» anzeigen, sondern neutral: «01.06.2018 – 28.02.2021, beendet» und im Detail «Vertragsende 28.02.2021 (ob befristet oder gekündigt, ist nicht erfasst)». Optional beim Bearbeiten nachfragen lassen. Begriff und Umgang in `offene-punkte.md` fachlich klären lassen. |

### Minor

| # | Bildschirm | Beobachtung | Vorschlag |
|---|---|---|---|
| m1 | Mietvertrag Pierre Dubois, gekündigt | Auf der Vertragsseite steht «Unbefristet, gekündigt auf den 31.03.2027», aber keine Handlung dazu; «Beenden» ist weg, nur «Bearbeiten» und «Löschen» bleiben. Anna sucht «Kündigung aufheben» zuerst hier. Im Formular liegt «Vertragsdauer» bei 1024 × 768 unter dem Fensterrand. | Auf der Vertragsseite im gekündigten Zustand einen Knopf «Kündigung aufheben» (mit Bestätigung «Der Mietvertrag läuft dann ohne Ende weiter.») oder einen Link «Kündigung ändern oder aufheben», der direkt zur Vertragsdauer im Formular springt. |
| m2 | Erfolgsmeldung nach «Kündigung aufheben» | «Mietvertrag von Pierre Dubois gespeichert» – sagt nicht, dass die Kündigung aufgehoben ist; Anna kontrolliert zur Sicherheit in der Liste. Beim Kündigen hiess es präzise «Der Mietvertrag von Pierre Dubois endet am 31.03.2027». | «Die Kündigung von Pierre Dubois ist aufgehoben. Der Mietvertrag läuft unbefristet weiter.» |
| m3 | Vertragsseite, Knopf «Beenden» und Dialogtitel «Mietvertrag beenden?» | Für eine Kündigung auf einen Termin in fünf Monaten klingt «Beenden» nach «sofort Schluss»; Anna zögert. Erst die Hilfe im Dialog («also der Kündigungstermin») klärt es. | Knopf «Kündigung erfassen» oder «Beenden (Kündigung)»; Titel «Mietvertrag kündigen oder beenden». Begriff mit `UBIQUITOUS_LANGUAGE.md` abgleichen, sonst `TODO(fachlich prüfen)`. |
| m4 | Formular «Bearbeiten», Vertragsdauer nach Wahl von «Kündigung aufheben» | Die erste Möglichkeit heisst weiter «Unbefristet, gekündigt auf den 31.03.2027»; wer «Unbefristet» sucht, liest das erste Wort und glaubt, das sei schon gewählt. | Erste Möglichkeit umbenennen: «Gekündigt auf den 31.03.2027 (bleibt so)». |
| m5 | Vertragsseite nach dem Beenden, 1024 × 768 | Die Erfolgsmeldung liegt über der Karte «Miete pro Monat» und verdeckt Akonto und Nettomiete. | Meldung oben im Inhaltsbereich oder schmaler am unteren Rand, ohne Karten zu verdecken. |
| m6 | Hilfe | Weder «befristet» noch «Kündigung» werden erklärt; Anna findet keine zweite Quelle für ihre Frage. | Kurzer Abschnitt «Unbefristet, gekündigt, befristet: Was ist der Unterschied?». |

## Was gut ist

- Der Dialog «Mietvertrag beenden?» erklärt das Feld als Kündigungstermin und dass der Vertrag bis und mit diesem Tag läuft, auch bei früherem Auszug. Der Hinweis auf die Kündigungsfrist von mindestens 3 Monaten hilft Anna, Pierres Kündigung zu prüfen.
- Der Wochentag unter dem Datum («Mittwoch, 31. März 2027») bestätigt die Eingabe.
- Die Vertragsseite unterscheidet sauber: grün «Laufend» plus «Unbefristet, gekündigt auf den 31.03.2027».
- «Kündigung aufheben» ist ein eigener, klar beschriebener Punkt unter «Vertragsdauer» («Der Mietvertrag läuft dann ohne Ende weiter.»). Anna musste nicht über «Unbefristet» oder Löschen raten.
- Der Löschen-Dialog schickt bei einem begonnenen Vertrag zu «Bearbeiten», statt etwas zu löschen.
- Nach dem Aufheben ist alles wieder konsistent: Liste, Vertragsseite, Knopf «Beenden», Wohnung 2.01 «Vermietet».
- Die Wohnung zeigt ihre Vertragsgeschichte («Mietverträge der Wohnung»), so findet Anna den früheren Mieter in zwei Klicks.

## Vergleich zu I4

| I4 | Jetzt (J1) |
|---|---|
| m1: Dialog «Mietvertrag beenden?» bei 768 px zu hoch, Knöpfe angeschnitten | **Besser bei Datum in der Zukunft:** ohne Kästchen und Ablehnung passt der Dialog ganz ins Fenster (Knöpfe bei rund 580 px). Mit vergangenem Datum nicht erneut geprüft. |
| m7: Gekündigte/beendete Verträge und Vertragsart | Neu geprüft: Die Unterscheidung «unbefristet, gekündigt» gibt es jetzt auf der Vertragsseite und im Formular, aber nicht in der Liste (M1); Altverträge erscheinen als «befristet» (M2). |
| M1, M2, m2, m3 (Vertragsbeginn-Ablehnung), m4 (Filter Abrechnungen), m6, m8 | Nicht geprüft; in dieser Runde wurde kein Vertragsbeginn geändert und kein vergangenes Vertragsende gesetzt. |
| – | **Neu geprüft:** Kündigung erfassen und aufheben. Beides gelingt beim ersten Versuch; die Aufhebung ist nur über «Bearbeiten» erreichbar (m1) und wird nicht als solche bestätigt (m2). |
