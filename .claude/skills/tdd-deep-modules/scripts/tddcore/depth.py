"""Measure how deep a TypeScript/JavaScript module is: its interface against its implementation."""
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Depth:
    path: str
    surface: int  # what a caller must know: exported names and their parameters
    size: int  # code lines: no blanks, no comments
    findings: tuple

    @property
    def ratio(self):
        return self.size / self.surface if self.surface else float(self.size)


def measure(root, path):
    text = (Path(root) / path).read_text()
    return Depth(path, _surface(text), _size(text), ())


def _size(text):
    return sum(1 for line in text.splitlines() if line.strip() and not line.strip().startswith("//"))


def _surface(text):
    surface = 0
    for params in re.findall(r"^export (?:async )?function\*? *\w+ *\(([^)]*)\)", text, re.MULTILINE):
        surface += 1 + len([p for p in params.split(",") if p.strip()])
    return surface
