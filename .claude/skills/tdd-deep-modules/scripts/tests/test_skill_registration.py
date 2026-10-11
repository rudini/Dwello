import json
import os
import subprocess
import unittest

import yaml

from tests.fixture import SCRIPTS, bun_repo

SKILL = SCRIPTS.parent / "SKILL.md"
PROJECT = SCRIPTS.parents[3]  # the repository that holds .claude/skills/


def frontmatter():
    _, header, _ = SKILL.read_text().split("---\n", 2)
    return yaml.safe_load(header)


class SkillRegistrationTest(unittest.TestCase):
    def test_skill_md_registers_the_guard_as_a_pre_tool_use_hook(self):
        self.assertTrue(SKILL.is_file(), f"{SKILL} is missing")
        meta = frontmatter()
        entry = meta["hooks"]["PreToolUse"][0]
        hook = entry["hooks"][0]

        self.assertEqual(meta["name"], "tdd-deep-modules")
        self.assertEqual(entry["matcher"], "Write|Edit|MultiEdit")
        self.assertEqual(hook["type"], "command")

        repo = bun_repo(self)
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n"}, 1)
        event = {"tool_name": "Edit", "tool_input": {"file_path": str(repo.path / "calc.ts")}}
        # run the registered command the way Claude Code does: a shell with CLAUDE_PROJECT_DIR set
        result = subprocess.run(["sh", "-c", hook["command"]], input=json.dumps(event), cwd=repo.path,
                                capture_output=True, text=True,
                                env={**os.environ, "CLAUDE_PROJECT_DIR": str(PROJECT)})

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("calc.ts is production code", result.stderr)
