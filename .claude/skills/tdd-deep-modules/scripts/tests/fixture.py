"""Throwaway git repositories for driving the CLIs end to end."""
import os
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1]

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

    def commit_phase(self, phase, files, exit_code, deleted=(), suite="full"):
        """A hand-built phase commit, shaped like tdd-step's, whatever the suite really does."""
        for rel, text in files.items():
            self.write(rel, text)
        for rel in deleted:
            (self.path / rel).unlink()
        self.git("add", "-A")
        tier = ["--trailer", f"TDD-Suite: {suite}"] if suite else []
        self.git("commit", "-q", "--allow-empty", "-m", f"{phase}: {phase} step",
                 "--trailer", f"TDD-Phase: {phase}", "--trailer", f"TDD-Exit-Code: {exit_code}", *tier)
        return self.git("rev-parse", "HEAD")

    def run(self, script, *args, cwd=".", path=None):
        env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
        if path is not None:
            env["PATH"] = path
        return subprocess.run([sys.executable, str(SCRIPTS / script), *args], cwd=self.path / cwd,
                              capture_output=True, text=True, env=env)

    def subject(self):
        return self.git("log", "-1", "--format=%s")

    def trailers(self):
        return self.git("log", "-1", "--format=%(trailers)")

    def trailer(self, key):
        """All values of trailer `key` on HEAD, so a forged duplicate shows up."""
        return self.git("log", "-1", f"--format=%(trailers:key={key},valueonly,separator=%x2C)")

RIGHT_ADD_JS = "export const add = (a, b) => a + b;\n"
VITEST_FILES = {"package.json": '{"devDependencies": {"vitest": "*"}}\n',
                ".gitignore": "node_modules\n",
                # like Dwello's own config: vitest owns the root tests, bun owns backend/
                "vitest.config.js": 'export default { test: { include: ["*.test.js"] } };\n',
                "calc.js": "export const add = (a, b) => 0;\n"}
VITEST_TEST = """import { test, expect } from "vitest";
import { add } from "./calc.js";

test("adds", () => {
  expect(add(1, 2)).toBe(3);
});
"""


def vitest_repo(case):
    """A vitest project borrowing this checkout's node_modules (run `npm ci` at the repo root)."""
    node_modules = SCRIPTS.parents[3] / "node_modules"
    case.assertTrue((node_modules / ".bin" / "vitest").exists(), f"missing {node_modules}; run npm ci")
    repo = Repo(case, VITEST_FILES)
    (repo.path / "node_modules").symlink_to(node_modules)
    return repo

BUN_FILES = {"backend/package.json": '{"scripts": {"test": "bun test"}}\n',
             "backend/calc.ts": "export const add = (a: number, b: number) => a + b;\n",
             "backend/calc.test.ts": 'import { test, expect } from "bun:test";\nimport { add } from "./calc";\n\n'
                                     'test("adds", () => {\n  expect(add(1, 2)).toBe(3);\n});\n'}

BUN_PACKAGE = '{"scripts": {"test": "bun test"}}\n'
WRONG_ADD_TS = "export const add = (a: number, b: number) => 0;\n"
RIGHT_ADD_TS = "export const add = (a: number, b: number) => a + b;\n"
BUN_TEST = ('import { test, expect } from "bun:test";\nimport { add } from "./calc";\n\n'
            'test("adds", () => {\n  expect(add(1, 2)).toBe(3);\n});\n')


def bun_repo(case, calc=WRONG_ADD_TS, **files):
    """A bun project at the repository root with `calc.ts` and no tests yet."""
    return Repo(case, {"package.json": BUN_PACKAGE, "calc.ts": calc, **files})

# fast tier: everything but *.pg.test.ts; full tier: everything (like Dwello's backend)
TIERED_PACKAGE = ('{"scripts": {"test": "bun test",'
                  ' "test:fast": "bun test --path-ignore-patterns=**/*.pg.test.ts"}}\n')
NO_DATABASE_TEST = ('import { test, expect } from "bun:test";\n\n'
                    'test("reads the database", () => {\n  expect("no database").toBe("rows");\n});\n')


def tiered_repo(case, calc=WRONG_ADD_TS, **files):
    """A bun project whose full tier holds a database test that fails (no database here)."""
    return bun_repo(case, calc, **{"package.json": TIERED_PACKAGE, "db.pg.test.ts": NO_DATABASE_TEST,
                                   **files})
