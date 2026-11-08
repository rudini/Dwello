# Fachreview #1130 / #1142, Runde 1

Gegenstand: `5d6a20f` (docs(i18n): add meter and free terms to glossary), Worktree `review-1130-fach`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | `messages/de.json:832` `contracts_apartment_help` (fr/it/en gleiche Zeile) widerspricht der neuen Zeile «frei (Wohnung)» (`UBIQUITOUS_LANGUAGE.md:24`: «Eine vermietete Wohnung ist ab dem Tag nach dem Vertragsende frei»). Der Hilfetext sagt «Vermietete Wohnungen sind mit «nicht verfügbar» markiert und lassen sich nicht wählen». Gesperrt ist aber nur eine Wohnung mit einem Mietvertrag ohne Vertragsende (`backend/src/services/apartment.service.ts:41-43`, `c.end_date is null`). Eine vermietete Wohnung mit Vertragsende lässt sich wählen und wird später frei (`contracts_free_later`, `src/lib/utils/contract-availability.ts:75-84`). Dazu verwendet en «Available» statt «free». Fix: Text aus der Tabelle «Wortlaut». |
| V-2 | Verwalter | Minor | `docs/design/i18n-begriffe.md` hat für die drei neuen Begriffe noch keine Zeilen. Das Dokument verlangt aber «One French, Italian and English term per German domain term» (:3). Fix: Zeilen aus der Tabelle «Zeilen für i18n-begriffe.md» übernehmen, nach :25 (Mietstatus) und nach :78 (Heizprofil). |

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| contracts_apartment_help | Wohnungen, die frei sind oder später frei werden, stehen zuoberst. Wohnungen mit einem unbefristeten Mietvertrag, der nicht gekündigt ist, sind mit «nicht verfügbar» markiert und lassen sich nicht wählen. | Les appartements libres ou qui seront libres plus tard figurent en haut. Les appartements avec un contrat de bail de durée indéterminée non résilié sont marqués « non disponible » et ne peuvent pas être choisis. | Gli appartamenti liberi o che si liberano più tardi sono in cima. Gli appartamenti con un contratto di locazione a tempo indeterminato non disdetto sono contrassegnati con «non disponibile» e non possono essere scelti. | Apartments that are free or become free later are listed first. Apartments with an open-ended rental contract that is not terminated are marked «not available» and cannot be chosen. |

## Zeilen für i18n-begriffe.md

| German | Français | Italiano | English |
|---|---|---|---|
| frei (Wohnung) / wird später frei | libre / sera libre plus tard | libero / si libera più tardi | free / becomes free later |
| Zähler (Heizung, Warmwasser) / Zählerstand | compteur (de chauffage, d’eau chaude) / relevé de compteur | contatore (del riscaldamento, dell’acqua calda) / lettura del contatore | meter (heating, hot water) / meter reading |
| Heizkostenverteiler | répartiteur de frais de chauffage | ripartitore delle spese di riscaldamento | heat cost allocator |

## Nicht bestätigt

- Ob «relevé de compteur» der beste französische Begriff für den abgelesenen Wert ist («index» wäre genauer): Für «Zählerstand» gibt es keine Fedlex-Stelle in OR oder VMWG, gesucht habe ich nicht. Die Zeile übernimmt das Wort, das die UI schon verwendet (`messages/fr.json:1562`).
- Ob ein Test oder ein Szenario den bisherigen Text `contracts_apartment_help` festhält: In `tests/` und `src/__tests__/` steht er nicht. Bei einem Treffer an anderer Stelle braucht die Änderung die Freigabe nach Schritt 1.

Geprüft: Die drei Zeilen stimmen Wort für Wort mit den Vorschlägen überein (`docs/reviews/659-fachreview-1.md:28-29`, `docs/reviews/b665-fachreview-1.md:66`), nur der Satzanfang steht gross. Platzierung und Code-Spalte sind sinnvoll (`CONTRACT_OVERLAP` in `backend/src/services/contract.service.ts:254`). Folgende Texte widersprechen den Zeilen nicht: `statements_heating_meters`, `statements_heating_meters_title`, `contracts_apartment_contracts_unknown`, `contracts_checking_apartments`, `contracts_free_later`, `contracts_delete_draft_contracts_unknown` und `ki_settings_model_failed` («frei» für Speicherplatz, kein Fachbegriff), je in allen vier Sprachen. `gallery_meter` ist ein Illustrationsmotiv, kein Fachtext.
