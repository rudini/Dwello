# Fachreview W3f-2: #76 (befristeter Mietvertrag) und #119 (verschieden eingestellte Abrechnungen)

Gegenstand: Delta `c46a112..c08599e` im Worktree `/tmp/claude-0/-home-user-Dwello/b764c1fc-ad3b-5410-ae08-ee39473408c9/scratchpad/review-w3f-fach2`. Hier stehen nur neue und noch offene Befunde.

Gesetzestext (OR, SR 220, Fassung 1.1.2026, Fedlex-Filestore, de/fr/it): `https://www.fedlex.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/27/317_321_377/20260101/{de,fr,it}/html/...`

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-7 | Verwalter | Minor | Ob neue Nebenkosten den Satz zum befristeten Mietvertrag erhalten, hängt von den Mietverträgen ab, die *dieser Lauf* abrechnet. Massgebend wären die Mietverträge des Gebäudes. |
| V-8 | Verwalter | Minor | Nach «… kommen deshalb aus den Einstellungen» kommt das Heizprofil ohne Standard-Heizprofil gar nicht aus den Einstellungen. Der Assistent wählt dann das erste vollständige Profil, und das kann eines der verschieden eingestellten sein. Das Muster gab es schon vorher bei `statements_preset_from_settings`. |
| V-6 | Verwalter | Nit | Noch offen: «Sommer» hat in der Step-Definition dieselben Monatsanteile wie «Winter». Das Vertragsende ist behoben. |

## Bestätigt

- **M-1 behoben.** `messages/de.json` `statements_akonto_raise_fixed_term` ist wörtlich mein Vorschlag. Der Unit-Test (`src/__tests__/statement-wizard.test.ts`, «nennt bei einem laufenden befristeten Mietvertrag …») und das Szenario prüfen den ganzen Satz mit Formular und Nichtigkeit. Nachgerechnet: (2800 − 2400) / 2400 = 16.7 %, also über 15 %; der Hinweis erscheint mit «17 %». Grundlage ist Art. 269d Abs. 2 und 3 OR (Wortlaut in Runde 1).
- **V-4 behoben.** Der Platzhalter `{fixedTerm}` steht in allen vier Sprachen direkt nach «… ist die Änderung nichtig.» (fr «… la modification est nulle.», it «… la modifica è nulla.», en «… the change is void.») und vor dem Satz zur Nettomiete. Das Leerzeichen setzt `newCostsText` (`src/lib/statement-wizard.ts`). Der Test prüft `ist die Änderung nichtig. ${fixedTerm} Waren die Kosten`.
- **V-3 behoben.** Das Szenario prüft jetzt zusätzlich «frühestens auf den nächsten Kündigungstermin» für Kaltwasser.
- **V-5 behoben.** `+page.server.ts` `chosen()`: `profiles = others.filter((s) => s.heatingProfileId)`. Eine Abrechnung ohne Heizprofil zählt im Vergleich nicht.
- **M-2, Stichtag.** `fixedTerm = endDate && !terminated && !movedOut`, dabei `movedOut = endDate <= max(Periodenende, heute)` (`src/lib/server/statement-generation.ts:97, 117`). Der Stichtag ist also heute, sobald heute nach dem Periodenende liegt. Das passt zum Glossar (Vertragsende Z. 36, Befristet Z. 37, Kündigungstermin Z. 38: «`end_date` mit `terminated = true`»). Das Feld `terminated` liefert das Backend (`backend/src/services/contract.service.ts:32`, Contract `tests/contracts/building-contracts.json:7`). Randfälle mit Test: Ende 2099 ergibt befristet. Gekündigt ergibt nein. Unbefristet ergibt nein. Ende in der Periode ergibt nein. Ende nach der Periode, aber vor heute (Test «zählt einen Mieter, der bis heute ausgezogen ist …») ergibt `movedOut` und damit nein. Der Teil zu gekündigten Mietverträgen bestand schon vorher und ist unverändert.
- **#119, Vergleich.** Verschieden ist es, wenn sich die Heizprofile (ohne `null`) unterscheiden *oder* die Sätze der Abrechnungen zum Satz des Laufs (#89). Dann fallen beide Vorlagen weg und der Text `statements_preset_differing` erscheint. Randfall: Alle übrigen Abrechnungen haben kein Heizprofil. Dann ist `profiles` leer, `other` ist undefiniert, und es erscheint der bisherige Text «aus den Einstellungen». Das stimmt. Randfall `managementFeePercent` null: `Number(null)` ergibt 0, das ist für alle gleich, also gibt es keinen falschen Unterschied.
- **Übersetzungen** gegen `docs/design/i18n-begriffe.md`:
  - Mietvertrag: contrat de bail / contratto di locazione / rental contract (Z. 27)
  - Vertragsende: fin du contrat / fine del contratto / contract end (Z. 28)
  - Befristet: durée déterminée / a tempo determinato / fixed-term (Z. 30)
  - Akonto: acompte / acconto / advance payment (Z. 35)
  - Nebenkostenabrechnung: décompte des charges / conteggio spese accessorie / utility cost statement (Z. 57)
  - Abrechnungsperiode: période de décompte / periodo di conteggio / billing period (Z. 60)
  - Heizprofil (Z. 55) und Verwaltungspauschale (Z. 64)
  - Anrede vous / Lei: alles eingehalten.

  Die Fachwörter stimmen mit Fedlex überein:
  - fr Art. 255 al. 2: «Il est de durée déterminée lorsqu’il doit prendre fin, sans congé, à l’expiration de la durée convenue.» Art. 269d al. 2: «Les majorations de loyer sont nulles lorsque: a. elles ne sont pas notifiées au moyen de la formule officielle; b. les motifs ne sont pas indiqués; …». Die Wörter «motivée», «formule officielle» und «nulle» im Text passen dazu.
  - it Art. 255 cpv. 2: «È a tempo determinato se destinata ad estinguersi, senza disdetta, alla scadenza pattuita.» Art. 269d cpv. 2: «L’aumento è nullo se il locatore: non lo comunica mediante il modulo prescritto; non lo motiva; …». Die Wörter «motivato» und «nullo» passen. «modulo ufficiale» folgt dem bestehenden `statements_akonto_raise`; das Gesetz sagt «modulo approvato dal Cantone» bzw. «modulo prescritto». Das ist sinngleich und kein Befund.
  - en hat keinen amtlichen Text. «fixed-term», «void» und «official form» folgen den bestehenden Texten.

  Den Sinn habe ich verglichen, er ist in allen drei Sprachen gleich wie im Deutschen. Das gilt auch für «ausser der Mietvertrag sieht sie vor»: «sauf si le contrat de bail la prévoit», «salvo che il contratto di locazione lo preveda», «unless the rental contract provides for it».

---

## V-7 (Minor, Verwalter): Der Satz zum befristeten Mietvertrag hängt am Lauf statt am Gebäude

**Beleg.** `src/routes/statements/generate/+page.server.ts` (Aktion, neu): `fixedTerm = (id) => preview.some((row) => row.buildingId === id && row.fixedTerm)`. Die Zeilen von `preview` kommen aus `contractsInPeriod` (`src/lib/server/statement-generation.ts:73–77`). Diese Funktion lässt Mietverträge weg, die in der Periode schon eine Abrechnung haben, und auch solche, die erst nach der Periode beginnen. Der Code-Kommentar sagt selbst: «new costs are the building's».

**Warum falsch.** Neue Nebenkosten führt der Vermieter für das ganze Gebäude und für die Zukunft ein (Art. 269d Abs. 3 OR). Ob es dabei einen laufenden befristeten Mietvertrag gibt, hängt nicht davon ab, wer in diesem Lauf abgerechnet wird. Ein typischer Fall nach A-10 (`docs/anforderungen-vertragsende.md:304–316`): Die Abrechnung von Lea Graf (befristet bis 2099) ist schon erstellt. Später wird der Entwurf von Eva Frei gelöscht und neu erstellt. Der neue Lauf rechnet nur Eva Frei ab, und Kaltwasser erscheint als «Neu» ohne den Satz zum befristeten Mietvertrag. Lea Graf erhält dann keinen Hinweis, dass die Frist mit dem Kündigungstermin für sie nicht gilt. Der übrige Text bleibt richtig; es fehlt nur die Ausnahme. Deshalb ist das Minor.

**Behebung.** `fixedTerm` pro Gebäude aus allen Mietverträgen bestimmen, die heute laufen. Mindestens aus `inPeriod` von `contractsOf` mit den schon abgerechneten, besser aus allen Mietverträgen des Gebäudes mit `endDate > heute` und `!terminated`. Die Mietverträge holt `contractsOf` schon. Dazu ein Unit-Test mit einem schon abgerechneten befristeten Mietvertrag.

## V-8 (Minor, Verwalter; bestand schon vorher): «aus den Einstellungen», obwohl die Einstellungen kein Heizprofil haben

**Beleg.**
- `+page.server.ts:78–79`: `defaultHeatingProfileId = pick?.other?.heatingProfileId ?? settings.default_heating_profile_id ?? ''`.
- `src/routes/statements/generate/SettingsStep.svelte:31–33`: «Preselect the first complete profile».
- Laut Triage zu V-2 haben die Einstellungen in E2E kein Standard-Heizprofil, und der Assistent wählt dann das erste vollständige Profil. Im Szenario #119 kann das «Winter» oder «Sommer» sein, also genau eines der verschieden eingestellten Profile.

**Warum falsch.** Der neue Text sagt «Heizprofil und Verwaltungspauschale kommen deshalb aus den Einstellungen». Ohne Standard-Heizprofil stimmt das für das Heizprofil nicht. Der unerfahrene Vermieter glaubt dann, das gewählte Profil sei seine Vorgabe, und prüft es weniger genau. Mit V-1 zusammen (verschiedene Heizprofile in derselben Wohnung bei einem Mieterwechsel) ist das genau der Fall, in dem die Prüfung zählt. Den gleichen Wortlaut hatte schon `statements_preset_from_settings`. Neu ist, dass der Fall jetzt eintritt, obwohl es übrige Abrechnungen gibt.

**Behebung.** Ohne Standard-Heizprofil nichts vorauswählen. Oder den Text abhängig machen, zum Beispiel: «Die übrigen Nebenkostenabrechnungen dieser Abrechnungsperiode sind verschieden eingestellt. Wählen Sie das Heizprofil und prüfen Sie die Verwaltungspauschale aus den Einstellungen.» Das ist ein neuer Wortlaut neben dem in #119 beschlossenen. Ich schlage vor, ihn ins Issue zu V-1 aufzunehmen (Labels `fachlich`, `entscheiden`), statt ein eigenes Issue zu eröffnen.

## V-6 (Nit, noch offen)

`tests/e2e/steps/statement-generate.steps.ts:306` legt «Sommer» mit denselben Monatsanteilen an wie «Winter». Das ist unverändert. Für den Test spielt es keine Rolle. Ein neutraler Name («Profil B») wäre fachlich ehrlicher.

## Fehlende Begriffe

Keine. Alle Begriffe der neuen Texte stehen im Glossar und in `docs/design/i18n-begriffe.md`. «Einstellungen» (paramètres / impostazioni / settings) steht nicht in der Tabelle von `i18n-begriffe.md`, folgt aber den bestehenden Texten `statements_preset_*`.

## Nicht bestätigt

- **unsicher** (wie in Runde 1): Ob ein Mietvertrag während der festen Dauer eine Erhöhung des *Akontos* oder neue Nebenkosten wirksam vorbehalten kann. Fedlex nennt nur Index und Staffel (Art. 269b, 269c OR). Der beschlossene Satz verweist nur auf den Mietvertrag und bleibt davon unberührt.
- Die englische Fassung lässt sich nicht an einem amtlichen Text messen (Fedlex hat keine englische Fassung des OR). Geprüft habe ich nur Sinn und Begriffe.
- Die fr/it-Fassung von Art. 269d Abs. 3 habe ich nur in Ausschnitten gesehen (fr ohne das Ende mit «nouveaux frais accessoires»). Inhaltlich deckt sie sich mit der deutschen Fassung aus Runde 1.
- Die Tests habe ich nicht laufen lassen; ich habe nur den Code und den Test-Diff gelesen.
- Formatierung, nicht fachlich: In allen vier `messages/*.json` fehlt bei `"statements_preset_from_settings":"…"` das Leerzeichen nach dem Doppelpunkt. Das gehört in den Bericht des code-reviewer.
