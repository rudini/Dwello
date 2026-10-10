import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { ts } from 'ts-morph';

export interface Coupling {
	fanIn: number;
	fanOut: number;
}

const SVELTE_SCRIPT = /<script[^>]*>([\s\S]*?)<\/script>/g;

function importSpecifiers(text: string, path: string): string[] {
	const code = path.endsWith('.svelte') ? [...text.matchAll(SVELTE_SCRIPT)].map((m) => m[1]).join('\n') : text;
	return ts.preProcessFile(code, true, true).importedFiles.map((f) => f.fileName);
}

/** Compiler options of the nearest tsconfig.json at or above the file (within root), cached per config. */
function optionsFinder(root: string): (file: string) => ts.CompilerOptions {
	const cache = new Map<string, ts.CompilerOptions>();
	const nearest = (dir: string): string | undefined => {
		const candidate = join(dir, 'tsconfig.json');
		if (existsSync(candidate)) return candidate;
		return dir === root || dirname(dir) === dir ? undefined : nearest(dirname(dir));
	};
	const parse = (config: string) => {
		const host = { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} };
		return ts.getParsedCommandLineOfConfigFile(config, {}, host)?.options ?? {};
	};
	return (file) => {
		const config = nearest(dirname(file));
		if (!config) return { moduleResolution: ts.ModuleResolutionKind.Bundler, allowJs: true };
		if (!cache.has(config)) cache.set(config, { allowJs: true, ...parse(config) });
		return cache.get(config)!;
	};
}

/**
 * Fan-in and fan-out per project file from the whole-project import graph, resolved through
 * the nearest tsconfig (paths, baseUrl). `files` are all project sources (TS and Svelte);
 * only importers in `countedImporters` count towards fan-in.
 */
export function coupling(root: string, files: string[], countedImporters: Set<string>): Map<string, Coupling> {
	const known = new Set(files);
	const optionsFor = optionsFinder(root);
	const result = new Map<string, Coupling>(files.map((f) => [f, { fanIn: 0, fanOut: 0 }]));
	for (const file of files) {
		const absolute = join(root, file);
		const targets = new Set<string>();
		for (const spec of importSpecifiers(readFileSync(absolute, 'utf8'), file)) {
			const target = resolve(root, spec, absolute, optionsFor(absolute), known);
			if (target && target !== file) targets.add(target);
		}
		result.get(file)!.fanOut = targets.size;
		if (countedImporters.has(file)) for (const t of targets) result.get(t)!.fanIn++;
	}
	return result;
}

function resolve(
	root: string,
	spec: string,
	from: string,
	options: ts.CompilerOptions,
	known: Set<string>
): string | undefined {
	const resolved = ts.resolveModuleName(spec, from, options, ts.sys).resolvedModule?.resolvedFileName;
	const candidates = resolved ? [resolved] : spec.startsWith('.') ? [join(dirname(from), spec)] : [];
	for (const candidate of candidates) {
		const path = relative(root, candidate).split(sep).join('/');
		if (known.has(path)) return path;
	}
	return undefined;
}
