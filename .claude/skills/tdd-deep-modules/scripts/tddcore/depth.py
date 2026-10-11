"""Measure how deep a TypeScript/JavaScript module is: its interface against its implementation."""
import os
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

from tddcore import protocol


@dataclass(frozen=True)
class Depth:
    path: str
    surface: int  # what a caller must know: exported names and their parameters
    size: int  # code lines: no blanks, no comments
    ratio: float  # size per unit of surface
    classitis: tuple  # names of tiny classes, when the module has two or more of them
    pass_through: tuple  # names of functions that only forward their arguments
    tests: tuple  # test files that import the module
    unused: tuple  # names of private functions nothing in the module calls
    duplicate: int  # extra copies of repeated code lines
    findings: tuple


SHALLOW_RATIO = 4  # fewer code lines per thing a caller must know means the module hides little
BLOAT_DUPLICATES = 3  # repeated lines that make a module bloated
DUPLICATE_LENGTH = 12  # shorter lines (`}`, `return x;`) repeat naturally
TINY_CLASS = 2  # methods; two or more classes this small spread one decision over many places


def measure(root, path):
    text = (Path(root) / path).read_text()
    surface, size = _surface(text), _size(text)
    ratio = size / surface if surface else float(size)
    pass_through = _pass_through(text)
    tests = _tests(Path(root) / path)
    unused, duplicate = _unused(text), _duplicate(text)
    tiny = [name for name, methods in _classes(text) if len(methods) <= TINY_CLASS]
    classitis = tuple(tiny) if len(tiny) >= 2 else ()
    findings = []
    if ratio < SHALLOW_RATIO:
        findings.append(f"shallow: ratio {ratio:.1f} < {SHALLOW_RATIO}")
    if classitis:
        findings.append(f"classitis: {', '.join(classitis)}")
    if pass_through:
        findings.append(f"pass-through: {', '.join(pass_through)}")
    if not tests:
        findings.append("untested: no test file imports it")
    bloat = ([f"unused {', '.join(unused)}"] if unused else []) + \
        ([f"{duplicate} duplicated lines"] if duplicate >= BLOAT_DUPLICATES else [])
    if bloat:
        findings.append(f"bloat: {'; '.join(bloat)}")
    return Depth(path, surface, size, ratio, classitis, pass_through, tests, unused, duplicate,
                 tuple(findings))


def _size(text):
    return sum(1 for line in text.splitlines() if line.strip() and not line.strip().startswith("//"))


def _surface(text):
    surface = 0
    for params in re.findall(r"^export (?:async )?function\*? *\w+ *\(([^)]*)\)", text, re.MULTILINE):
        surface += 1 + len([p for p in params.split(",") if p.strip()])
    return surface


# a function or method whose whole body returns one call: `name(params) { return target(args); }`
_FORWARD = re.compile(r"(?:function\s+)?(\w+)\s*\(([^()]*)\)[^{};=]*\{\s*return\s+[\w.]+\(([^()]*)\);?\s*\}")


def _pass_through(text):
    """Names of functions whose body only passes their own parameters, unchanged, to another call."""
    return tuple(name for name, params, args in _FORWARD.findall(text)
                 if _names(params) and _names(params) == [a.strip() for a in args.split(",") if a.strip()])


def _names(params):
    """Parameter names without types or defaults: `a: number, b = 2` -> [a, b]."""
    return [re.split(r"[?:=]", p)[0].strip() for p in params.split(",") if p.strip()]


def _classes(text):
    """[(name, [method names])] of every class, methods read from the class body's top level."""
    classes = []
    for match in re.finditer(r"\bclass\s+(\w+)[^{]*\{", text):
        body = _top_level(text[match.end():])
        methods = re.findall(r"^\s*(?:(?:public|protected|private|static|async|readonly)\s+)*(#?\w+)\s*\(",
                             body, re.MULTILINE)
        classes.append((match[1], [m for m in methods if m != "constructor"]))
    return classes


def _top_level(text):
    """The text up to the brace that closes the current block, with nested blocks left out."""
    depth, kept = 0, []
    for char in text:
        if char == "{":
            depth += 1
        elif char == "}":
            if depth == 0:
                break
            depth -= 1
        elif depth == 0:
            kept.append(char)
    return "".join(kept)


_SOURCE = {".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"}
_IMPORT = re.compile(r"""(?:\bfrom\s*|\bimport\s*\(?\s*)["'](\.{1,2}/[^"']*)["']""")


def _tests(module):
    """Test files of the module's repository whose relative imports resolve to the module."""
    module = module.resolve()
    top = Path(subprocess.run(["git", "rev-parse", "--show-toplevel"], cwd=module.parent, check=True,
                              capture_output=True, text=True).stdout.strip())
    listed = subprocess.run(["git", "ls-files", "-z", "-co", "--exclude-standard"], cwd=top, check=True,
                            capture_output=True, text=True).stdout.split("\0")
    target = module.with_suffix("")
    found = []
    for rel in listed:
        test = top / rel
        if Path(rel).suffix not in _SOURCE or protocol.is_production(rel) or not test.is_file():
            continue
        specs = _IMPORT.findall(test.read_text(errors="replace"))
        if any(Path(os.path.normpath(test.parent / spec)).with_suffix("") == target for spec in specs):
            found.append(rel)
    return tuple(found)


def _unused(text):
    """Top-level functions that are not exported and whose name appears nowhere else in the module."""
    declared = re.findall(r"^(?:async\s+)?function\*?\s*(\w+)|^(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\(",
                          text, re.MULTILINE)
    names = [a or b for a, b in declared]
    return tuple(n for n in names if len(re.findall(rf"\b{re.escape(n)}\b", text)) == 1)


def _duplicate(text):
    """Extra copies of code lines (DUPLICATE_LENGTH characters or longer) that occur more than once."""
    lines = [line.strip() for line in text.splitlines()]
    long = [line for line in lines if len(line) >= DUPLICATE_LENGTH and not line.startswith("//")]
    return len(long) - len(set(long))
