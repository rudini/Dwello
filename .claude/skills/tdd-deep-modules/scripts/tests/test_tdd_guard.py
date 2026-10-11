import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

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

    def test_files_outside_git_pass_and_bad_input_never_blocks(self):
        with self.subTest("outside git"), tempfile.TemporaryDirectory() as plain:
            event = {"tool_name": "Write", "tool_input": {"file_path": f"{plain}/calc.ts"}}
            result = subprocess.run([sys.executable, str(SCRIPTS / "tdd-guard")], input=json.dumps(event),
                                    cwd=plain, capture_output=True, text=True)

            self.assertEqual(result.returncode, 0, result.stderr)
        with self.subTest("malformed input"):
            result = subprocess.run([sys.executable, str(SCRIPTS / "tdd-guard")], input="not json",
                                    capture_output=True, text=True)

            self.assertEqual(result.returncode, 1, result.stderr)
            self.assertIn("tdd-guard: cannot read the hook input", result.stderr)
            self.assertNotIn("Traceback", result.stderr)

    def test_paths_are_resolved_before_they_are_judged(self):
        repo = bun_repo(self, **{"tests/keep.md": "x\n"})
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n"}, 1)
        with tempfile.TemporaryDirectory() as elsewhere:
            link = Path(elsewhere) / "link"
            link.symlink_to(repo.path)
            for name, path in (("dot-dot through tests/", f"{repo.path}/tests/../calc.ts"),
                               ("symlinked checkout", f"{link}/calc.ts")):
                with self.subTest(name):
                    event = {"tool_name": "Edit", "tool_input": {"file_path": path}}
                    result = subprocess.run([sys.executable, str(SCRIPTS / "tdd-guard")],
                                            input=json.dumps(event), capture_output=True, text=True)

                    self.assertEqual(result.returncode, 2, result.stderr)
                    self.assertIn("calc.ts is production code", result.stderr)

    def test_code_suffixes_are_matched_without_case(self):
        repo = bun_repo(self)
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n"}, 1)

        result = guard(repo, "Write", "Calc.TS")

        self.assertEqual(result.returncode, 2, result.stderr)

    def test_odd_input_shapes_are_a_clean_non_blocking_error(self):
        for raw in ("[]", '{"tool_input": "calc.ts"}', '{"tool_input": {"file_path": 3}}'):
            with self.subTest(raw):
                result = subprocess.run([sys.executable, str(SCRIPTS / "tdd-guard")], input=raw,
                                        capture_output=True, text=True)

                self.assertEqual(result.returncode, 1, result.stderr)
                self.assertIn("tdd-guard: cannot read the hook input", result.stderr)
                self.assertNotIn("Traceback", result.stderr)

    def test_a_toplevel_in_different_letter_case_still_blocks(self):
        repo = bun_repo(self)
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n"}, 1)
        real_git = shutil.which("git")
        with tempfile.TemporaryDirectory() as bin_dir:
            # like macOS on a case-insensitive disk: git reports the toplevel in its own spelling
            fake = Path(bin_dir) / "git"
            fake.write_text(f'#!/bin/sh\nif [ "$1 $2" = "rev-parse --show-toplevel" ]; then\n'
                            f'  {real_git} "$@" | tr "[:lower:]" "[:upper:]"\nelse\n  exec {real_git} "$@"\nfi\n')
            fake.chmod(0o755)
            event = {"tool_name": "Edit", "tool_input": {"file_path": str(repo.path / "calc.ts")}}
            result = subprocess.run([sys.executable, str(SCRIPTS / "tdd-guard")], input=json.dumps(event),
                                    capture_output=True, text=True,
                                    env={**os.environ, "PATH": f"{bin_dir}:{os.environ['PATH']}"})

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("calc.ts is production code", result.stderr)

    def test_a_git_failure_other_than_no_repository_is_reported(self):
        repo = bun_repo(self)
        with tempfile.TemporaryDirectory() as bin_dir:
            fake = Path(bin_dir) / "git"
            fake.write_text("#!/bin/sh\necho \"fatal: detected dubious ownership in repository at '$PWD'\" >&2\nexit 128\n")
            fake.chmod(0o755)
            event = {"tool_name": "Edit", "tool_input": {"file_path": str(repo.path / "calc.ts")}}
            result = subprocess.run([sys.executable, str(SCRIPTS / "tdd-guard")], input=json.dumps(event),
                                    capture_output=True, text=True,
                                    env={**os.environ, "PATH": f"{bin_dir}:{os.environ['PATH']}"})

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("tdd-guard: cannot check calc.ts: fatal: detected dubious ownership", result.stderr)

    def test_files_in_existing_directories_are_placed_by_git(self):
        repo = bun_repo(self, **{"tests/keep.md": "x\n", "src/keep.md": "x\n"})
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n"}, 1)
        (repo.path / "tests" / "alias.ts").symlink_to(repo.path / "src" / "calc.ts")
        for rel, expected in (("tests/helpers.ts", 0), ("src/calc.ts", 2), ("tests/alias.ts", 2)):
            with self.subTest(rel):
                result = guard(repo, "Edit", rel)

                self.assertEqual(result.returncode, expected, result.stderr)
