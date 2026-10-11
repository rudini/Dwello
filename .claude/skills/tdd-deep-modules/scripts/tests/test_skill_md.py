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

    def test_the_workflow_sections_follow_in_order(self):
        headings = [heading for heading, _ in sections()]
        workflow = ["1. Detect the context", "2. Design it twice", "3. Write the behaviour test list",
                    "4. Red, green, refactor with tdd-step", "5. Depth check in every refactor", "6. Design note"]

        self.assertEqual([h for h in headings if h in workflow], workflow)
        self.assertEqual(headings[-1], "6. Design note")
        self.assertLess(headings.index("Hard rules"), headings.index(workflow[0]))

    def test_design_it_twice_names_the_decision_two_designs_and_a_reason(self):
        text = dict(sections())["2. Design it twice"].lower()

        for element in ("hidden decision", "two interface designs", "compare", "depth",
                        "one sentence", "chosen"):
            self.assertIn(element, text)

    def test_the_depth_check_names_every_criterion(self):
        text = dict(sections())["5. Depth check in every refactor"].lower()

        for criterion in ("interface much simpler than the implementation", "classitis",
                          "pass-through", "pull complexity downward", "size alone",
                          "cumbersome tests", "wrong interface"):
            self.assertIn(criterion, text)

    def test_it_stays_short_and_every_reference_exists(self):
        text = SKILL.read_text()
        links = set(re.findall(r"references/[\w.-]+\.md", text))

        self.assertLess(len(text.splitlines()), 400)
        self.assertTrue(links, "SKILL.md links no references/ file")
        for link in sorted(links):
            self.assertTrue((SKILL.parent / link).is_file(), f"{link} does not exist")

    def test_the_design_note_records_the_design_at_the_end(self):
        text = dict(sections())["6. Design note"].lower()

        for element in ("hidden decision", "both designs", "reason", "depth_report", "tdd_replay"):
            self.assertIn(element, text)

    def test_detect_the_context_names_the_commands_and_an_exit(self):
        text = dict(sections())["1. Detect the context"]

        for element in ("npx vitest run", "bun test", "git log -1 --format=%s", "does not apply",
                        "only for vitest"):
            self.assertIn(element, text)

    def test_the_test_list_is_written_down_with_the_design(self):
        text = dict(sections())["3. Write the behaviour test list"]

        for element in ("one line per behaviour", "tdd-step test", "hidden decision", "both sketches"):
            self.assertIn(element, text.lower())

    def test_the_cycle_runs_through_tdd_step_and_has_a_way_back(self):
        text = dict(sections())["4. Red, green, refactor with tdd-step"]

        for element in ("scripts/tdd-step red", "scripts/tdd-step green", "scripts/tdd-step refactor",
                        "One behaviour from the list per cycle", "git reset --soft HEAD~1",
                        "package.json"):
            self.assertIn(element, text)

    def test_the_depth_check_keeps_tests_where_they_are(self):
        text = dict(sections())["5. Depth check in every refactor"]

        self.assertIn("keep every test's name and file", text)

    def test_the_cycle_is_honest_about_what_the_replay_checks(self):
        text = dict(sections())["4. Red, green, refactor with tdd-step"]

        self.assertNotIn("Never change a test after its green", text)
        for element in ("never what it expects", "does not catch a weakened assertion",
                        "git stash push -u --", "git stash pop"):
            self.assertIn(element, text)
