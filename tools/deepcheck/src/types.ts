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

export interface Report {
	modules: ModuleReport[];
	excluded: ExcludedModule[];
}
