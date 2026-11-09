# Fach-Review #698, Schritt 1, Runde 1 (Commit 4bc416bf)

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Minor | Der alte Satz «Jede Rechnung hat einen Verteilschlüssel» (`config_help_distribution_key`) stimmt nicht: Es gibt Rechnungen ohne Verteilschlüssel (`invoices_no_key`, angezeigt in `src/routes/invoices/[id]/CategorizationPanel.svelte:56`; `invoices_key_missing_note`; UBIQUITOUS_LANGUAGE.md:144 «Gleichmässig pro Wohnung: Verteilung einer Rechnung ohne Verteilschlüssel»). Fix: Den Satz nicht übernehmen, stattdessen `config_help_distribution_key_more` aus der Tabelle unten. |
| V-2 | Verwalter | Minor | An der Einstellung «Verwaltungspauschale» doppelt sich der Text, wenn man Glossar + `…_more` + `settings_fee_suggestion` aneinanderhängt: «Den Satz wählen Sie beim Erstellen der Abrechnungen, ausser der Mietvertrag nennt einen eigenen. Dwello nimmt höchstens 10 % an. Vorschlag beim Erstellen der Abrechnungen, dort für jeden Lauf anpassbar.» Das ist zweimal «beim Erstellen der Abrechnungen», und der letzte Satz hat kein Subjekt. Fix: Kein `config_help_management_fee_more` (`help.managementFee` wird nur an diesem Feld gezeigt, `src/routes/config/+page.svelte:283`), dafür `settings_fee_suggestion` neu wie in der Tabelle; er übernimmt die 10 %. Falls `settings_fee_suggestion` bleiben muss: `config_help_management_fee_more` = «Dwello nimmt höchstens 10 % an.» (fr «Dwello accepte au plus 10 %.», it «Dwello accetta al massimo il 10 %.», en «Dwello accepts at most 10 %.»). Dann bleibt die Doppelung. |

## Texte nach dem Glossartext

Heizprofil: keiner. `glossary_profile_text` enthält alles aus `config_help_heating_profile` (Prozent auf 12 Monate, Winter/Sommer, Ein- und Auszug nach Monaten) und dazu den Zeitpunkt der Wahl. Nach dem Glossartext liest sich `settings_profile_complete_only` gut.

Französisch: «10 %» mit U+00A0 vor «%», wie im bestehenden fr.json. Das «;» in fr steht nach U+00A0.

| key | de | fr | it | en |
|-----|----|----|----|----|
| config_help_distribution_key_more | Den Verteilschlüssel wählen Sie für jede Rechnung beim Erfassen. | Vous choisissez la clé de répartition pour chaque facture lors de sa saisie. | Sceglie la chiave di riparto per ogni fattura quando la registra. | You choose the distribution key for each invoice when you add it. |
| settings_fee_suggestion (neu, statt config_help_management_fee_more) | Dort schlägt Dwello den Satz vor, den Sie hier eintragen; Dwello nimmt höchstens 10 % an. | Dwello y propose le taux que vous saisissez ici ; Dwello accepte au plus 10 %. | Lì Dwello propone la percentuale che inserisce qui; Dwello accetta al massimo il 10 %. | There, Dwello suggests the rate you enter here; Dwello accepts at most 10 %. |
| contracts_advance_help_more | Das Akonto leistet der Mieter nur für die im Mietvertrag vereinbarten Nebenkosten, zum Beispiel Heizung und Wasser. | Le locataire ne verse l’acompte que pour les frais accessoires convenus dans le contrat de bail, par exemple le chauffage et l’eau. | L’inquilino versa l’acconto solo per le spese accessorie pattuite nel contratto di locazione, per esempio riscaldamento e acqua. | The tenant pays the advance payment only for the utility costs agreed in the rental contract, for example heating and water. |
| tenants_channel_help_more | Für einen Brief braucht es eine vollständige Adresse. Der Korrespondenzkanal gilt zum Beispiel für Abrechnungen und Mahnungen. | Une lettre nécessite une adresse postale complète. Le canal de correspondance s’applique par exemple aux décomptes et aux rappels. | Per una lettera serve un indirizzo postale completo. Il canale di corrispondenza vale per esempio per i conteggi e i solleciti. | A letter needs a complete postal address. The correspondence channel applies, for example, to statements and reminders. |

So lesen sich die zusammengesetzten Texte:
- **Verteilschlüssel:** Auf der Seite liest sich Glossar + `_more` gut. In den Einstellungen folgt `settings_key_suggested` («Dwello schlägt den hier gewählten Verteilschlüssel beim Erfassen einer Rechnung vor …»), auch das schliesst sauber an.
- **Verwaltungspauschale:** Siehe V-2. «Dort» in der neuen `settings_fee_suggestion` bezieht sich auf «beim Erstellen der Abrechnungen» im letzten Glossarsatz (alle vier Sprachen geprüft).
- **Akonto:** Der deutsche Text enthält wörtlich «für die im Mietvertrag vereinbarten Nebenkosten», damit hält das Szenario «Die Hilfe zum Akonto nennt die vereinbarten Nebenkosten» (`tests/e2e/steps/contract-form.steps.ts:547`). «ausserhalb von Dwello» (Zeile 617) kommt aus dem Glossartext, «amtlichen Formular» (Zeile 622) aus dem Änderungstext in `ContractForm.svelte:93`. Im Formular «Bearbeiten» folgt `contracts_advance_change_help` mit «Ein neues Akonto gilt ab …», auch das schliesst gut an.
- **Korrespondenzkanal:** Der erste Satz von `_more` ist eine echte Regel, keine Erklärung: Beim Brief verlangt das Backend Adresse, PLZ und Ort (`backend/src/services/tenant-fields.ts:31-33`). Der Glossartext nennt nur die E-Mail-Adresse. Ohne `_more` ginge diese Regel verloren. Abrechnungen und Mahnungen werden nach dem Kanal versandt (`statement-send.service.ts:28`, `reminder.service.ts:143`). Deshalb ist «Abrechnungen und Mahnungen» genauer als das alte «zum Beispiel Mahnungen» und passt zu `tenants_correspondence_address_help`.

Geht eine rechtliche Aussage verloren? Nein, wenn die Texte oben übernommen werden:
- Art. 257a Abs. 2 OR (vereinbarte Nebenkosten) steht neu in `contracts_advance_help_more`.
- Art. 4 Abs. 3 VMWG, «nur wenn vereinbart» und «bis 3 %» stehen schon im Glossartext Verwaltungspauschale.
- Die Grenze von 10 % ist eine Eingabeprüfung von Dwello (`backend/src/services/config.service.ts:6`), kein Recht. Sie steht neu in `settings_fee_suggestion`.

Fedlex, OR Stand 1. Oktober 2026, Art. 257a Abs. 2: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» VMWG Stand 1. Oktober 2025, Art. 4 Abs. 3: «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.»

Geprüft: Die fünf @wip-Szenarien und ihre Steps (Glossartext als Anfang der Hilfe). Die neue Satz-Prüfung im Unit-Test: Heute schlägt sie nur bei den zu entfernenden Keys `contracts_advance_help` und `config_help_management_fee` an. Die vorgeschlagenen Texte wiederholen keinen Glossarsatz. Die Begriffe stimmen mit UBIQUITOUS_LANGUAGE.md und i18n-begriffe.md überein (acompte/acconto/advance payment, frais accessoires convenus, rappel/sollecito/reminder).

## Nicht bestätigt

- Ob «Heizkosten … nach Monaten statt nach Tagen» im unveränderten `glossary_profile_text` die Teilmonatsregel genau trifft. UBIQUITOUS_LANGUAGE.md:154 sagt «Ein angebrochener Monat zählt mit dem Teil seiner Tage». Der Satz stand schon vorher im Text, und #698 lässt den Glossartext unverändert. Daher nicht weiter geprüft.
