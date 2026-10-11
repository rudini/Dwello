import json
import subprocess
import sys
import unittest

from tests.fixture import SCRIPTS, bun_repo


def guard(repo, tool, rel, field="file_path"):
    event = {"hook_event_name": "PreToolUse", "cwd": str(repo.path), "tool_name": tool,
             "tool_input": {field: str(repo.path / rel)}}
    return subprocess.run([sys.executable, str(SCRIPTS / "tdd-guard")], input=json.dumps(event),
                          cwd=repo.path, capture_output=True, text=True)


class TddGuardTest(unittest.TestCase):
    def test_a_production_edit_after_a_test_commit_is_blocked(self):
        repo = bun_repo(self)
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n"}, 1)

        result = guard(repo, "Edit", "calc.ts")

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("calc.ts is production code and the last TDD phase is test", result.stderr)

    def test_a_production_edit_after_red_is_allowed(self):
        repo = bun_repo(self)
        repo.commit_phase("red", {"calc.test.ts": "test"}, 1)

        result = guard(repo, "Edit", "calc.ts")

        self.assertEqual(result.returncode, 0, result.stderr)

    def test_production_edits_are_allowed_for_refactoring(self):
        for phase in ("green", "refactor"):
            with self.subTest(phase):
                repo = bun_repo(self)
                repo.commit_phase(phase, {"notes.md": phase}, 0)

                result = guard(repo, "Edit", "calc.ts")

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_writing_a_new_production_file_in_a_new_directory_is_judged_too(self):
        repo = bun_repo(self)
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n"}, 1)

        result = guard(repo, "Write", "src/new/calc.ts")

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("src/new/calc.ts is production code", result.stderr)

    def test_production_edits_are_blocked_before_any_tdd_commit(self):
        repo = bun_repo(self)

        result = guard(repo, "MultiEdit", "calc.ts")

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("last TDD phase is start", result.stderr)

    def test_test_files_may_always_be_edited(self):
        repo = bun_repo(self)
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n"}, 1)
        for rel in ("calc.test.ts", "tests/helpers.ts", "vitest.config.ts", "TESTLIST.md"):
            with self.subTest(rel):
                result = guard(repo, "Write", rel)

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_tools_without_a_file_path_pass(self):
        repo = bun_repo(self)
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n"}, 1)
        for tool, field in (("Bash", "command"), ("NotebookEdit", "notebook_path")):
            with self.subTest(tool):
                result = guard(repo, tool, "analysis.ipynb", field=field)

                self.assertEqual(result.returncode, 0, result.stderr)
