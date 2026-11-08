// P1 (docs/architecture/utility-tree.md): the Abrechnungslauf of one building with 50 apartments, PDFs included
export const P1_TARGET_MS = 30_000;

/** Whether the run and its PDFs together miss the target (#934: CI fails then) */
export const missesTarget = (runMs: number, pdfMs: number) => runMs + pdfMs > P1_TARGET_MS;
