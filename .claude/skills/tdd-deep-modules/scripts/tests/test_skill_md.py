"""The real SKILL.md carries every required element, in order."""
import re
import unittest

from tests.fixture import SCRIPTS

SKILL = SCRIPTS.parent / "SKILL.md"


def sections():
    """[(heading, text)] of the `## ` sections of SKILL.md's body, in order."""
    body = SKILL.read_text().split("---\n", 2)[2]
    parts = re.split(r"^## +(.+)$", body, flags=re.MULTILINE)
    return [(parts[i].strip(), parts[i + 1]) for i in range(1, len(parts), 2)]


class SkillMdTest(unittest.TestCase):
    def test_the_hard_rules_come_first(self):
        found = sections()
        self.assertTrue(found, "SKILL.md has no ## sections")
        heading, text = found[0]

        self.assertEqual(heading, "Hard rules")
        for rule in ("no production code without a failing test", "never delete assertions",
                     "never paste computed values into expected values", "never mix refactoring with green",
                     "no tests on private methods"):
            self.assertIn(rule, text.lower())
