/**
 * Fails `bun run test` when the backend tests together cover fewer lines or functions than today
 * (bun's own coverageThreshold applies to every single file). Raise the minimums as coverage grows; the goal is 80 %.
 */

const MINIMUM = { lines: 82, functions: 85 };
const lcov = await Bun.file(`${import.meta.dir}/../coverage/lcov.info`).text();
const total = (key: string) =>
	[...lcov.matchAll(new RegExp(`^${key}:(\\d+)$`, 'gm'))].reduce((sum, [, n]) => sum + Number(n), 0);

const lines = (100 * total('LH')) / total('LF');
const functions = (100 * total('FNH')) / total('FNF');
console.log(`Backend coverage: ${lines.toFixed(1)} % lines (minimum ${MINIMUM.lines} %), ${functions.toFixed(1)} % functions (minimum ${MINIMUM.functions} %)`);
if (lines < MINIMUM.lines || functions < MINIMUM.functions) process.exit(1);
