# Fachreview 686-1 (Schritt 1, Runde 1), Commit 27e4ffb

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Der Hilfetext zur Zahlungsfrist eines Entwurfs sagt, Dwello verschiebe sie beim späteren Versand auf {n} Tage. Eine längere Frist bleibt aber stehen. |
| V-2 | Verwalter | Major | Der neue `heatingNote` bricht zwei Szenarien auf `main`, die nicht `@wip` sind, und drei pg-Tests. Einer davon prüft danach nichts mehr. |
| V-3 | Verwalter | Minor | de «Gilt ab dem Versand.»: Das Subjekt fehlt (bei «Rückerstattung bis» unklar), und «gilt» weicht ab von «läuft» im Glossar (`UBIQUITOUS_LANGUAGE.md:170`, `help_statements_4`) und von fr/it/en («court», «decorre», «runs»). Fix: «Die Frist läuft ab dem Versand.» |
| V-4 | Verwalter | Minor | «Versanddatum» steht weder im Glossar noch in `messages/de.json`; das Panel zeigt direkt darunter das «Abrechnungsdatum». Fix: «nach dem Versand» (wie `help_statements_4` «Tag des Versands»). |
| V-5 | Verwalter | Minor | `heatingNote` in de/it/en hat vor «%» ein normales Leerzeichen (`pdf-texts/{de,it,en}.ts:57`), fr und alle Nachbarschlüssel haben ` `. Im PDF kann «%» so allein auf die nächste Zeile rutschen. Fix: in der neuen Zeile `{percent} %`. |

## V-1 (Major): Eine längere Frist bleibt beim Versand

- Beleg: `backend/src/services/statement.service.ts:724-727`, `datedToday`: `paymentDeadline && paymentDeadline > due ? paymentDeadline : due`. Das gilt beim Versand (`:758`, `statement-send.service.ts:139`) und beim PDF eines Entwurfs (`statement-pdf.service.ts:330`). In `docs/nebenkostenabrechnung-anforderungen.md:46` steht dazu: «nie früher als eine schon gesetzte Frist». Das Glossar sagt es beim erneuten Zustellen gleich (`UBIQUITOUS_LANGUAGE.md:171`, «eine spätere bleibt»).
- Warum falsch: Bei einem Entwurf lässt sich die Frist von Hand später setzen (für einen Entwurf gibt es keine Sperre, `refuseEarlierDeadline` greift erst mit einer mitgeteilten Frist). Dann verschiebt Dwello sie beim Versand nicht. Der vorgeschlagene Text verspricht etwas anderes. Ein Vermieter, der dem Mieter bewusst 60 Tage gibt, würde danach die Frist kürzen, weil er meint, Dwello setze sie sonst zurück.
- Fix: Den Satz des Entscheids behalten und ergänzen: «…; eine längere Frist bleibt.» Die Variante «auf mindestens {n} Tage» aus dem Vorschlag ist auch falsch, denn Dwello verschiebt eine längere Frist gar nicht. Den Text nur zu zeigen, solange die Frist nicht später liegt, ist ebenfalls nicht nötig: Der eine Text stimmt in beiden Fällen. Wortlaut siehe unten. DOM-Test (`statement-pages.dom.test.ts`) und `@wip`-Szenario (`statement-detail.feature:389`) übernehmen ihn.
- Rückerstattung: Ein Text reicht für beide Fälle. `datedToday` behandelt die Frist für die Rückerstattung gleich, und mit dem Subjekt «Die Frist» (V-3) passt der Satz auch unter «Rückerstattung bis».

## V-2 (Major): Szenarien und Tests prüfen den alten Wortlaut

- Beleg: Die neue Note enthält «43.00 % des Wohnungsanteils an den Heizkosten», nicht mehr «… % der Heizkosten». Dadurch schlagen fehl:
  - `tests/e2e/features/statement-detail.feature:657` `Dann steht im PDF "43.00 % der Heizkosten"` (auf `origin/main` Zeile 638, ohne `@wip`);
  - `:871` im Szenario «PDF nennt in der Erläuterung denselben Anteil nach dem Heizprofil wie in der Position» (`"70.98 % der Heizkosten"`, ohne `@wip`);
  - `backend/src/__tests__/statement-pdf.pg.test.ts:381` (`'50.00 % der Heizkosten'`) und `:446` (`'70.98 % der Heizkosten'`);
  - `backend/src/__tests__/statement-pdf-render.test.ts:765`. Das ist im Vorschlag schon genannt.
- Zudem: `statement-pdf.pg.test.ts:401` `expect(summer).not.toContain('67.39 % der Heizkosten')` bleibt nach der Änderung grün, auch wenn die Note wieder erscheint. Der Test prüft dann nichts mehr.
- Warum Major: Wird eine Szenariozeile auf `main` geändert, braucht der Pull Request `Spec change approved: #686` (CLAUDE.md, Schritt 1). P-4 entscheidet den Wortlaut der Note, damit auch diese beiden Zeilen. Der Plan nennt sie aber nicht.
- Fix: Die beiden Szenariozeilen auf «… % des Wohnungsanteils an den Heizkosten» ändern und im Pull Request `Spec change approved: #686` angeben, mit Verweis auf P-4. Die pg-Erwartungen ebenso anpassen. Zeile 401 auf `'67.39 % des Wohnungsanteils'` ändern.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| `heatingNote` (`backend/src/services/pdf-texts/*.ts:57`) | `Heizkosten nach Heizprofil «{profile}»: {percent} % des Wohnungsanteils an den Heizkosten in der Abrechnungsperiode` | `Frais de chauffage selon le profil « {profile} » : {percent} % de la part du logement dans les frais de chauffage pour la période de décompte` | `Spese di riscaldamento secondo il profilo «{profile}»: {percent} % della quota appartamento delle spese di riscaldamento nel periodo di conteggio` | `Heating costs under the heating profile ‘{profile}’: {percent} % of the apartment share of the heating costs for the billing period` |
| `statements_payment_deadline_draft_help` (`messages/*.json`; fr mit U+00A0 als Zeichen vor «;», wie in `fr.json`) | Die Frist läuft ab dem Versand. Versenden Sie später, verschiebt Dwello sie auf {n} Tage nach dem Versand; eine längere Frist bleibt. | Le délai court à partir de l’envoi. Si vous envoyez le décompte plus tard, Dwello le reporte à {n} jours après l’envoi ; un délai plus long reste inchangé. | Il termine decorre dall’invio. Se invia il conteggio più tardi, Dwello lo sposta a {n} giorni dopo l’invio; un termine più lungo resta invariato. | The deadline runs from the day the statement is sent. If you send it later, Dwello moves the deadline to {n} days after sending; a longer deadline stays. |

Zu den Fragen im Vorschlag:
- «des Wohnungsanteils» ist richtig, nicht «Ihres». Der Wohnungsanteil gehört zur Wohnung. Bei einem Mieterwechsel teilen sich Vor- und Nachmieter ihn nach dem Heizprofil.
- Ein Betrag in Klammern ist nicht nötig. Die Tabelle zeigt den Wohnungsanteil als Betrag und den Anteil daran (`statement-detail.feature:659`, `:893`). Auf eine detaillierte Abrechnung weist `noteHeating` hin (Art. 8 Abs. 1 VMWG, unverändert).

Geprüft: Formel «Ihr Anteil = Wohnungsanteil × Anteil nach Heizprofil» (`UBIQUITOUS_LANGUAGE.md:198`), nachgerechnet:
- CHF 1’000.00 × 43.00 % = CHF 430.00 (`feature:893`, `:659`);
- Mieterwechsel: der Nachmieter trägt 57 % = CHF 570.00, beide zusammen CHF 1’000.00;
- ganze Periode: 100 %, die Note steht ohne Monatszeile.

Ebenfalls geprüft:
- `{n}` ist `payment_deadline_days` zur Zeit des Versands (7–90, die Mehrzahl stimmt immer), und der Load-Test liest ihn aus der Konfiguration;
- der Hilfetext erscheint nur, wo das Panel eine Frist zeigt;
- Begriffe Zahlungsfrist, Wohnungsanteil, Heizprofil, Abrechnungsperiode und die fr/it/en-Begriffe aus `i18n-begriffe.md`;
- die Texte enthalten keine Rechtsbehauptung, für die ein Fedlex-Zitat nötig wäre.

## Nicht bestätigt

- Ob im `@wip`-Szenario `statement-detail.feature:399-408` (Eva Frei, «Winter», ohne Monatstabelle) wirklich `heatingNote` gewählt wird (keine Heizrechnung mit Leistungszeitraum) und der Wert «43.00 %» ist. `:893` deutet auf 43.00 % hin; die Fixture habe ich nicht gelesen. Das zeigt der Rot-Lauf.
