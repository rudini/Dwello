# Review: Instruktionen und Skills nach dem Lauf #81 (F-19a, Datenschutzseite)

Lauf: Session 2026-10-14, zweiter Bug des Serienauftrags. Slice #81, Commits 0b550a5, 87428b0, bf66a37. Zwei Runden `code-reviewer`, zwei Runden Persona Dr. Weber.
Geprüft: was im Lauf an `CLAUDE.md`, `.claude/agents/*.md`, `docs/design/i18n-begriffe.md`, den Skills `tdd`, `ponytail`, `ponytail-review` und an den Hooks gehakt hat oder unklar war. Nur Befunde, keine Umsetzung. Befunde aus `workflow-rules-review-2.md` werden nur genannt, wenn der Lauf sie bestätigt.

## Major

- **W-11 (Major) `CLAUDE.md:66`, `.claude/agents/fach-reviewer.md` – rechtliche Aussagen ohne fachliche Prüfung.** Die Datenschutzseite macht Aussagen mit rechtlichem Gewicht (DSG: Empfänger, Länder, Cookies). `fach-reviewer` prüft nur gegen Glossar, Anforderungen und Mietrecht. Schritt 1 und 5 lösen ihn darum nicht aus. Geprüft haben nur die Persona Dr. Weber (Nutzersicht) und `code-reviewer` (Code-Fakten); den Rechtstext hat niemand gegen das DSG gelesen. Vorschlag: den Scope von `fach-reviewer` um das DSG erweitern (Fedlex, wörtlich zitiert) und Schritt 1/5 um «privacy or legal texts» ergänzen, oder ausdrücklich festhalten, dass das offen bleibt (#82).
- **W-1 bestätigt (Major) `CLAUDE.md:72`.** Sie haben im Lauf entschieden: nach Abschluss selbst mergen und ohne Rückfrage weitermachen. In `CLAUDE.md` steht weiterhin «Ask me first for … merging while a Blocker/Major is open (the two kinds step 7 lets a task finish with included)». Eine künftige Session ohne diesen Chatverlauf fragt wieder. Vorschlag wie W-1, jetzt mit Ihrer Entscheidung als Quelle.

## Minor

- **W-12 (Minor) `docs/design/i18n-begriffe.md:5–9` – Stilregeln ohne Prüfung.** Die französischen Guillemets mit geschütztem Leerzeichen und der italienische Begriff «immobile» stehen in der Begriffstabelle, kein Test prüft sie. Beide Fehler (C-1, C-2) kamen erst im Code-Review auf; der Sprachcheck (`sprachen-bildschirme.feature`) findet nur deutschen Text. Vorschlag: ein Unit-Test über `messages/fr.json` (Guillemets nur mit U+00A0 innen) und über die Begriffstabelle (die Übersetzungen der Glossarbegriffe kommen vor, verbotene Varianten wie «stabile» nicht).
- **W-13 (Minor) `.github/ISSUE_TEMPLATE/task.md` – «Done means» zählt Fakten auf statt die Quelle.** #81 listete vier falsche Aussagen. Personas und Review fanden drei weitere (Google Maps, Adresssuche nur beim Erfassen, Sprach-Cookie ohne Wahl). Bei Aussagen über das System wäre die vollständige Quelle besser: «jede Anfrage des Browsers an fremde Server», «jedes Cookie». Vorschlag: im Template ein Hinweis «Bei Aussagen über das System: die Quelle nennen, aus der die Liste vollständig wird».
- **W-14 (Minor) `CLAUDE.md:65` – zweite Persona-Runde wegen kleiner Texte.** «the persona runs again only when the fix adds a text … it has not seen» löste eine volle zweite Runde von Dr. Weber aus (Stack-Start, ca. 3 Minuten). Anlass waren zwei Sätze. Sie fand nur Nits. Der Nutzen war da, aber klein. Vorschlag: bei neuen Sätzen ohne neuen Bildschirmzustand reicht eine Persona-Runde mit eng gefasster Aufgabe (wie hier gemacht); das in der Regel so sagen.
- **W-7 bestätigt (Minor) Stop-Hook.** In diesem Lauf acht Aufforderungen zum Push vor Abschluss der Reviews. Jede kostet eine Antwort.

## Nit

- **W-15 (Nit) `CLAUDE.md` «Formatting» – Python-/sed-Edits nach Prettier.** Ein Skript-Edit suchte den Text vor Prettiers Umbruch und verdoppelte eine Konstante (`oauth.ts`); `bun run check` hätte es gefunden, der Test fand es nicht sofort. Kein Regelfehler, nur Hinweis: nach Prettier keine Textersetzung auf den alten Wortlaut.
- **W-16 (Nit) `.claude/agents/persona.md` – Persona sieht nur Nutzersicht, prüft aber gern Technik.** Dr. Weber hat Netzwerk-Anfragen und Cookies im Browser mitgeschnitten. Das war für diese Aufgabe genau richtig und fand echte Fehler (P-2). Die Persona-Beschreibung sagt nicht, dass das erlaubt ist. Vorschlag: einen Satz ergänzen, dass eine Persona für Aussagen über das System die Browser-Werkzeuge (Netzwerk, Cookies) nutzen darf.

## Hat getragen (keine Änderung nötig)

- TDD mit `overwriteGetLocale` machte Übersetzungsbefunde als roten DOM-Test zeigbar (`privacy-i18n.dom.test.ts`).
- Die Regel «existed before → open work» trennte sauber: fünf Weber-Befunde gingen nach #82, vier nach `offene-punkte.md` U-23.
- Delta-Reviews (Runde 2) blieben klein und schnell, weil die Aufträge nur Delta und offene Befunde nannten.

## Nicht bestätigt

- Ob das DSG eine Länderangabe für CARTO, OpenPLZ und Google verlangt (W-11, #82): nicht geprüft, keine Quelle gelesen.
