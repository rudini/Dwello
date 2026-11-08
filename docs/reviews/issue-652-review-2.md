# Review issue #652, Runde 2 (Delta 1a66c15..6018245)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Minor | src/routes/apartments/[id]/+page.svelte:50 | Neuer Zugangsname «Mietvertrag erfassen: Wohnung …» ohne Test: das Wohnungs-Szenario (apartment-detail.feature:148, Wohnung «3.01») zeigt nur «Bearbeiten»/«Löschen», weil 3.01 einen laufenden Mietvertrag hat. Die DOM-Tests (apartments-pages.dom.test.ts:488–491) prüfen nur den Text. Entfernt man die Zeile, bleibt alles grün. |

Geschlossen: C-2 (pageActions und contractRowLinks greifen jetzt über `getByRole` statt über CSS).

Offen aus Runde 1, unverändert: C-1 (aria-label statt versteckter Span, kommt in den Pull Request), C-3 (keine DOM-Tests).

Geprüft: S-5 auf der Gebäude- und der Mieterseite. Beide ariaLabel nutzen `common_action_of_aria` und Texte, die es in allen vier `messages/*.json` gibt; der sichtbare Text bleibt gleich. Die Szenarien building-detail.feature:125 und tenant-detail.feature:94 schlagen ohne die Änderung fehl, weil die alte Tabelle die Namen ohne Datensatz erwartete. Die Locator-Union `.or()` liefert die Elemente in DOM-Reihenfolge; die Reihenfolge beider Tabellen passt zum Markup. Kein fremder Code im Delta.

## Nicht bestätigt

- Vom Aufrufer gemeldet: die zwei geänderten Szenarien zuerst rot bei den neuen Namen, danach grün; building-detail, apartment-detail, tenant-detail und contracts grün (66 passed, chromium); axe- und Sprach-Zeilen von building-detail, apartment-detail-vacant, apartment-detail-free und tenant-detail (26 passed); lint und svelte-check sauber. Selbst habe ich keine Tests ausgeführt.
- Ob `getByRole` versteckte Aktionen anders zählt als vorher `locator(':is(a, button)')`: die Header-Aktionen lassen sich nur zur Laufzeit prüfen. Durchgesehen habe ich tests/e2e/targets/navigation.ts und die Snippets der drei Seiten; dort gibt es keine versteckten Aktionen.
