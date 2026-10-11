/** Public types of the deepcheck JSON report; mirrored by schema/report.schema.json. */

export interface Location {
	name: string;
	line: number;
}

export interface LeakyExport extends Location {
	/** The internal (non-exported) type the exported signature references. */
	type: string;
}

export interface ModuleMetrics {
	interfaceSize: number;
	implementationSize: number;
	/** Calls, constructions, binary and conditional expressions, template strings (Phase 4: statements alone undercount dense code). */
	operations: number;
	depthRatio: number;
	passThroughs: Location[];
	leakyExports: LeakyExport[];
	classitis: boolean;
	dataOnlyClasses: string[];
	fanIn: number;
	fanOut: number;
	complexity: number;
	complexitySource: 'fallow' | 'own';
	/** Exports Fallow reports as unused; null when Fallow data is not available. */
	unusedExports: number | null;
}

export interface ClassReport {
	name: string;
	line: number;
	interfaceSize: number;
	implementationSize: number;
	depthRatio: number;
	dataOnly: boolean;
}

export interface ModuleReport {
	path: string;
	score: number;
	/** Large enough to judge: interfaceSize >= minInterfaceSize, or a pass-through or classitis case. */
	eligible: boolean;
	/** eligible and score >= failThreshold (after per-path overrides). */
	flagged: boolean;
	metrics: ModuleMetrics;
	classes: ClassReport[];
	/** Score components (0..1 each) before weighting. */
	components: Record<string, number>;
	reasons: string[];
}

export interface ExcludedModule {
	path: string;
	reason: 'test' | 'declaration' | 'generated' | 'entry' | 'type-only' | 'barrel' | 'suppressed';
}

/** An invalid inline suppression (G4); it is not applied and counts as a finding. */
export interface SuppressionFinding {
	path: string;
	line: number;
	message: string;
}

export interface ListedSuppression {
	path: string;
	line: number;
	kind: 'file' | 'next-line';
	rule: string | null;
	reason: string | null;
	valid: boolean;
}

export interface Report {
	modules: ModuleReport[];
	excluded: ExcludedModule[];
	suppressionFindings: SuppressionFinding[];
	suppressions: ListedSuppression[];
	/** Conditions that make results less accurate, e.g. unresolved tsconfig extends or Fallow unavailable. */
	warnings: string[];
	/** Fallow data fed the scores. */
	fallow: boolean;
}

export interface Group {
	key: string;
	count: number;
	maxScore: number;
}

/** `deepcheck scan --format json`; see schema/report.schema.json. */
export interface ScanOutput {
	schemaVersion: 1;
	tool: 'deepcheck';
	command: 'scan';
	scope: 'all';
	path: string | null;
	failThreshold: number;
	minScore: number | null;
	summary: {
		analyzed: number;
		/** Modules selected (shallow, or at least --min-score) before --top. */
		shallow: number;
		shown: number;
		excluded: number;
		invalidSuppressions: number;
	};
	findings: ModuleReport[];
	groups?: Group[];
	suppressionFindings: SuppressionFinding[];
	warnings: string[];
}

/** A changed module that fails a gate (check). */
export interface GateFinding extends ModuleReport {
	gate: 'G1' | 'G2';
	/** Score in the baseline; null for a module new to the baseline (G1). */
	baselineScore: number | null;
	/** The file did not exist at the base (G1 only: a new file rather than an existing module that got shallow). */
	newFile: boolean;
}

/** `deepcheck check --format json`; see schema/report.schema.json. */
export interface CheckOutput {
	schemaVersion: 1;
	tool: 'deepcheck';
	command: 'check';
	scope: 'changed';
	/** HEAD (dev loop) or the --changed-since ref. */
	base: string;
	failThreshold: number;
	tolerance: number;
	passed: boolean;
	summary: { analyzed: number; changed: number; failed: number; invalidSuppressions: number };
	findings: GateFinding[];
	/** G4: invalid suppressions in changed files. */
	suppressionFindings: SuppressionFinding[];
	warnings: string[];
}
