import type { Weights } from './config.ts';
import type { ModuleReport } from './types.ts';

const DESIGN_NOTE = 'Fix the design; do not pad the implementation to game the ratio.';

/** Components at or above this value are named as reasons. */
const NOTABLE = 0.5;

type Advice = (r: ModuleReport) => string;

const ADVICE: Record<keyof Weights, Advice> = {
	depth: ({ metrics: m }) =>
		`depthRatio ${m.depthRatio.toFixed(1)}: an interface of ${m.interfaceSize} units hides only ${m.implementationSize} statements. Shrink the exported surface: offer fewer, more powerful functions and hide the details behind them.`,
	complexity: ({ metrics: m }) =>
		`complexity ${m.complexity} for ${m.interfaceSize} interface units: little logic sits behind the interface. Merge this module into its callers or callee so the interface carries real functionality.`,
	passThrough: ({ metrics: m }) =>
		`${m.passThroughs.length} pass-through(s) (${m.passThroughs.map((p) => `${p.name}:${p.line}`).join(', ')}): they only forward their parameters. Merge them into the callee or let callers use the callee directly.`,
	leaky: ({ metrics: m }) =>
		`leaky exports (${m.leakyExports.map((l) => `${l.name} -> ${l.type}`).join(', ')}): exported signatures use internal types. Hide those types behind the interface or design them as part of it.`,
	classitis: ({ metrics: m }) =>
		m.dataOnlyClasses.length > 0
			? `data-only class(es) ${m.dataOnlyClasses.join(', ')}: only fields, getters and setters. Move the behaviour that uses the data into the class, or combine it with the module that does.`
			: 'classitis: one of many tiny single-export files in this directory. Combine them into one deeper module.',
	coupling: ({ metrics: m }) =>
		`coupling: imports ${m.fanOut} module(s) but is used by ${m.fanIn}. A deep module is used widely and depends on little; pull the work it delegates into it.`,
	unusedExports: ({ metrics: m }) =>
		`${m.unusedExports} export(s) unused (Fallow): they widen the interface without serving callers. Stop exporting them.`
};

export function reasons(report: ModuleReport): string[] {
	const notable = (Object.keys(ADVICE) as (keyof Weights)[]).filter((k) => report.components[k] >= NOTABLE);
	return [...notable.map((k) => ADVICE[k](report)), DESIGN_NOTE];
}
