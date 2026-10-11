"""Measure how deep a TypeScript/JavaScript module is: its interface against its implementation."""
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Depth:
    path: str
    surface: int  # what a caller must know: exported names and their parameters
    size: int  # code lines: no blanks, no comments
    ratio: float  # size per unit of surface
    classitis: tuple  # names of tiny classes, when the module has two or more of them
    pass_through: tuple  # names of functions that only forward their arguments
    findings: tuple


SHALLOW_RATIO = 4  # fewer code lines per thing a caller must know means the module hides little
TINY_CLASS = 2  # methods; two or more classes this small spread one decision over many places


def measure(root, path):
    text = (Path(root) / path).read_text()
    surface, size = _surface(text), _size(text)
    ratio = size / surface if surface else float(size)
    pass_through = _pass_through(text)
    tiny = [name for name, methods in _classes(text) if len(methods) <= TINY_CLASS]
    classitis = tuple(tiny) if len(tiny) >= 2 else ()
    findings = []
    if ratio < SHALLOW_RATIO:
        findings.append(f"shallow: ratio {ratio:.1f} < {SHALLOW_RATIO}")
    if classitis:
        findings.append(f"classitis: {', '.join(classitis)}")
    if pass_through:
        findings.append(f"pass-through: {', '.join(pass_through)}")
    return Depth(path, surface, size, ratio, classitis, pass_through, tuple(findings))


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
