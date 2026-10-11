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
