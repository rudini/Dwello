import { ts, type SourceFile } from 'ts-morph';
import type { ListedSuppression } from './types.ts';

export type Suppression = Omit<ListedSuppression, 'path' | 'valid'>;

const LINE_RULES = ['pass-through', 'leaky-export', 'data-only-class'];

const MARKER = /\/\/\s*deepcheck-ignore-(file|next-line)\b(.*)$/;
const WELL_FORMED = /^(?:\s+([a-z][\w-]*))?\s*(?:--\s*(.*?))?\s*$/;

/** The text and line of every `//` comment in the file (not string or template contents). */
function lineComments(sf: SourceFile): { text: string; line: number }[] {
	const text = sf.getFullText();
	const ranges = new Map<number, ts.CommentRange>();
	const visit = (node: ts.Node) => {
		for (const r of [...(ts.getLeadingCommentRanges(text, node.pos) ?? []), ...(ts.getTrailingCommentRanges(text, node.end) ?? [])])
			ranges.set(r.pos, r);
		node.forEachChild(visit);
	};
	visit(sf.compilerNode);
	visit(sf.compilerNode.endOfFileToken);
	return [...ranges.values()]
		.filter((r) => r.kind === ts.SyntaxKind.SingleLineCommentTrivia)
		.sort((a, b) => a.pos - b.pos)
		.map((r) => ({ text: text.slice(r.pos, r.end), line: sf.getLineAndColumnAtPos(r.pos).line }));
}

/** All deepcheck suppression comments in a file, valid or not; a malformed one has no reason. */
export function parseSuppressions(sf: SourceFile): Suppression[] {
	return lineComments(sf).flatMap(({ text, line }) => {
		const marker = MARKER.exec(text);
		if (!marker) return [];
		const [, kind, rest] = marker;
		const parts = WELL_FORMED.exec(rest);
		const rule = parts?.[1] ?? /^\s+([a-z][\w-]*)/.exec(rest)?.[1] ?? null;
		return [{ line, kind: kind as Suppression['kind'], rule, reason: parts?.[2] || null }];
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
