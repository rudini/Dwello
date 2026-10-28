# Fach-Review #860, Runde 1 (Commit 1e5687a)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Die Zeile «Betreiber» (UBIQUITOUS_LANGUAGE.md:246) legt fest, dass Texte an den Liegenschaftsverwalter den Betreiber «die Person, die Dwello betreut» nennen, und #860 sagt «überall». `messages/de.json` nennt ihn aber heute 22-mal «Betreiber», mit «Betreiben Sie Dwello selbst, … Installationsanleitung» (z. B. `login_password_forgot` :1970, `ki_model_failed_text` :1996, `ki_settings_model_offline` :2041, `privacy_controller_none` :169). Damit widerspricht das Glossar jetzt den bestehenden Texten. Lösung: ein Issue (`domain`), das die bestehenden Texte in allen vier Sprachen angleicht. Ausgenommen bleiben die Rechtstexte (Datenschutz), wo «Betreiber» als Rolle nach DSG korrekt ist; die Zeile sollte diese Ausnahme nennen. |
| V-2 | Verwalter | Minor | In i18n-begriffe.md fehlen fr/it/en für den beschlossenen Satz «Betreuen Sie Dwello selbst, finden Sie das Vorgehen in der Installationsanleitung.», obwohl ihn jeder Text zur Sicherung braucht. Lösung: Zeile nach der Tabelle «Wortlaut» unten ergänzen; «guide d’installation / guida all’installazione / installation guide» wie in den bestehenden Texten. |

Zu den vorgeschlagenen Übersetzungen von «die Person, die Dwello betreut»: Ich übernehme sie, so wie sie sind. «la personne qui s’occupe de Dwello» und «la persona che si occupa di Dwello» sind natürlich und passen zu «vous» und «Lei» («Adressez-vous à la personne qui s’occupe de Dwello.», «Si rivolga alla persona che si occupa di Dwello.»). Ausserdem verwechselt man sie nicht mit «gérer» bzw. «gestore», das schon für Betreiber und Verwaltung steht. «the person who looks after Dwello» ist idiomatisch, und anders als «manages» verwechselt man es nicht mit «property manager».

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| (Satz Selbstbetrieb, #860) | Betreuen Sie Dwello selbst, finden Sie das Vorgehen in der Installationsanleitung. | Si vous vous occupez vous-même de Dwello, la marche à suivre figure dans le guide d’installation. | Se si occupa Lei stesso di Dwello, trova la procedura nella guida all’installazione. | If you look after Dwello yourself, the steps are in the installation guide. |

## Nicht bestätigt

- Ob «überall» im Beschluss von #860 auch die 22 bestehenden Texte mit «Betreiber» meint oder nur die neuen Texte zur Sicherung. Gelesen habe ich den Issue-Text von #860 und `messages/de.json`; für V-1 entscheidet das der Product Owner.

Geprüft: Die vier Zeilen (Definitionen, fr/it/en, it «copia di sicurezza» mit Mehrzahl) und der Zusatz zu «Betreiber» entsprechen wörtlich dem Beschluss in #860. Sie folgen dem Stil von Glossar und i18n-begriffe (Issue-Verweise, «Nicht zu verwechseln», typografischer Apostroph). `docs/installation.md` existiert.
