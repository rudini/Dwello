"""Throwaway git repositories for driving the CLIs end to end."""
import os
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1]

ADD_TEST = """import unittest
from calc import add


class AddTest(unittest.TestCase):
    def test_adds(self):
        self.assertEqual(add(1, 2), 3)
"""
WRONG_ADD = "def add(a, b):\n    return 0\n"
RIGHT_ADD = "def add(a, b):\n    return a + b\n"


class Repo:
    def __init__(self, case, files):
        tmp = tempfile.TemporaryDirectory()
        case.addCleanup(tmp.cleanup)
        self.path = Path(tmp.name)
        self.git("init", "-q", "-b", "main")
        self.git("config", "user.email", "t@example.com")
        self.git("config", "user.name", "t")
        self.commit_all("init", files)

    def write(self, rel, text):
        target = self.path / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text)

    def git(self, *args):
        return subprocess.run(["git", *args], cwd=self.path, check=True,
                              capture_output=True, text=True).stdout.strip()

    def commit_all(self, message, files):
        for rel, text in files.items():
            self.write(rel, text)
        self.git("add", "-A")
        self.git("commit", "-q", "--allow-empty", "-m", message)
        return self.git("rev-parse", "HEAD")

    def run(self, script, *args):
        env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
        return subprocess.run([sys.executable, str(SCRIPTS / script), *args], cwd=self.path,
                              capture_output=True, text=True, env=env)

    def subject(self):
        return self.git("log", "-1", "--format=%s")

    def trailers(self):
        return self.git("log", "-1", "--format=%(trailers)")
