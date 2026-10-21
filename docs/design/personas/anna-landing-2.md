# Anna – Landing Page, Runde 2

Persona: Anna, 29, vermietet zum ersten Mal eine Wohnung und muss bald ihre erste Nebenkostenabrechnung machen. Desktop 1440 × 900, Maus; erster Bildschirm und Abschnitt «Einrichten» zusätzlich auf dem Handy (390 × 844). Seite: `http://localhost:3310/index.html` (statisch). Nichts gespeichert.

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/anna-landing-2/`.

## Befunde (was auf der Landing Page noch geändert werden sollte)

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Einrichten, Link «Anleitung zum Weitergeben (Englisch)» | Die Anleitung ist der einzige Weg zum Start, ist aber nur auf Englisch und liegt auf GitHub. Aus meiner Umgebung antwortet GitHub mit 404 (auch die Startseite des Projekts und die Issues). Was meine Helferin konkret tun muss, sehe ich so nirgends auf Deutsch. |
| P-2 | Major | Ganze Seite, v. a. «Vier Schritte» und Abrechnungsteil | Für meine erste Abrechnung fehlt, was ich selbst bereitlegen muss: Mietvertrag mit den vereinbarten Nebenkosten, was die Mieter im Jahr schon bezahlt haben (Akonto), die Rechnungen des Jahres. Dass die Abrechnung die Vorauszahlungen abzieht, steht nirgends; ich lese nur «zahlt CHF 215.80 nach». |
| P-3 | Minor | Einrichten, Kasten «Heute noch mit Google-Anmeldung» | Unklar, wessen Google-Konto: meines oder das der Helferin? Und wer den «Schlüssel bei Google» besitzt, wenn die Helferin später nicht mehr da ist. |
| P-4 | Minor | Einrichten, Tabs «Eigener PC / Homeserver / Cloud» | Ich weiss nicht, welche Variante ich wählen soll. «Ideal für den Start» steht bei «Eigener PC», aber ob die Helferin dafür an meinen PC kommen muss (auch für Updates), oder ob sie das aus der Ferne kann, sagt die Seite nicht. |
| P-5 | Minor | Einrichten, Terminal-Block | Der schwarze Befehlsblock steht direkt unter dem Text für mich und erschreckt mich. Es fehlt eine Zeile wie «Dieser Teil ist für die Person, die Dwello einrichtet». Auf dem Handy sind die Befehle rechts abgeschnitten (Block scrollt seitlich innen). |
| P-6 | Nit | Navigation, Hero, Abschnitt, Schluss | Derselbe Ort heisst «Einrichten» (Menü), «So kommen Sie zu Dwello» (Hero), «Installieren» (Abschnittsmarke) und «Dwello einrichten lassen» (Schluss). Ich war kurz unsicher, ob das dasselbe ist. |
| P-7 | Minor | Funktionen, Verteilschlüssel, Rechnungen | Fachwörter ohne Erklärung auf der Seite: «Verteilschlüssel», «Heizprofil», «umlagefähig», «Mietstage», «Leistungszeitraum». Die Seite verspricht, dass jedes Feld in der App seinen Begriff erklärt; hier auf der Seite selbst fehlt das. |

## Fragebogen

### A. Erster Eindruck

1. **Was ist Dwello?** Ein kostenloses Programm, das mir als private Vermieterin die Nebenkostenabrechnung macht: Rechnungen hineinziehen, prüfen, mit QR-Rechnung an die Mieter schicken. (Hero)
2. **Für wen, angesprochen? 5/5.** «Ihre Nebenkostenabrechnung, einfacher gemacht» und «für private Vermieterinnen und Vermieter» – das bin genau ich, und die Abrechnung ist gerade mein Problem.
3. **Was als Nächstes?** «So kommen Sie zu Dwello», weil ich wissen will, ob ich das überhaupt hinbekomme. Gleich danach «Demo ansehen». Der kleine Satz unter den Knöpfen («Einrichten muss Dwello jemand, der sich mit Computern auskennt») sagt mir schon im ersten Bildschirm ehrlich, dass ich Hilfe brauche – gut.
4. **Vertrauenswürdig? 4/5.** Ruhig, sauber, echtes App-Bild darunter, «Open Source · Gratis · Für die Schweiz». Ein Punkt Abzug, weil ich nicht sehe, wer dahintersteht (erst ganz unten «© 2026 Roger Rudin» und Impressum).

### B. Verständlichkeit

5. **Texte ohne Nachschlagen? 3/5.** Die Teile für mich (Hero, Vier Schritte, FAQ) verstehe ich. Unklar: «KI liest Ihre Belege auf Ihrem eigenen Rechner», «Ollama», «OpenAI-kompatible KI», «MCP», «Docker Desktop», «NAS», «SSH», «Domain mit HTTPS», «Caddy», «Tailscale», «AGPL», «Verteilschlüssel», «Heizprofil», «umlagefähig», «Leistungszeitraum». Bei den Technikwörtern beruhigt mich, dass sie für die Helferin sind; die Fachwörter der Abrechnung aber sind für mich und bleiben unerklärt (P-7).
6. **Heute vs. geplant? 5/5.** Grüne Marke «Verfügbar», gestrichelte «Geplant», Legende darüber, MCP klar als «Geplant · MCP» und «Erfundenes Beispiel» markiert, Roadmap mit Issue-Nummern. Das ist eindeutig.
7. **Bilder zeigen die Arbeit? 4/5.** Übersicht mit «Als Nächstes zu tun», der Dialog «Rechnungen hochladen» mit dem gelben «Bitte prüfen», die Abrechnung von Hans Müller und der QR-Zahlteil zeigen genau, was mich erwartet. Die Bilder sind klein und die Schrift darin auf dem Desktop knapp lesbar.

### C. Nutzen und Bedenken

8. **Welches Problem gelöst?** Ich muss nicht selbst in Excel ausrechnen, wie viel Lift oder Heizung auf meine Wohnung fällt, und bekomme ein PDF mit QR-Rechnung, das jede Zahl erklärt. **Nicht gelöst/erwartet:** eine Liste, was ich für die erste Abrechnung brauche, und wie die Vorauszahlungen der Mieter verrechnet werden (P-2).
9. **Was überzeugt am meisten?** «Eine Abrechnung, die jede Zahl erklärt» mit dem konkreten Beispiel Hans Müller (CHF 215.80 Nachzahlung), und der Satz «Was sie nicht sicher weiss, zeigt Dwello als Hinweis. Erst wenn Sie bestätigen, wird die Rechnung erstellt.»
10. **Bedenken?** Kosten: beantwortet (FAQ «Kostet Dwello wirklich nichts?»: nur Server/Strom, Porto, ggf. externe KI). Datenschutz: beantwortet (Abschnitt Datenschutz, «Verantwortlich für die Daten Ihrer Mieter bleiben Sie»). Rechtssicherheit: ehrlich beantwortet (FAQ, Hauseigentümerverband, Schlichtungsbehörde; Art. 257a OR). Installation und Hilfe: teilweise – wer es macht, ist klar, aber die Anleitung ist englisch und für mich nicht erreichbar (P-1); offen bleibt, was passiert, wenn meine Helferin nicht mehr verfügbar ist, und an wen ich mich bei Problemen wende ausser «Fehler melden» auf GitHub.
11. **Glaube ich Datenschutz und «gratis»? 4/5.** Die Vergleichstabelle und «Wir erfahren nicht, dass Sie Dwello nutzen» wirken glaubwürdig, und die Seite selbst lädt nichts von fremden Servern. Dass ich mich trotzdem bei Google anmelden muss, passt für mich nicht ganz zu «nichts geht an uns» – ehrlich gesagt wird es aber im gelben Kasten.

### D. Weg zum Start

12. **Weiss ich, wie anfangen? 4/5.** So habe ich es verstanden: (1) Demo ansehen. (2) Jemanden fragen, der sich mit Computern auskennt (Familie, Bekannte, IT-Dienst), und dieser Person die Anleitung geben; sie braucht rund eine Stunde und richtet Dwello auf meinem PC ein, mit meinem (?) Google-Konto. (3) Ich arbeite danach nur im Browser: Gebäude per Adresse erfassen, Wohnungen, Mieter, Mietverträge. (4) Rechnungen hochladen. (5) Abrechnung erstellen, prüfen, versenden. (6) Die Helferin macht ab und zu Updates und Datensicherungen. – Wer was macht, ist jetzt klar. Abzug, weil ich die Anleitung nicht öffnen kann, nicht weiss, welche Variante (PC/NAS/Cloud) ich nehmen soll (P-4), und nicht weiss, was ich selbst bereitlegen muss (P-2).
13. **Installation selbst?** Nein. Ab «git clone» und «docker compose» verstehe ich nichts. Ich würde meinen Cousin fragen, der in der Informatik arbeitet. Die Seite sagt mir genau das, das finde ich gut. Der Satz «Updates und Datensicherungen macht diese Person ab und zu» heisst aber, dass ich ihn auf Dauer brauche; wie oft «ab und zu» ist, steht nicht da.
14. **Gefunden, was gesucht? 4/5.** Navigation oben (Desktop) und «Menü» auf dem Handy mit Sprachen und Impressum, Impressum und Datenschutzerklärung im Fuss. Abzug für die vier Namen desselben Abschnitts (P-6) und weil der wichtigste Link (Anleitung) nach GitHub führt, das für mich nicht lädt.

### E. Bedienung und Darstellung

15. **Lesbar und bedienbar? 4/5.** Grosse Schrift, guter Kontrast, grosse Knöpfe; auf dem Handy kein seitliches Scrollen der Seite, Hero passt mit beiden Knöpfen in den ersten Bildschirm. Abzug: Text in den App-Bildschirmfotos sehr klein; auf dem Handy ist der Befehlsblock rechts abgeschnitten (P-5).
16. **Länge?** Zu lang für mich: auf dem Desktop rund 16 000 Pixel, auf dem Handy rund 26 000. Richtig gelesen habe ich bis «Vier Schritte» und die Abrechnung; die Funktionskacheln (WCAG, Mobile first, axe) und Open-Source-Teil habe ich überflogen, weil sie nicht für mich sind. Den Abschnitt Einrichten und die FAQ habe ich gezielt angesprungen.

### F. Gesamturteil

17. **Ausprobieren? 4/5.** Ja, zuerst die Demo, dann mit meinem Cousin einrichten. Kostenlos und auf meine Abrechnung zugeschnitten. Abzug, weil der Start von einer zweiten Person abhängt.
18. **Empfehlen? 4/5.** Einer Bekannten mit einer Wohnung und jemandem mit IT-Kenntnissen in der Nähe: ja. Ohne so jemanden: nein, und das sagt die Seite auch ehrlich.
19. **Erste Änderung:** Im Abschnitt Einrichten auf Deutsch eine kurze Checkliste «Was Sie vorbereiten» (Helferin, Google-Konto, PC, Mietverträge mit Nebenkosten, Akontozahlungen, Rechnungen des Jahres) und die Anleitung auch auf Deutsch.

### Zusatz: Wirkung, Bilder und Animationen

20. **Warm oder kühl? 3/5.** Freundlich und ruhig durch die direkte Anrede («Sie entscheiden», «Die nächste Abrechnung machen Sie mit Dwello») und die Strichzeichnung Haus → Abrechnung → Mieterin. Kühl wirken der schwarze Terminal-Block, die Tabelle «Typisches Abo» und die Technikkacheln (WCAG, axe, 48 Pixel).
21. **Bilder?** Die App-Bilder reichen mir, um zu verstehen, was ich tue. Hilfreich wäre ein Bild einer Vermieterin am Küchentisch mit dem Ordner voller Rechnungen, oder Mieter, die die QR-Rechnung mit dem Handy bezahlen. Nicht helfen würden Stockfotos von lachenden Leuten oder Hochhäusern.
22. **Animation, die erklärt?** «Rechnungen per Drag & Drop»: eine Rechnung, die hineingezogen wird, und die Felder füllen sich. «Gerecht verteilt, auch im Winter»: der Liftbetrag CHF 1'690.00, der sich auf sechs Wohnungen aufteilt. «Vier Schritte»: die Pfeile vom Haus zur Mieterin nacheinander.
23. **Wo stört Bewegung?** Im Hero, beim Lesen langer Texte (Datenschutz, FAQ) und beim Befehlsblock. Auf dem Handy ist die Seite schon sehr lang; Animationen, die beim Scrollen erst erscheinen, würden mich bremsen.
24. **Drei Ideen für mehr Wärme:** (1) Ein kurzes Zitat oder eine kleine Geschichte einer Vermieterin («Meine erste Abrechnung hat einen Abend gedauert»). (2) Den Einrichtungsteil als Gespräch zwischen mir und meiner Helferin darstellen («Das machen Sie / Das macht Ihre Helferin»), den Terminal-Block zuklappbar. (3) Technikkacheln (WCAG, axe, Pixel) in Alltagssprache umschreiben: «Gut lesbar, auch mit Brille und auf dem Handy».

## Beobachtungen

- Die Seite lädt nur von `localhost:3310`, keine fremden Server (Netzwerkanfragen beim Laden geprüft). Passt zu «Kein Tracking».
- Der FAQ-Punkt «Brauche ich technische Kenntnisse?» ist offen, die anderen sind zugeklappt; alle Antworten sind kurz und verständlich.
- Hinter «Was passiert, wenn die KI eine Rechnung falsch liest?» steht genau das, was ich wissen wollte; die Antwort könnte auch im Hero-Umfeld stehen.
- Im Hero-Bild der Übersicht steht «Noch nicht abgerechnet: Alpenblick (2025, 2023, 2022, 2021) …» – für mich sieht das nach viel Rückstand aus, eher abschreckend als einladend.
- Abschnitt «Gebäude erfassen in zwei Minuten» mit dem Gebäuderegister ist für mich als Anfängerin ein starkes Argument: ich muss Flächen nicht suchen.
- Die Handy-Navigation «Menü» öffnet eine Liste mit allen Abschnitten, Impressum und den Sprachen; «Einrichten» springt richtig zum Abschnitt.

## Aufgabe geschafft: teilweise

Ich weiss, dass Dwello mir bei der ersten Nebenkostenabrechnung hilft und wer was macht (Helferin richtet ein und pflegt, ich arbeite im Browser). Den eigentlichen Start konnte ich nicht nachvollziehen: Die Anleitung (GitHub) war nicht erreichbar, und was ich selbst vorbereiten muss, sagt die Seite nicht.

## Aufwand

Rund 15 Minuten, etwa 14 Schritte (erster Bildschirm, Scrollen, «So kommen Sie zu Dwello», drei Tabs, FAQ aufklappen, Anleitung- und Demo-Link prüfen, Impressum/Datenschutz, Handy: erster Bildschirm, Menü, Einrichten).

## Ablauf

1. **Erster Bildschirm Desktop** (`01-desktop-first.png`). Erwartet: worum es geht. Gesehen: grosser Titel «Ihre Nebenkostenabrechnung, einfacher gemacht.», Kurztext, Knöpfe «Demo ansehen» und «So kommen Sie zu Dwello», darunter der Hinweis, dass jemand mit Computerkenntnissen einrichten muss. Sofort klar.
2. **Scrollen** (`03-desktop-scroll1.png`, `07-desktop-vierschritte.png`). Erwartet: wie es geht. Gesehen: App-Übersicht auf Desktop und Handy, vier Zahlen (CHF 0.–, 4 Sprachen, 50 Wohnungen, 0 Daten), dann «Vier Schritte. Einmal im Jahr. Ohne Excel.» mit Gebäude erfassen → Rechnungen hochladen → Abrechnungen erstellen → Prüfen und versenden. Gut verständlich, aber Akonto/Vorauszahlungen fehlen.
3. **Rechnungen und Abrechnung** (`08-desktop-rechnungen.png`). Erwartet: wie die KI arbeitet. Gesehen: drei nummerierte Schritte und ein echter Dialog mit «Bitte prüfen». Beruhigend.
4. **Funktionen** (`09-desktop-funktionen.png`). Erwartet: was es heute gibt. Gesehen: Kacheln mit «Verfügbar»/«Geplant» und Legende. Klar, aber sehr technisch formuliert.
5. **«So kommen Sie zu Dwello»** (`04-`, `05-desktop-installieren*.png`). Erwartet: Schritte für mich. Gesehen: «Einmal einrichten lassen, dann läuft es.», wer es macht, rund eine Stunde, Knopf «Anleitung zum Weitergeben (Englisch)», Tabs mit Terminalbefehlen, Kasten «Ideal für den Start», gelber Kasten zur Google-Anmeldung. Wer was macht: klar. Was ich tun soll ausser «Person fragen»: unklar.
6. **Tabs Homeserver / Cloud.** Erwartet: welche Variante für mich. Gesehen: SSH, Domain, HTTPS, VPN, Tailscale, Caddy, Infomaniak/Exoscale/Hetzner. Für mich nicht entscheidbar.
7. **Anleitung öffnen.** Erwartet: Anleitung. Gesehen: GitHub antwortet aus meiner Umgebung mit 404, ebenso die Projektseite und das Issue #497. Ich beurteile nur, was die Seite sagt.
8. **Demo-Link.** Erwartet: Demo. Gesehen: `demo.dwello.ch` aus der Sandbox nicht erreichbar (Verbindung abgelehnt). Nicht beurteilt.
9. **FAQ aufklappen** (`06-desktop-faq.png`). Erwartet: Antworten zu Kosten, Recht, Hilfe. Gesehen: sechs kurze, klare Antworten.
10. **Schluss** (`11-desktop-schluss.png`). Gesehen: «Die nächste Abrechnung machen Sie mit Dwello.» mit «Demo ansehen» und «Dwello einrichten lassen»; Fuss mit Impressum, Datenschutzerklärung, Sprachen.
11. **Handy, erster Bildschirm** (`20-mobile-first.png`). Titel, Text und beide Knöpfe im ersten Bildschirm, Knopf «Menü» oben rechts, kein seitliches Scrollen.
12. **Handy, Menü** (`24-mobile-menu.png`). Abschnitte, Impressum, Sprachen. «Einrichten» springt zum Abschnitt.
13. **Handy, Einrichten** (`21-`, `22-`, `23-mobile-installieren*.png`). Text gut lesbar, Anleitungsknopf über die ganze Breite, Tabs untereinander. Befehlsblock rechts abgeschnitten (innen seitlich scrollbar), Kasten «Ideal für den Start» und Google-Hinweis gut lesbar.

## Verwirrung

- «Einrichten», «Installieren», «So kommen Sie zu Dwello», «Dwello einrichten lassen»: vier Namen für einen Ort.
- «Ihr Google-Konto» und «ein Schlüssel bei Google»: wessen Konto, wessen Schlüssel?
- «Eigener PC» ist «Ideal für den Start», aber «Für den Zugriff vom Handy eignet sich ein Homeserver» – ich weiss nicht, ob ich später wechseln kann und was dann mit meinen Daten passiert.
- «Leistungszeitraum», «umlagefähig», «Verteilschlüssel», «Heizprofil», «Mietstage»: ohne Erklärung auf der Seite.
- «KI liest Ihre Belege auf Ihrem eigenen Rechner» und «16 GB Arbeitsspeicher»: weiss ich nicht, ob mein Laptop das hat.
- «Anleitung zum Weitergeben (Englisch)»: Warum englisch auf einer Seite «Für die Schweiz»?

## Fehlerrisiken

- Ich denke, Dwello sei nach der Einrichtung «fertig», und vergesse Updates und Datensicherungen, weil «ab und zu» kein Intervall nennt.
- Meine Helferin legt den Google-Schlüssel mit ihrem eigenen Konto an; wenn sie wegzieht, komme ich nicht mehr hinein (nicht geprüft, nur befürchtet).
- Ich starte ohne die Akontozahlungen der Mieter und merke erst bei der Abrechnung, dass mir Angaben fehlen.
- Ich lade nur einzelne Rechnungen hoch, weil «Laden Sie die Rechnungen hoch, sobald sie kommen» klingt, als sei es für das vergangene Jahr zu spät.

## Vorschläge

- **P-1:** Desktop, `index.html` → «So kommen Sie zu Dwello» → «Anleitung zum Weitergeben (Englisch)». Hilft: Anleitung auf Deutsch (mindestens die Schritte), oder die wichtigsten fünf Schritte direkt auf der Seite in einfachem Deutsch; dazu ein Hinweis, wo die Anleitung liegt, falls GitHub nicht lädt.
- **P-2:** Desktop, «Vier Schritte» und «Eine Abrechnung, die jede Zahl erklärt». Hilft: kurzer Kasten «Für Ihre erste Abrechnung brauchen Sie»: Mietvertrag mit den vereinbarten Nebenkosten, die Akontozahlungen der Mieter im Abrechnungsjahr, alle Rechnungen des Jahres (auch nachträglich hochladbar), Flächen der Wohnungen (oder Gebäuderegister). Ein Satz, dass die Abrechnung die Vorauszahlungen abzieht.
- **P-3:** «Einrichten» → gelber Kasten «Heute noch mit Google-Anmeldung». Hilft: ein Satz «Sie melden sich mit Ihrem eigenen Google-Konto an; der Schlüssel gehört zu Ihrer Installation» (oder was zutrifft).
- **P-4:** «Einrichten» → Tabs. Hilft: eine Zeile über den Tabs «Unsicher? Nehmen Sie ‹Eigener PC›; Ihre Helferin kann später wechseln», und ob Updates aus der Ferne gehen.
- **P-5:** «Einrichten» → Terminal-Block, Desktop und Handy 390 px. Hilft: Überschrift «Für die Person, die einrichtet» über dem Block, Block auf dem Handy zugeklappt oder umbrechend.
- **P-6:** Navigation «Einrichten», Hero «So kommen Sie zu Dwello», Marke «Installieren», Schluss «Dwello einrichten lassen». Hilft: überall «Einrichten» (Abschnittsmarke ebenfalls «Einrichten»).
- **P-7:** «Rechnungen per Drag & Drop» (Leistungszeitraum, umlagefähig), «Gerecht verteilt» (Verteilschlüssel, Heizprofil), «Eine Abrechnung …» (Mietstage). Hilft: je ein Halbsatz Erklärung in Klammern, z. B. «Verteilschlüssel (nach welcher Regel die Kosten auf die Wohnungen verteilt werden)».

## Nicht geprüft

- Die Anleitung selbst: `https://github.com/rudini/Dwello/blob/main/docs/installation.md` antwortet aus der Sandbox mit 404 (auch die Projektseite und die Issues), daher beurteile ich nur den Text der Seite.
- Die Demo: `demo.dwello.ch` ist aus der Sandbox nicht erreichbar (Verbindung abgelehnt).
- Die Sprachversionen FR/IT/EN, das Markenhandbuch und der Dunkelmodus der Seite: nicht Teil meiner Aufgabe.
- Impressum und Datenschutzerklärung nur geöffnet und überflogen, nicht inhaltlich geprüft.
