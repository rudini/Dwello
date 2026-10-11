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
    pass_through: tuple  # names of functions that only forward their arguments
    findings: tuple


SHALLOW_RATIO = 4  # fewer code lines per thing a caller must know means the module hides little


def measure(root, path):
    text = (Path(root) / path).read_text()
    surface, size = _surface(text), _size(text)
    ratio = size / surface if surface else float(size)
    pass_through = _pass_through(text)
    findings = []
    if ratio < SHALLOW_RATIO:
        findings.append(f"shallow: ratio {ratio:.1f} < {SHALLOW_RATIO}")
    if pass_through:
        findings.append(f"pass-through: {', '.join(pass_through)}")
    return Depth(path, surface, size, ratio, pass_through, tuple(findings))


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
