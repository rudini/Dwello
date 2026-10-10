import type { Baseline } from './baseline.ts';
import type { Config } from './config.ts';
import type { ChangedFile } from './git.ts';
import type { GateFinding, ModuleReport, Report, SuppressionFinding } from './types.ts';


export interface GateResult {
	passed: boolean;
	failures: GateFinding[];
	/** G4: invalid suppressions in changed files. */
	suppressionFindings: SuppressionFinding[];
}

/** G1 for modules new to the baseline, G2 for baselined ones that worsened by more than `tolerance`, else null (G3). */
function moduleGate(m: ModuleReport, baselineScore: number | null, tolerance: number): GateFinding | null {
	if (!m.flagged) return null;
	if (baselineScore === null) return { ...m, gate: 'G1', baselineScore };
	return m.score - baselineScore > tolerance ? { ...m, gate: 'G2', baselineScore } : null;
}

export function evaluateGate(report: Report, changed: ChangedFile[], baseline: Baseline, config: Config): GateResult {
	const basePath = new Map(changed.map((c) => [c.path, c.previousPath ?? c.path]));
	const scores = new Map(baseline.entries.map((e) => [e.path, e.score]));
	const failures = report.modules
		.filter((m) => basePath.has(m.path))
		.map((m) => moduleGate(m, scores.get(basePath.get(m.path)!) ?? null, config.tolerance))
		.filter((f): f is GateFinding => f !== null);
	const suppressionFindings = report.suppressionFindings.filter((f) => basePath.has(f.path));
	return { passed: failures.length === 0 && suppressionFindings.length === 0, failures, suppressionFindings };
}
