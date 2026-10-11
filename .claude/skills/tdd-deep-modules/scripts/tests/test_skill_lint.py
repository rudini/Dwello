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
