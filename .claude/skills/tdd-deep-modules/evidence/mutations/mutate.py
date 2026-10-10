"""mutate.py FILE OLD NEW TEST: apply one mutation, run one test, restore. Prints KILLED or SURVIVED."""
import subprocess, sys
from pathlib import Path
path, old, new, test = sys.argv[1:5]
p = Path(path); original = p.read_text()
assert original.count(old) == 1, f"mutation anchor not unique/found: {old!r}"
p.write_text(original.replace(old, new))
try:
    r = subprocess.run([sys.executable, "-m", "unittest", test], capture_output=True, text=True)
finally:
    p.write_text(original)
print(("KILLED  " if r.returncode else "SURVIVED"), f"{path}: {old!r} -> {new!r} [{test.rsplit('.',1)[-1]}]")
