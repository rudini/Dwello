import { dirname } from 'node:path';
import { Project, type SourceFile } from 'ts-morph';
import { reasons } from './advice.ts';
import { loadConfig, type Config } from './config.ts';
import { excludeByPath, isModuleCandidate, isSource, matchesAny, walk } from './discover.ts';
import { fallowIgnorePatterns } from './fallow.ts';
import { coupling } from './graph.ts';
import { contentExclusion, fileMetrics, type FileMetrics } from './metrics.ts';
import { components, shallowScore } from './score.ts';
import type { ExcludedModule, ModuleReport, Report } from './types.ts';

export interface AnalyzeOptions {
	root: string;
	fallow: string;
	config?: Config;
}

interface Candidate {
	path: string;
	file: FileMetrics;
}

const byPath = (a: { path: string }, b: { path: string }) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0);

function loadModules(root: string, paths: string[]): Map<string, SourceFile> {
	const project = new Project({
		skipAddingFilesFromTsConfig: true,
		skipFileDependencyResolution: true,
		compilerOptions: { noLib: true, noResolve: true, allowJs: true }
	});
	return new Map(paths.map((p) => [p, project.addSourceFileAtPath(`${root}/${p}`)]));
}

/** Files in directories of at least `minFiles` analyzed modules, most of which are tiny single-export files. */
function classitisFiles(candidates: Candidate[], minFiles: number): Set<string> {
	const tiny = (c: Candidate) => c.file.exportCount === 1 && c.file.implementationSize <= 3;
	const byDir = Map.groupBy(candidates, (c) => dirname(c.path));
	const result = new Set<string>();
	for (const group of byDir.values()) {
		const tinyOnes = group.filter(tiny);
		if (group.length >= minFiles && tinyOnes.length >= 0.8 * group.length) tinyOnes.forEach((c) => result.add(c.path));
	}
	return result;
}

function settingsFor(path: string, config: Config) {
	const override = config.overrides.filter((o) => matchesAny(path, o.files));
	return Object.assign({ failThreshold: config.failThreshold, minInterfaceSize: config.minInterfaceSize }, ...override);
}

export function analyze({ root, config = loadConfig(root) }: AnalyzeOptions): Report {
	const sources = walk(root, config).filter(isSource);
	const excluded: ExcludedModule[] = [];
	const modulePaths: string[] = [];
	const fallowIgnores = fallowIgnorePatterns(root);
	for (const path of sources.filter((p) => isModuleCandidate(p, config))) {
		const reason = excludeByPath(root, path, config, fallowIgnores);
		if (reason) excluded.push({ path, reason });
		else modulePaths.push(path);
	}
	const candidates: Candidate[] = [];
	for (const [path, sf] of loadModules(root, modulePaths)) {
		const reason = contentExclusion(sf);
		if (reason) excluded.push({ path, reason });
		else candidates.push({ path, file: fileMetrics(sf) });
	}
	const notCounted = new Set(excluded.filter((e) => e.reason !== 'barrel' && e.reason !== 'type-only').map((e) => e.path));
	const graph = coupling(root, sources, new Set(sources.filter((s) => !notCounted.has(s))));
	const classitis = classitisFiles(candidates, config.classitisMinFiles);
	const modules = candidates.map(({ path, file }) => {
		const { fanIn, fanOut } = graph.get(path)!;
		const metrics = {
			interfaceSize: file.interfaceSize,
			implementationSize: file.implementationSize,
			depthRatio: file.implementationSize / Math.max(1, file.interfaceSize),
			passThroughs: file.passThroughs,
			leakyExports: file.leakyExports,
			classitis: classitis.has(path),
			dataOnlyClasses: file.dataOnlyClasses,
			fanIn,
			fanOut,
			complexity: file.complexity,
			complexitySource: 'own' as const,
			unusedExports: null
		};
		const parts = components(metrics, file.exportCount, file.functionCount, config);
		const score = shallowScore(parts, config.weights);
		const { failThreshold, minInterfaceSize } = settingsFor(path, config);
		const eligible = metrics.interfaceSize >= minInterfaceSize || metrics.passThroughs.length > 0 || parts.classitis > 0;
		const report: ModuleReport = { path, score, flagged: eligible && score >= failThreshold, metrics, classes: file.classes, components: parts, reasons: [] };
		report.reasons = reasons(report);
		return report;
	});
	modules.sort((a, b) => b.score - a.score || byPath(a, b));
	return { modules, excluded: excluded.sort(byPath) };
}
