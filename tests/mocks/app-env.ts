import { vi } from 'vitest';

// $app/env/private reads the environment once when it loads; the tests change env (./env.ts) between cases,
// so each read takes its value from there, '' when unset (as src/env.ts falls back)
vi.mock('$app/env/private', async () => {
	const { env } = await import('./env');
	const named = (key: string | symbol): key is string => typeof key === 'string' && /^[A-Z][A-Z0-9_]*$/.test(key);
	return new Proxy(env, {
		has: (target, key) => named(key) || Reflect.has(target, key),
		get: (target, key) => (named(key) ? (target[key] ?? '') : Reflect.get(target, key))
	});
});
