import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SCRIPT = fileURLToPath(new URL('./e2e-areas.mjs', import.meta.url));
const AREAS = JSON.parse(readFileSync(fileURLToPath(new URL('../../tests/e2e/areas.json', import.meta.url)), 'utf8'));
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const FEATURES = readdirSync(fileURLToPath(new URL('../../tests/e2e/features', import.meta.url))).filter((f) => f.endsWith('.feature'));

/** Every source file of the app and the E2E tests, as a path from the repository root */
const SOURCES = ['src', 'backend/src', 'tests/e2e'].flatMap((dir) =>
	readdirSync(join(ROOT, dir), { recursive: true, encoding: 'utf8' })
		.map((file) => `${dir}/${file}`)
		.filter((file) => /\.(ts|js|mjs|svelte)$/.test(file) && !file.includes('paraglide'))
);

/** The repository files a source file imports (relative and $lib imports, with or without extension) */
function imports(file: string): string[] {
	const text = readFileSync(join(ROOT, file), 'utf8');
	return [...text.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].flatMap(([, spec]) => {
		const base = spec.startsWith('$lib/') ? join('src/lib', spec.slice(5)) : spec.startsWith('.') ? join(dirname(file), spec) : null;
		if (base === null) return [];
		const found = ['', '.ts', '.js', '.svelte', '/index.ts'].map((ext) => base + ext).find((path) => existsSync(join(ROOT, path)) && !path.endsWith('/'));
		return found ? [relative(ROOT, join(ROOT, found))] : [];
	});
}

const matches = (patterns: string[], file: string) => patterns.some((pattern) => new RegExp(pattern).test(file));

/** The Playwright file filters the script answers for these changed files; [] means every scenario */
function filters(...files: string[]): string[] {
	const run = spawnSync('node', [SCRIPT], { input: files.join('\n') + '\n', encoding: 'utf8' });
	expect(run.status, run.stderr).toBe(0);
	return run.stdout.trim().split(' ').filter(Boolean);
}

/** The feature files a filter list selects, as Playwright matches them against the generated spec paths */
const selected = (list: string[]) =>
	FEATURES.filter((f) => list.some((filter) => new RegExp(filter).test(`.features-gen/tests/e2e/features/${f}.spec.js`)));

describe('E2E-Auswahl nach Bereich (#845)', () => {
	it('wählt bei einer Rechnungsänderung die Rechnungsszenarien und die bereichsübergreifenden Prüfungen', () => {
		const list = filters('src/routes/invoices/InvoiceRow.svelte', 'src/routes/invoices/[id]/+page.svelte');
		expect(selected(list)).toEqual(
			['demo.feature', 'invoice-detail.feature', 'invoice-edit.feature', 'invoice-new.feature', 'invoices.feature', 'sprachen-bildschirme.feature'].sort()
		);
	});

	it('vereinigt die Szenarien mehrerer Bereiche', () => {
		const list = selected(filters('src/routes/tenants/+page.svelte', 'src/routes/buildings/new/+page.svelte'));
		expect(list).toContain('tenant-detail.feature');
		expect(list).toContain('building-new.feature');
		expect(list).not.toContain('invoices.feature');
	});

	it('ordnet die Unterseiten der Einstellungen ihrem eigenen Bereich zu', () => {
		expect(selected(filters('src/routes/config/categories/+page.svelte'))).toEqual(['categories-ki.feature', 'categories.feature', 'demo.feature', 'sprachen-bildschirme.feature']);
		expect(selected(filters('src/routes/config/+page.svelte'))).toEqual(['demo.feature', 'settings.feature', 'sprachen-bildschirme.feature']);
	});

	it('wählt bei einer geänderten Feature-Datei genau diese', () => {
		expect(selected(filters('tests/e2e/features/sicherung.feature'))).toEqual(['demo.feature', 'sicherung.feature', 'sprachen-bildschirme.feature']);
	});

	it('übergeht Unit-Tests, Werkzeuge und Dokumentation, die kein Szenario ausführt', () => {
		expect(filters('src/routes/invoices/+page.svelte', 'src/__tests__/invoices.test.ts', 'backend/src/__tests__/invoice.pg.test.ts', 'tools/fitness/fitness.ts', 'docs/test-pyramid.md')).toEqual(
			filters('src/routes/invoices/+page.svelte')
		);
	});

	it.each(['src/lib/api.ts', 'src/lib/server/missing-statements.ts', 'src/routes/api/invoices/+server.ts', 'backend/src/services/invoice.service.ts', 'backend/src/routes/invoices.ts', 'backend/src/__tests__/helpers/pdf-text.ts', 'src/routes/config/DeleteDialog.svelte', 'src/routes/+layout.svelte', 'backend/src/services/today.ts', 'backend/migrations/0042_x.sql', 'messages/de.json', 'tests/e2e/steps/common.steps.ts', 'playwright.config.ts', '.github/workflows/ci.yml', 'package.json'])(
		'führt alle Szenarien aus, sobald %s geändert ist, das keinem Bereich gehört',
		(file) => {
			expect(filters('src/routes/invoices/+page.svelte', file)).toEqual([]);
		}
	);

	it('führt nur die bereichsübergreifenden Prüfungen aus, wenn nur Dateien ohne Szenario geändert sind', () => {
		expect(selected(filters('src/__tests__/invoices.test.ts'))).toEqual(['demo.feature', 'sprachen-bildschirme.feature']);
	});

	it('nennt nur Filter, die eine vorhandene Feature-Datei treffen', () => {
		for (const [name, area] of Object.entries<{ features: string[] }>(AREAS.areas))
			for (const filter of area.features) expect(selected([filter]), `${name}: ${filter}`).not.toEqual([]);
		for (const filter of AREAS.always) expect(selected([filter]), filter).not.toEqual([]);
	});

	it('ordnet jede Feature-Datei einem Bereich, den bereichsübergreifenden Prüfungen oder dem vollen Lauf zu', () => {
		const all = [...AREAS.always, ...AREAS.fullRunOnly, ...Object.values<{ features: string[] }>(AREAS.areas).flatMap((a) => a.features)];
		expect(FEATURES.filter((f) => selected(all).indexOf(f) === -1)).toEqual([]);
	});

	it('ordnet einem Bereich nur Dateien zu, die keine Datei ausserhalb des Bereichs importiert', () => {
		const leaks = Object.entries<{ paths: string[] }>(AREAS.areas).flatMap(([name, area]) =>
			SOURCES.filter((importer) => !matches(area.paths, importer) && !matches(AREAS.ignore, importer)).flatMap((importer) =>
				imports(importer)
					.filter((target) => matches(area.paths, target))
					.map((target) => `${name}: ${importer} -> ${target}`)
			)
		);
		expect(leaks).toEqual([]);
	});

	it('übergeht keine Datei, die ein E2E-Test oder die App importiert', () => {
		const ignored = SOURCES.flatMap((importer) => (matches(AREAS.ignore, importer) ? [] : imports(importer).filter((target) => matches(AREAS.ignore, target))));
		expect(ignored).toEqual([]);
	});

	it('nennt Filter ohne Zeichen, die die Shell der Befehlszeile umdeutet', () => {
		const all = [...AREAS.always, ...Object.values<{ features: string[] }>(AREAS.areas).flatMap((a) => a.features)];
		for (const filter of all) expect(filter).toMatch(/^[\w./-]+$/);
	});

	it('gibt die Auswahl eines Pull Request als Dateifilter in zwei Shards an Playwright, sonst alles wie bisher', () => {
		const ci = readFileSync(fileURLToPath(new URL('../../.github/workflows/ci.yml', import.meta.url)), 'utf8');
		expect(ci).toContain('filter=$(node tools/ci/e2e-areas.mjs < changed.txt)');
		expect(ci).toContain('[ -n "$filter" ] && e2e=2');
		expect(ci).toContain('e2e($e2e; "--grep-invert @a11y \\($filter)")');
		expect(ci).toMatch(/e2e=\$\(\[ "\$\{\{ github\.event_name \}\}" = pull_request \] && echo 5 \|\| echo 12\)\n\s+filter=\n/);
	});
});
