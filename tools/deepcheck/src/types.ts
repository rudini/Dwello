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
	reason: 'test' | 'declaration' | 'generated' | 'type-only' | 'barrel' | 'config' | 'suppressed';
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
