/**
 * The update service (#1453): the one container with the Docker socket. On request it pulls the images of frontend
 * and backend and recreates their containers as Compose would (the previous one stopped and kept under another name
 * until the new one is healthy), first the backend, whose start backs up and migrates the database, then the
 * frontend. The Docker Engine API, not Compose: the containers already hold their settings with the host's paths, on
 * Linux as on Docker Desktop.
 */

export type Docker = (path: string, init?: RequestInit) => Promise<Response>;

export type UpdateStatus =
	| { state: 'idle' | 'pulling' | 'backend' | 'frontend' | 'done' }
	// restore: the previous version does not start either (the new one had changed the database): restore the Sicherung
	| { state: 'failed'; restore: boolean };

const PARTS = ['backend', 'frontend'] as const;
type Part = (typeof PARTS)[number];

type Options = { pollMs?: number; timeoutMs?: Record<Part, number> };

// the backend's start backs up and migrates the database before it answers; the UI asks for patience after 15 minutes
const TIMEOUT_MS: Record<Part, number> = { backend: 50 * 60_000, frontend: 5 * 60_000 };

type Inspected = {
	Id: string;
	Image: string;
	Config: Record<string, unknown> & { Image: string; Env?: string[]; Labels?: Record<string, string> };
	HostConfig: unknown;
	NetworkSettings: { Networks: Record<string, { Aliases: string[] | null }> };
	State: { Running: boolean; Restarting: boolean; Health?: { Status: string } };
};

/** The Docker Engine behind a unix socket (Bun's fetch) */
const dockerSocket =
	(socket = '/var/run/docker.sock'): Docker =>
	(path, init) =>
		fetch(`http://docker${path}`, { ...init, unix: socket } as RequestInit);

export function createUpdater(docker: Docker, { pollMs = 2000, timeoutMs = TIMEOUT_MS }: Options = {}) {
	let status: UpdateStatus = { state: 'idle' };

	async function call(path: string, init?: RequestInit) {
		const response = await docker(path, init);
		if (!response.ok) throw new Error(`${init?.method ?? 'GET'} ${path}: ${response.status} ${await response.text()}`);
		return response;
	}
	const post = (path: string, body?: unknown) =>
		call(path, { method: 'POST', ...(body ? { body: JSON.stringify(body), headers: { 'content-type': 'application/json' } } : {}) });
	const inspect = async (ref: string) => (await (await call(`/containers/${ref}/json`)).json()) as Inspected;

	async function pull(image: string) {
		const at = image.lastIndexOf(':');
		const query = new URLSearchParams({ fromImage: image.slice(0, at), tag: image.slice(at + 1) });
		// the answer streams the progress; a failure comes as a line with «error», still with status 200
		const progress = await (await post(`/images/create?${query}`)).text();
		const failed = progress.split('\n').find((line) => line.includes('"error"'));
		if (failed) throw new Error(`pull ${image}: ${failed}`);
	}

	/** The container's settings without what it took from its previous image, so the new image's defaults apply */
	async function settingsFor(old: Inspected) {
		const image = ((await (await call(`/images/${old.Image}/json`)).json()) as { Config: Record<string, unknown> }).Config;
		const config: Record<string, unknown> = { ...old.Config, Hostname: undefined };
		for (const key of ['Entrypoint', 'Cmd', 'WorkingDir', 'User', 'Healthcheck'])
			if (JSON.stringify(config[key]) === JSON.stringify(image[key])) delete config[key];
		const imageEnv = (image.Env as string[] | undefined) ?? [];
		config.Env = old.Config.Env?.filter((entry) => !imageEnv.includes(entry));
		const imageLabels = (image.Labels as Record<string, string> | undefined) ?? {};
		config.Labels = Object.fromEntries(Object.entries(old.Config.Labels ?? {}).filter(([key, value]) => imageLabels[key] !== value));
		const short = old.Id.slice(0, 12);
		const EndpointsConfig = Object.fromEntries(
			Object.entries(old.NetworkSettings.Networks).map(([network, { Aliases }]) => [network, { Aliases: Aliases?.filter((alias) => alias !== short) }])
		);
		return { ...config, HostConfig: old.HostConfig, NetworkingConfig: { EndpointsConfig } };
	}

	async function healthy(ref: string, part: Part) {
		const deadline = Date.now() + timeoutMs[part];
		while (Date.now() < deadline) {
			const { State } = await inspect(ref);
			if (State.Health?.Status === 'healthy') return;
			if (!State.Running || State.Restarting) throw new Error(`dwello-${part} did not start`);
			await Bun.sleep(pollMs);
		}
		throw new Error(`dwello-${part} not healthy after ${timeoutMs[part] / 60_000} minutes`);
	}

	/** Recreates the part's container; `renamed` learns when the previous one is out of the way */
	async function recreate(part: Part, renamed: Part[]) {
		const name = `dwello-${part}`;
		const old = await inspect(name);
		const settings = await settingsFor(old);
		await post(`/containers/${name}/rename?name=${name}-previous`);
		renamed.unshift(part);
		await post(`/containers/${name}-previous/stop`);
		const { Id } = (await (await post(`/containers/create?name=${name}`, settings)).json()) as { Id: string };
		await post(`/containers/${Id}/start`);
		await healthy(Id, part);
	}

	/** Back to the previous container; false when it does not start either */
	async function restorePrevious(part: Part) {
		const name = `dwello-${part}`;
		await docker(`/containers/${name}?force=true`, { method: 'DELETE' });
		await post(`/containers/${name}-previous/rename?name=${name}`);
		await post(`/containers/${name}/start`);
		return healthy(name, part).then(
			() => true,
			() => false
		);
	}

	async function run() {
		status = { state: 'pulling' };
		const recreated: Part[] = [];
		try {
			const images = await Promise.all(PARTS.map(async (part) => (await inspect(`dwello-${part}`)).Config.Image));
			for (const image of images) await pull(image);
			for (const part of PARTS) {
				status = { state: part };
				await recreate(part, recreated);
			}
			for (const part of PARTS) await call(`/containers/dwello-${part}-previous`, { method: 'DELETE' });
			status = { state: 'done' };
		} catch (error) {
			console.error('[update] failed, back to the previous version:', error instanceof Error ? error.message : error);
			let started = true;
			for (const part of recreated) started = (await restorePrevious(part).catch(() => false)) && started;
			if (!started) console.error('[update] the previous version does not start: restore the Sicherung from before the update');
			status = { state: 'failed', restore: !started };
		}
	}

	return {
		status: () => status,
		/** Starts an update unless one runs; false while one runs */
		start() {
			if (!['idle', 'done', 'failed'].includes(status.state)) return false;
			void run();
			return true;
		}
	};
}

/** The service's HTTP interface on the internal network: POST /update starts, GET /status says how far it is */
export const updateRequests =
	(updater: ReturnType<typeof createUpdater>) =>
	(request: Request): Response => {
		const { pathname } = new URL(request.url);
		if (request.method === 'POST' && pathname === '/update') return new Response(null, { status: updater.start() ? 202 : 409 });
		if (request.method === 'GET' && pathname === '/status') return Response.json(updater.status());
		return new Response(null, { status: 404 });
	};

// compose.yaml starts it on its own: bun src/updater/updater.ts
if (import.meta.main) {
	const port = Number(process.env.PORT ?? 3002);
	Bun.serve({ port, fetch: updateRequests(createUpdater(dockerSocket())) });
	console.log(`[update] listening on ${port}`);
}
