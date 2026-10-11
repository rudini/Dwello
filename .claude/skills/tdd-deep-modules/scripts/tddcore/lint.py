"""Check that a tdd-deep-modules skill directory holds everything the skill must contain."""
import os
import re
from pathlib import Path

import yaml

# keys Claude Code reads from a skill's frontmatter
_KEYS = {"name", "description", "license", "allowed-tools", "metadata", "compatibility", "hooks", "model",
         "argument-hint", "disable-model-invocation", "user-invocable", "context", "agent", "when_to_use",
         "version", "paths", "effort", "shell"}

LINE_LIMIT = 400  # SKILL.md must stay below this; details belong in references/

# every section the skill must have, in order, with the phrases it must contain (compared in lower case)
REQUIRED = {
    "Hard rules": ["no production code without a failing test", "never delete assertions",
                   "never paste computed values into expected values", "never mix refactoring with green",
                   "no tests on private methods"],
    "1. Detect the context": ["npx vitest run", "bun test", "git log -1 --format=%s", "does not apply"],
    "2. Design it twice": ["hidden decision", "two interface designs", "compare", "depth", "one sentence",
                           "chosen"],
    "3. Write the behaviour test list": ["one line per behaviour", "tdd-step test", "hidden decision",
                                         "both sketches"],
    "4. Red, green, refactor with tdd-step": ["scripts/tdd-step red", "scripts/tdd-step green",
                                              "scripts/tdd-step refactor", "one behaviour from the list per cycle",
                                              "git reset --soft head~1", "package.json"],
    "5. Depth check in every refactor": ["interface much simpler than the implementation", "classitis",
                                         "pass-through", "pull complexity downward", "size alone",
                                         "cumbersome tests", "wrong interface", "keep every test's name and file"],
    "6. Design note": ["hidden decision", "both designs", "reason", "depth_report", "tdd_replay"],
}


def problems(skill):
    """One message per problem found in the skill at `skill`; empty when it is valid."""
    skill = Path(skill)
    text = (skill / "SKILL.md").read_text()
    match = re.match(r"---\n(.*?)\n---\n", text, re.DOTALL)
    if not match:
        return ["SKILL.md has no frontmatter"]
    try:
        front = yaml.safe_load(match[1])
    except yaml.YAMLError:
        return ["frontmatter is not valid YAML"]
    if not isinstance(front, dict):
        return ["frontmatter is not valid YAML"]
    lines = len(text.splitlines())
    length = [f"SKILL.md has {lines} lines (limit: fewer than {LINE_LIMIT})"] if lines >= LINE_LIMIT else []
    return _frontmatter(front, skill.name) + _hook(front, skill) + _required(text[match.end():]) + length


def _required(body):
    parts = re.split(r"^## +(.+)$", body, flags=re.MULTILINE)
    headings = [parts[i].strip() for i in range(1, len(parts), 2)]
    sections = {parts[i].strip(): parts[i + 1].lower() for i in range(1, len(parts), 2)}
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
    return found


def _hook(front, skill):
    """The PreToolUse hook that runs scripts/tdd-guard on Write and Edit, and the script itself."""
    hooks = front.get("hooks") if isinstance(front.get("hooks"), dict) else {}
    registered = any(_runs_guard(entry) for entry in hooks.get("PreToolUse") or [])
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
    elif not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", str(name)) or len(str(name)) > 64:
        found.append(f"frontmatter: name '{name}' is not kebab-case")
    elif name != directory:
        found.append(f"frontmatter: name '{name}' differs from the directory '{directory}'")
    description = front.get("description")
    if not description:
        found.append("frontmatter: description is missing")
    else:
        description = str(description)
        if len(description) > 1024:
            found.append(f"frontmatter: description has {len(description)} characters (limit 1024)")
        if "<" in description or ">" in description:
            found.append("frontmatter: description contains angle brackets")
    return found


def _runs_guard(entry):
    """True for a hook entry whose matcher covers Write and Edit and that runs scripts/tdd-guard."""
    if not isinstance(entry, dict):
        return False
    try:
        matches = all(re.fullmatch(str(entry.get("matcher", "")), tool) for tool in ("Write", "Edit"))
    except re.error:
        return False
    commands = [str(hook.get("command", "")) for hook in entry.get("hooks") or [] if isinstance(hook, dict)]
    return matches and any("scripts/tdd-guard" in command for command in commands)
