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
