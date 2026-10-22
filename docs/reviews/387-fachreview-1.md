# Fachreview #387, Runde 1 (Szenario vor der Umsetzung)

Gegenstand: Szenario «Beim Mieterwechsel das Heizprofil der Abrechnung derselben Wohnung», `tests/e2e/features/statement-generate.feature:711–724`, Commit ff0950a6, und das geplante Verhalten aus dem Auftrag.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Eine ersetzte Abrechnung zählt in `chosen` als Abrechnung der Periode und würde auch bei der Wohnungsregel zählen. Bei der berichtigten Abrechnung des ausziehenden Mieters (typischer Fall nach A-10) kommt so das Heizprofil aus den Einstellungen statt das des Nachmieters. |
| V-2 | Verwalter | Minor | Das Wort «Vor- oder Nachmieters» im Hinweis ist zu eng und kommt nicht aus dem Glossar: «Vormieter» fehlt in `UBIQUITOUS_LANGUAGE.md`, «Nachmieter» (Z. 45) gilt nur nach einem gekündigten oder befristeten Vertrag, und die Regel greift auch beim zweiten Mietvertrag desselben Mieters. Fix: Text unten mit «Mieterwechsel» (Z. 47). |
| V-3 | Verwalter | Minor | «Mietverträge, die noch keine Abrechnung haben» muss dieselbe Menge sein, die der Lauf abrechnet: ohne übergangene Mietverträge («Abgerechnet bis», Glossar Z. 49) und ohne Mietverträge ausserhalb der Periode. Sonst kann die Abrechnung einer fremden Wohnung ein zweites Heizprofil einbringen, und die Regel fällt ohne Grund auf die Einstellungen zurück. Fix: Menge aus derselben Quelle wie der Lauf und die Vorschau (`billedContracts` bzw. Logik der übergangenen Mietverträge) bilden, nicht neu nachbauen. |
| V-4 | Verwalter | Minor | Der Zweig «Wohnungen mit verschiedenen Heizprofilen, also Einstellungen und #119-Hinweis» hat kein Szenario. Fix: ein Szenario mit zwei fehlenden Mietverträgen in 3.01 und 3.02, deren Abrechnungen derselben Wohnung «Winter» und «Sommer» nennen; erwartet wird der Hinweis `statements_preset_differing`. |

## V-1 (Major): Ersetzte Abrechnungen dürfen nicht mitzählen

**Beleg.**
- `src/routes/statements/generate/+page.server.ts:38–55`: `others` sind alle Abrechnungen von `statements?buildingId&periodStart&periodEnd`, ohne Filter auf den Status.
- `backend/src/services/statement.service.ts:133–148`: Der Status wird nur gefiltert, wenn man ihn angibt. Ersetzte Abrechnungen (`replaced`) kommen also mit.
- Glossar `UBIQUITOUS_LANGUAGE.md:202`, «Ersetzt»: «… zählt nicht als Abrechnung der Periode». Szenario Z. 47–55: Der Lauf rechnet den Mietvertrag mit ersetzter Abrechnung wieder ab. Dieser Mietvertrag ist also einer der «noch fehlenden».

**Warum falsch.** Ein Beispiel: Eva Freis Abrechnung 2024 (3.01, «Winter») ist versendet, danach ändert sich ihr Vertragsende (A-10), und sie wird ersetzt. Marc Hubers Abrechnung (3.01) läuft mit «Sommer». Der Link öffnet den Assistenten für Eva Freis berichtigte Abrechnung.
- Heute (#119): Wegen der ersetzten Abrechnung gilt `differing` als wahr, also kommt das Heizprofil aus den Einstellungen.
- Geplant: Die Abrechnungen derselben Wohnung nennen «Winter» (ersetzt) und «Sommer», also kein einziges Heizprofil. Auch dann kommt es aus den Einstellungen.

Richtig wäre in beiden Fällen «Sommer». Nur dann tragen Eva und Marc zusammen mit dem Leerstand im April 100 % der Heizkosten der Wohnung.

Nachgerechnet mit einem Profil «Winter» (Jan 20, Feb 18, Mär 15, Apr 10, Mai 3, Jun–Aug 0, Sep 2, Okt 7, Nov 10, Dez 15; Summe 100):
- Beide nach «Winter»: Eva 53 % + Leerstand April 10 % + Marc 37 % = 100 %.
- Eva nach «Winter», Marc nach einem gleichmässigen Profil (245/366 Tage = 66.94 %): 53 % + 66.94 % = 119.94 %, ohne den Leerstand. Die Mieter zahlen also mehr als die tatsächlichen Aufwendungen. Das widerspricht Art. 257b Abs. 1 OR («… sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters …», Wortlaut übernommen aus `docs/reviews/w3f-fachreview-1.md:52`; siehe «Nicht bestätigt»).
- Randfall Null: In einer Periode nur aus Monaten mit 0 % (Szenario Z. 111–122) verteilen die Abrechnungen nach Mietstagen. Dort spielt das Heizprofil keine Rolle, und die Regel schadet nicht.

**Fix.** Abrechnungen mit Status `replaced` vor dem Vergleich ausschliessen, sowohl für `differing` (#119) als auch für die Wohnungsregel. Dazu ein Szenario: Eva «Winter» versendet und ersetzt, Marc «Sommer», Assistent für Lindenhof 2024 öffnen. Erwartet wird, dass der Assistent «Sommer» vorschlägt. Weil die ersetzte Abrechnung herausfällt, zeigt er den #89/A-10-Hinweis «wie bei den übrigen …» und nicht den neuen.

## Vorgeschlagener Wortlaut (V-2) und Übersetzungen

- de: «Beim Mieterwechsel ist das Heizprofil wie bei der bestehenden Nebenkostenabrechnung derselben Wohnung eingestellt, die Verwaltungspauschale kommt aus den Einstellungen. Prüfen Sie beides und gehen Sie weiter zur Vorschau.»
- fr: «En cas de changement de locataire, le profil de chauffage est réglé comme pour le décompte des charges existant du même appartement, les frais d’administration proviennent des paramètres. Vérifiez les deux et passez à l’aperçu.»
- it: «In caso di cambio d’inquilino, il profilo di riscaldamento è impostato come nel conteggio spese accessorie esistente dello stesso appartamento, le spese amministrative provengono dalle impostazioni. Li verifichi entrambi e passi all’anteprima.»
- en: «At a change of tenant, the heating profile is set like the existing utility cost statement of the same apartment, the management fee comes from the settings. Check both and continue to the preview.»

Die Begriffe stammen aus `docs/design/i18n-begriffe.md`: Z. 15 Wohnung, Z. 37 Mieterwechsel, Z. 74 Heizprofil, Z. 77 Nebenkostenabrechnung, Z. 85 Verwaltungspauschale.

Fehlender Begriff: keiner, wenn der Text oben gilt. Bleibt «Vor- oder Nachmieter», braucht es einen Glossareintrag «Vormieter» («Mieter, dessen Mietvertrag für dieselbe Wohnung vor dem Vertragsbeginn eines anderen Mietvertrags endet») und ein Issue (`fachlich`, `entscheiden`).

## Randfälle des Auftrags

- **Mehrere fehlende Mietverträge in Wohnungen mit verschiedenen Heizprofilen:** Einstellungen und #119-Hinweis sind vertretbar. Ein einziges Heizprofil kann nicht beide Wohnungen auf 100 % bringen, und die Vorschau nennt jede Abrechnung mit anderem Heizprofil bei einer Teilperiode (Szenarien Z. 632–652). Es fehlt ein Szenario (V-4).
- **Abrechnung derselben Wohnung mit gelöschtem Heizprofil:** Sie zu ignorieren ist richtig, denn es gibt nichts vorzuwählen. Das gelöschte Profil wird zu `null` (`onDelete: 'set null'`, w3f V-5), und `deleteHeatingProfile` lässt das Löschen trotz Abrechnungen zu (`backend/src/services/heating-profile.service.ts:249–270`).

Geprüft: Das Szenario schlägt «Winter» vor (Eva Frei 3.01). Lea Roth (3.02, «Sommer», ganze Periode) bewirkt, dass die übrigen Abrechnungen verschieden eingestellt sind, und beeinflusst den Anteil nach Heizprofil nicht (Szenario Z. 642). Die Regel nur bei verschieden eingestellten Abrechnungen anzuwenden genügt: Sonst nennen alle Abrechnungen schon dasselbe Profil. Dass die Verwaltungspauschale aus den Einstellungen kommt, wie #119, verschiebt keine Anteile zwischen Mietern (w3f Z. 65). V-8 und P-2 bleiben wie entschieden.

## Nicht bestätigt

- Den Wortlaut von Art. 257b Abs. 1 OR konnte ich auf Fedlex nicht abrufen: Die Seite braucht JavaScript (`https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de`). `mmx search` liefert nur Sekundärquellen (gerichte-zh.ch, mieterschutz.ch), deren Wortlaut mit dem Zitat in `docs/reviews/w3f-fachreview-1.md:52` übereinstimmt. Die Aussage ist deshalb **unsicher** im Sinne der Quellenregel.
- Ob die Vorschau eine bestehende Abrechnung mit gelöschtem Heizprofil nennt (`statements_existing_profile` mit `{used}`), habe ich nicht geprüft. Gesucht habe ich in `statement-generate.feature` und `messages/de.json`, dort gibt es kein Szenario dafür.
