# Workflow notes: #1182

| Rule | What happened | Proposed change |
|---|---|---|
| `docs/design/personas/README.md`, "Running a review", «A state reached only by a failure» | The busy state lasts only while a request waits; the README names how a persona reaches a failing request, not a waiting one. The task told Helga to hold the form action's POST for 10 s with `page.route`, which worked. | Add «a waiting state: name the request to hold and for how long (the persona delays it)» next to the failure rule. |
| Issue template `nfr.md` / issue #1182 «Done means» («design-guard or axe check») | axe's `color-contrast` skips elements with `aria-disabled="true"`, so it could not have caught the pale busy button; the check became a computed-contrast question in the scenario plus a DOM test pinning the token pair. | None for the rules; an issue that names axe for a busy or disabled control could say that axe skips it. |
