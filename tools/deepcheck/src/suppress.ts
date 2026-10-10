import type { ListedSuppression } from './types.ts';

export type Suppression = Omit<ListedSuppression, 'path' | 'valid'>;

const LINE_RULES = ['pass-through', 'leaky-export', 'data-only-class'];

const COMMENT = /\/\/\s*deepcheck-ignore-(file|next-line)\b(?:\s+([a-z][\w-]*))?\s*(?:--\s*(.*?))?\s*$/;

/** All deepcheck suppression comments in a file, valid or not. */
export function parseSuppressions(text: string): Suppression[] {
	return text.split('\n').flatMap((line, i) => {
		const match = COMMENT.exec(line);
		if (!match) return [];
		const [, kind, rule, reason] = match;
		return [{ line: i + 1, kind: kind as Suppression['kind'], rule: rule ?? null, reason: reason || null }];
	});
}

export const suppressesFile = (suppressions: Suppression[]) =>
	suppressions.some((s) => s.kind === 'file' && s.reason);

/** Why a suppression comment is invalid, or null when it is valid. */
function problem(s: Suppression): string | null {
	const rules = LINE_RULES.join(', ');
	if (s.kind === 'next-line' && !s.rule) return `deepcheck-ignore-next-line needs a rule: one of ${rules}`;
	if (s.kind === 'next-line' && !LINE_RULES.includes(s.rule!))
		return `deepcheck-ignore-next-line names an unknown rule "${s.rule}": use one of ${rules}`;
	if (!s.reason) return `deepcheck-ignore-${s.kind} needs a reason: add "-- <why this is shallow by design>"`;
	return null;
}

export const suppressionProblems = (suppressions: Suppression[]) =>
	suppressions.flatMap((s) => {
		const message = problem(s);
		return message ? [{ line: s.line, message }] : [];
	});

/** Whether a valid next-line suppression for `rule` sits directly above `line`. */
export const suppressesLine = (suppressions: Suppression[], rule: string, line: number) =>
	suppressions.some((s) => s.kind === 'next-line' && s.rule === rule && s.reason && s.line === line - 1);
