import { describe, expect, it, vi } from 'vitest';

// The base branch must be served like the pull request head (a production build), or rendering differences between
// `bun run dev` and `node build` show as changes on pages the pull request does not touch (#1172)
describe('playwright.screenshots.config', () => {
	it('startet die Basis wie den Kopf als Produktions-Build auf Port 3200 mit derselben Umgebung', async () => {
		vi.stubEnv('UI_BASE_DIR', '/tmp/base');
		const { default: config } = await import('../../playwright.screenshots.config');
		const servers = config.webServer as { command: string; port: number; env?: Record<string, string> }[];
		const head = servers.find((server) => server.port === 3100)!;
		const base = servers.find((server) => server.port === 3200)!;
		expect(base.command).toBe('cd "/tmp/base" && bun run build && node build');
		// the same environment as the head but the port, ORIGIN included: /config/access-keys shows the address
		expect(base.env).toEqual({ ...head.env, PORT: '3200' });
	});
});
