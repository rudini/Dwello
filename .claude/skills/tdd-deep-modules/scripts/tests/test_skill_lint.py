import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from tests.fixture import SCRIPTS

SKILL = SCRIPTS.parent


def lint(skill):
    return subprocess.run([sys.executable, str(SCRIPTS / "skill_lint"), str(skill)],
                          capture_output=True, text=True)


def copy_of_skill(case):
    """A copy of the real skill's SKILL.md, references/ and hook script, to break on purpose."""
    tmp = tempfile.TemporaryDirectory()
    case.addCleanup(tmp.cleanup)
    copy = Path(tmp.name) / SKILL.name
    shutil.copytree(SKILL / "references", copy / "references")
    (copy / "scripts").mkdir()
    shutil.copy2(SKILL / "scripts" / "tdd-guard", copy / "scripts" / "tdd-guard")
    shutil.copy2(SKILL / "SKILL.md", copy / "SKILL.md")
    return copy


class SkillLintTest(unittest.TestCase):
    def test_the_real_skill_passes(self):
        result = lint(SKILL)

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(result.stdout.strip(), "skill_lint: OK")

    def test_frontmatter_problems_are_named(self):
        real = (SKILL / "SKILL.md").read_text()
        description = next(line for line in real.splitlines() if line.startswith("description: "))
        body = real.split("---\n", 2)[2]
        cases = {
            "no frontmatter": (body, "SKILL.md has no frontmatter"),
            "unreadable": ("---\nname: [x\n---\n" + body, "frontmatter is not valid YAML"),
            "no name": (real.replace("name: tdd-deep-modules\n", ""), "frontmatter: name is missing"),
            "not kebab": (real.replace("name: tdd-deep-modules", "name: TDD_Deep"),
                          "frontmatter: name 'TDD_Deep' is not kebab-case"),
            "other name": (real.replace("name: tdd-deep-modules", "name: tdd-other"),
                           "frontmatter: name 'tdd-other' differs from the directory 'tdd-deep-modules'"),
            "no description": (real.replace(description + "\n", ""), "frontmatter: description is missing"),
            "long description": (real.replace(description, "description: " + "x" * 1100),
                                 "frontmatter: description has 1100 characters (limit 1024)"),
            "angle brackets": (real.replace(description, "description: Use for <tdd>"),
                               "frontmatter: description contains angle brackets"),
            "list description": (real.replace(description, "description: [Enforced, tdd]"),
                                 "frontmatter: description must be text"),
            "number description": (real.replace(description, "description: 42"),
                                   "frontmatter: description must be text"),
            "number name": (real.replace("name: tdd-deep-modules", "name: 123"),
                            "frontmatter: name '123' is not kebab-case"),
            "unknown key": (real.replace("name: tdd-deep-modules\n", "name: tdd-deep-modules\ncolor: red\n"),
                            "frontmatter: unknown key 'color'"),
        }
        for name, (text, message) in cases.items():
            with self.subTest(name):
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(text)

                result = lint(copy)

                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn(f"skill_lint: {message}\n", result.stdout)

    def test_the_guard_hook_must_be_registered(self):
        real = (SKILL / "SKILL.md").read_text()
        hooks = real[real.index("hooks:\n"):real.index("---\n", 4)]
        cases = {
            "no hooks": (lambda copy: (copy / "SKILL.md").write_text(real.replace(hooks, "")),
                         "hooks: no PreToolUse hook runs scripts/tdd-guard for Write and Edit"),
            "edit not matched": (lambda copy: (copy / "SKILL.md").write_text(
                real.replace('matcher: "Write|Edit|MultiEdit"', 'matcher: "Write"')),
                "hooks: no PreToolUse hook runs scripts/tdd-guard for Write and Edit"),
            "other command": (lambda copy: (copy / "SKILL.md").write_text(
                real.replace("scripts/tdd-guard'", "scripts/other'")),
                "hooks: no PreToolUse hook runs scripts/tdd-guard for Write and Edit"),
            "broken matcher": (lambda copy: (copy / "SKILL.md").write_text(
                real.replace('matcher: "Write|Edit|MultiEdit"', 'matcher: "Write|(Edit"')),
                "hooks: no PreToolUse hook runs scripts/tdd-guard for Write and Edit"),
            "script missing": (lambda copy: (copy / "scripts" / "tdd-guard").unlink(),
                               "hooks: scripts/tdd-guard is missing or not executable"),
            "not executable": (lambda copy: (copy / "scripts" / "tdd-guard").chmod(0o644),
                               "hooks: scripts/tdd-guard is missing or not executable"),
        }
        for name, (breaks, message) in cases.items():
            with self.subTest(name):
                copy = copy_of_skill(self)
                breaks(copy)

                result = lint(copy)

                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn(f"skill_lint: {message}\n", result.stdout)

    def test_a_missing_required_element_is_named_with_its_section(self):
        real = (SKILL / "SKILL.md").read_text()
        design = real[real.index("## 2. Design it twice"):real.index("## 3. ")]
        cases = {
            "phrase": (real.replace("classitis", "many classes"),
                       "missing in '5. Depth check in every refactor': classitis"),
            "hard rule": (real.replace("No tests on private methods", "Tests where it helps"),
                          "missing in 'Hard rules': no tests on private methods"),
            "section": (real.replace(design, ""), "missing section '2. Design it twice'"),
        }
        for name, (text, message) in cases.items():
            with self.subTest(name):
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(text)

                result = lint(copy)

                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn(f"skill_lint: {message}\n", result.stdout)

    def test_sections_out_of_order_are_named(self):
        real = (SKILL / "SKILL.md").read_text()
        rules = real[real.index("## Hard rules"):real.index("## 1. ")]
        design = real[real.index("## 2. "):real.index("## 3. ")]
        tests = real[real.index("## 3. "):real.index("## 4. ")]
        cases = {
            "swapped": (real.replace(design + tests, tests + design),
                        "sections out of order: expected Hard rules, 1. Detect the context, "
                        "2. Design it twice, 3. Write the behaviour test list"),
            "rules late": (real.replace(rules, "") + "\n" + rules, "sections out of order"),
            "note not last": (real + "\n## 7. Extras\n\nMore.\n", "'6. Design note' is not the last section"),
        }
        for name, (text, message) in cases.items():
            with self.subTest(name):
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(text)

                result = lint(copy)

                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn(f"skill_lint: {message}", result.stdout)

    def test_the_hard_rules_must_be_the_first_section(self):
        real = (SKILL / "SKILL.md").read_text()
        copy = copy_of_skill(self)
        (copy / "SKILL.md").write_text(real.replace("## Hard rules", "## Background\n\nHistory.\n\n## Hard rules"))

        result = lint(copy)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("skill_lint: 'Hard rules' is not the first section\n", result.stdout)

    def test_a_skill_md_of_400_lines_or_more_is_too_long(self):
        real = (SKILL / "SKILL.md").read_text()
        padding = "\n" * (400 - len(real.splitlines()))
        copy = copy_of_skill(self)
        (copy / "SKILL.md").write_text(real.replace("## Hard rules", padding + "## Hard rules"))

        result = lint(copy)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("skill_lint: SKILL.md has 400 lines (limit: fewer than 400)\n", result.stdout)

    def test_a_missing_reference_file_is_named(self):
        copy = copy_of_skill(self)
        (copy / "references" / "depth.md").unlink()

        result = lint(copy)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("skill_lint: references/depth.md is linked but does not exist\n", result.stdout)

    def test_a_directory_without_skill_md_exits_2(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)

        result = lint(Path(tmp.name))

        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
        self.assertIn(f"skill_lint: no SKILL.md in {tmp.name}", result.stderr)
        self.assertNotIn("Traceback", result.stderr)

    def test_the_review_hardened_statements_are_required(self):
        real = (SKILL / "SKILL.md").read_text()
        cases = {
            "one-sentence reason": ("2. Design it twice", "one-sentence reason"),
            "One test per cycle": ("Hard rules", "one test per cycle"),
            "no second test before the first is green": ("4. Red, green, refactor with tdd-step",
                                                         "no second test before the first is green"),
            "never what it expects": ("4. Red, green, refactor with tdd-step", "never what it expects"),
            "git stash push -u --": ("4. Red, green, refactor with tdd-step", "git stash push -u --"),
            "changed production .ts/.js files": ("5. Depth check in every refactor",
                                                 "changed production .ts/.js files"),
            "not assertion strength": ("6. Design note", "not assertion strength"),
        }
        for phrase, (section, named) in cases.items():
            with self.subTest(phrase):
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(real.replace(phrase, "removed"))

                result = lint(copy)

                self.assertIn(f"skill_lint: missing in '{section}': {named}\n", result.stdout)

    def test_a_relative_skill_path_is_judged_by_its_real_directory_name(self):
        copy = copy_of_skill(self)

        result = subprocess.run([sys.executable, str(SCRIPTS / "skill_lint"), "."], cwd=copy,
                                capture_output=True, text=True)

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_a_skill_md_that_is_not_utf8_is_named(self):
        copy = copy_of_skill(self)
        (copy / "SKILL.md").write_bytes((SKILL / "SKILL.md").read_bytes() + b"\xff\n")

        result = lint(copy)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("skill_lint: SKILL.md is not valid UTF-8\n", result.stdout)
        self.assertNotIn("Traceback", result.stderr)

    def test_an_inverted_element_is_named(self):
        real = (SKILL / "SKILL.md").read_text()
        cases = {
            "**No classitis.**": ("**Prefer classitis.**", "5. Depth check in every refactor", "no classitis"),
            "**No pass-through wrappers.**": ("**Add pass-through wrappers freely.**",
                                              "5. Depth check in every refactor", "no pass-through wrappers"),
            "**Do not split by size alone.**": ("**Split by size alone.**", "5. Depth check in every refactor",
                                                "do not split by size alone"),
            "**Cumbersome tests signal a wrong interface.**": (
                "**Cumbersome tests are fine; a wrong interface is rare.**", "5. Depth check in every refactor",
                "cumbersome tests signal a wrong interface"),
            "**Compare them by depth:**": ("**Compare them by line count:**", "2. Design it twice",
                                           "compare them by depth"),
            "**Pull complexity downward.**": ("**Push complexity to callers.**", "5. Depth check in every refactor",
                                              "pull complexity downward"),
        }
        for original, (inverted, section, named) in cases.items():
            with self.subTest(original):
                self.assertIn(original, real)
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(real.replace(original, inverted))

                result = lint(copy)

                self.assertIn(f"skill_lint: missing in '{section}': {named}\n", result.stdout)

    def test_every_reference_file_must_be_linked(self):
        real = (SKILL / "SKILL.md").read_text()
        copy = copy_of_skill(self)
        (copy / "SKILL.md").write_text(real.replace("references/depth.md", "the depth notes"))

        result = lint(copy)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("skill_lint: references/depth.md is not linked from SKILL.md\n", result.stdout)

    def test_the_hook_check_follows_claude_codes_matcher_and_command_rules(self):
        real = (SKILL / "SKILL.md").read_text()
        matcher = 'matcher: "Write|Edit|MultiEdit"'
        command = "'\"$CLAUDE_PROJECT_DIR\"/.claude/skills/tdd-deep-modules/scripts/tdd-guard'"
        self.assertIn(matcher, real)
        self.assertIn(command, real)
        accepted = {"star matcher": real.replace(matcher, 'matcher: "*"'),
                    "empty matcher": real.replace(matcher, 'matcher: ""'),
                    "no matcher": real.replace("    - " + matcher + "\n      hooks:", "    - hooks:")}
        rejected = {"prompt hook": real.replace("type: command", "type: prompt"),
                    "echo": real.replace(command, "'echo scripts/tdd-guard'")}
        for name, text in {**accepted, **rejected}.items():
            with self.subTest(name):
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(text)

                result = lint(copy)

                registered = "hooks: no PreToolUse hook" not in result.stdout
                self.assertEqual(registered, name in accepted, result.stdout)

    def test_a_byte_order_mark_is_named(self):
        copy = copy_of_skill(self)
        (copy / "SKILL.md").write_bytes(b"\xef\xbb\xbf" + (SKILL / "SKILL.md").read_bytes())

        result = lint(copy)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertEqual(result.stdout, "skill_lint: SKILL.md starts with a byte order mark; save it without one\n")

    def test_headings_inside_code_fences_are_not_sections(self):
        real = (SKILL / "SKILL.md").read_text()
        rules = real[real.index("## Hard rules"):real.index("## 1. ")]
        copy = copy_of_skill(self)
        (copy / "SKILL.md").write_text(real.replace(rules, "```\n" + rules + "```\n\n"))

        result = lint(copy)

        self.assertIn("skill_lint: missing section 'Hard rules'\n", result.stdout)

    def test_a_duplicate_frontmatter_key_is_named(self):
        real = (SKILL / "SKILL.md").read_text()
        copy = copy_of_skill(self)
        (copy / "SKILL.md").write_text(real.replace("name: tdd-deep-modules\n",
                                                    "name: tdd-deep-modules\nname: tdd-deep-modules\n"))

        result = lint(copy)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("skill_lint: frontmatter: key 'name' appears twice\n", result.stdout)


    def test_a_negated_item_is_named(self):
        real = (SKILL / "SKILL.md").read_text()
        items = {
            "Hard rules": ["No production code without a failing test.",
                           "Never delete assertions, and never paste computed values into expected values.",
                           "Never mix refactoring with green.", "No tests on private methods.", "One test per cycle."],
            "2. Design it twice": ["Name the one hidden decision", "Sketch two interface designs",
                                   "Compare them by depth:", "Record the chosen design with a one-sentence reason"],
            "4. Red, green, refactor with tdd-step": ["Red.", "Green.", "Refactor."],
            "5. Depth check in every refactor": ["Interface much simpler than the implementation.", "No classitis.",
                                                 "No pass-through wrappers.", "Pull complexity downward.",
                                                 "Do not split by size alone.",
                                                 "Cumbersome tests signal a wrong interface."],
            "6. Design note": ["Hidden decision:", "Both designs:", "Interface:", "Depth:", "Open points:", "Proof:"],
        }
        for section, labels in items.items():
            for label in labels:
                with self.subTest(label):
                    self.assertIn(f"**{label}**", real)
                    copy = copy_of_skill(self)
                    (copy / "SKILL.md").write_text(real.replace(f"**{label}**", f"**Do not {label.lower()}**", 1))

                    result = lint(copy)

                    self.assertIn(f"skill_lint: '{section}' has no item **{label}**\n", result.stdout)

    def test_inverting_the_framing_sentences_is_named(self):
        real = (SKILL / "SKILL.md").read_text()
        cases = {"Break none of these, even when it would be faster.":
                 ("Break any of these when it would be faster.", "Hard rules", "break none of these"),
                 "In every refactor phase": ("In some refactor phases", "5. Depth check in every refactor",
                                             "in every refactor phase")}
        for original, (inverted, section, named) in cases.items():
            with self.subTest(original):
                self.assertIn(original, real)
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(real.replace(original, inverted))

                result = lint(copy)

                self.assertIn(f"skill_lint: missing in '{section}': {named}\n", result.stdout)

    def test_the_hook_must_run_exactly_this_skills_guard(self):
        real = (SKILL / "SKILL.md").read_text()
        command = "'\"$CLAUDE_PROJECT_DIR\"/.claude/skills/tdd-deep-modules/scripts/tdd-guard'"
        guard = '"$CLAUDE_PROJECT_DIR"/.claude/skills/tdd-deep-modules/scripts/tdd-guard'
        hooks = real[real.index("  PreToolUse:\n"):real.index("---\n", 4)]
        accepted = {"bash": real.replace(command, f"'bash {guard}'")}
        rejected = {"or true": real.replace(command, f"'{guard} || true'"),
                    "other skill": real.replace(command, "'\"$CLAUDE_PROJECT_DIR\"/.claude/skills/other/scripts/tdd-guard'"),
                    "unbalanced quote": real.replace(command, "'\"$CLAUDE_PROJECT_DIR/.claude/skills/tdd-deep-modules/scripts/tdd-guard'"),
                    "entry not a mapping": real.replace(hooks, "  PreToolUse:\n    - just a string\n"),
                    "PreToolUse a number": real.replace(hooks, "  PreToolUse: 3\n"),
                    "hooks a number": real.replace("      hooks:\n        - type: command", "      hooks: 3\n      x:\n        - type: command")}
        for name, text in {**accepted, **rejected}.items():
            with self.subTest(name):
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(text)

                result = lint(copy)

                self.assertNotIn("Traceback", result.stderr)
                registered = "hooks: no PreToolUse hook" not in result.stdout
                self.assertEqual(registered, name in accepted, result.stdout + result.stderr)

    def test_tilde_fences_and_html_comments_hold_no_sections(self):
        real = (SKILL / "SKILL.md").read_text()
        rules = real[real.index("## Hard rules"):real.index("## 1. ")]
        for name, (opening, closing) in {"tilde fence": ("~~~\n", "~~~\n\n"), "comment": ("<!--\n", "-->\n\n")}.items():
            with self.subTest(name):
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(real.replace(rules, opening + rules + closing))

                result = lint(copy)

                self.assertIn("skill_lint: missing section 'Hard rules'\n", result.stdout)

    def test_the_doubles_rule_is_required(self):
        real = (SKILL / "SKILL.md").read_text()
        cases = {
            "the item": (real.replace("**Doubles only at system boundaries.**", "**Doubles where they help.**"),
                         "'Hard rules' has no item **Doubles only at system boundaries.**"),
            "own logic": (real.replace("No mocks or spies of your own logic", "Mock what is slow"),
                          "missing in 'Hard rules': no mocks or spies of your own logic"),
            "real objects": (real.replace("real objects by default", "mocks by default"),
                             "missing in 'Hard rules': real objects by default"),
            "boundaries": (real.replace("mail, login, network, framework modules, external backends", "anything"),
                           "missing in 'Hard rules': mail, login, network, framework modules, external backends"),
            "contract suite": (real.replace("against both the fake and the real implementation", "against the fake"),
                               "missing in 'Hard rules': against both the fake and the real implementation"),
            "adapter": (real.replace("fake the adapter, not the framework", "fake the framework"),
                        "missing in 'Hard rules': fake the adapter, not the framework"),
            "many mocks": (real.replace("Many mocks in a test signal a wrongly cut interface", "Mocks are fine"),
                           "missing in 'Hard rules': many mocks in a test signal a wrongly cut interface"),
        }
        for name, (text, message) in cases.items():
            with self.subTest(name):
                self.assertNotEqual(text, real)
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(text)

                result = lint(copy)

                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn(f"skill_lint: {message}\n", result.stdout)

    def test_the_test_boundary_and_the_swarm_item_are_required(self):
        real = (SKILL / "SKILL.md").read_text()
        cases = {
            "boundary": (real.replace("The test boundary is the public interface of the deep module or service",
                                      "Test what you like"),
                         "missing in 'Hard rules': the test boundary is the public interface of the deep module"
                         " or service"),
            "helpers": (real.replace("with no tests and no public exports of their own", "with their own tests"),
                        "missing in 'Hard rules': no tests and no public exports of their own"),
            "the item": (real.replace("**No swarm of exported helpers.**", "**Export helpers freely.**"),
                         "'5. Depth check in every refactor' has no item **No swarm of exported helpers.**"),
            "core": (real.replace("A functional core is fine as internal structure", "Export the core"),
                     "missing in '5. Depth check in every refactor': a functional core is fine as internal"
                     " structure"),
            "one caller": (real.replace("small exported pure functions with one caller", "exported functions"),
                           "missing in '5. Depth check in every refactor': small exported pure functions with one"
                           " caller"),
        }
        for name, (text, message) in cases.items():
            with self.subTest(name):
                self.assertNotEqual(text, real)
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(text)

                result = lint(copy)

                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn(f"skill_lint: {message}\n", result.stdout)

    def test_the_doubles_and_depth_rules_are_guarded_as_whole_statements(self):
        real = (SKILL / "SKILL.md").read_text()
        contract = "Every fake of a boundary has a contract test suite that runs against both the fake and the real implementation."
        adapter = "Wrap a framework module (such as SvelteKit's `$app/*`) in a small project-owned adapter"
        cases = {
            "contract optional": (real.replace(contract, "A fake needs no contract test suite; at most, compare it once by "
                                               "hand against both the fake and the real implementation."),
                                  "missing in 'Hard rules': every fake of a boundary has a contract test suite"),
            "adapter dropped": (real.replace(adapter, "Mock `$app/*` directly with vi.mock; if you ever write an adapter"),
                                "missing in 'Hard rules': in a small project-owned adapter"),
            "helpers are details": (real.replace("Pure helper functions inside it are implementation details",
                                                 "Pure helper functions inside it deserve tests"),
                                    "missing in 'Hard rules': pure helper functions inside it are implementation details"),
            "swarm is fine": (real.replace("with one caller each are classitis too", "with one caller each are fine"),
                              "missing in '5. Depth check in every refactor': with one caller each are classitis"),
        }
        for name, (text, message) in cases.items():
            with self.subTest(name):
                self.assertNotEqual(text, real)
                copy = copy_of_skill(self)
                (copy / "SKILL.md").write_text(text)

                result = lint(copy)

                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn(f"skill_lint: {message}\n", result.stdout)
