// Step 4 helper: for the top-20 coupled production file pairs (primary view) pick example
// commits that change both files, so a human can read the diff. Also lists the
// 5 feat units with the most production files, with their per-layer file split.
// Out: out/s4-pair-examples.csv, out/s4-top5-features.csv
import { csv, git, logicalName, readCsv } from './lib';

const pairs = readCsv('m2-file-pairs-units-prod.csv').slice(0, 20);
const cf = readCsv('commit-files.csv');
const commits = new Map(readCsv('commits.csv').map((c) => [c.sha, c]));
const bySha = new Map<string, Set<string>>();
for (const r of cf) {
	const p = logicalName(r.path);
	(bySha.get(r.sha) ?? bySha.set(r.sha, new Set()).get(r.sha)!).add(p);
}
const rows = pairs.map((p, i) => {
	const shas = [...bySha].filter(([, s]) => s.has(p.a) && s.has(p.b)).map(([sha]) => sha);
	// Prefer the smallest commit: its diff is easiest to read and most specific.
	shas.sort((x, y) => +commits.get(x)!.files - +commits.get(y)!.files);
	const example = commits.get(shas[0]) ?? { sha: '', subject: '', files: '' };
	return {
		rank: i + 1,
		a: p.a,
		b: p.b,
		shared: p.shared,
		degree: p.degree,
		cross_layer: p.cross_layer,
		import: p.import,
		commits_with_both: shas.length,
		example_sha: example.sha,
		example_subject: example.subject,
		example_files: example.files
	};
});
csv('s4-pair-examples.csv', rows);

const units = readCsv('units.csv')
	.filter((u) => u.type === 'feat')
	.sort((a, b) => +b.files_prod - +a.files_prod)
	.slice(0, 5);
csv('s4-top5-features.csv', units, ['id', 'sha', 'date', 'title', 'commits', 'files_prod', 'files_test', 'files_other', 'layers_prod_list', 'i18n_files', 'n_FE', 'n_BFF', 'n_Backend', 'n_DB', 'n_Shared/Contracts', 'n_Tests-Unit', 'n_Tests-Acceptance', 'n_Process']);

// Test churn of the top-5 features that touches selectors or visible text.
const SEL = /TestId|testid|getByRole|getByText|querySelector|getByLabel|toHaveText|textContent|m\.[a-z_]+\(/;
csv(
	's4-top5-test-churn.csv',
	units.map((u) => {
		const diff = git(['diff', '-w', `${u.sha}^1`, u.sha, '--', 'src/__tests__', 'tests/e2e', 'backend/src/__tests__']);
		const lines = diff.split('\n').filter((l) => /^[+-][^+-]/.test(l));
		return { id: u.id, test_lines_changed: lines.length, selector_or_text_lines: lines.filter((l) => SEL.test(l)).length };
	})
);

// "Ritual" files: registries every new screen or state must be entered into (CLAUDE.md, Design-Regeln/Process).
const RITUAL = ['tests/a11y/screens.json', 'tests/e2e/features/accessibility.feature', 'tests/e2e/features/sprachen-bildschirme.feature', 'tests/e2e/fixtures/screens.ts', 'tests/e2e/tasks/accessibility.ts', 'tests/e2e/targets/accessibility.ts'];
const uf = readCsv('unit-files.csv');
const allUnits = readCsv('units.csv');
csv(
	's4-ritual-files.csv',
	['feat', 'fix'].map((type) => {
		const ids = allUnits.filter((u) => u.type === type).map((u) => u.id);
		const hits = ids.map((id) => uf.filter((f) => f.id === id && RITUAL.includes(f.path)).length);
		const contractFixtures = ids.map((id) => uf.filter((f) => f.id === id && f.path.startsWith('tests/contracts/')).length);
		const typesTs = ids.filter((id) => uf.some((f) => f.id === id && f.path === 'src/lib/types.ts')).length;
		return {
			type,
			units: ids.length,
			units_touching_any_ritual_file: hits.filter((h) => h > 0).length,
			units_touching_3plus_ritual_files: hits.filter((h) => h >= 3).length,
			ritual_file_changes: hits.reduce((s, h) => s + h, 0),
			units_touching_contract_fixtures: contractFixtures.filter((h) => h > 0).length,
			contract_fixture_changes: contractFixtures.reduce((s, h) => s + h, 0),
			units_touching_types_ts: typesTs
		};
	})
);
