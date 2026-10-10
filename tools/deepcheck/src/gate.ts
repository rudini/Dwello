import { analyze } from './analyze.ts';
import { BASELINE_FILE, parseBaseline, type Baseline } from './baseline.ts';
import { loadConfig, type Config } from './config.ts';
import { baseRevision, changedFiles, fileAtRevision, type ChangedFile } from './git.ts';
import type { CheckOutput, GateFinding, ModuleReport, Report, SuppressionFinding } from './types.ts';


export interface GateResult {
	passed: boolean;
	failures: GateFinding[];
	/** G4: invalid suppressions in changed files. */
	suppressionFindings: SuppressionFinding[];
}

/** G1 for modules new to the baseline, G2 for baselined ones that worsened by more than `tolerance`, else null (G3). */
function moduleGate(m: ModuleReport, baselineScore: number | null, tolerance: number, newFile: boolean): GateFinding | null {
	if (!m.flagged) return null;
	if (baselineScore === null) return { ...m, gate: 'G1', baselineScore, newFile };
	return m.score - baselineScore > tolerance ? { ...m, gate: 'G2', baselineScore, newFile } : null;
}

export function evaluateGate(report: Report, changed: ChangedFile[], baseline: Baseline, config: Config): GateResult {
	const previous = new Map(changed.map((c) => [c.path, c.previousPath]));
	const scores = new Map(baseline.entries.map((e) => [e.path, e.score]));
	const failures = report.modules
		.filter((m) => previous.has(m.path))
		.map((m) => {
			const before = previous.get(m.path);
			return moduleGate(m, scores.get(before ?? m.path) ?? null, config.tolerance, before === null);
		})
		.filter((f): f is GateFinding => f !== null);
	const suppressionFindings = report.suppressionFindings.filter((f) => previous.has(f.path));
	return { passed: failures.length === 0 && suppressionFindings.length === 0, failures, suppressionFindings };
}

/**
 * The gate judges with the threshold the baseline was written with: a threshold change takes effect
 * once it is merged together with a regenerated baseline, so legacy modules never fail in between.
 */
function withBaselineThreshold(config: Config, baseline: Baseline | null): { config: Config; warnings: string[] } {
	if (!baseline || baseline.failThreshold === config.failThreshold) return { config, warnings: [] };
	return {
		config: { ...config, failThreshold: baseline.failThreshold },
		warnings: [
			`the baseline was written with failThreshold ${baseline.failThreshold} but the config has ${config.failThreshold}; the gate uses ${baseline.failThreshold} until a regenerated baseline is merged (deepcheck baseline)`
		]
	};
}

function fallowWarning(baseline: Baseline | null, report: Report): string[] {
	if (!baseline || baseline.fallow === report.fallow) return [];
	const used = report.fallow ? 'uses it' : 'does not';
	return [`the baseline was written ${baseline.fallow ? 'with' : 'without'} Fallow data but this run ${used}; scores of baselined modules are not fully comparable`];
}

function checkOutput(base: string, config: Config, report: Report, changed: ChangedFile[], result: GateResult): CheckOutput {
	const changedPaths = new Set(changed.map((c) => c.path));
	return {
		schemaVersion: 1,
		tool: 'deepcheck',
		command: 'check',
		scope: 'changed',
		base,
		failThreshold: config.failThreshold,
		tolerance: config.tolerance,
		passed: result.passed,
		summary: {
			analyzed: report.modules.length,
			changed: report.modules.filter((m) => changedPaths.has(m.path)).length,
			failed: result.failures.length,
			invalidSuppressions: result.suppressionFindings.length
		},
		findings: result.failures,
		suppressionFindings: result.suppressionFindings,
		warnings: report.warnings
	};
}

/** The changed-scope gate for a project: changes since HEAD or `since`, judged against the baseline at that base. */
export function runGate(root: string, fallow: string, since?: string): CheckOutput {
	const changed = changedFiles(root, since);
	// The baseline as it was at the base, so a change cannot regenerate its own way past the gate.
	const text = fileAtRevision(root, baseRevision(root, since), BASELINE_FILE);
	const baseline = text === null ? null : parseBaseline(text);
	const adjusted = withBaselineThreshold(loadConfig(root), baseline);
	const report = analyze({ root, fallow, config: adjusted.config });
	report.warnings.push(...adjusted.warnings, ...fallowWarning(baseline, report));
	const result = evaluateGate(report, changed, baseline ?? parseBaseline(null), adjusted.config);
	return checkOutput(since ?? 'HEAD', adjusted.config, report, changed, result);
}
