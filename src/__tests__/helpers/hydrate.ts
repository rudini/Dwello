import { afterEach } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { compile } from 'svelte/compiler';
import { flushSync, hydrate, unmount, type Component } from 'svelte';

const hydrated: ReturnType<typeof hydrate>[] = [];
afterEach(() => {
	while (hydrated.length) unmount(hydrated.pop()!);
	document.body.innerHTML = '';
});

/**
 * Puts the server-rendered HTML of a component (path relative to src/) into the document, as the browser shows it
 * before the JavaScript has loaded. The component is compiled for the server here, since this project compiles it for the browser.
 */
export async function serverRender(file: string, props: Record<string, unknown>) {
	// Inside the project, so the compiled modules find svelte in node_modules
	const dir = mkdtempSync(resolve('node_modules/.ssr-'));
	try {
		const module = compileForServer(resolve('src', file), dir);
		writeFileSync(
			module,
			`${readFileSync(module, 'utf8')}\nexport { render } from 'svelte/server';`
		);
		const { default: component, render } = await import(/* @vite-ignore */ module);
		document.body.innerHTML = render(component, { props }).body;
	} finally {
		rmSync(dir, { recursive: true });
	}
}

/** Compiles a component and the components it imports (relative or $lib paths) for the server into dir */
function compileForServer(filename: string, dir: string): string {
	const { js } = compile(readFileSync(filename, 'utf8'), { filename, generate: 'server' });
	const code = js.code
		// The server build of svelte (onMount does nothing there), not the browser build this project resolves
		.replace("from 'svelte'", `from '${resolve('node_modules/svelte/src/index-server.js')}'`)
		.replace(/from '((?:\.|\$lib\/)[^']+\.svelte)'/g, (_, child: string) => {
			const path = child.startsWith('$lib/')
				? resolve('src/lib', child.slice(5))
				: resolve(dirname(filename), child);
			return `from '${compileForServer(path, dir)}'`;
		})
		.replace(/from '\$lib\//g, `from '${resolve('src/lib')}/`)
		// Other relative imports (TypeScript modules) from where the component lives
		.replace(
			/from '(\.[^']+)'/g,
			(_, path: string) => `from '${resolve(dirname(filename), path)}'`
		);
	// Named by the path below src, so components with the same file name (lib/ui/Icon, lib/components/Icon) stay apart
	const module = join(
		dir,
		`${relative(resolve('src'), filename)
			.replace(/\.svelte$/, '')
			.replaceAll('/', '_')}.js`
	);
	writeFileSync(module, code);
	return module;
}

/** Hydrates the server-rendered HTML in the document, as the browser does once the JavaScript has loaded */
export function hydrateAs<P extends Record<string, unknown>>(component: Component<P>, props: P) {
	hydrated.push(hydrate(component, { target: document.body, props }));
	flushSync();
}
