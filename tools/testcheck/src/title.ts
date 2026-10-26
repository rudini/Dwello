/** A test as the title rules see it. */
export interface Titled {
	/** The describe titles, " > " between them. */
	path: string;
	/** The test's own title. */
	name: string;
	line: number;
	/** The body's code, printed in one layout without comments. */
	code: string;
}

export interface TitleFinding<T extends Titled> {
	test: T;
	rule: 'duplicate-title' | 'duplicate-body';
	message: string;
}

/**
 * Two tests of one describe block with the same title, or with the same body under different titles: then at
 * least one title does not say what its test checks (or the test is redundant). Reported on the later test.
 */
export function titleFindings<T extends Titled>(tests: T[]): TitleFinding<T>[] {
	const findings: TitleFinding<T>[] = [];
	const byTitle = new Map<string, T>();
	const byBody = new Map<string, T>();
	for (const t of tests) {
		const title = byTitle.get(`${t.path}>${t.name}`);
		const body = byBody.get(`${t.path}>${t.code}`);
		if (title) findings.push({ test: t, rule: 'duplicate-title', message: `same title as the test on line ${title.line}: name what each one checks` });
		else if (body && body.name !== t.name)
			findings.push({ test: t, rule: 'duplicate-body', message: `same body as «${body.name}» (line ${body.line}): one title does not describe its test, or the test is redundant` });
		byTitle.set(`${t.path}>${t.name}`, t);
		byBody.set(`${t.path}>${t.code}`, t);
	}
	return findings;
}
