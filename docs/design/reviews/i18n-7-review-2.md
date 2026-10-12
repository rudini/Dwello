# i18n step 7 and native reads – review 2

Scope: commit 1bad456 (step-7 review fixes and the fr/it/en wording from the native reads). Fresh read-only reviewer. Result: 0 blockers, 0 majors, 4 minors and a note. Verified: `de.json` byte-identical, placeholders equal in all files, French typography change only touched plain spaces before `: ; ? ! %` and spaced ellipses (no times, URLs or placeholders affected, guillemets still with U+00A0), Italian courtesy pronouns consistent, `hooks.server.ts` only the 401 text changed; 1717 unit tests green.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Minor | fr «la prochain terme de résiliation» (gender) | «le prochain terme de résiliation» |
| 2 | Minor | en login text without the instruction the other languages give | «Please add the OAuth credentials for Google or Microsoft.» |
| 3 | Minor | it «riceve un rimborso (rimborso)» | «la differenza le viene rimborsata (rimborso)» |
| 4 | Minor | fr «envoyés … envoyés … envoi» | «Les rappels par e-mail passent par le service d’envoi …» |
| 5 | Note | fr «montant dû» vs term «montant à payer»; «établis maintenant» hides the open term Abrechnungslauf | Kept; both terms are in `offene-punkte.md` |

Step 7 closed: no open blocker or major.
