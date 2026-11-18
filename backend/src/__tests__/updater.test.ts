/**
 * The update service (#1453): pulls the new images of frontend and backend and recreates both containers through the
 * Docker Engine API, the previous ones kept until the new ones are healthy; against a stand-in of that API
 */

import { describe, expect, it } from 'bun:test';
import { createUpdater, updateRequests, type UpdateStatus } from '../updater/updater';

type Container = {
	Id: string;
	Name: string;
	Image: string;
	Config: Record<string, unknown>;
	HostConfig: Record<string, unknown>;
	NetworkSettings: { Networks: Record<string, { Aliases: string[] | null }> };
	State: { Running: boolean; Restarting: boolean; Health?: { Status: string } };
};

const IMAGE_DEFAULTS = { Env: ['PATH=/usr/bin', 'BUN_VERSION=1.2'], WorkingDir: '/app', User: 'bun', Entrypoint: ['docker-entrypoint.sh'], Labels: { 'org.opencontainers.image.source': 'x' } };

/** A Docker Engine with the two Dwello containers; `health` decides how a started container ends up */
function fakeDocker(health: (name: string, image: string) => 'healthy' | 'exited' = () => 'healthy', pullFails = false) {
	const images: Record<string, string> = { 'ghcr.io/rudini/dwello-backend:latest': 'sha-old-b', 'ghcr.io/rudini/dwello-frontend:latest': 'sha-old-f' };
	const containers = new Map<string, Container>();
	const calls: string[] = [];
	let next = 0;
	for (const part of ['backend', 'frontend']) {
		const name = `dwello-${part}`;
		const image = `ghcr.io/rudini/dwello-${part}:latest`;
		containers.set(name, {
			Id: `old-${part}`,
			Name: `/${name}`,
			Image: images[image],
			Config: { ...IMAGE_DEFAULTS, Image: image, Hostname: `old-${part}`, Env: [...IMAGE_DEFAULTS.Env, `PORT=${part}`], Cmd: ['sh', '-c', part], Labels: { ...IMAGE_DEFAULTS.Labels, 'com.docker.compose.service': part } },
			HostConfig: { Binds: ['/home/landlord/dwello/backups:/backups'], RestartPolicy: { Name: 'unless-stopped' } },
			NetworkSettings: { Networks: { dwello_dwello: { Aliases: [name, part, `old-${part}`.slice(0, 12)] } } },
			State: { Running: true, Restarting: false, Health: { Status: 'healthy' } }
		});
	}
	const byRef = (ref: string) => containers.get(ref) ?? [...containers.values()].find((c) => c.Id === ref);
	const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

	async function docker(path: string, init: RequestInit = {}): Promise<Response> {
		const method = init.method ?? 'GET';
		const url = new URL(path, 'http://docker');
		calls.push(`${method} ${url.pathname}${url.search}`);
		const [, kind, ref, action] = url.pathname.split('/');
		if (kind === 'images' && ref === 'create') {
			const image = `${url.searchParams.get('fromImage')}:${url.searchParams.get('tag')}`;
			if (pullFails) return new Response('{"status":"Pulling"}\n{"error":"manifest unknown"}\n');
			images[image] = `sha-new-${image.includes('backend') ? 'b' : 'f'}`;
			return new Response('{"status":"Pulling"}\n{"status":"Downloaded newer image"}\n');
		}
		if (kind === 'images') return json({ Config: IMAGE_DEFAULTS });
		if (kind !== 'containers') return json({ message: 'unknown' }, 404);
		if (ref === 'create') {
			const name = url.searchParams.get('name')!;
			const body = JSON.parse(String(init.body));
			const id = `new-${++next}`;
			containers.set(name, { Id: id, Name: `/${name}`, Image: images[body.Image], Config: body, HostConfig: body.HostConfig, NetworkSettings: { Networks: {} }, State: { Running: false, Restarting: false } });
			return json({ Id: id }, 201);
		}
		const container = byRef(ref);
		if (!container) return json({ message: 'No such container' }, 404);
		const name = container.Name.slice(1);
		if (method === 'GET') return json(container);
		if (method === 'DELETE') {
			containers.delete(name);
			return new Response(null, { status: 204 });
		}
		if (action === 'stop') container.State = { Running: false, Restarting: false };
		if (action === 'start') {
			const ending = health(name, container.Image);
			container.State = ending === 'healthy' ? { Running: true, Restarting: false, Health: { Status: 'healthy' } } : { Running: false, Restarting: true };
		}
		if (action === 'rename') {
			containers.delete(name);
			container.Name = `/${url.searchParams.get('name')}`;
			containers.set(container.Name.slice(1), container);
		}
		return new Response(null, { status: 204 });
	}
	return { docker, containers, calls };
}

const withStart = (updater: ReturnType<typeof createUpdater>) => (updater.start(), updater);

const quick = { pollMs: 1, timeoutMs: { backend: 50, frontend: 50 } };

async function finished(updater: ReturnType<typeof createUpdater>): Promise<UpdateStatus> {
	while (!['done', 'failed'].includes(updater.status().state)) await Bun.sleep(1);
	return updater.status();
}

describe('Update-Dienst', () => {
	it('lädt die neuen Images, erstellt Backend und Frontend neu und entfernt die bisherigen Container', async () => {
		const engine = fakeDocker();
		const updater = createUpdater(engine.docker, quick);

		expect(updater.start()).toBe(true);
		expect(await finished(updater)).toEqual({ state: 'done' });

		expect(engine.containers.get('dwello-backend')!.Image).toBe('sha-new-b');
		expect(engine.containers.get('dwello-frontend')!.Image).toBe('sha-new-f');
		expect([...engine.containers.keys()].sort()).toEqual(['dwello-backend', 'dwello-frontend']);
		expect(engine.calls.filter((call) => call.includes('/images/create'))).toEqual([
			'POST /images/create?fromImage=ghcr.io%2Frudini%2Fdwello-backend&tag=latest',
			'POST /images/create?fromImage=ghcr.io%2Frudini%2Fdwello-frontend&tag=latest'
		]);
	});

	it('übernimmt die Einstellungen des Containers, aber nicht, was er vom bisherigen Image hatte', async () => {
		const engine = fakeDocker();
		await finished(withStart(createUpdater(engine.docker, quick)));

		const backend = engine.containers.get('dwello-backend')!;
		expect(backend.Config.Env).toEqual(['PORT=backend']);
		expect(backend.Config.Cmd).toEqual(['sh', '-c', 'backend']);
		expect(backend.Config.Hostname).toBeUndefined();
		expect(backend.Config.WorkingDir).toBeUndefined();
		expect(backend.Config.Labels).toEqual({ 'com.docker.compose.service': 'backend' });
		expect(backend.HostConfig).toEqual({ Binds: ['/home/landlord/dwello/backups:/backups'], RestartPolicy: { Name: 'unless-stopped' } });
		expect(backend.Config.NetworkingConfig).toEqual({ EndpointsConfig: { dwello_dwello: { Aliases: ['dwello-backend', 'backend'] } } });
	});

	it('startet die bisherigen Container wieder, wenn das neue Frontend nicht startet', async () => {
		const engine = fakeDocker((name, image) => (name === 'dwello-frontend' && image === 'sha-new-f' ? 'exited' : 'healthy'));
		expect(await finished(withStart(createUpdater(engine.docker, quick)))).toEqual({ state: 'failed', restore: false });

		expect(engine.containers.get('dwello-backend')).toMatchObject({ Id: 'old-backend', State: { Running: true } });
		expect(engine.containers.get('dwello-frontend')).toMatchObject({ Id: 'old-frontend', State: { Running: true } });
		expect([...engine.containers.keys()].sort()).toEqual(['dwello-backend', 'dwello-frontend']);
	});

	it('verlangt die Wiederherstellung, wenn auch das bisherige Backend nicht mehr startet', async () => {
		// the new backend migrated the database and failed after it; the previous one refuses the newer database
		const engine = fakeDocker((name) => (name === 'dwello-backend' ? 'exited' : 'healthy'));
		expect(await finished(withStart(createUpdater(engine.docker, quick)))).toEqual({ state: 'failed', restore: true });
	});

	it('ändert nichts, wenn ein Image nicht geladen werden kann', async () => {
		const engine = fakeDocker(undefined, true);
		expect(await finished(withStart(createUpdater(engine.docker, quick)))).toEqual({ state: 'failed', restore: false });

		expect(engine.calls.filter((call) => !call.startsWith('GET') && !call.includes('/images/create'))).toEqual([]);
	});

	it('startet kein zweites Update, solange eines läuft', () => {
		const updater = createUpdater(fakeDocker().docker, quick);
		expect(updater.start()).toBe(true);
		expect(updater.start()).toBe(false);
		expect(updater.status().state).toBe('pulling');
	});

	it('nimmt den Auftrag über HTTP an und meldet den Stand', async () => {
		const handle = updateRequests(createUpdater(fakeDocker().docker, quick));
		const send = (method: string, path: string) => handle(new Request(`http://updater${path}`, { method }));

		expect((await send('POST', '/update')).status).toBe(202);
		expect((await send('POST', '/update')).status).toBe(409);
		expect(await (await send('GET', '/status')).json()).toEqual({ state: 'pulling' });
		expect((await send('GET', '/other')).status).toBe(404);
	});
});
