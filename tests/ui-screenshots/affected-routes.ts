import { readdirSync, readFileSync } from 'fs';
import { basename, dirname, extname, join } from 'path';

// Source files of the frontend, relative to the repository root
export function sourceFiles(root = '.') {
	return readdirSync(join(root, 'src'), { recursive: true, encoding: 'utf8' })
		.map((file) => join('src', file).replaceAll('\\', '/'))
		.filter((file) => /\.(svelte|ts|js|json|css|html)$/.test(file));
}

const isTest = (file: string) => file.includes('__tests__') || /\.(test|spec)\.ts$/.test(file);
const routeOf = (dir: string) => dir.replace(/^src\/routes/, '') || '/';
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// `import type` vanishes when compiled: a changed type cannot change how a page looks
const withoutTypeImports = (source: string) => source.replace(/import\s+type\b[^;]*?from\s*['"][^'"]*['"]/g, '');

// Module specifier ending a file is imported by: `Button.svelte`, `navigation` (.ts/.js), `stores` for stores/index.ts
function importName(file: string) {
	const ext = extname(file);
	if (ext !== '.ts' && ext !== '.js') return basename(file);
	const name = basename(file, ext);
	return name === 'index' ? basename(dirname(file)) : name;
}

/**
 * Pages (route patterns like `/buildings/[id]`) whose appearance a change of `changed` can alter:
 * the page itself, every page below a changed layout, and every page importing a changed module, transitively.
 */
export function affectedRoutes(changed: string[], files: string[], read: (file: string) => string) {
	const pages = files.filter((file) => basename(file) === '+page.svelte').map((file) => dirname(file));
	const routes = new Set<string>();
	const seen = new Set<string>();
	const queue = changed.filter((file) => file.startsWith('src/') && !isTest(file));
	const importers = (file: string) => {
		const specifier = new RegExp(`['"][^'"]*/${escape(importName(file))}(\\.(ts|js))?['"]`);
		return files.filter(
			(other) => other !== file && !isTest(other) && specifier.test(withoutTypeImports(read(other)))
		);
	};

	while (queue.length) {
		const file = queue.shift()!;
		if (seen.has(file)) continue;
		seen.add(file);
		const dir = dirname(file);
		const name = basename(file);
		if (dir === 'src' && /^(app|hooks)\./.test(name)) {
			pages.forEach((page) => routes.add(routeOf(page))); // shell of every page
		} else if (dir.startsWith('src/routes') && /^\+(layout|error)\./.test(name)) {
			pages.filter((page) => page === dir || page.startsWith(`${dir}/`)).forEach((page) => routes.add(routeOf(page)));
		} else if (dir.startsWith('src/routes') && name.startsWith('+page.')) {
			routes.add(routeOf(dir));
		} else {
			queue.push(...importers(file));
		}
	}
	return [...routes].sort();
}

// The backend code that draws the statement PDF: its pages are captured on their own (statement-pdf.ts)
const PDF_SOURCES = ['pdf.service.ts', 'pdf-format.ts', 'qr-bill.service.ts'].map((file) => `backend/src/services/${file}`);

/** Whether a change can alter how the statement PDF looks */
export const pdfAffected = (changed: string[]) => changed.some((file) => PDF_SOURCES.includes(file));

// CLI: changed files on stdin, affected routes on stdout, one per line, and «pdf» when the statement PDF changed
if (process.argv[1]?.endsWith('affected-routes.ts')) {
	const changed = readFileSync(0, 'utf8').split('\n').filter(Boolean);
	const cache = new Map<string, string>();
	const read = (file: string) => cache.get(file) ?? cache.set(file, readFileSync(file, 'utf8')).get(file)!;
	const routes = affectedRoutes(changed, sourceFiles(), read);
	console.log([...routes, ...(pdfAffected(changed) ? ['pdf'] : [])].join('\n'));
}
