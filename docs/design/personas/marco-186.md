# Marco – Slice 186: Begründungen der Kategorien, Hinweis Mietvertrag, KI-Hinweise, Rechnungshinweis (Italienisch, 390 px)

Persona: Marco, 38, Smartphone 390 × 844, Touch, Oberflächensprache Italiano. Nur angeschaut, nichts gespeichert; Sprache am Schluss wieder auf Deutsch gestellt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/fbb18b34-b688-5fdb-9b9f-9f01da7bd45c/scratchpad/marco-186/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Nuova categoria, KI-Hinweis «unsicher» | «L’IA non è sicura.» ist doppeldeutig: «sicura» heisst auch «sicher/gefahrlos». Ich habe zuerst «die KI ist nicht sicher (unsicher im Sinne von Sicherheit)» gelesen. |
| P-2 | Minor | Nuova categoria / Modificare, Hilfetext bei «Spese accessorie addebitabili» | Der Hilfetext ist auf dem Handy ein Block von 12 Zeilen vor den beiden Auswahlkarten (Regeln zu Heizung, Lift, Wasser, Abwasser, Kehricht, Meteorwasser, Mietvertrag in einem Absatz). Ich muss zweimal scrollen, bis ich wählen kann, und finde die für mich wichtige Regel nicht schnell. «contano solo esercizio e manutenzione» ist unklar (zählen wofür?). |
| P-3 | Minor | Categorie (Liste) und Modificare: Begründungen | Die Begründungen sagen nicht ausdrücklich, was daraus folgt. «Ascensore: … sono legati all’uso» – dass «legato all’uso» = addebitabile heisst, muss ich aus dem Hilfetext der Bearbeitungsseite ableiten; in der Liste steht diese Erklärung nirgends. Bei «Manutenzione estintori» verstehe ich «anche quando l’edificio è vuoto» erst beim zweiten Lesen als Grund für «nicht addebitabile». |
| P-4 | Minor | Modificare Ascensore | Wenn ich die Auswahl auf «Non addebitabile» umstelle (nicht gespeichert), bleibt die Begründung «… sono legati all’uso» unverändert darunter stehen und widerspricht meiner Wahl, ohne Hinweis wie «Die Vorgabe für diese Kategorie ist: addebitabile». |
| P-5 | Minor | Dettaglio fattura (Riparazioni) | Der Hinweis «Diritto svizzero di locazione» ist allgemein (Liste typischer nicht addebitabler Kosten) und nennt nicht den Grund der Kategorie «Riparazioni», den ich in der Kategorienliste gelesen habe («Il locatore deve mantenere l’immobile … coperte dalla pigione»). Er ist zudem als gelbe Warnung mit Warndreieck gestaltet, obwohl nichts falsch ist. |
| P-6 | Nit | Modificare / Nuova categoria, Dettaglio fattura | Gesetzesverweise brechen bei 390 px mitten im Verweis um: «(art. 257a cpv. 2 / CO).», «(art. / 256 cpv. 1, 256b e 257a CO)». |
| P-7 | Nit | Modificare (Ascensore, Manutenzione estintori) | Die Begründung steht ohne Überschrift direkt unter der Karte «Non addebitabile»; sie wirkt wie die Erklärung dieser einen Option statt wie die Begründung der Kategorie. |

Layout: auf allen geprüften Bildschirmen kein seitliches Scrollen (scrollWidth = 390). Bedienelemente: Auswahlkarten «Addebitabile»/«Non addebitabile» deutlich über 48 px, «Far verificare dall’IA» 48 px, «Categorizzare di nuovo» und «Modificare la fattura» 48 px; die Kartenzeilen der Kategorienliste sind ganz antippbar (Tipp auf die Begründung öffnet die Bearbeitungsseite). Die Radio-Kreise selbst sind 24 px, aber die ganze Karte ist das Ziel.

## Beobachtungen

- Feld «Nome (tedesco)» mit deutschem Beispiel «Treppenhausreinigung» und auf der Bearbeitungsseite deutsche Beschreibung («Strom, Notruftelefon und reine Wartung des Lifts …») in der italienischen Oberfläche; als Tessiner verstehe ich das knapp, Helga-ähnliche Nutzer im Tessin kaum.
- «L’elenco non mostra la descrizione delle categorie predefinite.» – verstanden, aber warum dann ein Beschreibungsfeld?
- Untertitel «Un tipo di costo secondo cui classifica le fatture.» klingt holprig.
- Leeres Namensfeld + «Far verificare dall’IA»: Fehler «Il nome è obbligatorio» ohne Punkt und ohne Handlungsanweisung.
- Der KI-Knopf steht nach den beiden Auswahlkarten; ich hätte ihn vor der Wahl erwartet (erst fragen, dann wählen).
- Filterknöpfe Liste: «Tutte (21)» Plural, «Addebitabile (12)» Singular.
- Demo-Rechnung «Lift AG – Serviceabonnement Lift 2025» ist addebitabile, obwohl die Begründung der Kategorie «Ascensore» sagt, Serviceabos mit Reparaturen trage der Vermieter. Ich kann nicht sehen, ob das Abo Reparaturen enthält; die Rechnungsdetailseite gibt bei addebitabili Rechnungen gar keinen Hinweis (auch nicht auf den Mietvertrag).
- Spracheinstellung gilt offenbar nur im Browser: eine neue Sitzung startete wieder auf Deutsch.
- Deaktivierte «Eliminare»-Knöpfe in der Liste sind nur blasser; der Grund steht einmal oben in der Liste.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 25 Schritte (Sprache umstellen, Menü, Kategorien, zwei Bearbeitungsseiten, neues Formular mit zwei KI-Prüfungen, Rechnungsfilter, Rechnungsdetail, Sprache zurück).

## Ablauf

1. **Sprache auf Italiano.** Erwartet: Sprachmenü oben. Gesehen: Knopf «Sprache: Deutsch», Liste mit «Italiano»; danach alles italienisch.
2. **Impostazioni → Categorie.** Erwartet: Menü → Einstellungen. Gesehen: im Hamburger-Menü unter «Impostazioni e aiuto» direkt «Categorie». Seite mit Einleitung, Knopf «Registrare una categoria», Filter, zwei Hinweise, dann 21 Karten mit Name, Begründung, Badge, Anzahl Rechnungen (Screenshot 04: Karten untereinander, nichts abgeschnitten).
3. **Hinweis Mietvertrag gelesen.** «L’inquilino paga i costi addebitabili solo se il contratto di locazione li indica come spese accessorie (art. 257a cpv. 2 CO).» Klar und kurz; gut. Er steht zwischen zwei anderen Hinweisen und ist leicht zu überlesen, aber verständlich.
4. **Ascensore in der Liste.** Erwartet: warum addebitabile. Gesehen: «Elettricità, telefono d’emergenza e manutenzione dell’ascensore sono legati all’uso; riparazioni, pezzi di ricambio e abbonamenti di servizio con riparazioni sono a carico del locatore.» + Badge «Addebitabile». Verstanden, dass Strom und Wartung zahlt der Mieter, Reparaturen nicht. «legati all’uso» musste ich selbst als «deshalb addebitabile» deuten (P-3).
5. **Manutenzione estintori in der Liste.** Gesehen: «La protezione antincendio è necessaria anche quando l’edificio è vuoto; la manutenzione non è legata all’uso.» + «Non addebitabile». Logik erst beim zweiten Lesen (P-3).
6. **Bearbeitungsseiten beider Kategorien.** Erwartet: dieselbe Begründung. Gesehen: Hilfetext über der Auswahl (12 Zeilen, P-2), zwei grosse Auswahlkarten, darunter die Begründung ohne Überschrift (P-7) (Screenshot 06). Probehalber «Non addebitabile» bei Ascensore angetippt: Begründung bleibt gleich, kein Hinweis (P-4). Nicht gespeichert.
7. **Nuova categoria, Name «KI-Ausfall Fensterreinigung», «Far verificare dall’IA».** Erwartet: Fehlermeldung, dass die KI nicht geht. Gesehen nach unter 1 s: gelber Kasten «Nessuna proposta dell’IA – L’IA non è raggiungibile. Riprovi più tardi o indichi Lei se i costi sono addebitabili.» Gut: sagt, was passiert ist und was ich tun soll; Auswahl bleibt leer.
8. **Name «Bewachung», erneut prüfen.** Gesehen: «Nessuna proposta dell’IA – L’IA non è sicura. Indichi Lei se i costi sono addebitabili.» (Screenshot 12). Handlungsanweisung klar, «non è sicura» doppeldeutig (P-1). Was ich zur Entscheidung brauche, steht im langen Hilfetext darüber; der Hinweis verweist nicht darauf.
9. **Rechnung in «Riparazioni».** Fatture → Filter Categoria «Riparazioni» → «Cercare»: 1 Rechnung, Sanitär Keller AG, «Reparatur Boiler Wohnung 2.01». Detailseite (Screenshot 15): Badge «Non addebitabile», darunter Kasten «Diritto svizzero di locazione – Questa fattura non entra nel conteggio spese accessorie. Costi non addebitabili tipici: riparazioni, assicurazione edificio, imposta immobiliare, interessi ipotecari (art. 256 cpv. 1, 256b e 257a CO).» Erste Zeile hilft sofort; der Rest ist allgemein (P-5).
10. **Sprache zurück auf Deutsch.** Erledigt; neue Sitzung zeigt «Sprache: Deutsch».

## Verwirrung

- «legato all’uso» (in fast allen Begründungen): Schlüsselbegriff, nur im Hilfetext der Bearbeitungsseite erklärt, nicht in der Liste.
- «contano solo esercizio e manutenzione dell’impianto»: zählen wofür?
- «L’IA non è sicura»: «nicht sicher» oder «unsicher (Sicherheit)»?
- «OLAL», «CO», «cpv.»: als Tessiner kenne ich CO; OLAL musste ich raten (Verordnung). Für mich ok, für Anfänger nicht erklärt.

## Fehlerrisiken

- Ich stelle eine vordefinierte Kategorie um, ohne zu merken, dass ich von der rechtlichen Vorgabe abweiche (P-4).
- Ich lese «L’IA non è sicura» als Warnung vor der KI und traue danach auch ihren sonstigen Vorschlägen nicht.
- Wegen des langen Hilfetexts wähle ich auf dem Handy, ohne die passende Regel gelesen zu haben (P-2).

## Vorschläge

- **P-1:** Nuova categoria → Name «Bewachung» → «Far verificare dall’IA». Besser: «L’IA non riesce a decidere.» oder «L’IA non ne è certa.»
- **P-2:** Nuova categoria oder Modificare öffnen, auf 390 px zur Auswahl scrollen. Besser: ein Satz Grundregel («Addebitabili sono i costi legati all’uso, se il contratto li indica.») und die Einzelregeln als kurze Liste oder ausklappbar unter der Auswahl.
- **P-3:** Categorie öffnen, Karte «Ascensore» / «Manutenzione estintori» lesen. Besser: Schlussfolgerung anhängen («… sono legati all’uso: quindi addebitabili.» / «… non è legata all’uso: perciò non addebitabile.»).
- **P-4:** Modificare Ascensore → «Non addebitabile» antippen. Besser: Hinweis unter der Begründung, wenn die Wahl von der Vorgabe abweicht («Per questa categoria il diritto di locazione prevede: addebitabile.»).
- **P-5:** Fatture → Categoria «Riparazioni» → Rechnung Sanitär Keller AG öffnen. Besser: die Begründung der Kategorie anzeigen statt der allgemeinen Liste; als neutraler Infokasten statt Warnung.
- **P-6:** Seiten auf 390 px öffnen. Besser: geschützte Leerzeichen innerhalb der Gesetzesverweise.
- **P-7:** Modificare öffnen. Besser: kurze Überschrift «Perché?» oder «Motivo per questa categoria» über der Begründung, mit etwas Abstand zu den Karten.

## Nicht geprüft

- Speichern einer Kategorie (Auftrag: nur anschauen).
- Ein KI-Ergebnis mit eindeutigem Vorschlag (Auftrag nannte nur Ausfall und «unsicher»).
- Dunkelmodus, Querformat, andere Sprachen als Italienisch.
- Ob die rechtlichen Aussagen stimmen (Sache von Dr. Weber bzw. Fachreview).
