# Sven – Öffentliche Demo (b162): Hinweis «Öffentliche Demo» mit Tastatur und Screenreader

Persona: Sven, 45, blind, Screenreader und Tastatur. Desktop 1440 × 900, nur Tastatur, beurteilt am Accessibility-Baum (`readOut`) und am Fokus (`document.activeElement`).
App: öffentliche Demo auf http://localhost:3300 (DEMO=on). Nur angesehen, nichts gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | alle Seiten (Anmelden, Übersicht, Gebäude, Datenschutz, Nutzungsbedingungen, Hilfe) | «Zum Inhalt springen» landet auf `main`, und das Erste darin ist der ganze Demo-Hinweis (Titel plus drei Sätze, rund 35 Wörter). Auf jeder Seite höre ich ihn vor dem Seitentitel (h1), jedes Mal wieder. |
| P-2 | Minor | alle Seiten | Der Hinweis wird nur als zwei normale Absätze vorgelesen: «Öffentliche Demo» ist keine Überschrift, es gibt keinen Bereich (region/note), keinen Namen und keine Rolle. Das Warnsymbol hört man nicht. Mit Überschriften- oder Landmarken-Navigation (H, D) überspringe ich ihn ganz, auf der Anmeldeseite also auch die Warnung vor echten Daten. |
| P-3 | Nit | Datenschutz | Auf der Datenschutzseite kommt der Inhalt doppelt: zuerst der Hinweis-Absatz, kurz danach der Abschnitt h2 «Öffentliche Demo» mit fast demselben Text. |
| P-4 | Nit | Anmelden, Datenschutz und Nutzungsbedingungen (abgemeldet) | Abgemeldet stehen «Hilfe» und die Sprachwahl in keiner Landmarke (kein banner). Zwischen dem Hinweis und der h1 «Anmelden» steht ein loser Absatz «Dwello». Das war vermutlich schon vor dieser Änderung so. |
| P-5 | Minor (Fachgebiet von Dr. Weber) | Datenschutz | Der Text sagt «Schriften und Symbole werden von Google Fonts geladen», aber beim Laden von /privacy sah ich keine einzige Anfrage an einen fremden Server. Die Aussage ist hier vermutlich falsch. |

**Aufgabe geschafft:** ja

**Aufwand:** etwa 10 Minuten, 6 Skriptläufe. Geprüft: Anmelden, Datenschutz, Nutzungsbedingungen und Hilfe (abgemeldet), dann Übersicht, Gebäude und Datenschutz (angemeldet), Seitenwechsel innerhalb der App, Benutzermenü.

## Ablauf

1. **Anmeldeseite abgemeldet öffnen (`/` leitet nach `/login`).**
   Erwartet: Seitentitel «Anmelden – Dwello», und bevor ich mich anmelde, erfahre ich, dass das eine gemeinsame Demo ist.
   Gesehen: Der Titel heisst «Anmelden - Dwello». So liest sich die Seite vor: Link «Zum Inhalt springen», Link «Hilfe», Navigation «Sprachwahl», dann im Hauptbereich zuerst der Absatz «Öffentliche Demo» und danach der Absatz «Alle Besucher sehen und ändern dieselben Daten. Jede Nacht werden alle Änderungen gelöscht und die Beispieldaten neu geladen. Geben Sie keine echten Namen, Adressen oder Beträge ein.» Erst dann folgen «Dwello» und die Überschrift 1 «Anmelden». Ja, wer der Reihe nach liest, erfährt vor dem Anmelden, dass die Daten geteilt sind und jede Nacht zurückgesetzt werden. Der Text ist klar.
   Aber: Mit der Tab-Taste geht es «Zum Inhalt springen», «Hilfe», «Sprache: Deutsch», «Mit Google anmelden». Der Hinweis selbst ist nicht fokussierbar, und der Google-Link verweist nicht auf ihn. Wer nur tabbt oder mit H direkt zu «Anmelden» springt, hört ihn nie (P-2).
   Auf dem Screenshot ist der Hinweis ein gelber Kasten mit Warndreieck über der ganzen Breite, über der Anmeldekarte. Sehende sehen also eine Warnung, ich höre nur zwei Absätze.

2. **Skip-Link auf der Anmeldeseite (Tab, Enter).**
   Erwartet: Der Fokus springt zum Seiteninhalt, also zu «Anmelden».
   Gesehen: Der Fokus liegt auf `main#main-content` (tabindex -1). Der Inhalt beginnt mit «Öffentliche Demo …». Das nächste Tab führt zu «Mit Google anmelden». Auf dieser Seite ist das gewollt und gut: Der Hinweis gehört vor die Anmeldung.

3. **Datenschutz abgemeldet (`/privacy`).**
   Erwartet: Seitentitel, dann die Erklärung zur Demo.
   Gesehen: Der Titel heisst «Datenschutz - Dwello». Nach dem Skip-Link kommt zuerst der Hinweis-Absatz, dann die h1 «Datenschutz», dann die Einleitung und die h2 «Öffentliche Demo» mit fast demselben Text (P-3). Danach steht in einem eigenen Absatz, dass jede Anmeldung mit der E-Mail-Adresse protokolliert wird. Das ist neu und wichtig. Der Abschnitt ist als h2 gut zu finden.
   Nebenbei: Der Absatz über Google Fonts passt nicht zu dem, was ich im Netzwerk sah (P-5).

4. **Angemeldet: Übersicht (`/` leitet nach `/dashboard`).**
   Erwartet: Banner, Hauptnavigation, dann der Inhalt mit «Übersicht».
   Gesehen: Der Titel heisst «Übersicht - Dwello». Reihenfolge: Skip-Link, banner (Dwello, Sprache, Benutzermenü), navigation «Hauptnavigation» mit 13 Links, dann main. Darin wieder zuerst «Öffentliche Demo» und der Hinweistext, dann die h1 «Übersicht». Nach Skip-Link und Enter liegt der Fokus auf main. Wer ab dort liest, hört zuerst die rund 35 Wörter Hinweis. Das nächste Tab führt zu «Rechnungen 2025 ansehen».

5. **Angemeldet: Gebäude (über den Link «Gebäude» der Hauptnavigation, mit Enter).**
   Erwartet: Der neue Seitentitel wird angesagt, und ich komme schnell zum Inhalt.
   Gesehen: Eine Live-Region (assertive) sagt «Gebäude - Dwello» an. Das ist gut, der Hinweis wird beim Seitenwechsel nicht automatisch mitgelesen. Der Fokus springt auf den Seitenanfang (body), das nächste Tab führt zu «Zum Inhalt springen». Skip-Link und Enter, dann weiterlesen: wieder zuerst «Öffentliche Demo …», erst dann die h1 «Gebäude» (P-1). Dasselbe gilt für «Rechnungen 2025 ansehen» aus der Übersicht: Angesagt wird «Rechnungen - Dwello», nach dem Skip-Link kommt wieder zuerst der Hinweis.

6. **Angemeldet: Datenschutz, Nutzungsbedingungen, Hilfe.**
   Gesehen: Überall steht der Hinweis als erstes Element in main, vor der h1.

7. **Benutzermenü.**
   Gesehen: Der Button «Vera Verwalter Benutzermenü» meldet [expanded], darin die E-Mail-Adresse, «Einstellungen» und «Abmelden». Einen Demo-Bezug gibt es dort nicht, das ist auch nicht nötig.

## Verwirrung

- Ich höre «Öffentliche Demo» als losen Absatz, ohne Rolle. Ist das eine Überschrift, ein Hinweis, eine Warnung? Erst der nächste Satz erklärt es. Sehende sehen ein Warndreieck und eine farbige Box, ich bekomme nichts davon mit.
- «Zum Inhalt springen» heisst für mich «bring mich zur Seite, die ich gewählt habe». In der Demo bringt er mich auf jeder Seite zuerst zum selben Hinweis. Nach dem dritten Seitenwechsel springe ich nur noch mit H zur h1. Das geht, aber dann hätte ich den Skip-Link nicht gebraucht.
- Die Begriffe sind klar: «Beispieldaten», «neu geladen», «keine echten Namen, Adressen oder Beträge».

## Fehlerrisiken

- Wer sich nach Überschriften oder Landmarken bewegt (das ist bei Screenreadern üblich), überspringt den Hinweis auf der Anmeldeseite ganz und tippt später vielleicht echte Mieterdaten ein (P-2).
- Wer nach wenigen Seiten gelernt hat, dass nach dem Skip-Link «immer dasselbe» kommt, liest ab dann nicht mehr hin. Eine spätere, wirklich neue Meldung an dieser Stelle ginge unter (P-1).

## Vorschläge

- **P-1** – Reproduktion: Angemeldet `/dashboard` öffnen, Tab, Enter («Zum Inhalt springen»), dann weiterlesen: zuerst «Öffentliche Demo», «Alle Besucher …», erst dann die h1 «Übersicht». Dasselbe auf `/buildings` nach einem Klick in der Hauptnavigation.
  Was helfen würde: den Hinweis aus `main` herausnehmen und als eigenen, benannten Bereich vor `main` setzen (nach banner und Navigation, oder direkt nach dem Skip-Link). Dann landet «Zum Inhalt springen» bei der h1, und der Hinweis bleibt im Lesefluss und in der Landmarken-Liste auffindbar. Auf der Anmeldeseite darf er gern zuerst kommen. Dort stört er nicht, dort braucht man ihn.
- **P-2** – Reproduktion: Abgemeldet `/login` öffnen und die Überschriften auflisten oder H drücken: Die erste Überschrift ist «Anmelden», der Hinweis fehlt. In der Landmarken-Liste ist er auch nicht, er hat keine Rolle und keinen Namen.
  Was helfen würde: einen Bereich mit Namen, zum Beispiel `<section aria-labelledby>` oder `<aside>` mit dem Titel «Öffentliche Demo» als Namen, damit er als «Bereich Öffentliche Demo» angesagt wird und mit D/R erreichbar ist. Den Titel als Überschrift nur, wenn die Reihenfolge der Überschriften dabei stimmt (nicht als h2 vor der h1). Kein `role="alert"`: Der Hinweis würde sonst bei jedem Seitenwechsel ungefragt vorgelesen.
- **P-3** – Reproduktion: `/privacy` öffnen und der Reihe nach lesen: Hinweis-Absatz, h1, dann h2 «Öffentliche Demo» mit dem gleichen Satz.
  Was helfen würde: Auf der Datenschutzseite genügt der Abschnitt. Oder der Abschnitt nennt nur, was neu ist (Protokoll der Anmeldungen), und verweist auf den Hinweis.
- **P-4** – Reproduktion: Abgemeldet `/login` öffnen, Landmarken auflisten: Es gibt nur «Sprachwahl» (navigation), main und contentinfo, «Hilfe» steht ausserhalb.
  Was helfen würde: die Kopfzeile der abgemeldeten Seiten in ein banner legen und «Dwello» über «Anmelden» aus dem Lesefluss nehmen oder in die h1 aufnehmen. Wohl schon vorher so, also offene Arbeit.
- **P-5** – Reproduktion: `/privacy` mit offener Netzwerkliste laden: keine Anfrage ausser an localhost:3300. Der Text sagt aber, Google erhalte die IP-Adresse.
  Was helfen würde: den Satz an das echte Verhalten angleichen. Bitte von Dr. Weber oder dem fach-reviewer bestätigen lassen; das ist nicht mein Gebiet.

## Nicht geprüft

- Ein echter Screenreader (NVDA, JAWS, VoiceOver) war nicht verfügbar. Ich habe am Accessibility-Baum und am Fokus beurteilt. Wie der fokussierte `main` mit tabindex -1 tatsächlich angesagt wird (nur «Hauptbereich» oder auch der ganze Text), hängt vom Screenreader ab.
- Die echte Anmeldung über Google: Ich war über das Persona-Sitzungs-Cookie angemeldet.
- Andere Sprachen (fr/it/en), dunkles Design, Mobilgerät.
- Ob die Seite überhaupt Schriften von Google lädt: Die Netzwerkliste habe ich nur für /privacy angesehen.
