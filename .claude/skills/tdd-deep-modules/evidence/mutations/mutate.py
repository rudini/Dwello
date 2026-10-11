"""mutate.py FILE OLD NEW TEST: apply one mutation, run one test, restore.

Prints KILLED or SURVIVED; prints BASELINE-FAILS (and mutates nothing) when TEST fails unmutated,
because a kill only counts when the test passed before the mutation.
"""
import subprocess
import sys
from pathlib import Path

path, old, new, test = sys.argv[1:5]
label = f"{path}: {old!r} -> {new!r} [{test.rsplit('.', 1)[-1]}]"


def passes():
    return subprocess.run([sys.executable, "-m", "unittest", test], capture_output=True).returncode == 0


if not passes():
    sys.exit(f"BASELINE-FAILS {label}")
p = Path(path)
original = p.read_text()
assert original.count(old) == 1, f"mutation anchor not unique/found: {old!r}"
p.write_text(original.replace(old, new))
try:
    killed = not passes()
finally:
    p.write_text(original)
print("KILLED  " if killed else "SURVIVED", label)
