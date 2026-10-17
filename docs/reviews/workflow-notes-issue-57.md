# Workflow notes: issue #57

| Rule | What happened | Proposed change |
|---|---|---|
| `docs/design/i18n-begriffe.md:5` (French guillemets and colons with a non-breaking space) and the no-prompt rule to edit files only with Edit/Write | Replacing French texts in `messages/fr.json` with the Edit tool dropped or turned the U+00A0 spaces into normal ones, and once lost the space before «; only an `od -c` check and the code review (C-1) found it. Writing ` ` in the Edit strings turned out to produce the real character. No test checks the French typography. | Say in `i18n-begriffe.md` how to enter U+00A0 with the Edit tool (` ` in the string), or add a test in `i18n` that every « in fr.json is followed and every » preceded by U+00A0, and that « has a normal space or a line start before it. |
