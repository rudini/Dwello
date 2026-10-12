# Native read – German (`messages/de.json`)

Read by a subagent acting as a Swiss German native speaker (not a human native speaker). Result: no «ß», no doubled spaces, no English left, «Sie» throughout, terms as in `UBIQUITOUS_LANGUAGE.md`; assembled texts read correctly. 4 majors and 13 minors, **all in German wording that existed before this work** (checked against `main`, 3f2a1e3). The goal requires the German wording to stay unchanged and existing tests check some of these texts, so none was changed; they are listed in `offene-punkte.md` for a decision.

| Key | Severity | Finding (pre-existing German) |
|---|---|---|
| `dashboard_task_letters_text_one` | Major | «1 Brief … Drucken Sie sie aus» (pronoun of the plural) |
| `dashboard_task_drafts_text_one` | Major | «1 Nebenkostenabrechnung … stellen Sie sie den Mietern zu» (plural tenants) |
| `statements_finding_stock_missing_many` | Major | «Tankbestand am … und am … fehlen» (singular noun, plural verb) |
| `privacy_third_2` | Major | Says fonts come from Google Fonts; the app bundles them (already in `offene-punkte.md`) |
| `backend_formula_sample_negative` | Minor | «für die Kleine Wohnung …» capital mid-sentence (same in the backend) |
| `statements_list_and`, `statements_part_month` | Minor | «den Januar und den Februar und den März»; article before months |
| `statements_finding_gap_*`, `…stock_missing_one` | Minor | No article at sentence start |
| `contracts_availability_blocked` | Minor | Hyphen as dash; «Vertrag» instead of «Mietvertrag» |
| `backend_*_name_taken`, `apartments_number_taken_text` | Minor | Straight quotes instead of «» |
| toasts (`buildings_*_toast` vs `tenants_deleted_toast`) | Minor | Name sometimes in «», sometimes not |
| `buildings_canton_fr` | Minor | «Fribourg» while other cantons have German names |
| `statements_error_fee` | Minor | Example «2,5» with comma, elsewhere point |
| short field errors | Minor | Some end with a period, some not |
| `help_tenants_3` | Minor | «bis» twice |
| `tenants_channel_help` | Minor | «Per E-Mail braucht …» without subject |
| `statements_compared_text` | Minor | «Lieferant» where the UI says «Rechnungssteller» |

