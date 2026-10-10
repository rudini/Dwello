import { dirname } from 'node:path';
import { Project, type SourceFile } from 'ts-morph';
import { reasons } from './advice.ts';
import { loadConfig, type Config } from './config.ts';
import { excludeByPath, isModuleCandidate, isSource, matchesAny, walk } from './discover.ts';
import { fallowIgnorePatterns, loadFallow, type FallowData } from './fallow.ts';
import { coupling } from './graph.ts';
import { contentExclusion, fileMetrics, type FileMetrics } from './metrics.ts';
import { components, shallowScore } from './score.ts';
import { parseSuppressions, suppressesFile, suppressesLine, suppressionProblems, type Suppression } from './suppress.ts';
import type { ExcludedModule, ListedSuppression, ModuleReport, Report, SuppressionFinding } from './types.ts';

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

function withoutSuppressed(file: FileMetrics, suppressions: Suppression[]): FileMetrics {
	return {
		...file,
		passThroughs: file.passThroughs.filter((p) => !suppressesLine(suppressions, 'pass-through', p.line)),
		leakyExports: file.leakyExports.filter((l) => !suppressesLine(suppressions, 'leaky-export', l.line)),
		dataOnlyClasses: file.classes
			.filter((c) => c.dataOnly && !suppressesLine(suppressions, 'data-only-class', c.line))
			.map((c) => c.name)
	};
}

/** Fallow's cyclomatic total when it reports the file, else the own count. */
function complexityOf(path: string, file: FileMetrics, fallow: FallowData | null) {
	const fromFallow = fallow?.complexity.get(path);
	return fromFallow === undefined
		? { complexity: file.complexity, complexitySource: 'own' as const }
		: { complexity: fromFallow, complexitySource: 'fallow' as const };
}

function settingsFor(path: string, config: Config) {
	const override = config.overrides.filter((o) => matchesAny(path, o.files));
	return Object.assign({ failThreshold: config.failThreshold, minInterfaceSize: config.minInterfaceSize }, ...override);
}

export function analyze({ root, fallow, config = loadConfig(root) }: AnalyzeOptions): Report {
	const warnings: string[] = [];
	const fallowData = loadFallow(root, fallow, warnings);
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
	const suppressionFindings: SuppressionFinding[] = [];
	const listed: ListedSuppression[] = [];
	for (const [path, sf] of loadModules(root, modulePaths)) {
		const suppressions = parseSuppressions(sf);
		suppressionFindings.push(...suppressionProblems(suppressions).map((p) => ({ path, ...p })));
		listed.push(...suppressions.map((s) => ({ path, ...s, valid: !suppressionProblems([s]).length })));
		const reason = suppressesFile(suppressions) ? 'suppressed' : contentExclusion(sf);
		if (reason) excluded.push({ path, reason });
		else candidates.push({ path, file: withoutSuppressed(fileMetrics(sf), suppressions) });
	}
	// Tests, declarations and generated code are not real callers; every other module is.
	const notCounted = new Set(
		excluded.filter((e) => ['test', 'declaration', 'generated'].includes(e.reason)).map((e) => e.path)
	);
	const barrels = new Set(excluded.filter((e) => e.reason === 'barrel').map((e) => e.path));
	const graph = coupling(root, sources, new Set(sources.filter((s) => !notCounted.has(s))), barrels, warnings);
	const classitis = classitisFiles(candidates, config.classitisMinFiles);
	const modules = candidates.map(({ path, file }) => {
		const { fanIn, fanOut } = graph.get(path)!;
		const metrics = {
			interfaceSize: file.interfaceSize,
			implementationSize: file.implementationSize,
			operations: file.operations,
			depthRatio: file.implementationSize / Math.max(1, file.interfaceSize),
			passThroughs: file.passThroughs,
			leakyExports: file.leakyExports,
			classitis: classitis.has(path),
			dataOnlyClasses: file.dataOnlyClasses,
			fanIn,
			fanOut,
			...complexityOf(path, file, fallowData),
			unusedExports: fallowData ? (fallowData.unusedExports.get(path) ?? 0) : null
		};
		const parts = components(metrics, file.exportCount, file.functionCount, config);
		const score = shallowScore(parts, config.weights);
		const { failThreshold, minInterfaceSize } = settingsFor(path, config);
		const eligible = metrics.interfaceSize >= minInterfaceSize || metrics.passThroughs.length > 0 || parts.classitis > 0;
		const report: ModuleReport = {
			path,
			score,
			eligible,
			flagged: eligible && score >= failThreshold,
			metrics,
			classes: file.classes,
			components: parts,
			reasons: []
		};
		report.reasons = reasons(report);
		return report;
	});
	modules.sort((a, b) => b.score - a.score || byPath(a, b));
	return { modules, excluded: excluded.sort(byPath), suppressionFindings, suppressions: listed, warnings, fallow: fallowData !== null };
}
