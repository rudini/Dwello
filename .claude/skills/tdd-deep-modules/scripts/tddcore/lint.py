"""Check that a tdd-deep-modules skill directory holds everything the skill must contain."""
import os
import re
import shlex
from pathlib import Path

import yaml

# keys Claude Code reads from a skill's frontmatter
_KEYS = {"name", "description", "license", "allowed-tools", "metadata", "compatibility", "hooks", "model",
         "argument-hint", "disable-model-invocation", "user-invocable", "context", "agent", "when_to_use",
         "version", "paths", "effort", "shell"}

REFERENCES = ("references/design-it-twice.md", "references/depth.md", "references/tooling.md")  # the details
LINE_LIMIT = 400  # SKILL.md must stay below this; details belong in references/

# every section the skill must have, in order, with the phrases it must contain (compared in lower case)
REQUIRED = {
    "Hard rules": ["no production code without a failing test", "never delete assertions",
                   "never paste computed values into expected values", "never mix refactoring with green",
                   "no tests on private methods", "one test per cycle",
                   "break none of these", "no mocks or spies of your own logic", "real objects by default",
                   "mail, login, network, framework modules, external backends",
                   "against both the fake and the real implementation", "fake the adapter, not the framework",
                   "many mocks in a test signal a wrongly cut interface",
                   "the test boundary is the public interface of the deep module or service",
                   "no tests and no public exports of their own",
                   "every fake of a boundary has a contract test suite", "in a small project-owned adapter",
                   "pure helper functions inside it are implementation details"],
    "1. Detect the context": ["npx vitest run", "bun test", "git log -1 --format=%s", "does not apply"],
    "2. Design it twice": ["hidden decision", "two interface designs", "compare", "depth", "one sentence",
                           "chosen", "one-sentence reason", "compare them by depth"],
    "3. Write the behaviour test list": ["one line per behaviour", "tdd-step test", "hidden decision",
                                         "both sketches"],
    "4. Red, green, refactor with tdd-step": ["scripts/tdd-step red", "scripts/tdd-step green",
                                              "scripts/tdd-step refactor", "one behaviour from the list per cycle",
                                              "git reset --soft head~1", "package.json",
                                              "no second test before the first is green", "never what it expects",
                                              "git stash push -u --"],
    "5. Depth check in every refactor": ["in every refactor phase", "interface much simpler than the implementation",
                                         "classitis",
                                         "pass-through", "pull complexity downward", "size alone",
                                         "cumbersome tests", "wrong interface", "keep every test's name and file",
                                         "changed production .ts/.js files", "no classitis",
                                         "no pass-through wrappers", "do not split by size alone",
                                         "cumbersome tests signal a wrong interface",
                                         "a functional core is fine as internal structure",
                                         "small exported pure functions with one caller",
                                         "with one caller each are classitis"],
    "6. Design note": ["hidden decision", "both designs", "reason", "depth_report", "tdd_replay",
                       "not assertion strength"],
}

# the bold list items each section must open with, so a negation in front of one ("Do not ...") is caught
ITEMS = {
    "Hard rules": ["No production code without a failing test.",
                   "Never delete assertions, and never paste computed values into expected values.",
                   "Never mix refactoring with green.", "No tests on private methods.", "One test per cycle.",
                   "Doubles only at system boundaries."],
    "2. Design it twice": ["Name the one hidden decision", "Sketch two interface designs", "Compare them by depth:",
                           "Record the chosen design with a one-sentence reason"],
    "4. Red, green, refactor with tdd-step": ["Red.", "Green.", "Refactor."],
    "5. Depth check in every refactor": ["Interface much simpler than the implementation.", "No classitis.",
                                         "No swarm of exported helpers.", "No pass-through wrappers.",
                                         "Pull complexity downward.",
                                         "Do not split by size alone.", "Cumbersome tests signal a wrong interface."],
    "6. Design note": ["Hidden decision:", "Both designs:", "Interface:", "Depth:", "Open points:", "Proof:"],
}


def problems(skill):
    """One message per problem found in the skill at `skill`; empty when it is valid."""
    skill = Path(skill).resolve()
    try:
        text = (skill / "SKILL.md").read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return ["SKILL.md is not valid UTF-8"]
    if text.startswith("\ufeff"):
        return ["SKILL.md starts with a byte order mark; save it without one"]
    match = re.match(r"---\n(.*?)\n---\n", text, re.DOTALL)
    if not match:
        return ["SKILL.md has no frontmatter"]
    try:
        front = yaml.safe_load(match[1])
    except yaml.YAMLError:
        return ["frontmatter is not valid YAML"]
    if not isinstance(front, dict):
        return ["frontmatter is not valid YAML"]
    keys = re.findall(r"^([\w-]+):", match[1], re.MULTILINE)  # top-level keys; YAML keeps only the last
    twice = [f"frontmatter: key '{key}' appears twice" for key in sorted({k for k in keys if keys.count(k) > 1})]
    return (twice + _frontmatter(front, skill.name) + _hook(front, skill) + _required(text[match.end():])
            + _length(text) + _references(text, skill))


def _length(text):
    lines = len(text.splitlines())
    return [f"SKILL.md has {lines} lines (limit: fewer than {LINE_LIMIT})"] if lines >= LINE_LIMIT else []


def _references(text, skill):
    links = sorted(set(re.findall(r"references/[\w./-]+\.md", text)))
    return ([f"{link} is linked but does not exist" for link in links if not (skill / link).is_file()]
            + [f"{reference} is not linked from SKILL.md" for reference in REFERENCES if reference not in links])


def _required(body):
    # code blocks and HTML comments hold no sections
    body = re.sub(r"^(```|~~~).*?^\1|<!--.*?-->", "", body, flags=re.MULTILINE | re.DOTALL)
    parts = re.split(r"^## +(.+)$", body, flags=re.MULTILINE)
    headings = [parts[i].strip() for i in range(1, len(parts), 2)]
    sections = {parts[i].strip(): parts[i + 1].lower() for i in range(1, len(parts), 2)}
    raw = {parts[i].strip(): parts[i + 1] for i in range(1, len(parts), 2)}
    found = []
    present = [heading for heading in headings if heading in REQUIRED]
    if present != [heading for heading in REQUIRED if heading in present]:
        found.append(f"sections out of order: expected {', '.join(REQUIRED)}")
    first, last = list(REQUIRED)[0], list(REQUIRED)[-1]
    if headings and first in headings and headings[0] != first:
        found.append(f"'{first}' is not the first section")
    if headings and last in headings and headings[-1] != last:
        found.append(f"'{last}' is not the last section")
    for heading, phrases in REQUIRED.items():
        if heading not in sections:
            found.append(f"missing section '{heading}'")
            continue
        found += [f"missing in '{heading}': {phrase}" for phrase in phrases if phrase not in sections[heading]]
        found += [f"'{heading}' has no item **{label}**" for label in ITEMS.get(heading, [])
                  if not re.search(rf"^\s*(?:-|\d+\.)\s+\*\*{re.escape(label)}\*\*", raw[heading], re.MULTILINE)]
    return found


def _hook(front, skill):
    """The PreToolUse hook that runs scripts/tdd-guard on Write and Edit, and the script itself."""
    hooks = front.get("hooks") if isinstance(front.get("hooks"), dict) else {}
    entries = hooks.get("PreToolUse")
    registered = isinstance(entries, list) and any(_runs_guard(entry, skill.name) for entry in entries)
    found = [] if registered else ["hooks: no PreToolUse hook runs scripts/tdd-guard for Write and Edit"]
    guard = skill / "scripts" / "tdd-guard"
    if not (guard.is_file() and os.access(guard, os.X_OK)):
        found.append("hooks: scripts/tdd-guard is missing or not executable")
    return found


def _frontmatter(front, directory):
    found = [f"frontmatter: unknown key '{key}'" for key in sorted(set(front) - _KEYS)]
    name = front.get("name")
    if not name:
        found.append("frontmatter: name is missing")
    elif not isinstance(name, str) or not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", name) or len(name) > 64:
        found.append(f"frontmatter: name '{name}' is not kebab-case")
    elif name != directory:
        found.append(f"frontmatter: name '{name}' differs from the directory '{directory}'")
    description = front.get("description")
    if not description:
        found.append("frontmatter: description is missing")
    elif not isinstance(description, str):
        found.append("frontmatter: description must be text")
    else:
        if len(description) > 1024:
            found.append(f"frontmatter: description has {len(description)} characters (limit 1024)")
        if "<" in description or ">" in description:
            found.append("frontmatter: description contains angle brackets")
    return found


def _runs_guard(entry, name):
    """True for a hook entry whose matcher covers Write and Edit and whose command runs this skill's guard."""
    if not isinstance(entry, dict) or not isinstance(entry.get("hooks"), list):
        return False
    matcher = str(entry.get("matcher") or "*")  # Claude Code: no, empty or `*` matcher matches every tool
    try:
        matches = matcher == "*" or all(re.fullmatch(matcher, tool) for tool in ("Write", "Edit"))
    except re.error:
        return False
    commands = [str(hook.get("command", "")) for hook in entry["hooks"]
                if isinstance(hook, dict) and hook.get("type") == "command"]
    return matches and any(_runs_only(command, f".claude/skills/{name}/scripts/tdd-guard") for command in commands)


def _runs_only(command, guard):
    """True when the shell command runs `guard` and nothing else (directly, or through `sh`/`bash`)."""
    try:
        words = shlex.split(command)
    except ValueError:
        return False
    if words[:1] in (["sh"], ["bash"]):
        words = words[1:]
    return len(words) == 1 and words[0].endswith(guard)
