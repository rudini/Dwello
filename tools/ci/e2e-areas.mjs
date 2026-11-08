// Which E2E scenarios a pull request runs (#845): reads the changed files from stdin and prints the Playwright file
// filters of their areas plus the cross-area checks (tests/e2e/areas.json), space-separated; prints nothing, meaning
// every scenario, as soon as one changed file belongs to no area. Usage: node tools/ci/e2e-areas.mjs < changed.txt
import { readFileSync } from 'node:fs';

const { always, ignore, areas } = JSON.parse(readFileSync(new URL('../../tests/e2e/areas.json', import.meta.url), 'utf8'));
const matches = (patterns, file) => patterns.some((pattern) => new RegExp(pattern).test(file));

const files = readFileSync(0, 'utf8')
	.split('\n')
	.filter((file) => file && !matches(ignore, file));
const filters = new Set(always);
for (const file of files) {
	const feature = file.match(/^tests\/e2e\/features\/([\w-]+\.feature)$/);
	const owners = feature ? [{ features: [`features/${feature[1]}`] }] : Object.values(areas).filter((area) => matches(area.paths, file));
	if (owners.length === 0) process.exit(0);
	for (const owner of owners) for (const filter of owner.features) filters.add(filter);
}
console.log([...filters].join(' '));
